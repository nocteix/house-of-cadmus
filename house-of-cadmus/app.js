
const byId = {};
NODES.forEach(n => byId[n.id] = n);

const rows = {};
NODES.forEach(n => { (rows[n.gen] = rows[n.gen] || []).push(n); });

const COL_W = 210, ROW_H = 190, PAD_TOP = 40, MIN_GAP = 40;
const genKeys = Object.keys(rows).map(Number).sort((a,b) => a-b);

function getNodeWidth(kind) {
  if (kind.includes('origin')) return 200;
  if (kind.includes('end')) return 220;
  return 172;
}

// Assign widths first, since row width requirements depend on the actual
// mix of node widths in that row (an 'origin'/'end' box is wider than a
// normal one), not just a node count.
NODES.forEach(n => { n.width = getNodeWidth(n.kind); n.height = 70; });

// treeWidth must be at least as wide as the most crowded row actually
// needs — every node's width plus a guaranteed minimum gap around each —
// or a densely-populated row could overlap itself. This makes that
// impossible by construction rather than something to re-check by hand
// every time a node gets added.
const widestRowRequirement = Math.max(...Object.values(rows).map(row =>
  row.reduce((sum, n) => sum + n.width, 0) + MIN_GAP * (row.length + 1)
));
const maxCols = Math.max(...Object.values(rows).map(r => r.length));
const treeWidth = Math.max(maxCols * COL_W + 100, 1100, widestRowRequirement);

genKeys.forEach((g, rowIndex) => {
  const row = rows[g];
  // Pack this row's actual box widths left-to-right with MIN_GAP between
  // them, then center the whole packed group within treeWidth — rather
  // than dividing treeWidth into equal-width slots regardless of how wide
  // each box actually is, which is what could let a wide 'origin'/'end'
  // box overlap its neighbor.
  const contentWidth = row.reduce((sum, n) => sum + n.width, 0) + MIN_GAP * (row.length - 1);
  let cursor = (treeWidth - contentWidth) / 2;
  row.forEach(n => {
    n.x = cursor + n.width / 2;
    n.y = PAD_TOP + rowIndex * ROW_H + 45;
    cursor += n.width + MIN_GAP;
  });
});

// Runtime safety net: the packing above should make same-row overlap
// mathematically impossible, but this is cheap to verify and will warn
// loudly in the console if a future edit to MIN_GAP/COL_W/getNodeWidth
// ever breaks that guarantee — catching it immediately instead of
// requiring another round of manual screenshot inspection.
Object.values(rows).forEach(row => {
  for (let i = 0; i < row.length; i++) {
    for (let j = i + 1; j < row.length; j++) {
      const a = row[i], b = row[j];
      const gap = Math.abs(a.x - b.x) - (a.width + b.width) / 2;
      if (gap < 0) {
        console.warn(`Layout overlap: "${a.name}" and "${b.name}" overlap by ${(-gap).toFixed(1)}px`);
      }
    }
  }
});

const treeHeight = PAD_TOP + genKeys.length * ROW_H + 80;

const tree = document.getElementById('tree');
tree.style.width = treeWidth + 'px';
tree.style.height = treeHeight + 'px';

// Declared up front (rather than down in the Filter System section below)
// because buildEdges() calls updateVisibility(), and buildEdges() runs
// immediately, before execution ever reaches that section — a `const`
// declared later would still be in the temporal dead zone at that point.
const activeFilters = {
  node: { coral: true, bronze: true, gold: true },
  edge: { 'blood-edge': true, 'succ-edge': true, 'reincarnation-edge': true }
};

// Render Nodes first, so we can measure their real rendered height below —
// edges are anchored to n.height, and CSS only guarantees a *minimum* height
// (min-height:70px), so any node whose text wraps onto extra lines will be
// taller than the 70px default. Building edges before nodes existed in the
// DOM meant that mismatch could never be corrected.
NODES.forEach((n, idx) => {
  const btn = document.createElement('button');
  const mainKind = n.kind.includes('coral') ? 'coral' : n.kind.includes('bronze') ? 'bronze' : 'gold';
  btn.className = 'node-btn ' + n.kind;
  btn.id = 'node-' + n.id;
  btn.setAttribute('data-category', mainKind);
  btn.style.left = n.x + 'px';
  btn.style.top = n.y + 'px';
  btn.style.animationDelay = (idx * 0.02) + 's';
  btn.innerHTML = `<span class="name">${n.name}</span><span class="fate">${n.fate}</span>`;
  btn.addEventListener('click', () => {
    if (pathMode) { handlePathClick(n); } else { openCard(n); }
  });
  tree.appendChild(btn);
});

