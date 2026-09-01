const NODES = [

  {id:'zeus', name:'Zeus', epithet:'King of the Gods', fate:'Avenges Zagreus; Engineers His Rebirth', kind:'gold origin', gen:-1,
    father:'Cronus', mother:'Rhea',
    facts:[
      'King of the gods. He comes to Persephone, his own daughter, hidden away by Demeter to keep her from suitors, in the form of a serpent, a union later writers like Nonnus and Clement of Alexandria treat as especially transgressive.',
      'Names their son Zagreus his heir, seating him on the throne of heaven with his own thunderbolts in hand and posting the Curetes to guard him, the same protection Zeus himself received as a hidden infant on Crete.',
      'When the Titans kill Zagreus regardless, incinerates them with lightning in fury; the Orphics taught that humanity itself was born from the resulting ash, carrying both the Titans\' violence and a fragment of Zagreus\'s own divinity.',
      'Gives Zagreus\'s rescued heart to the mortal Semele, engineering his son\'s second birth as the Theban Dionysus.'
    ],
    sources:['Nonnus, Dionysiaca 6.155–205','Diodorus Siculus 4.4.1','Clement of Alexandria, Protrepticus 2.6, 2.16']},

  {id:'persephone', name:'Persephone', epithet:'Queen of the Underworld', fate:'Bears Zagreus, then Loses Him', kind:'gold origin', gen:-1,
    father:'Zeus', mother:'Demeter',
    facts:[
      'Daughter of Zeus and Demeter. Still an unwed maiden, hidden away by her mother to keep her from suitors, when Zeus reaches her there disguised as a serpent, according to Orphic tradition. This union predates, and is separate from, the far more famous story of her abduction by Hades.',
      'Bears Zagreus from that union, given its transgressive circumstances.',
      'Loses her son to the Titans\' dismemberment soon after, a grief the Orphics wove into her later role as queen of the dead, once Hades takes her as his own wife.'
    ],
    sources:['Nonnus, Dionysiaca 6.155–205','Diodorus Siculus 4.4.1','Clement of Alexandria, Protrepticus 2.6, 2.16']},

  {id:'zagreus', name:'Zagreus', epithet:'The First Dionysus', fate:'Dismembered; Heart Reborn', kind:'gold zagreus', gen:-0.5, parents:['zeus','persephone'],
    father:'Zeus', mother:'Persephone',
    facts:[
      'In Orphic myth, a prior Dionysus, son of Zeus and Persephone. Zeus enthrones him in heaven with his own lightning in hand, the first of this family\'s many thrones built only to be destroyed before the heir who was meant for it ever truly rules.',
      'Torn apart and eaten by the Titans at Hera\'s instigation; Athena rescues his still-beating heart.',
      'Zeus grinds the heart into a potion given to Semele, and the Theban Dionysus is understood as his second birth.',
      'His reincarnation fares no better on that count. Dionysus, too, is passed over when Cadmus hands the Theban throne to Pentheus instead, the same pattern recurring in his very next life.'
    ],
    sources:['Diodorus Siculus 4.4.1–2','Hyginus, Fabulae 167','Nonnus, Dionysiaca 6','Clement, Protrepticus 2.8–9']},

  {id:'cadmus', name:'Cadmus', epithet:'m. Harmonia, Founder of Thebes', fate:'Exiled; Turned into Serpents', kind:'coral origin', gen:0,
    father:'Agenor', mother:'Telephassa',
    facts:[
      'When Zeus abducts his sister Europa, Agenor sends Cadmus to find her with orders not to return without her. Unable to, Cadmus consults the Delphic oracle instead, which tells him to abandon the search and follow a cow to found a city, Thebes, in her place.',
      'Follows the oracle to found Thebes after slaying the dragon guarding the spring of Ares.',
      'On Athena\'s advice, sows the dragon\'s teeth. The armed Spartoi ("Sown Men") who spring from the earth slaughter each other down to five survivors, including Echion and Chthonius, the forefathers of Pentheus\'s and Lycus\'s branches of the family, who then help him build the city.',
      'Serves Ares as a bondsman for eight years to atone for killing the dragon before being given Harmonia, daughter of Ares and Aphrodite, as his wife; Hephaestus secretly curses her wedding necklace out of resentment.',
      'By Dionysus\'s account, Cadmus helps his daughters invent the story that Semele lied about Zeus, complicit in denying his own grandson.',
      'In old age, crushed by the horrific deaths of their children and grandchildren, they are exiled to Illyria and transformed into serpents.'
    ],
    sources:['Apollodorus, Bibl. 3.1.1, 3.4.1–2','Ovid, Met. 3.1–130, 4.563–603','Statius, Thebaid 2.265–274','Euripides, Bacchae 26–42']},

  {id:'harmonia', name:'Harmonia', epithet:'m. Cadmus, Goddess of Concord', fate:'Exiled; Turned into Serpents', kind:'coral origin', gen:0,
    father:'Ares', mother:'Aphrodite',
    facts:[
      'Daughter of Ares and Aphrodite; given to Cadmus as a bride once he completes his eight years of atonement to Ares.',
      'Their wedding is attended by every Olympian god in person, one of the only times mortals and immortals feast together.',
      'Hephaestus, still resentful of Aphrodite\'s affair with Ares, gives her a wedding necklace and robe he has secretly cursed to bring ruin on whoever possesses them; the necklace resurfaces generations later to bribe Eriphyle and doom Amphiaraus.',
      'In old age, crushed by the deaths of their children and grandchildren, she and Cadmus are exiled to Illyria and transformed into serpents together.'
    ],
    sources:['Apollodorus, Bibl. 3.4.2','Hesiod, Theogony 933–937','Diodorus Siculus 4.2, 5.48–49','Ovid, Met. 4.563–603']},

  {id:'autonoe', name:'Autonoe', epithet:'m. Aristaeus', fate:'Exiled in grief after son\'s death', kind:'coral', gen:1, parents:['cadmus','harmonia'],
    father:'Cadmus', mother:'Harmonia',
    facts:[
      'Autonoe, daughter of Cadmus and Harmonia, marries the shepherd-god Aristaeus.',
      'Named by Dionysus among the sisters who denied Semele\'s divine affair.',
      'Her son Actaeon is torn apart by his hounds; overcome with grief, she leaves Thebes forever and dies in Megara.'
    ],
    sources:['Apollodorus, Bibl. 3.4.4','Euripides, Bacchae 26–42','Pausanias 1.44.5']},

  {id:'ino', name:'Ino', epithet:'m. Athamas', fate:'Drowns; Deified as Leucothea', kind:'coral', gen:1, parents:['cadmus','harmonia'],
    father:'Cadmus', mother:'Harmonia',
    facts:[
      'Fosters the infant Dionysus (in Ovid\'s account), incurring Hera\'s wrath.',
      'Hera strikes her and her husband Athamas (King of Orchomenus) with madness.',
      'In Ovid\'s gentler telling, Ino leaps off a sea-cliff carrying her still-living son Melicertes; Apollodorus\'s harsher version instead has her kill him in a boiling cauldron before she jumps.',
      'Poseidon deifies her as the marine goddess Leucothea.'
    ],
    sources:['Euripides, Bacchae 26–42','Apollodorus, Bibl. 1.9.1–2, 3.4.3','Ovid, Met. 4.416–542']},

  {id:'semele', name:'Semele', epithet:'m. Zeus', fate:'Killed by Lightning; Deified as Thyone', kind:'coral', gen:1, parents:['cadmus','harmonia'],
    father:'Cadmus', mother:'Harmonia',
    facts:[
      'Tricked by Hera into asking Zeus to reveal himself in full divine majesty.',
      'Her mortal frame is instantly incinerated by lightning; Zeus rescues the unborn Dionysus from her womb.',
      'Dionysus later descends into Hades to rescue her, bringing her to Olympus where she becomes the goddess Thyone.'
    ],
    sources:['Apollodorus, Bibl. 3.4.3, 3.5.3','Hesiod, Theogony 940–943','Euripides, Bacchae 1–63','Ovid, Met. 3.253–315','Pindar, Pythian 3.88–99']},

  {id:'agave', name:'Agave', epithet:'m. Echion (Spartos)', fate:'Kills son; Exiled in madness', kind:'coral', gen:1, parents:['cadmus','harmonia'],
    father:'Cadmus', mother:'Harmonia',
    facts:[
      'Marries Echion, one of the five surviving Spartoi ("Sown Men") born from the dragon\'s teeth.',
      'Helps spread the slander that Semele lied about Zeus to hide a mortal affair.',
      'Driven into a Bacchic frenzy, she leads the Maenads who tear apart her own son, Pentheus.',
      'Restored to sanity by Cadmus, she realizes her horrific crime and is banished from Thebes.'
    ],
    sources:['Euripides, Bacchae 26–42, 1043–1152, 1233–1300','Apollodorus, Bibl. 3.5.2']},

  {id:'polydorus', name:'Polydorus', epithet:'m. Nycteis', fate:'Died of unknown causes', kind:'bronze', gen:1, parents:['cadmus','harmonia'], succFrom:'pentheus',
    father:'Cadmus', mother:'Harmonia',
    facts:[
      'Too young to inherit when Cadmus abdicates, so Pentheus rules first instead.',
      'The sole surviving legitimate son of Cadmus, he stabilizes the fractured dynasty after Pentheus\'s horrific death.',
      'Marries Nycteis, daughter of Nycteus (a Spartos descendant).',
      'Eventually succeeds as king, but dies young of causes the sources don\'t specify, leaving the throne to his son Labdacus.'
    ],
    sources:['Apollodorus, Bibl. 3.5.5','Diodorus Siculus 4.2', 'Nonnus, Dionysiaca 5.207-212']},


  {id:'actaeon', name:'Actaeon', fate:'Torn apart by his hounds', kind:'coral', gen:2, parents:['autonoe'],
    father:'Aristaeus', mother:'Autonoe',
    facts:['A hunter trained by Chiron.', 'Stumbles upon Artemis bathing; transformed into a stag by the goddess and torn to pieces by his own 50 hunting dogs.'],
    sources:['Apollodorus, Bibl. 3.4.4','Ovid, Met. 3.138–252']},

  {id:'inosons', name:'Learchus & Melicertes', epithet:"Ino's sons", fate:'Murdered / Drowned in madness', kind:'coral', gen:2, parents:['ino'],
    father:'Athamas', mother:'Ino',
    facts:['Learchus is shot/dashed against a rock by his maddened father, Athamas.','Melicertes is carried into the ocean by Ino; deified posthumously as the sea god Palaemon.'],
    sources:['Apollodorus, Bibl. 3.4.3','Ovid, Met. 4.512–530']},

  {id:'dionysus', name:'Dionysus', epithet:'Twice-born God', fate:'Passed over for throne; Triumphant God', kind:'gold', gen:2, parents:['semele'],
    father:'Zeus', mother:'Semele',
    facts:[
      'Generationally a cousin to Pentheus, but his divine nature and "second birth" from Zeus\'s thigh place him outside standard mortal aging.',
      'Cadmus gives the Theban throne to Pentheus, passing over Dionysus.',
      'Returns to Thebes as an established god disguised as a mortal to punish his aunts and assert his divinity.',
      'Destroys Pentheus and leaves Thebes permanently under his religious dominion.'
    ],
    sources:['Euripides, Bacchae 1–63, 26–42, 170–180','Apollodorus, Bibl. 3.4.3, 3.5.2']},

  {id:'pentheus', name:'Pentheus', fate:'Torn apart by his mother', kind:'coral', gen:2, parents:['agave'], succFrom:'cadmus',
    father:'Echion (Spartos)', mother:'Agave',
    facts:[
      'His father Echion is a Spartos (one of the earth-born warriors created from dragon\'s teeth).',
      'Cadmus makes him king of Thebes instead of Dionysus.',
      'Arrests Dionysus and outlaws his rites, then is lured into spying on the Maenads while disguised in women\'s clothes.',
      'Spotted and torn limb from limb by Agave and the frenzied women.'
    ],
    sources:['Euripides, Bacchae (esp. 912–1152)','Apollodorus, Bibl. 3.5.2']},

  {id:'labdacus', name:'Labdacus', fate:'Killed for resisting Dionysus', kind:'coral', gen:2, parents:['polydorus'], succFrom:'polydorus',
    father:'Polydorus', mother:'Nycteis',
    facts:[
      'Succeeds Polydorus; later resists the Dionysian rites just like Pentheus and meets an early violent death, leaving behind his own infant son, Laius, whose twenty-year regency under Lycus this triggers.',
      'Leaves behind an infant son, Laius.'
    ],
    sources:['Apollodorus, Bibl. 3.5.5']},


  {id:'lycus', name:'Lycus', epithet:'Usurper Regent (m. Dirce)', fate:'Killed by Amphion & Zethus', kind:'coral regent', gen:3, succFrom:'labdacus',
    father:'Chthonius (or Hyrieus)', mother:'N/A',
    facts:[
      'After Labdacus dies leaving only an infant son, Laius, Lycus, brother of Nycteus (father of Nycteis and Antiope), steps in as guardian of the throne.',
      'After Nycteus\'s death, Lycus usurps the regent throne for 20 years.',
      'His wife Dirce mercilessly torments their captive niece Antiope.',
      'When Antiope\'s twin sons Amphion and Zethus uncover their heritage, they slay Lycus and tie Dirce to a wild bull to be dragged to death.'
    ],
    sources:['Apollodorus, Bibl. 3.5.5','Hyginus, Fabulae 7, 8']},

  {id:'amphionzethus', name:'Amphion & Zethus', epithet:'Twin Kings (Sons of Antiope)', fate:'Suicide / Grief after children\'s murder', kind:'coral regent', gen:3, succFrom:'lycus',
    father:'Zeus', mother:'Antiope (Niece of Lycus)',
    facts:[
      'Sons of Zeus and Antiope (daughter of Nycteus, sister to Nycteis).',
      'Usurp the throne after overthrowing Lycus, forcing the rightful infant blood heir Laius into exile in Peloponnese.',
      'Built the 7-gated walls of Thebes using Amphion\'s magical lyre.',
      'Amphion marries Niobe, whose pride causes Apollo and Artemis to slaughter all their children. Amphion commits suicide in grief.'
    ],
    sources:['Apollodorus, Bibl. 3.5.5–6','Ovid, Met. Book 6']},

  {id:'laius', name:'Laius', fate:'Killed by his son Oedipus', kind:'coral', gen:3, parents:['labdacus'], succFrom:'amphionzethus',
    father:'Labdacus', mother:'Unknown',
    facts:[
      'The legitimate blood heir of Cadmus, restored to the throne only after two successive usurpations (Lycus, then Amphion & Zethus).',
      'Abducts Chrysippus while in exile, bringing a divine curse upon his bloodline.',
      'Killed at a three-way crossroads by his abandoned son Oedipus.'
    ],
    sources:['Apollodorus, Bibl. 3.5.7','Sophocles, Oedipus Rex']},

  {id:'oedipus', name:'Oedipus', fate:'Blinded, Exiled, Mysterious death', kind:'coral', gen:4, parents:['laius'], succFrom:'creon',
    father:'Laius', mother:'Jocasta (Tragedy) / Euryganeia (Epic)',
    facts:[
      'An oracle warns Laius that his own son will kill him, so at birth the infant\'s ankles are pierced and bound and he is left exposed on Mount Cithaeron; a shepherd takes pity and passes him to childless King Polybus of Corinth, who raises him as his own.',
      'Not knowing he is adopted, Oedipus flees Corinth after Delphi warns him he is fated to kill his father and marry his mother, unwittingly heading straight toward Thebes and his birth parents.',
      'Kills an old man in a quarrel at a three-way crossroads without recognizing him as Laius, then solves the Sphinx\'s riddle and unknowingly marries his own mother Jocasta (in the Attic tragic tradition).',
      'Early epic traditions (e.g. Oedipodeia) note Jocasta died young and Oedipus fathered his main royal heirs with his second wife Euryganeia.',
      'Blinds himself with Jocasta\'s brooches upon discovering the truth; dies in exile at Colonus.'
    ],
    sources:['Statius, Thebaid 2.276–279','Apollodorus, Bibl. 3.5.7–9','Sophocles, Oedipus Rex','Sophocles, Oedipus at Colonus','Pausanias 9.5.11']},


  {id:'creon', name:'Creon', epithet:'Regent of Thebes (Brother of Jocasta)', fate:'Loses Wife & Son; Reigns On, Broken', kind:'coral regent', gen:3.5, row:4, succFrom:'laius',
    father:'Menoeceus', mother:'N/A',
    facts:[
      'Jocasta\'s brother. Serves as regent of Thebes twice, first between Laius\'s death and Oedipus solving the Sphinx\'s riddle, and again for the young Laodamas once Eteocles and Polynices kill each other.',
      'Gives Eteocles full burial honors but decrees that Polynices, as an attacker of his own city, must be left unburied. Defying the order is made a capital offense.',
      'Sentences his niece Antigone to be sealed alive in a tomb for defying that edict; the prophet Tiresias warns him he is wrong, but too late.',
      'His son Haemon, Antigone\'s betrothed, and his own wife Eurydice both take their own lives in the aftermath, leaving him ruling on alone.'
    ],
    sources:['Sophocles, Antigone','Sophocles, Oedipus Rex','Apollodorus, Bibl. 3.5.8–3.7.1']},

  {id:'eteocles', name:'Eteocles', epithet:'Defender of Thebes', fate:'Killed by Polynices in Combat', kind:'coral', gen:5, parents:['oedipus'], succFrom:'oedipus',
    father:'Oedipus', mother:'Jocasta (Tragedy) / Euryganeia (Epic)',
    facts:[
      'Agreed to alternate the kingship annually with Polynices after Oedipus\'s fall.',
      'Refused to yield the throne after his first year expired, igniting the Seven Against Thebes war.',
      'Slain in single combat by his brother Polynices.'
    ],
    sources:['Apollodorus, Bibl. 3.6.1–8','Sophocles, Antigone']},

  {id:'polynices', name:'Polynices', epithet:'Leader of the Seven', fate:'Killed by Eteocles in Combat', kind:'coral', gen:5, parents:['oedipus'], succFrom:'oedipus',
    father:'Oedipus', mother:'Jocasta (Tragedy) / Euryganeia (Epic)',
    facts:[
      'Exiled by Eteocles when denied his rightful turn on the throne.',
      'Gathered the Seven Against Thebes to reclaim the crown.',
      'Slain in single combat by Eteocles outside the gates of Thebes.'
    ],
    sources:['Apollodorus, Bibl. 3.6.1–8','Euripides, Phoenissae']},

  {id:'antigone', name:'Antigone', epithet:'Daughter of Oedipus', fate:'Sealed in a Tomb; Hangs Herself', kind:'coral', gen:5, parents:['oedipus'],
    father:'Oedipus', mother:'Jocasta (Tragedy) / Euryganeia (Epic)',
    facts:[
      'Follows her blinded father into exile at Colonus, acting as his guide until his death.',
      'Defies Creon\'s edict forbidding the burial of her brother Polynices, performing funeral rites for him in secret.',
      'Sentenced by Creon to be sealed alive in a rock-cut tomb as punishment.',
      'Hangs herself inside the tomb before Creon, warned by Tiresias and rushing to free her, can arrive in time.'
    ],
    sources:['Sophocles, Antigone','Sophocles, Oedipus at Colonus','Apollodorus, Bibl. 3.7.1']},

  {id:'ismene', name:'Ismene', epithet:'Daughter of Oedipus', fate:'Spared by Creon; Outlives Her Family', kind:'bronze', gen:5, parents:['oedipus'],
    father:'Oedipus', mother:'Jocasta (Tragedy) / Euryganeia (Epic)',
    facts:[
      'Antigone\'s younger sister; warns her against defying Creon\'s burial edict and initially refuses to help, fearing for both their lives.',
      'After Antigone is caught, tries to claim a share of the guilt so she can die alongside her. Antigone refuses to let her, insisting Ismene chose life.',
      'Creon spares her, making her the last of Oedipus\'s children left standing once Antigone, Eteocles, and Polynices are all dead.',
      'An earlier, less-followed tradition instead has her killed by Tydeus at Athena\'s instigation, but Sophocles\' version, in which she survives, is the one that stuck.'
    ],
    sources:['Sophocles, Antigone','Mimnermus, fr. 21 West (preserved in the Hypothesis to Sophocles\' Antigone)']},


  {id:'laodamas', name:'Laodamas', fate:'Killed by Alcmaeon in War', kind:'coral', gen:6, parents:['eteocles'], succFrom:'creon',
    father:'Eteocles', mother:'Unknown',
    facts:['Son of Eteocles; too young to rule after his father\'s death, so Creon reigns as regent until he comes of age. Rules Thebes during the attack of the Epigoni and is slain in battle by Alcmaeon.'],
    sources:['Apollodorus, Bibl. 3.7.2–3','Pausanias 9.5.13']},

  {id:'alcmaeon', name:'Alcmaeon', epithet:'Leader of the Epigoni; Son of Amphiaraus', fate:'Matricide; Hounded by Furies', kind:'coral', gen:6.2,
    father:'Amphiaraus', mother:'Eriphyle',
    facts:[
      'Son of the seer Amphiaraus and Eriphyle, the same Eriphyle who was bribed with the cursed Necklace of Harmonia by Polynices to force her husband into the doomed war against Thebes.',
      'Leads the Epigoni, sons of the original Seven, in the second and victorious assault on Thebes, killing Laodamas and finally sacking the city his father died attacking.',
      'Carries out Amphiaraus\'s dying command by killing his own mother Eriphyle in revenge for sending her husband to his death.',
      'Driven mad and hounded across Greece by the Erinyes (Furies) for matricide, the same divine punishment that plagued Oedipus\'s own line generations earlier.',
      'His own sons, Amphoterus and Acarnan, later avenge his death and recover the necklace from his killers, finally dedicating it at Delphi\'s Temple of Athena and ending the curse that ran from Harmonia\'s wedding day through six generations of this family.'
    ],
    sources:['Apollodorus, Bibl. 3.7.2–7','Pausanias 9.5.13','Thucydides 2.102.9']},

  {id:'thersander', name:'Thersander', fate:'Killed by Telephus in Mysia', kind:'coral', gen:6, parents:['polynices'], succFrom:'laodamas',
    father:'Polynices', mother:'Argia',
    facts:['Son of Polynices; takes the throne after the Epigoni defeat Laodamas.'],
    sources:['Apollodorus, Bibl. 3.7.2 (Epigoni), Epit. 3.17 (death)','Pausanias 9.5.14–15']},

  {id:'peneleos', name:'Peneleos', epithet:'Regent of Thebes (for Tisamenus)', fate:'Killed by Eurypylus at Troy', kind:'coral regent', gen:6.5, succFrom:'thersander',
    father:'Hippalcimus', mother:'Asterope',
    facts:[
      'A Boeotian noble and former Argonaut; chosen to command the Theban contingent to Troy because Thersander\'s son Tisamenus is not yet old enough to lead.',
      'Wounded by Polydamas in battle, then killed at Troy by Eurypylus, son of Telephus, the same lineage that killed Thersander himself a generation earlier.',
      'His grandson Damasichthon, through his son Opheltes, later becomes king of Thebes once the Cadmean line ends with Autesion.'
    ],
    sources:['Pausanias 9.5.15–16','Homer, Iliad 2.494–495, 16.335–341']},

  {id:'tisamenus', name:'Tisamenus', fate:'Died naturally (Spared by Furies)', kind:'bronze', gen:7, parents:['thersander'], succFrom:'peneleos',
    father:'Thersander', mother:'Demonassa',
    facts:['Son of Thersander and Demonassa, daughter of Amphiaraus, the seer whose death the cursed Necklace of Harmonia had bought. Ruled quietly once of age; the Erinyes (Furies) temporarily ceased harassing the line during his lifetime.'],
    sources:['Pausanias 9.5.15']},

  {id:'autesion', name:'Autesion', fate:'Driven into Exile by Furies', kind:'coral', gen:8, parents:['tisamenus'], succFrom:'tisamenus',
    father:'Tisamenus', mother:'Unknown',
    facts:['The Furies resume their torment; advised by an oracle to leave Thebes and join the Dorians. Ends Cadmean rule.'],
    sources:['Pausanias 9.5.15–16']},

  {id:'xanthusline', name:'Damasichthon → Ptolemy → Xanthus', epithet:'Non-Cadmean Succession', fate:'Killed by Trickery in Combat', kind:'coral non-cadmean end composite', gen:9, succFrom:'autesion',
    father:'Opheltes (father of Damasichthon)', mother:'N/A',
    facts:[
      'Following Autesion\'s exile, the Thebans choose three non-Cadmean kings to rule in succession.',
      'Damasichthon, son of Opheltes and grandson of Peneleus, reigns first.',
      'Ptolemy, his son, succeeds him.',
      'Xanthus, Ptolemy\'s son, becomes the final king of Thebes.',
      'Xanthus is slain in single combat by Melanthus (or Andropompus) of Athens through a deceitful trick during a border dispute.',
      'Upon Xanthus\'s death, the Thebans abolish the monarchy for good and shift to rule by elected magistrates.'
    ],
    sources:['Pausanias 9.5.16']}
];


const REIGNS = [
  { ids: ['cadmus'] },
  { ids: ['pentheus'] },
  { ids: ['polydorus'] },
  { ids: ['labdacus'] },
  { ids: ['lycus'], regent: true },
  { ids: ['amphionzethus'], regent: true },
  { ids: ['laius'] },
  { ids: ['creon'], regent: true, note: '1st regency, for Oedipus' },
  { ids: ['oedipus'] },
  { ids: ['eteocles', 'polynices'] },
  { ids: ['creon'], regent: true, note: '2nd regency, for Laodamas' },
  { ids: ['laodamas'] },
  { ids: ['thersander'] },
  { ids: ['peneleos'], regent: true, note: 'for Tisamenus' },
  { ids: ['tisamenus'] },
  { ids: ['autesion'] },
  { ids: ['xanthusline'] }
];