// SVG setup
const svgNS = 'http://www.w3.org/2000/svg';
const svg = document.createElementNS(svgNS,'svg');
svg.classList.add('edges');
svg.setAttribute('width', treeWidth);
svg.setAttribute('height', treeHeight);
svg.setAttribute('shape-rendering', 'geometricPrecision');
tree.appendChild(svg);

function curve(x1, y1, x2, y2, cpy1, cpy2){
  const defaultY = (y2 - y1) / 2;
  const cp1 = cpy1 !== undefined ? cpy1 : y1 + defaultY;
  const cp2 = cpy2 !== undefined ? cpy2 : y2 - defaultY;
  return `M ${x1} ${y1} C ${x1} ${cp1}, ${x2} ${cp2}, ${x2} ${y2}`;
}

function curveHorizontal(x1, y1, x2, y2) {
  const dx = Math.abs(x2 - x1) / 2;
  const cp1x = x1 < x2 ? x1 + dx : x1 - dx;
  const cp2x = x1 < x2 ? x2 - dx : x2 + dx;
  return `M ${x1} ${y1} C ${cp1x} ${y1}, ${cp2x} ${y2}, ${x2} ${y2}`;
}

// A blood-edge whose parent and child are more than one row apart (e.g. a
// child born generations before a regent row like Peneleos got inserted
// between them) risks running straight through whatever occupies the
// intervening row(s). The first version of this fix just bowed every such
// edge left by a fixed amount — which fixed the case it was written for
// (Zagreus/Dionysus past Semele's row) but was never re-checked once new
// nodes (Alcmaeon) were later added into a *different* skip-edge's path
// (Thersander/Tisamenus past Peneleos), and it clipped straight through
// Alcmaeon's box. A fixed blind offset can't stay correct as the tree
// grows — so this checks the actual bounding box of every node the curve
// would pass near, and picks the smallest bow (trying both directions)
// that actually clears all of them, instead of assuming one distance and
// direction will always be enough.
function bezierPoint(t, x0, y0, x1, y1, x2, y2, x3, y3) {
  const mt = 1 - t;
  return {
    x: mt*mt*mt*x0 + 3*mt*mt*t*x1 + 3*mt*t*t*x2 + t*t*t*x3,
    y: mt*mt*mt*y0 + 3*mt*mt*t*y1 + 3*mt*t*t*y2 + t*t*t*y3
  };
}

function curveSkipAware(x1, y1, x2, y2, gen1, gen2) {
  const i1 = genKeys.indexOf(gen1), i2 = genKeys.indexOf(gen2);
  const lo = Math.min(i1, i2), hi = Math.max(i1, i2);
  if (hi - lo <= 1) return curve(x1, y1, x2, y2);

  const obstacles = [];
  for (let idx = lo + 1; idx < hi; idx++) {
    (rows[genKeys[idx]] || []).forEach(n => obstacles.push(n));
  }
  if (!obstacles.length) return curve(x1, y1, x2, y2);

  const margin = 22;
  const cp1y = y1 + (y2 - y1) * 0.35;
  const cp2y = y1 + (y2 - y1) * 0.75;

  function pathFor(offset) {
    const cp1x = x1 + offset, cp2x = x2 + offset;
    return { d: `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`, cp1x, cp2x };
  }

  function clears(offset) {
    const { cp1x, cp2x } = pathFor(offset);
    if (cp1x < 10 || cp1x > treeWidth - 10 || cp2x < 10 || cp2x > treeWidth - 10) return false;
    for (let step = 1; step <= 9; step++) {
      const p = bezierPoint(step / 10, x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2);
      for (const o of obstacles) {
        if (Math.abs(p.x - o.x) < o.width / 2 + margin && Math.abs(p.y - o.y) < o.height / 2 + margin) {
          return false;
        }
      }
    }
    return true;
  }

  for (const mag of [150, 190, 230, 270, 310, 350, 400, 450]) {
    for (const sign of [-1, 1]) {
      if (clears(sign * mag)) return pathFor(sign * mag).d;
    }
  }
  // Nothing fully cleared (very dense area) — the largest bow left is
  // still a better fallback than a straight drop through everything.
  return pathFor(-450).d;
}

function addPath(d, cls, sourceId, targetId){
  const p = document.createElementNS(svgNS,'path');
  p.setAttribute('d', d);
  p.setAttribute('class', 'edge ' + cls);
  p.setAttribute('fill','none');
  p.setAttribute('data-source', sourceId);
  p.setAttribute('data-target', targetId);
  svg.appendChild(p);
  return p;
}

// Measures each node's real rendered height, then (re)builds every edge
// from scratch. Exposed as a function (not a one-shot block) because the
// webfonts (Cinzel/Crimson Pro) load with &display=swap, meaning the
// browser paints with fallback fonts first and swaps the real font in
// later — text can reflow to a different height *after* this has already
// run once. Re-running it once fonts are confirmed ready corrects any
// drift from that swap.
function buildEdges(){
  NODES.forEach(n => {
    const el = document.getElementById('node-' + n.id);
    if (el) n.height = el.offsetHeight;
  });

  svg.innerHTML = '';
  const drawnMarriageBars = new Set();

  NODES.forEach(n => {
    const parents = (n.parents||[]).map(pid => byId[pid]).filter(Boolean);

    if (parents.length === 2 && Math.abs(parents[0].y - parents[1].y) < 10) {
      // Married co-parents on the same row: instead of two separate lines
      // crossing into every child (which tangles into an X-mess once there
      // are several children), draw one shared "marriage bar" between the
      // parents and a single trunk line down to each child.
      const [p1, p2] = parents;
      const barY = p1.y + (p1.height/2) + 18;
      const midX = (p1.x + p2.x) / 2;
      const barKey = [p1.id, p2.id].sort().join('|');
      if (!drawnMarriageBars.has(barKey)) {
        addPath(`M ${p1.x} ${barY} L ${p2.x} ${barY}`, 'blood-edge', p1.id, p2.id);
        drawnMarriageBars.add(barKey);
      }
      addPath(curveSkipAware(midX, barY, n.x, n.y - (n.height/2), p1.gen, n.gen), 'blood-edge', p1.id, n.id);
    } else {
      parents.forEach(p => {
        addPath(curveSkipAware(p.x, p.y + (p.height/2), n.x, n.y - (n.height/2), p.gen, n.gen), 'blood-edge', p.id, n.id);
      });
    }

    // Only draw a succession edge when it actually tells the reader
    // something the blood edge doesn't — who a ruler took the throne from,
    // when that's someone other than their own parent (a regent, a skipped
    // generation, someone from outside the bloodline entirely). When
    // succFrom points to a node that's already one of this person's blood
    // parents, the blood edge already says everything the succession edge
    // would, and drawing both just doubles the same line. That's obvious
    // where several siblings fan out from one parent (it visibly diverges
    // into two close, parallel curves), but the exact same redundancy
    // exists wherever an only child inherits directly — it just isn't
    // visible there, since the two curves happen to overlap almost
    // exactly. Skipping it here keeps the rule consistent everywhere,
    // not just in the one spot it happened to be easy to notice.
    if(n.succFrom && !(n.parents || []).includes(n.succFrom)){
      const p = byId[n.succFrom];
      if(p) {
        let pathData;

        // Case 1: Same horizontal row
        if (Math.abs(p.y - n.y) < 10) {
          const startX = p.x <= n.x ? p.x + (p.width / 2) : p.x - (p.width / 2);
          const endX = n.x <= p.x ? n.x - (n.width / 2) : n.x + (n.width / 2);
          pathData = curveHorizontal(startX, p.y, endX, n.y);
        }
        // Case 2: Upward succession (e.g. Pentheus [Gen 2] -> Polydorus [Gen 1])
        else if (p.y > n.y) {
          const startX = p.x + (p.width / 2);
          const startY = p.y;
          const endX = n.x;
          const endY = n.y + (n.height / 2);
          const cp1x = startX + 50;
          const cp1y = startY;
          const cp2x = endX;
          const cp2y = endY + 40;
          pathData = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
        }
        // Case 3: Downward succession (Standard top-to-bottom)
        else {
          const startX = p.x;
          const startY = p.y + (p.height / 2);
          const endX = n.x;
          const endY = n.y - (n.height / 2);
          // Same obstacle-aware routing as skip-row blood edges — a
          // succession edge can skip rows just as easily (Thersander to
          // Peneleos skips over Alcmaeon's row) and was clipping straight
          // through his box before this, which is doubly misleading since
          // Alcmaeon never actually held the throne at all.
          pathData = curveSkipAware(startX, startY, endX, endY, p.gen, n.gen);
        }

        addPath(pathData, 'succ-edge', p.id, n.id);
      }
    }

    if(n.id === 'zagreus'){
      const d = byId['dionysus'];
      // Bowed sideways rather than a straight vertical drop — a direct line
      // would run right through the Semele/Cadmus/Harmonia column in
      // between, visually reading as if it terminated at Semele's box
      // instead of passing through to Dionysus two rows further down.
      // Routed through the same obstacle-checking logic as skip-row blood
      // edges, rather than a separate hand-tuned bow, so it stays correct
      // if anything ever gets added into that corridor too.
      const y1 = n.y + (n.height/2), y2 = d.y - (d.height/2);
      const pathData = curveSkipAware(n.x, y1, d.x, y2, n.gen, d.gen);
      addPath(pathData, 'reincarnation-edge', n.id, d.id);
    }
    if(n.id === 'alcmaeon'){
      // Not a blood or succession relationship (he's an Argive prince, not
      // Theban royalty) so it doesn't belong in the filterable edge
      // categories above — but leaving him with *no* connecting line at all
      // makes him look like an unrelated, unexplained figure floating in
      // the middle of the tree. This stays as a plain, uncategorized
      // connector: always visible, not tied to any filter toggle.
      const l = byId['laodamas'];
      addPath(curve(l.x, l.y + (l.height/2), n.x, n.y - (n.height/2)), 'vengeance-edge', l.id, n.id);
    }
  });

  // Edge filter state (coral/bronze/gold node visibility, etc.) needs to be
  // re-applied any time edges are rebuilt, since the fresh <path> elements
  // start out with no 'dimmed' class regardless of the current filter state.
  if (typeof updateVisibility === 'function') updateVisibility();
}

buildEdges();

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(buildEdges);
}

// On narrow viewports the tree canvas (treeWidth, often 1000px+) is much
// wider than the screen, and its root nodes sit horizontally centered
// within that canvas — so a horizontal scroll container starting at its
// default scrollLeft:0 shows an almost entirely empty left margin with no
// visible nodes and no indication there's content to the right. Center the
// initial scroll position on load so the root of the tree is what a mobile
// visitor actually sees first.
const scrollWrap = document.querySelector('.scroll-wrap');
if (scrollWrap && scrollWrap.scrollWidth > scrollWrap.clientWidth) {
  scrollWrap.scrollLeft = (scrollWrap.scrollWidth - scrollWrap.clientWidth) / 2;
}

// ---------- Succession Timeline ----------
// Builds REIGNS (from data.js) as a strictly-ordered vertical list inside
// the shared modal, independent of the tree's blood/succession edges
// above. This is what actually answers "who held the throne, when" — the
// tree can't, since a person who reigns at multiple non-contiguous points
// (Creon, twice) can only have one succFrom edge, not two.
function renderTimelineList() {
  const el = document.getElementById('timelineList');
  if (!el || typeof REIGNS === 'undefined') return;
  el.innerHTML = '';
  REIGNS.forEach((reign, i) => {
    const item = document.createElement('div');
    item.className = 'timeline-list-item' + (reign.regent ? ' regent' : '');

    const num = document.createElement('div');
    num.className = 'tll-num';
    num.textContent = String(i + 1) + '.';
    item.appendChild(num);

    const names = document.createElement('div');
    names.className = 'tll-names';
    reign.ids.forEach((id, j) => {
      const node = byId[id];
      if (!node) return;
      if (j > 0) {
        const sep = document.createElement('span');
        sep.className = 'tll-joint-sep';
        sep.textContent = '&';
        names.appendChild(sep);
      }
      const nameBtn = document.createElement('button');
      nameBtn.className = 'tl-name';
      nameBtn.type = 'button';
      nameBtn.textContent = node.name;
      nameBtn.addEventListener('click', () => openCard(node));
      names.appendChild(nameBtn);
    });
    item.appendChild(names);

    if (reign.note) {
      const note = document.createElement('div');
      note.className = 'tll-note';
      note.textContent = reign.note;
      item.appendChild(note);
    }

    el.appendChild(item);
  });
}

// ---------- Filter System ----------
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.getAttribute('data-type');
    const category = btn.getAttribute('data-category');
    
    const newState = !activeFilters[type][category];
    activeFilters[type][category] = newState;
    
    btn.classList.toggle('off', !newState);
    btn.setAttribute('aria-pressed', newState ? 'true' : 'false');
    
    updateVisibility();
  });
});

function updateVisibility() {
  document.querySelectorAll('.node-btn').forEach(btn => {
    const category = btn.getAttribute('data-category');
    const isVisible = activeFilters.node[category];
    btn.classList.toggle('dimmed', !isVisible);

    if (isVisible) {
      btn.removeAttribute('tabindex');
      btn.removeAttribute('aria-hidden');
    } else {
      btn.setAttribute('tabindex', '-1');
      btn.setAttribute('aria-hidden', 'true');
    }
  });

  document.querySelectorAll('path.edge').forEach(path => {
    const classes = Array.from(path.classList);
    const edgeType = classes.find(c => activeFilters.edge[c] !== undefined);
    const edgeFilterActive = edgeType ? activeFilters.edge[edgeType] : true;
    
    const sourceId = path.getAttribute('data-source');
    const targetId = path.getAttribute('data-target');
    const sourceNode = document.getElementById('node-' + sourceId);
    const targetNode = document.getElementById('node-' + targetId);
    
    const sourceDimmed = sourceNode ? sourceNode.classList.contains('dimmed') : false;
    const targetDimmed = targetNode ? targetNode.classList.contains('dimmed') : false;

    const isVisible = edgeFilterActive && (!sourceDimmed && !targetDimmed);
    path.classList.toggle('dimmed', !isVisible);
  });
}

// ---------- Bloodline Path Tracing ----------
let pathMode = false;
let pathSelection = [];
const pathModeBtn = document.getElementById('pathModeBtn');
const pathStatus = document.getElementById('pathStatus');

pathModeBtn.addEventListener('click', () => {
  pathMode = !pathMode;
  document.body.classList.toggle('path-mode', pathMode);
  pathModeBtn.classList.toggle('active', pathMode);
  pathModeBtn.setAttribute('aria-pressed', pathMode ? 'true' : 'false');
  pathModeBtn.textContent = pathMode ? 'Exit Trace Mode' : 'Trace a Bloodline Between Two Figures';
  clearPathSelection();
  pathStatus.hidden = !pathMode;
  if (pathMode) pathStatus.textContent = 'Click a figure to start tracing.';
});

function clearPathSelection() {
  pathSelection = [];
  document.querySelectorAll('.node-btn').forEach(btn => {
    btn.classList.remove('path-anchor', 'path-node', 'path-faded');
  });
  document.querySelectorAll('path.edge').forEach(path => {
    path.classList.remove('path-highlight', 'path-faded');
  });
}

// Walks the blood ('parents') or succession ('succFrom') graph upward from
// a starting node, recording the shortest route back to every ancestor it
// can reach. Used from both ends of a selected pair to find their nearest
// shared ancestor — a plain "walk up from one side" assumption breaks for
// married co-parents (Cadmus & Harmonia, Zeus & Persephone), where a node
// can have two valid parents to climb through.
function ancestorsWithPath(startId, field) {
  const result = new Map();
  const queue = [{ id: startId, dist: 0, path: [startId] }];
  while (queue.length) {
    const { id, dist, path } = queue.shift();
    if (result.has(id) && result.get(id).dist <= dist) continue;
    result.set(id, { dist, path });
    const node = byId[id];
    if (!node) continue;
    const nextIds = field === 'parents' ? (node.parents || []) : (node.succFrom ? [node.succFrom] : []);
    nextIds.forEach(nid => {
      if (byId[nid]) queue.push({ id: nid, dist: dist + 1, path: [...path, nid] });
    });
  }
  return result;
}

function findPath(idA, idB, field) {
  if (idA === idB) return null;
  const ancA = ancestorsWithPath(idA, field);
  const ancB = ancestorsWithPath(idB, field);
  let best = null;
  ancA.forEach((infoA, id) => {
    if (ancB.has(id)) {
      const total = infoA.dist + ancB.get(id).dist;
      if (!best || total < best.total) best = { total, id };
    }
  });
  if (!best) return null;
  const upA = ancA.get(best.id).path;
  const upB = ancB.get(best.id).path.slice(0, -1).reverse();
  return upA.concat(upB);
}

// Finds the rendered <path> element connecting a child to one of its
// parents. Handles the married co-parents case specially: when a child has
// two co-parents sharing one drawn trunk line, the trunk's data-source is
// always whichever parent happened to be listed first — even if the path
// being traced goes through the *other* parent — so a literal source/target
// match alone would miss it. Also lights up the short marriage-bar line
// between the two parents, so the couple reads as connected rather than
// the trunk appearing to start mid-air.
function highlightEdgeBetween(childId, parentId, edgeClass) {
  const child = byId[childId];
  const parents = (child.parents || []).map(pid => byId[pid]).filter(Boolean);
  const isMarriedPair = parents.length === 2 && Math.abs(parents[0].y - parents[1].y) < 10;

  if (edgeClass === 'blood-edge' && isMarriedPair && parents.some(p => p.id === parentId)) {
    document.querySelectorAll(`path.blood-edge[data-target="${childId}"]`).forEach(p => p.classList.add('path-highlight'));
    const [p1, p2] = parents;
    document.querySelectorAll('path.blood-edge').forEach(p => {
      const s = p.getAttribute('data-source'), t = p.getAttribute('data-target');
      if ((s === p1.id && t === p2.id) || (s === p2.id && t === p1.id)) p.classList.add('path-highlight');
    });
    return;
  }

  document.querySelectorAll(`path.${edgeClass}`).forEach(p => {
    const s = p.getAttribute('data-source'), t = p.getAttribute('data-target');
    if ((s === childId && t === parentId) || (s === parentId && t === childId)) {
      p.classList.add('path-highlight');
    }
  });
}

function showPath(idA, idB) {
  document.querySelectorAll('.node-btn').forEach(btn => btn.classList.add('path-faded'));
  document.querySelectorAll('.node-btn').forEach(btn => btn.classList.remove('path-anchor'));
  document.querySelectorAll('path.edge').forEach(path => path.classList.add('path-faded'));

  let path = findPath(idA, idB, 'parents');
  let via = 'blood';
  if (!path) { path = findPath(idA, idB, 'succFrom'); via = 'succession'; }

  if (!path) {
    pathStatus.textContent = `${byId[idA].name} and ${byId[idB].name} aren't connected by blood or succession anywhere in this tree.`;
    return;
  }

  path.forEach(id => {
    const el = document.getElementById('node-' + id);
    if (el) { el.classList.remove('path-faded'); el.classList.add('path-node'); }
  });

  const field = via === 'blood' ? 'parents' : 'succFrom';
  const edgeClass = via === 'blood' ? 'blood-edge' : 'succ-edge';
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i], b = path[i + 1];
    const aIsChildOfB = field === 'parents' ? (byId[a].parents || []).includes(b) : byId[a].succFrom === b;
    if (aIsChildOfB) highlightEdgeBetween(a, b, edgeClass);
    else highlightEdgeBetween(b, a, edgeClass);
  }
  document.querySelectorAll('path.edge.path-highlight').forEach(p => p.classList.remove('path-faded'));

  const steps = path.length - 1;
  pathStatus.textContent = via === 'blood'
    ? `Bloodline from ${byId[idA].name} to ${byId[idB].name} (${steps} step${steps === 1 ? '' : 's'}).`
    : `No shared blood, but connected through royal succession from ${byId[idA].name} to ${byId[idB].name} (${steps} step${steps === 1 ? '' : 's'}).`;
}

function handlePathClick(n) {
  if (pathSelection.length === 2) clearPathSelection();

  if (pathSelection.length === 0) {
    pathSelection = [n.id];
    document.getElementById('node-' + n.id).classList.add('path-anchor');
    pathStatus.textContent = `${n.name} selected. Click a second figure to trace the bloodline between them.`;
    return;
  }

  if (pathSelection[0] === n.id) return;

  pathSelection.push(n.id);
  showPath(pathSelection[0], pathSelection[1]);
}

// Modal System & Focus Management
let lastFocusedElement = null;
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('closeBtn');
const mainHeader = document.getElementById('mainHeader');
const mainContent = document.getElementById('mainContent');
const mainFooter = document.getElementById('mainFooter');
const cardContainer = document.getElementById('cardContainer');
const figureCardBody = document.getElementById('figureCardBody');
const timelineModalBody = document.getElementById('timelineModalBody');

// Shared by both modal types (a figure's card, and the succession
// timeline) — background-hiding, scroll-locking, and focus handling are
// identical either way; only what's inside #cardContainer differs.
function openOverlay(ariaLabel) {
  lastFocusedElement = document.activeElement;
  document.body.style.overflow = 'hidden';

  mainHeader.setAttribute('aria-hidden', 'true');
  mainContent.setAttribute('aria-hidden', 'true');
  mainFooter.setAttribute('aria-hidden', 'true');

  overlay.setAttribute('aria-hidden', 'false');
  cardContainer.setAttribute('aria-label', ariaLabel);
  overlay.classList.add('open');
  cardContainer.focus();
}

function openCard(n){
  figureCardBody.hidden = false;
  timelineModalBody.hidden = true;
  cardContainer.classList.remove('wide');

  const genDisplay = n.gen === -1 ? 'ORPHIC PROLOGUE' : 'GENERATION ' + n.gen;
  document.getElementById('cardEyebrow').textContent = genDisplay + (n.epithet ? ' · ' + n.epithet.toUpperCase() : '');
  document.getElementById('cardName').textContent = n.name;
  document.getElementById('cardEpithet').textContent = n.epithet || '';

  const parentsEl = document.getElementById('cardParents');
  const hasFather = n.father && n.father !== 'N/A';
  const hasMother = n.mother && n.mother !== 'N/A';

  if (hasFather && hasMother) {
    parentsEl.innerHTML = `<strong>Parents</strong> · ${n.father} & ${n.mother}`;
    parentsEl.style.display = 'block';
  } else if (hasFather) {
    parentsEl.innerHTML = `<strong>Father</strong> · ${n.father}`;
    parentsEl.style.display = 'block';
  } else if (hasMother) {
    parentsEl.innerHTML = `<strong>Mother</strong> · ${n.mother}`;
    parentsEl.style.display = 'block';
  } else {
    parentsEl.style.display = 'none';
  }

  const fateEl = document.getElementById('cardFate');
  fateEl.textContent = n.fate;
  fateEl.className = 'fate-line ' + (n.kind.includes('coral') ? 'coral' : n.kind.includes('bronze') ? 'bronze' : 'gold');
  document.getElementById('cardFacts').innerHTML = n.facts.map(f => `<li>${f}</li>`).join('');
  document.getElementById('cardSources').innerHTML = n.sources.map(s => `${s}`).join('<br>');

  openOverlay(n.name);
}

function openTimelineModal() {
  figureCardBody.hidden = true;
  timelineModalBody.hidden = false;
  cardContainer.classList.add('wide');
  renderTimelineList();
  openOverlay('The Throne of Thebes, succession timeline');
}

function closeCard() {
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  
  mainHeader.removeAttribute('aria-hidden');
  mainContent.removeAttribute('aria-hidden');
  mainFooter.removeAttribute('aria-hidden');

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

closeBtn.addEventListener('click', closeCard);
document.getElementById('timelineModeBtn').addEventListener('click', openTimelineModal);

const legendToggleBtn = document.getElementById('legendToggleBtn');
const legendPanel = document.getElementById('legendPanel');
legendToggleBtn.addEventListener('click', () => {
  const isOpen = !legendPanel.hidden;
  legendPanel.hidden = isOpen;
  legendToggleBtn.setAttribute('aria-expanded', String(!isOpen));
  legendToggleBtn.textContent = isOpen ? 'Show Legend & Filters ▾' : 'Hide Legend & Filters ▴';
});

function handleOverlayClose(e) {
  if (e.target === overlay) {
    if (e.type === 'click' || (e.type === 'keydown' && (e.key === 'Enter' || e.key === ' '))) {
      e.preventDefault();
      closeCard();
    }
  }
}

overlay.addEventListener('click', handleOverlayClose);
overlay.addEventListener('keydown', handleOverlayClose);

document.addEventListener('keydown', (e) => { 
  if (!overlay.classList.contains('open')) return;

  if (e.key === 'Escape') {
    closeCard();
  } else if (e.key === 'Tab') {
    // Scoped to whichever content body is actually visible — both bodies
    // live inside #overlay at all times (one just has the `hidden`
    // attribute), and querySelectorAll doesn't know or care about that,
    // so querying the whole overlay would pull in focusable elements
    // from the hidden body too and break the trap.
    const visibleBody = figureCardBody.hidden ? timelineModalBody : figureCardBody;
    const focusables = [closeBtn, ...visibleBody.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  }
});
