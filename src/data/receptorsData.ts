import { ReceptorInfo } from '../types';

export const RECEPTORS_DATABASE: ReceptorInfo[] = [
  // GLUTAMATE IONOTROPIC
  {
    id: 'nmda',
    name: 'Receptor NMDA',
    codeName: 'GluN1 / GluN2A-D (GRIN1, GRIN2A-D)',
    family: 'glutamate',
    transduction: 'ionotropic',
    couplingOrConductance: 'Ca2+ >> Na+, K+ (Wysokie przewodnictwo Ca2+)',
    structureSubunits: 'Heterotetramer (2x obligat. GluN1 + 2x GluN2A/B/C/D)',
    synapticLocation: ['postsynaptic', 'extrasynaptic'],
    cnsRegions: ['Kora mózgowa (wszystkie warstwy)', 'Hipokamp (CA1, CA3, zakręt zębaty)', 'Prążkowie', 'Ciało migdałowate'],
    functionalRole: 'Biologiczny detektor koincydencji; kluczowy mediator długotrwałego wzmocnienia synaptycznego (LTP) oraz ekscytotoksyczności.',
    signalingCascade: {
      title: 'Kaskada wapniowa CaMKII / Kalcyneuryna',
      steps: [
        'Depolaryzacja błony (przez AMPA do ok. -30 mV) usuwa elektrostatyczny blok Mg2+',
        'Jednoczesne związanie glutaminianu (GluN2) oraz koagonisty (glicyna/D-seryna na GluN1)',
        'Masywny napływ jonów Ca2+ do kolca dendrytycznego',
        'Aktywacja CaMKII (autofosforylacja Thr286) -> fosforylacja GluA1 receptora AMPA (indukcja LTP)',
        'Przy słabszym napływie Ca2+: aktywacja kalcyneuryny (PP2B) -> defosforylacja i indukcja LTD'
      ],
      primaryEffectors: ['CaMKII', 'Kalcyneuryna (PP2B)', 'nNOS (syntaza tlenku azotu)', 'CREB'],
      cellularOutcome: 'Plastyczność synaptyczna (LTP/LTD), wbudowywanie receptorów AMPA w postsynapsę, ekspresja genów wczesnej odpowiedzi (Arc, c-Fos).'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'd1',
        nature: 'scaffold',
        description: 'C-końcowy ogon GluN1 tworzy bezpośredni kompleks fizyczny z domeną C-końcową receptora D1; dopamina stabilizuje NMDA w błonie i zapobiega jego endocytozie.'
      },
      {
        partnerReceptor: 'ampa',
        nature: 'synergy',
        description: 'AMPA dostarcza szybkiego ładunku depolaryzującego (EPSP), który jest warunkiem sine qua non odblokowania poru NMDA od jonu Mg2+.'
      },
      {
        partnerReceptor: 'gaba_a',
        nature: 'antagonism',
        description: 'Napływ Cl- przez GABA_A utrzymuje potencjał spoczynkowy w rejonie -70 mV, cementując blok Mg2+ w kanale NMDA (hamowanie bocznikujące).'
      }
    ],
    pharmacology: {
      endogenousLigands: ['L-Glutaminian', 'Glicyna', 'D-Seryna'],
      clinicalAgonists: ['NMDA (badawczy)'],
      clinicalAntagonistsOrBlockers: ['Ketamina (szybki antydepresant)', 'Esketamina (Spravato)', 'Memantyna (ch. Alzheimera)', 'Fencyklidyna (PCP)'],
      allostericModulators: ['Cynk (Zn2+ - endogenny allosteryk)', 'Poliaminy (spermina, spermidyna)'],
      clinicalApplications: ['Lekooporna depresja', 'Otępienie w chorobie Alzheimera', 'Neuroprotekcja poudarowa', 'Znieczulenie ogólne']
    },
    badgeColor: 'emerald'
  },
  {
    id: 'ampa',
    name: 'Receptor AMPA',
    codeName: 'GluA1 - GluA4 (GRIA1 - GRIA4)',
    family: 'glutamate',
    transduction: 'ionotropic',
    couplingOrConductance: 'Na+, K+ (oraz Ca2+ w kanałach bez edytowanej GluA2)',
    structureSubunits: 'Tetramer podjednostek GluA1-GluA4; dominują heteromery GluA1/GluA2 i GluA2/GluA3',
    synapticLocation: ['postsynaptic'],
    cnsRegions: ['Powszechny w całym OUN', 'Wysoka gęstość w korze, hipokampie, móżdżku i prążkowiu'],
    functionalRole: 'Odpowiada za wczesną, szybką fazę pobudzającego potencjału postsynaptycznego (EPSP); motor transmisji synaptycznej.',
    signalingCascade: {
      title: 'Szybka depolaryzacja postsynaptyczna',
      steps: [
        'Wiązanie 2-4 cząsteczek glutaminianu z domenami zewnątrzkomórkowymi',
        'Błyskawiczne otwarcie kanału kationowego (czas otwarcia <1 ms)',
        'Gwałtowny dokomórkowy napływ Na+ znoszący ujemny ładunek spoczynkowy',
        'Generacja klasycznego EPSP umożliwiającego odblokowanie NMDA',
        'Regulacja: fosforylacja Ser845 (przez PKA) ułatwia insercję do błony, Ser831 (przez CaMKII) zwiększa przewodnictwo'
      ],
      primaryEffectors: ['PSD-95 (kotwica białkowa)', 'TARP (stargazyna)', 'PKA', 'CaMKII'],
      cellularOutcome: 'Podstawowa depolaryzacja błony dendrytycznej, transmisja impulsu nerwowego, ekspresja LTP.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'nmda',
        nature: 'synergy',
        description: 'Depolaryzacja z AMPA usuwa blokadę magnezową NMDA, umożliwiając napływ Ca2+ i kaskady plastyczności.'
      },
      {
        partnerReceptor: 'd1',
        nature: 'synergy',
        description: 'D1 poprzez aktywację PKA i fosforylację Ser845 zwiększa insercję GluA1 do błony synaptycznej w prążkowiu.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['L-Glutaminian'],
      clinicalAgonists: ['AMPA (badawczy)'],
      clinicalAntagonistsOrBlockers: ['Perampanel (Fycompa - lek przeciwpadaczkowy)', 'NBQX (selektywny antagonista badawczy)'],
      allostericModulators: ['Ampakiny (CX-516 - wzmacniacze funkcji poznawczych)', 'Cyklotiazyd (hamuje desensytyzację)'],
      clinicalApplications: ['Padaczka oporna na leczenie', 'Zaburzenia poznawcze i mnemoniczne']
    },
    badgeColor: 'emerald'
  },
  {
    id: 'kainate',
    name: 'Receptor Kainianowy',
    codeName: 'GluK1 - GluK5 (GRIK1 - GRIK5)',
    family: 'glutamate',
    transduction: 'ionotropic',
    couplingOrConductance: 'Na+, K+ (zmienna przepuszczalność Ca2+)',
    structureSubunits: 'Tetramer: homomery GluK1-3 lub heteromery z GluK4/GluK5',
    synapticLocation: ['presynaptic', 'postsynaptic'],
    cnsRegions: ['Hipokamp (włókna kiciaste pola CA3)', 'Kora mózgowa', 'Móżdżek', 'Rogi tylne rdzenia kręgowego'],
    functionalRole: 'Dwoista funkcja: postsynaptycznie generuje wolniejszy komponent EPSP; presynaptycznie moduluje wyrzut zarówno glutaminianu, jak i GABA.',
    signalingCascade: {
      title: 'Dwukierunkowa regulacja presynaptyczna',
      steps: [
        'Wiązanie glutaminianu na terminalu presynaptycznym',
        'Przy niskich stężeniach: nieznaczna depolaryzacja ułatwiająca wyrzut transmitera',
        'Przy wysokich stężeniach: inaktywacja kanałów sodowych i spadek uwalniania glutaminianu (autoregulacja negatywna)',
        'Współpraca z białkami G (nietypowa kaskada metabotropowa dla kanału jonotropowego)'
      ],
      primaryEffectors: ['Kanały sodowe zależne od napięcia', 'Pęcherzyki synaptyczne VGLUT'],
      cellularOutcome: 'Precyzyjne dostrajanie dynamiki wyładowań w obwodach hipokampa i modulacja czucia bólu.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'gaba_a',
        nature: 'synergy',
        description: 'Presynaptyczne receptory kainianowe na zakończeniach interneuronów stymulują wyrzut GABA, nasilając hamowanie sieciowe.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['L-Glutaminian'],
      clinicalAgonists: ['Kwas kainowy (silny drgawkotwórczy model padaczki)'],
      clinicalAntagonistsOrBlockers: ['Tezampanel (LY-293558 - migrena, ból neuropatyczny)'],
      clinicalApplications: ['Ból neuropatyczny', 'Napady migrenowe', 'Modele padaczki skroniowej']
    },
    badgeColor: 'emerald'
  },

  // GLUTAMATE METABOTROPIC
  {
    id: 'mglur1_5',
    name: 'mGluR Grupa I (mGluR1, mGluR5)',
    codeName: 'GRM1, GRM5',
    family: 'glutamate',
    transduction: 'gpcr_gq',
    couplingOrConductance: 'Białko Gαq/11 -> Fosfolipaza C-β (PLCβ)',
    structureSubunits: 'Dimery GPCR klasy C z dużą domeną zewnątrzkomórkową typu Venus flytrap (VFT)',
    synapticLocation: ['postsynaptic', 'extrasynaptic'],
    cnsRegions: ['Móżdżek (komórki Purkinjego - mGluR1)', 'Hipokamp, kora mózgowa, prążkowie (mGluR5)'],
    functionalRole: 'Indukcja długotrwałego osłabienia synaptycznego (mGluR-LTD), synteza endokannabinoidów oraz znoszenie prądu M (KCNQ).',
    signalingCascade: {
      title: 'Kaskada PLCβ - IP3/DAG i synteza 2-AG',
      steps: [
        'Wiązanie glutaminianu aktywuje Gαq/11',
        'Stymulacja PLCβ prowadzi do hydrolizy PIP2 do IP3 oraz DAG',
        'IP3 uwalnia Ca2+ z ER; Ca2+ wraz z DAG aktywuje PKC',
        'DAG jest przekształcany przez lipazę DAGLα w 2-arachidonoiloglicerol (2-AG)',
        '2-AG dyfunduje retrogradnie do presynaptycznych receptorów CB1',
        'Spadek stężenia PIP2 zamyka kanały potasowe Kv7 (prąd M), gwałtownie podnosząc pobudliwość'
      ],
      primaryEffectors: ['PLCβ', 'IP3R', 'PKC', 'DAGLα (synteza 2-AG)', 'Homer (białko rusztowania)'],
      cellularOutcome: 'Mobilizacja Ca2+, indukcja retrogradnego hamowania DSE/DSI, lokalna synteza białek dendrytycznych.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'cb1',
        nature: 'retrograde',
        description: 'Aktywacja postsynaptyczna mGluR1/5 jest głównym wyzwalaczem syntezy 2-AG, który retrogradnie hamuje presynaptyczny CB1.'
      },
      {
        partnerReceptor: 'nmda',
        nature: 'scaffold',
        description: 'Białko rusztowania Shank łączy kompleks NMDA/PSD-95 z kompleksem Homer/mGluR1/5, synchronizując sygnały wapniowe.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['L-Glutaminian'],
      clinicalAgonists: ['DHPG (selektywny agonista badawczy)'],
      clinicalAntagonistsOrBlockers: ['MPEP, Mavoglurant (antagoniści/NAM mGluR5 w zespole łamliwego chromosomu X)'],
      clinicalApplications: ['Zespół łamliwego chromosomu X', 'Dyskinezy wywołane lewodopą (LID)', 'Uzależnienia']
    },
    badgeColor: 'amber'
  },
  {
    id: 'mglur2_3',
    name: 'mGluR Grupa II (mGluR2, mGluR3)',
    codeName: 'GRM2, GRM3',
    family: 'glutamate',
    transduction: 'gpcr_gi',
    couplingOrConductance: 'Białko Gαi/o oraz wolne dimery Gβγ',
    structureSubunits: 'Dimery GPCR klasy C; tworzą także heterodimery mGluR2-mGluR3 i mGluR2-5HT2A',
    synapticLocation: ['presynaptic', 'glial'],
    cnsRegions: ['Kora przedczołowa', 'Hipokamp', 'Ciało migdałowate', 'Wzgórze', 'Astrocyty (głównie mGluR3)'],
    functionalRole: 'Autoreceptor presynaptyczny: potężny hamulec uwalniania glutaminianu, chroniący neurony przed ekscytotoksycznością.',
    signalingCascade: {
      title: 'Hamowanie wyrzutu glutaminianu i spadek cAMP',
      steps: [
        'Wyciek nadmiaru glutaminianu poza synapsę aktywuje perisynaptyczny mGluR2/3',
        'Podjednostka Gαi hamuje cyklazę adenylanową, obniżając stężenie cAMP i wygaszając PKA',
        'Uwolniony heterodimer Gβγ bezpośrednio blokuje bramkowane napięciem kanały wapniowe Cav2.1 (P/Q) i Cav2.2 (N)',
        'Brak dokomórkowego prądu Ca2+ uniemożliwia fuzję pęcherzyków SNARE i uwalnianie glutaminianu'
      ],
      primaryEffectors: ['Cyklaza adenylanowa (hamowanie)', 'Kanały Cav2.1/Cav2.2 (blokada)', 'Kanały GIRK (aktywacja)'],
      cellularOutcome: 'Wyciszenie transmisji pobudzającej, działanie neuroprotekcyjne, anksjolityczne i przeciwpsychotyczne.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: '5ht2a',
        nature: 'heterodimer',
        description: 'Tworzy funkcjonalny heterodimer 5-HT2A - mGluR2 w neuronach piramidowych kory. Agonizm mGluR2 wygasza psychodeliczne i pro-psychotyczne efekty pobudzenia 5-HT2A.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['L-Glutaminian', 'NAAG (preferencyjnie mGluR3)'],
      clinicalAgonists: ['Pomaglumetad metionil (LY-2140023 - badany w schizofrenii)'],
      clinicalAntagonistsOrBlockers: ['LY-341495 (badawczy antagonista)'],
      allostericModulators: ['Bavisant (PAM mGluR2)'],
      clinicalApplications: ['Schizofrenia (leczenie psychoz bez blokady D2)', 'Zaburzenia lękowe uogólnione']
    },
    badgeColor: 'rose'
  },
  {
    id: 'mglur4_7_8',
    name: 'mGluR Grupa III (mGluR4, mGluR7, mGluR8)',
    codeName: 'GRM4, GRM7, GRM8',
    family: 'glutamate',
    transduction: 'gpcr_gi',
    couplingOrConductance: 'Białko Gαi/o -> spadek cAMP + blokada Cav2',
    structureSubunits: 'Dimery GPCR klasy C',
    synapticLocation: ['presynaptic'],
    cnsRegions: ['Zwoje podstawy (prążkowie, gałka blada, istota czarna)', 'Opuszka węchowa', 'Hipokamp'],
    functionalRole: 'Bezpośrednie autoreceptory strefy aktywnej (szczególnie mGluR7 o bardzo niskim powinowactwie, aktywowany tylko przy skrajnych wyładowaniach).',
    signalingCascade: {
      title: 'Ostateczny bezpiecznik presynaptyczny',
      steps: [
        'Związanie bardzo wysokiego stężenia glutaminianu w strefie uwalniania pęcherzyków',
        'Aktywacja Gi/o i uwolnienie Gβγ',
        'Błyskawiczne zahamowanie napływu Ca2+ przez Cav2.1',
        'Zatrzymanie lawinowego wyrzutu neuroprzekaźnika przy częstych wyładowaniach'
      ],
      primaryEffectors: ['Cav2.1', 'GIRK', 'PKA'],
      cellularOutcome: 'Ochrona przed wyładowaniami padaczkowymi i modulacja pętli motorycznych zwojów podstawy.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'gaba_b',
        nature: 'synergy',
        description: 'Współdziała addytywnie z presynaptycznym GABA_B w terminalach glutaminianergicznych w tłumieniu wyrzutu.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['L-Glutaminian', 'L-AP4'],
      clinicalAgonists: ['L-AP4 (badawczy)'],
      allostericModulators: ['Foliglurax (PAM mGluR4 badany w chorobie Parkinsona)'],
      clinicalApplications: ['Choroba Parkinsona (modulacja gałki bladej)', 'Leczenie przeciwdrgawkowe']
    },
    badgeColor: 'rose'
  },

  // GABA & GLYCINE
  {
    id: 'gaba_a',
    name: 'Receptor GABA_A',
    codeName: 'GABRA1-6, GABRB1-3, GABRG1-3, GABRD, GABRE, GABRP, GABRQ',
    family: 'gaba',
    transduction: 'ionotropic',
    couplingOrConductance: 'Cl- >> HCO3- (Napływ anionów chlorkowych)',
    structureSubunits: 'Heteropentamer Cys-loop; w mózgu dominuje 2α1 2β2 1γ2 (ok. 60%) oraz α2β3γ2, α5β3γ2, α4βδ',
    synapticLocation: ['postsynaptic', 'extrasynaptic'],
    cnsRegions: ['Powszechny w całym OUN (główny receptor hamujący)', 'Kora, hipokamp, wzgórze, móżdżek, pień mózgu'],
    functionalRole: 'Podstawa szybkiego hamowania fazowego (synaptyczne z podjednostką γ2) oraz tonicznego (ekstrasynaptyczne z podjednostką δ).',
    signalingCascade: {
      title: 'Hamowanie fazowe i bocznikujące (Cl-)',
      steps: [
        'Wiązanie 2 cząsteczek GABA na granicy podjednostek α i β',
        'Otwarcie poru anionowego i dokomórkowy prąd Cl-',
        'Oddalenie potencjału błonowego od progu pobudzenia (hiperpolaryzacja do ok. -75 mV)',
        'Spadek oporności błony (shunting inhibition) drastycznie redukujący amplitudę dochodzących EPSP',
        'Zakotwiczenie w macierzy postsynaptycznej przez białko gefirynę (gephyrin)'
      ],
      primaryEffectors: ['Gefiryna', 'Kanały Cl-', 'KCC2 (kotransporter K+/Cl- utrzymujący gradient)'],
      cellularOutcome: 'Błyskawiczne wygaszenie pobudzenia neuronalnego, synchronizacja rytmów gamma (interneurony PV+).'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'nmda',
        nature: 'antagonism',
        description: 'Potencjał wywołany przez GABA_A uniemożliwia depolaryzację wymaganą do usunięcia jonu Mg2+ z kanału NMDA.'
      },
      {
        partnerReceptor: 'd5',
        nature: 'scaffold',
        description: 'Receptor D5 fizycznie asocjuje z drugą wewnątrzkomórkową pętlą podjednostki γ2 receptora GABA_A, modulując prądy hamujące.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['GABA (kwas gamma-aminomasłowy)'],
      clinicalAgonists: ['Muscymol (badawczy)'],
      clinicalAntagonistsOrBlockers: ['Bikukulina (antagonista)', 'Pikrotoksyna (bloker kanału)'],
      allostericModulators: ['Benzodiazepiny (Diazepam, Lorazepam - PAM α1/2/3/5)', 'Z-leki (Zolpidem - selektywny PAM α1)', 'Neurosteroidy (Breksanolon, Zuranolon - PAM podjednostki δ)', 'Barbiturany', 'Propofol'],
      clinicalApplications: ['Stany lękowe i ataki paniki', 'Bezsenność', 'Status epilepticus (stany drgawkowe)', 'Znieczulenie ogólne', 'Depresja poporodowa (zuranolon)']
    },
    badgeColor: 'emerald'
  },
  {
    id: 'gaba_b',
    name: 'Receptor GABA_B',
    codeName: 'GABBR1, GABBR2',
    family: 'gaba',
    transduction: 'gpcr_gi',
    couplingOrConductance: 'Białko Gαi/o oraz wolny dimer Gβγ -> GIRK i Cav2',
    structureSubunits: 'Obligatoryjny heterodimer: GABA_B1 (wiąże ligand) + GABA_B2 (sprzężony z białkiem G)',
    synapticLocation: ['presynaptic', 'postsynaptic', 'extrasynaptic'],
    cnsRegions: ['Rdzeń kręgowy (rogi tylne i przednie)', 'Kora mózgowa', 'Wzgórze', 'Móżdżek', 'Hipokamp'],
    functionalRole: 'Powolny, długotrwały potencjał hamujący IPSP (postsynaptycznie) oraz silny presynaptyczny hamulec wyrzutu neurotransmiterów.',
    signalingCascade: {
      title: 'Aktywacja kanałów GIRK i blokada egzocytozy',
      steps: [
        'Wiązanie GABA na zewnątrzkomórkowej domenie podjednostki GABA_B1',
        'Allosteryczne przejście konformacyjne aktywuje domenę 7TM podjednostki GABA_B2',
        'Gαi hamuje cyklazę adenylanową, obniżając poziom cAMP i aktywność PKA',
        'Postsynaptycznie: uwolniony Gβγ bezpośrednio otwiera dokomórkowe kanały potasowe GIRK (Kir3), dając powolny, późny IPSP',
        'Presynaptycznie: dimer Gβγ wiąże kanały wapniowe Cav2.1/2.2 i hamuje egzocytozę glutaminianu oraz monoamin'
      ],
      primaryEffectors: ['Kanały GIRK (Kir3.1-3.4)', 'Kanały Cav2.1 / Cav2.2', 'Cyklaza adenylanowa'],
      cellularOutcome: 'Głęboka, długotrwała hiperpolaryzacja błony dendrytycznej, zniesienie spastyczności mięśniowej.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'nmda',
        nature: 'antagonism',
        description: 'Postsynaptyczny GABA_B wywołuje długotrwałą hiperpolaryzację dendrytu, wzmacniając blokadę Mg2+ kanałów NMDA.'
      },
      {
        partnerReceptor: 'mglur1_5',
        nature: 'scaffold',
        description: 'W komórkach móżdżku GABA_B może tworzyć makrokompleksy z mGluR1, modyfikując prądy wapniowe.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['GABA'],
      clinicalAgonists: ['Baklofen (Lioresal - lek miorelaksacyjny w stwardnieniu rozsianym)', 'Kwas gamma-hydroksymasłowy (GHB / Oksybat sodu)'],
      clinicalAntagonistsOrBlockers: ['Faklofen, CGP-35348 (badawcze)'],
      allostericModulators: ['Kwas walproinowy (pośrednio)', 'GS-39783 (PAM)'],
      clinicalApplications: ['Spastyczność mięśniowa pourazowa i w SM', 'Narkolepsja z katapleksją (Xyrem)', 'Uzależnienie od alkoholu']
    },
    badgeColor: 'rose'
  },
  {
    id: 'glyr',
    name: 'Receptor Glicynowy (GlyR)',
    codeName: 'GLRA1 - GLRA4, GLRB',
    family: 'glycine',
    transduction: 'ionotropic',
    couplingOrConductance: 'Cl- (Napływ anionów chlorkowych)',
    structureSubunits: 'Heteropentamer: 3x podjednostka α (α1-α3) + 2x podjednostka β',
    synapticLocation: ['postsynaptic'],
    cnsRegions: ['Rdzeń kręgowy (rogi przednie i tylne)', 'Pień mózgu (jądra nerwów czaszkowych)', 'Siatkówka'],
    functionalRole: 'Podstawowy receptor hamujący dolnego piętra OUN; odpowiada za rozluźnienie motoneuronów w pętli komórek Renshawa oraz bramkowanie czucia bólu.',
    signalingCascade: {
      title: 'Hamowanie postsynaptyczne motoneuronów i czucia bólu',
      steps: [
        'Wiązanie glicyny w szczelinie synaptycznej',
        'Błyskawiczne otwarcie kanału anionowego i dokomórkowy napływ Cl-',
        'Potężna hiperpolaryzacja błony komórkowej motoneuronu',
        'Gefiryna wiąże domenę cytoplazmatyczną podjednostki β z mikrotubulami cytoszkieletu'
      ],
      primaryEffectors: ['Gefiryna', 'Kanał chlorkowy'],
      cellularOutcome: 'Hamowanie nawrotowe motoneuronów (zapobieganie tężyczce mięśni), filtracja bodźców nocyceptywnych.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'gaba_a',
        nature: 'synergy',
        description: 'Często współwystępuje w tych samych synapsach rdzenia kręgowego, zapewniając dwufazowe hamowanie anionowe.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['Glicyna', 'β-alanina', 'Tauryna'],
      clinicalAntagonistsOrBlockers: ['Strychnina (silna trucizna drgawkowa wywołująca skurcze tężcowe)'],
      clinicalApplications: ['Hiperekpleksja (choroba wrodzona - mutacje GLRA1)', 'Terapia bólu neuropatycznego rdzeniowego']
    },
    badgeColor: 'emerald'
  },

  // DOPAMINE RECEPTORS
  {
    id: 'd1',
    name: 'Receptor Dopaminowy D1',
    codeName: 'DRD1',
    family: 'dopamine',
    transduction: 'gpcr_gs',
    couplingOrConductance: 'Białko Gαs / Gαolf -> stymulacja cyklazy adenylanowej (AC)',
    structureSubunits: 'Monomer GPCR klasy A; tworzy homodimery D1-D1 oraz heterodimery D1-D2, D1-NMDA',
    synapticLocation: ['postsynaptic'],
    cnsRegions: ['Prążkowie (neurony średnie kolczaste dMSN drogi bezpośredniej)', 'Jądro półleżące (NAc)', 'Kora przedczołowa (PFC)', 'Opuszka węchowa'],
    functionalRole: 'Inicjacja i ułatwianie ruchu (droga bezpośrednia), pamięć robocza w korze przedczołowej, układ nagrody i motywacja.',
    signalingCascade: {
      title: 'Kaskada cAMP - PKA - DARPP-32 (Thr34)',
      steps: [
        'Dopamina wiąże D1, aktywując specyficzne dla prążkowia białko Gαolf',
        'Gαolf stymuluje cyklazę adenylanową typu V (AC5), podnosząc poziom cAMP',
        'cAMP wiąże podjednostki regulatorowe PKA, uwalniając aktywne kinazy PKA',
        'PKA fosforyluje DARPP-32 na reszcie Treonina-34 (Thr34)',
        'Sfosforylowany DARPP-32 staje się silnym inhibitorem fosfatazy białkowej 1 (PP1)',
        'Zahamowanie PP1 uniemożliwia defosforylację GluA1 i GluN2B, maksymalizując ich pobudliwość',
        'Równolegle PKA przemieszcza się do jądra i fosforyluje CREB (Ser133)'
      ],
      primaryEffectors: ['AC5', 'PKA', 'DARPP-32 (Thr34)', 'PP1 (hamowanie)', 'CREB'],
      cellularOutcome: 'Wzmocnienie pobudzenia glutaminianowego, ułatwienie napędu ruchowego, konsolidacja pamięci motorycznej.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'nmda',
        nature: 'scaffold',
        description: 'Bezpośredni kompleks fizyczny: D1 wiąże GluN1, fosforylacja przez PKA stabilizuje NMDA w gęstości postsynaptycznej.'
      },
      {
        partnerReceptor: 'd2',
        nature: 'heterodimer',
        description: 'W podpopulacji neuronów NAc tworzy heterodimer D1-D2 sprzężony nietypowo z białkiem Gq/11, wywołując wyrzut wapnia.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['Dopamina'],
      clinicalAgonists: ['SKF-38393 (badawczy)', 'Fenoldopam (obwodowy)'],
      clinicalAntagonistsOrBlockers: ['Ecopipam (badany w zespole Tourette’a i pląsawicy)', 'SCH-23390 (badawczy)'],
      clinicalApplications: ['Zespół Tourette’a', 'Poprawa funkcji poznawczych w schizofrenii', 'Choroba Parkinsona']
    },
    badgeColor: 'sky'
  },
  {
    id: 'd2',
    name: 'Receptor Dopaminowy D2',
    codeName: 'DRD2 (izoformy D2S i D2L)',
    family: 'dopamine',
    transduction: 'gpcr_gi',
    couplingOrConductance: 'Białko Gαi/o oraz wolny dimer Gβγ',
    structureSubunits: 'Monomer GPCR klasy A; splicing generuje formę D2S (krótka, presynaptyczna) i D2L (długa, postsynaptyczna)',
    synapticLocation: ['presynaptic', 'postsynaptic'],
    cnsRegions: ['Prążkowie (neurony iMSN drogi pośredniej)', 'Substantia nigra pars compacta (SNc)', 'Pole brzuszne nakrywki (VTA)', 'Przysadka mózgowa'],
    functionalRole: 'Autoreceptor wygaszający wyrzut dopaminy (D2S); postsynaptyczny mediator hamowania ruchu w drodze pośredniej (D2L); regulacja prolaktyny.',
    signalingCascade: {
      title: 'Hamowanie cAMP, aktywacja GIRK i szlak Akt-GSK3β',
      steps: [
        'Związanie dopaminy aktywuje białko heterotrimeryczne Gi/o',
        'Podjednostka Gαi hamuje cyklazę adenylanową, obniżając stężenie cAMP i wygaszając PKA',
        'Uwolniony heterodimer Gβγ otwiera kanały potasowe GIRK (hiperpolaryzacja)',
        'Gβγ presynaptycznie hamuje kanały Cav2.1/2.2, zatrzymując syntezę i wyrzut dopaminy',
        'Niezależnie od białka G: kompleks β-arestyna-2 rekrutuje fosfatazę PP2A, defosforylując i inaktywując kinazę Akt, co aktywuje GSK-3β'
      ],
      primaryEffectors: ['Cyklaza adenylanowa (hamowanie)', 'GIRK', 'β-arestyna-2', 'Akt / GSK-3β'],
      cellularOutcome: 'Hamowanie niepożądanych wzorców ruchowych w drodze pośredniej, wygaszanie wyrzutu dopaminy.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'a2a',
        nature: 'heterodimer',
        description: 'Tworzy heterodimer A2A-D2 w prążkowiu. Aktywacja A2A przez adenozynę zmniejsza powinowactwo dopaminy do D2 (antagonizm czynnościowy).'
      },
      {
        partnerReceptor: 'd1',
        nature: 'antagonism',
        description: 'W prążkowiu D1 (droga bezpośrednia - ruch) i D2 (droga pośrednia - hamowanie ruchu) tworzą wzajemną równowagę push-pull.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['Dopamina'],
      clinicalAgonists: ['Pramipeksol', 'Ropinirol', 'Rotygotyna', 'Bromokryptyna', 'Kabergolina'],
      clinicalAntagonistsOrBlockers: ['Haloperidol (klasyczny neuroleptyk)', 'Olanzapina', 'Rispolept (Rysperydon)', 'Klozapina', 'Metoklopramid'],
      allostericModulators: ['Arypiprazol (częściowy agonista - stabilizator dopaminy)', 'Brekspiprazol', 'Kariprazyna'],
      clinicalApplications: ['Schizofrenia i epizody manii', 'Choroba Parkinsona', 'Zespół niespokojnych nóg (RLS)', 'Hiperprolaktynemia']
    },
    badgeColor: 'rose'
  },
  {
    id: 'd3',
    name: 'Receptor Dopaminowy D3',
    codeName: 'DRD3',
    family: 'dopamine',
    transduction: 'gpcr_gi',
    couplingOrConductance: 'Białko Gαi/o',
    structureSubunits: 'Monomer GPCR klasy A',
    synapticLocation: ['presynaptic', 'postsynaptic'],
    cnsRegions: ['Układ limbiczny (jądro półleżące - NAc)', 'Wyspy Calleja', 'Kora czołowa'],
    functionalRole: 'Modulacja układu nagrody, procesów motywacyjnych, emocjonalnych oraz poszukiwania substancji uzależniających.',
    signalingCascade: {
      title: 'Hamowanie cAMP w układzie limbicznym',
      steps: [
        'Wiązanie dopaminy z wyjątkowo wysokim powinowactwem (ok. 20-krotnie wyższym niż do D2)',
        'Aktywacja Gi/o i spadek cAMP',
        'Modulacja transmisji dopaminergicznej w strukturach mezolimbicznych'
      ],
      primaryEffectors: ['Cyklaza adenylanowa', 'GIRK'],
      cellularOutcome: 'Regulacja pobudliwości w osi motywacja-uzależnienie.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'd2',
        nature: 'synergy',
        description: 'Współdziała z D2 w regulacji pętli nagrody w jądrze półleżącym.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['Dopamina'],
      clinicalAgonists: ['Pramipeksol (wysokie powinowactwo do D3)'],
      clinicalAntagonistsOrBlockers: ['Kariprazyna (Reagila - częściowy agonista z preferencją do D3)', 'Buspiron (słaby antagonista)'],
      clinicalApplications: ['Schizofrenia z objawami negatywnymi (kariprazyna)', 'Epizody depresyjne w chorobie afektywnej dwubiegunowej', 'Uzależnienia']
    },
    badgeColor: 'rose'
  },

  // SEROTONIN RECEPTORS
  {
    id: '5ht1a',
    name: 'Receptor Serotoninowy 5-HT1A',
    codeName: 'HTR1A',
    family: 'serotonin',
    transduction: 'gpcr_gi',
    couplingOrConductance: 'Białko Gαi/o oraz Gβγ -> GIRK i spadek cAMP',
    structureSubunits: 'Monomer GPCR klasy A',
    synapticLocation: ['presynaptic', 'postsynaptic'],
    cnsRegions: ['Jądra szwu (autoreceptor somatodendrytyczny)', 'Hipokamp (CA1)', 'Kora przedczołowa', 'Ciało migdałowate'],
    functionalRole: 'Autoreceptor wygaszający wyładowania neuronów 5-HT w pniu mózgu; postsynaptycznie wywiera silny efekt anksjolityczny i przeciwdepresyjny.',
    signalingCascade: {
      title: 'Otwarcie GIRK i wygaszenie aktywności serotoninergicznej',
      steps: [
        'Serotonina wiąże 5-HT1A w błonie somatodendrytycznej jąder szwu',
        'Dysocjacja heterodimeru Gβγ',
        'Gβγ bezpośrednio otwiera kanały potasowe GIRK (Kir3)',
        'Wypływ K+ powoduje natychmiastową hiperpolaryzację neuronu i zatrzymanie salw wyładowań',
        'Zahamowanie PKA zmniejsza fosforylację kanałów wapniowych'
      ],
      primaryEffectors: ['Kanały GIRK', 'Cyklaza adenylanowa', 'ERK1/2'],
      cellularOutcome: 'Spadek częstotliwości wyładowań neuronów jąder szwu; redukcja lęku i napięcia postsynaptycznie.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: '5ht2a',
        nature: 'antagonism',
        description: 'W korze mózgowej wykazuje przeciwstawne działanie do 5-HT2A (5-HT1A hiperpolaryzuje neurony piramidowe, podczas gdy 5-HT2A je depolaryzuje).'
      }
    ],
    pharmacology: {
      endogenousLigands: ['Serotonina (5-HT)'],
      clinicalAgonists: ['Buspiron (Spitomin - częściowy agonista, anksjolityk)', 'Flibanseryna (Addyi)', 'Wortioksetyna (częściowy agonista)'],
      clinicalAntagonistsOrBlockers: ['WAY-100635 (badawczy)'],
      clinicalApplications: ['Zaburzenia lękowe uogólnione (GAD)', 'Duża depresja (MDD - desensytyzacja autoreceptora po lekach SSRI)', 'HSDD']
    },
    badgeColor: 'rose'
  },
  {
    id: '5ht2a',
    name: 'Receptor Serotoninowy 5-HT2A',
    codeName: 'HTR2A',
    family: 'serotonin',
    transduction: 'gpcr_gq',
    couplingOrConductance: 'Białko Gαq/11 -> Fosfolipaza C-β (PLCβ)',
    structureSubunits: 'Monomer GPCR klasy A; tworzy heterodimery z mGluR2 oraz kompleksem D2',
    synapticLocation: ['postsynaptic'],
    cnsRegions: ['Kora nowa (głównie neurony piramidowe warstwy V)', 'Klaustrum (przedmurze)', 'Płytki krwi'],
    functionalRole: 'Modulacja percepcji, integracji sensorycznej i plastyczności korowej; kluczowy punkt uchwytu psychodelików i atypowych leków przeciwpsychotycznych.',
    signalingCascade: {
      title: 'Kaskada PLCβ - IP3/DAG - Ca2+ oraz szlak β-arestyny-2',
      steps: [
        'Ligand wiąże 5-HT2A, aktywując białko Gαq/11',
        'PLCβ hydrolizuje PIP2 do IP3 i DAG; następuje wyrzut Ca2+ z siateczki ER',
        'Wypływ Ca2+ i kinaza PKC modulują kanały jonowe, prowadząc do depolaryzacji komórek piramidowych',
        'Agoniści psychodeliczni (np. psylocyna, LSD) indukują tzw. functional selectivity (bias) preferujący rekrutację β-arestyny-2 i szlaku PLA2/Src',
        'Zwiększenie asynchronicznego wyrzutu glutaminianu w korze mózgowej'
      ],
      primaryEffectors: ['PLCβ', 'IP3R', 'PKC', 'PLA2', 'β-arestyna-2'],
      cellularOutcome: 'Zwiększenie plastyczności synaptycznej (synaptogeneza, ekspresja BDNF), dezorganizacja fal alfa kory, percepcja psychodeliczna.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'mglur2_3',
        nature: 'heterodimer',
        description: 'Tworzy z mGluR2 heterodimer 5-HT2A-mGluR2; pobudzenie mGluR2 znosi psychodeliczne i psychotyczne efekty pobudzenia 5-HT2A.'
      },
      {
        partnerReceptor: 'nmda',
        nature: 'synergy',
        description: 'Pobudzenie 5-HT2A nasila wyrzut glutaminianu w warstwie V kory, wtórnie aktywując postsynaptyczne receptory NMDA i AMPA.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['Serotonina'],
      clinicalAgonists: ['Psylocyna / Psylocybina', 'LSD', 'DMT', 'Meskalina (klasyczne psychodeliki serotoninergiczne)'],
      clinicalAntagonistsOrBlockers: ['Olanzapina', 'Klozapina', 'Rysperydon', 'Kwetiapina', 'Pimawanseryna (Nuplazid - odwrotny agonista w psychozie Parkinsona)'],
      clinicalApplications: ['Terapia psychodeliczna lekoopornej depresji i PTSD', 'Schizofrenia i psychozy (blokada)', 'Psychoza w chorobie Parkinsona']
    },
    badgeColor: 'amber'
  },
  {
    id: '5ht3',
    name: 'Receptor Serotoninowy 5-HT3',
    codeName: 'HTR3A - HTR3E',
    family: 'serotonin',
    transduction: 'ionotropic',
    couplingOrConductance: 'Na+, K+, Ca2+ (Szybki nieselektywny kanał kationowy)',
    structureSubunits: 'Pentamer z podrodziny Cys-loop (homomery 5-HT3A lub heteromery z 5-HT3B-E)',
    synapticLocation: ['postsynaptic', 'presynaptic'],
    cnsRegions: ['Pień mózgu (pole najdalsze - area postrema, jądro pasma samotnego NTS)', 'Interneurony kory i hipokampa'],
    functionalRole: 'Jedyny jonotropowy receptor serotoninowy. Odpowiada za odruch wymiotny w pniu mózgu oraz za szybkie hamowanie sieciowe (poprzez interneurony GABA).',
    signalingCascade: {
      title: 'Błyskawiczna depolaryzacja kationowa',
      steps: [
        'Związanie serotoniny z kieszenią między podjednostkami pentameru',
        'Błyskawiczne otwarcie kanału i napływ jonów Na+ i Ca2+',
        'Gwałtowny EPSP w komórkach area postrema wyzwalający ośrodek wymiotny',
        'W korze: aktywacja interneuronów GABA-ergicznych generująca szybkie hamowanie neuronów piramidowych'
      ],
      primaryEffectors: ['Kanał kationowy'],
      cellularOutcome: 'Wyzwolenie odruchu wymiotnego, modulacja motoryki przewodu pokarmowego, szybka regulacja sieci neuronalnych.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'gaba_a',
        nature: 'synergy',
        description: 'Lokalizuje się na interneuronach zawierających GABA; jego aktywacja wyzwala masywny wyrzut GABA działający na GABA_A.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['Serotonina'],
      clinicalAgonists: ['2-Methyl-5-HT (badawczy)'],
      clinicalAntagonistsOrBlockers: ['Ondansetron (Zofran)', 'Granisetron', 'Palonosetron (setrony - silne leki przeciwwymiotne)'],
      clinicalApplications: ['Nudności i wymioty wywołane chemioterapią (CINV)', 'Wymioty pooperacyjne (PONV)', 'Zespół jelita drażliwego (IBS-D)']
    },
    badgeColor: 'emerald'
  },
  {
    id: '5ht4_6_7',
    name: 'Receptory 5-HT4, 5-HT6, 5-HT7',
    codeName: 'HTR4, HTR6, HTR7',
    family: 'serotonin',
    transduction: 'gpcr_gs',
    couplingOrConductance: 'Białko Gαs -> stymulacja cyklazy adenylanowej -> ↑ cAMP / PKA',
    structureSubunits: 'Monomery GPCR klasy A',
    synapticLocation: ['postsynaptic'],
    cnsRegions: ['Hipokamp (CA1)', 'Jądro nadskrzyżowaniowe (SCN - 5-HT7)', 'Kora przedczołowa', 'Prążkowie (5-HT6)'],
    functionalRole: 'Wzmacnianie procesów uczenia się i konsolidacji pamięci; regulacja rytmu dobowego (5-HT7 w SCN) oraz neurogenezy.',
    signalingCascade: {
      title: 'Stymulacja cAMP - PKA i plastyczności synaptycznej',
      steps: [
        'Wiązanie 5-HT aktywuje białko Gαs',
        'Wzrost syntezy cAMP i aktywacja kinazy PKA',
        'Fosforylacja czynnika transkrypcyjnego CREB na reszcie Ser133',
        'Ekspresja neurotrofin (BDNF) i białek kolców dendrytycznych'
      ],
      primaryEffectors: ['Cyklaza adenylanowa', 'PKA', 'CREB', 'BDNF'],
      cellularOutcome: 'Poprawa plastyczności synaptycznej, wzmocnienie pamięci, synchronizacja zegara biologicznego.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'trkb',
        nature: 'synergy',
        description: 'Szlak 5-HT4/6/7 stymuluje ekspresję genu BDNF, który wtórnie aktywuje receptory TrkB, nasilając neuroplastyczność.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['Serotonina'],
      clinicalAgonists: ['Prukalopryd (agonista 5-HT4)'],
      clinicalAntagonistsOrBlockers: ['Idalopirdyna (antagonista 5-HT6 badany w otępieniu)', 'Lurasidon (antagonista 5-HT7 - działanie przeciwdepresyjne)'],
      clinicalApplications: ['Zaburzenia poznawcze w otępieniu', 'Choroba afektywna dwubiegunowa (lurasidon)', 'Regulacja rytmów okołodobowych']
    },
    badgeColor: 'sky'
  },

  // CHOLINERGIC
  {
    id: 'nachr_a7',
    name: 'Receptor Nikotynowy α7 (nAChR α7)',
    codeName: 'CHRNA7',
    family: 'acetylcholine',
    transduction: 'ionotropic',
    couplingOrConductance: 'Ca2+ > Na+, K+ (Wyjątkowo wysoka przepuszczalność Ca2+)',
    structureSubunits: 'Homopentamer złożony z 5 podjednostek α7',
    synapticLocation: ['presynaptic', 'postsynaptic', 'glial'],
    cnsRegions: ['Hipokamp (interneurony i komórki piramidowe)', 'Kora przedczołowa', 'Mikroglej (szlak cholinergiczny przeciwzapalny)'],
    functionalRole: 'Regulacja uwagi i pamięci roboczej; presynaptyczna stymulacja wyrzutu glutaminianu; silny hamulec neurozapalenia na mikrogleju.',
    signalingCascade: {
      title: 'Masywny napływ wapnia i hamowanie zapalenia',
      steps: [
        'Związanie acetylocholiny lub nikotyny otwiera kanał o bardzo szybkiej kinetyce inaktywacji',
        'Napływ jonów Ca2+ bezpośrednio do kolbki aksonalnej lub kolca dendrytycznego',
        'Presynaptycznie: fuzja pęcherzyków i ułatwienie uwalniania glutaminianu i dopaminy',
        'Na komórkach mikrogleju: aktywacja kinazy Jak2 / STAT3 i blokada translokacji jądrowej NF-κB, wygaszająca produkcję cytokin zapalnych (TNF-α, IL-1β)'
      ],
      primaryEffectors: ['Ca2+', 'CaMKII', 'Jak2 / STAT3', 'NF-κB (hamowanie)'],
      cellularOutcome: 'Wzmocnienie pamięci i uwagi, obniżenie neurotoksycznego stanu zapalnego mózgu.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'p2x7',
        nature: 'antagonism',
        description: 'Aktywacja α7 na mikrogleju hamuje aktywację inflamasomu NLRP3 wywoływaną przez purynoreceptor P2X7.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['Acetylocholina', 'Cholina'],
      clinicalAgonists: ['Nikotyna', 'Enceniklina (EVP-6124 - badana w schizofrenii)'],
      clinicalAntagonistsOrBlockers: ['α-Bungarotoksyna (toksyna węża)', 'Metillikakonityna (MLA)'],
      allostericModulators: ['Galantamina (lek na ch. Alzheimera - allosteryczny wzmacniacz nAChR)'],
      clinicalApplications: ['Choroba Alzheimera', 'Deficyty poznawcze w schizofrenii', 'Terapia antyneurozapalna']
    },
    badgeColor: 'emerald'
  },
  {
    id: 'nachr_a4b2',
    name: 'Receptor Nikotynowy α4β2',
    codeName: 'CHRNA4, CHRNB2',
    family: 'acetylcholine',
    transduction: 'ionotropic',
    couplingOrConductance: 'Na+, K+ (umiarkowana przepuszczalność Ca2+)',
    structureSubunits: 'Heteropentamer: najczęściej (α4)2(β2)3 o bardzo wysokim powinowactwie do liganda',
    synapticLocation: ['presynaptic', 'postsynaptic'],
    cnsRegions: ['Pole brzuszne nakrywki (VTA - neurony dopaminergiczne)', 'Wzgórze', 'Kora mózgowa'],
    functionalRole: 'Główny receptor odpowiedzialny za uzależnienie od nikotyny; stymuluje wyładowania neuronów dopaminergicznych szlaku nagrody.',
    signalingCascade: {
      title: 'Presynaptyczna stymulacja wyrzutu dopaminy w VTA',
      steps: [
        'Nikotyna lub ACh wiąże się na granicy podjednostek α4 i β2',
        'Napływ Na+ i depolaryzacja neuronów dopaminergicznych w VTA',
        'Wzrost częstotliwości wyładowań salwowych i masywny wyrzut dopaminy w jądrze półleżącym (NAc)',
        'Długotrwała ekspozycja na nikotynę prowadzi do paradoksalnej up-regulacji liczby receptorów'
      ],
      primaryEffectors: ['Kanał kationowy', 'Układ dopaminergiczny mezolimbiczny'],
      cellularOutcome: 'Poczucie nagrody, euforia, konsolidacja nałogu nikotynowego.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'd2',
        nature: 'synergy',
        description: 'Aktywacja α4β2 w VTA prowadzi do uwalniania dopaminy w prążkowiu, pobudzając receptory D1 i D2.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['Acetylocholina'],
      clinicalAgonists: ['Nikotyna', 'Wareniklina (Champix - częściowy agonista w rzucaniu palenia)', 'Cytyzyna (Tabex/Desmoxan)'],
      clinicalAntagonistsOrBlockers: ['Dihyro-β-erytroidyna (DhβE)'],
      clinicalApplications: ['Leczenie uzależnienia od nikotyny', 'Modulacja nastroju i uwagi']
    },
    badgeColor: 'emerald'
  },
  {
    id: 'm1_muscarinic',
    name: 'Receptor Muskarynowy M1',
    codeName: 'CHRM1',
    family: 'acetylcholine',
    transduction: 'gpcr_gq',
    couplingOrConductance: 'Białko Gαq/11 -> Fosfolipaza C-β (PLCβ)',
    structureSubunits: 'Monomer GPCR klasy A',
    synapticLocation: ['postsynaptic'],
    cnsRegions: ['Hipokamp', 'Kora mózgowa (warstwy powierzchowne i głębokie)', 'Prążkowie'],
    functionalRole: 'Kluczowy dla konsolidacji pamięci, uwagi i plastyczności; zamknięcie kanałów typu M (KCNQ) dramatycznie zwiększa pobudliwość neuronów.',
    signalingCascade: {
      title: 'Hamowanie prądu M (Kv7) i facylitacja plastyczności',
      steps: [
        'ACh wiąże M1, aktywując białko Gαq/11',
        'PLCβ rozszczepia PIP2 do IP3 i DAG',
        'Uszczuplenie puli PIP2 w błonie bezpośrednio zamyka potasowe kanały bramkowane napięciem Kv7 (KCNQ)',
        'Zanik hiperpolaryzującego prądu M powoduje, że neuron odpowiada serią wyładowań zamiast pojedynczym pikiem',
        'PKC fosforyluje receptory NMDA, zwiększając ich otwarcie'
      ],
      primaryEffectors: ['PLCβ', 'Kanały Kv7/KCNQ (zamknięcie)', 'PKC', 'NMDA (facylitacja)'],
      cellularOutcome: 'Podwyższenie gotowości wyładowań neuronów piramidowych kory i hipokampa, wsparcie procesów uczenia.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'nmda',
        nature: 'synergy',
        description: 'M1 poprzez PKC znosi blokadę Mg2+ i zwiększa prąd wapniowy przez NMDA, wzmacniając indukcję LTP.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['Acetylocholina'],
      clinicalAgonists: ['Ksanomelina (składnik leku Cobenfy w schizofrenii - podwójny agonista M1/M4)'],
      clinicalAntagonistsOrBlockers: ['Skopolamina (wywołuje przejściową amnezję)', 'Biperyden', 'Triheksyfenidyl'],
      clinicalApplications: ['Nowoczesne leczenie schizofrenii (Cobenfy - bez blokady receptorów dopaminowych D2)', 'Poprawa pamięci w otępieniach', 'Choroba Parkinsona']
    },
    badgeColor: 'amber'
  },
  {
    id: 'm4_muscarinic',
    name: 'Receptor Muskarynowy M4',
    codeName: 'CHRM4',
    family: 'acetylcholine',
    transduction: 'gpcr_gi',
    couplingOrConductance: 'Białko Gαi/o',
    structureSubunits: 'Monomer GPCR klasy A',
    synapticLocation: ['presynaptic', 'postsynaptic'],
    cnsRegions: ['Prążkowie (wysoka ekspresja na neuronach kolczastych dMSN)', 'VTA / SNc'],
    functionalRole: 'Hamowanie nadmiernego wyrzutu dopaminy w prążkowiu; hamowanie drogi bezpośredniej zwojów podstawy.',
    signalingCascade: {
      title: 'Hamowanie wyrzutu dopaminy w prążkowiu',
      steps: [
        'Aktywacja M4 wycisza cyklazę adenylanową przez Gαi',
        'Obniżenie cAMP przeciwdziała efektom stymulacji D1 w prążkowiu',
        'Presynaptyczna redukcja wyrzutu neurotransmiterów'
      ],
      primaryEffectors: ['Cyklaza adenylanowa', 'GIRK'],
      cellularOutcome: 'Stabilizacja przekaźnictwa motorycznego i antypsychotyczne wygaszanie prążkowia.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'd1',
        nature: 'antagonism',
        description: 'W neuronach drogi bezpośredniej dMSN receptor M4 przeciwstawia się kaskadzie D1/cAMP/DARPP-32.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['Acetylocholina'],
      clinicalAgonists: ['Ksanomelina (Cobenfy)', 'Emraklydyna (selektywny PAM M4 badany w schizofrenii)'],
      clinicalAntagonistsOrBlockers: ['Tropikamid'],
      clinicalApplications: ['Schizofrenia (przełom w farmakoterapii)', 'Dyskinezy w chorobie Parkinsona']
    },
    badgeColor: 'rose'
  },

  // ADRENERGIC
  {
    id: 'alpha2_adrenergic',
    name: 'Receptor α2-Adrenergiczny (α2A, α2B, α2C)',
    codeName: 'ADRA2A, ADRA2B, ADRA2C',
    family: 'norepinephrine',
    transduction: 'gpcr_gi',
    couplingOrConductance: 'Białko Gαi/o oraz Gβγ -> GIRK i zamknięcie HCN',
    structureSubunits: 'Monomer GPCR klasy A',
    synapticLocation: ['presynaptic', 'postsynaptic'],
    cnsRegions: ['Locus coeruleus (miejsce sinawe - presynaptyczny autoreceptor)', 'Grzbietowo-boczna kora przedczołowa (dlPFC - postsynaptyczny)'],
    functionalRole: 'Autoreceptor w locus coeruleus (wyłącza wyrzut noradrenaliny); w korze przedczołowej zamyka kanały HCN, wyostrzając stosunek sygnału do szumu (uwaga skupiona).',
    signalingCascade: {
      title: 'Zamknięcie kanałów HCN w korze przedczołowej',
      steps: [
        'Noradrenalina wiąże postsynaptyczny α2A w kolcu dendrytycznym dlPFC',
        'Gαi hamuje cyklazę adenylanową, powodując lokalny spadek cAMP',
        'Spadek cAMP zamyka sąsiadujące kanały kationowe bramkowane cyklicznym nukleotydem (HCN)',
        'Zamknięcie HCN zapobiega ucieczce ładunku elektrycznego przez błonę (zwiększenie oporności wejściowej)',
        'Dochodzący sygnał reprezentujący zadanie w pamięci roboczej dociera bez strat do somy neuronu'
      ],
      primaryEffectors: ['Kanały HCN (zamknięcie)', 'Cyklaza adenylanowa', 'GIRK (w LC)'],
      cellularOutcome: 'Wzmocnienie koncentracji i uwagi roboczej; wyciszenie autonomicznego układu współczulnego.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'beta1_adrenergic',
        nature: 'antagonism',
        description: 'W korze przedczołowej umiarkowane stężenie NA działa na α2A (skupienie uwagi), podczas gdy wysoki stres zalewa receptory β1 (cAMP rośnie, otwiera HCN, rozpraszając uwagę).'
      }
    ],
    pharmacology: {
      endogenousLigands: ['Noradrenalina', 'Adrenalina'],
      clinicalAgonists: ['Klonidyna', 'Guanfacyna (Intuniv - selektywny agonista α2A w ADHD)', 'Deksmedetomidyna (sedacja OUN bez depresji oddechowej)'],
      clinicalAntagonistsOrBlockers: ['Johimbina (wywołuje silny lęk i tachykardię)'],
      clinicalApplications: ['ADHD u dzieci i dorosłych', 'Sedacja na oddziałach intensywnej terapii', 'Nadciśnienie tętnicze pierwotne', 'Objawy odstawienne opiatów']
    },
    badgeColor: 'rose'
  },
  {
    id: 'beta_adrenergic',
    name: 'Receptory β-Adrenergiczne (β1, β2)',
    codeName: 'ADRB1, ADRB2',
    family: 'norepinephrine',
    transduction: 'gpcr_gs',
    couplingOrConductance: 'Białko Gαs -> ↑ cAMP / PKA',
    structureSubunits: 'Monomery GPCR klasy A',
    synapticLocation: ['postsynaptic', 'glial'],
    cnsRegions: ['Hipokamp', 'Ciało migdałowate (jądro podstawno-boczne BLA)', 'Kora mózgowa'],
    functionalRole: 'Konsolidacja śladów pamięci emocjonalnej wywołanej stresem; regulacja glikogenolizy w astrocytach.',
    signalingCascade: {
      title: 'Fosforylacja GluA1 i konsolidacja pamięci traumatycznej',
      steps: [
        'Wyrzut noradrenaliny w stresie aktywuje β-receptory w ciele migdałowatym',
        'Gαs podnosi poziom cAMP i uruchamia PKA',
        'PKA fosforyluje podjednostkę GluA1 na Ser845, przyspieszając jej wbudowywanie w synapsę',
        'Fosforylacja kanałów wapniowych Cav1.2 potęguje napływ wapnia'
      ],
      primaryEffectors: ['PKA', 'GluA1 (Ser845)', 'Cav1.2', 'CREB'],
      cellularOutcome: 'Nieodwracalne utrwalenie reakcji lękowych i śladów pamięciowych w ciele migdałowatym.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'ampa',
        nature: 'synergy',
        description: 'PKA aktywowana przez receptory β bezpośrednio fosforyluje GluA1, dramatycznie ułatwiając wzmocnienie synapsy.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['Noradrenalina', 'Adrenalina'],
      clinicalAgonists: ['Izoprenalina (badawczy)'],
      clinicalAntagonistsOrBlockers: ['Propranolol (przenika barierę krew-mózg; stosowany w lęku scenicznym i PTSD)', 'Metoprolol'],
      clinicalApplications: ['Fobia społeczna i lęk sceniczny', 'Prewencja konsolidacji traumy w PTSD (propranolol)', 'Drżenie samoistne']
    },
    badgeColor: 'sky'
  },

  // OPIOID RECEPTORS
  {
    id: 'mor_opioid',
    name: 'Receptor Opioidowy μ (MOR)',
    codeName: 'OPRM1',
    family: 'opioid',
    transduction: 'gpcr_gi',
    couplingOrConductance: 'Białko Gαi/o oraz wolny dimer Gβγ',
    structureSubunits: 'Monomer GPCR klasy A',
    synapticLocation: ['presynaptic', 'postsynaptic'],
    cnsRegions: ['Istota szara okołowodociągowa (PAG)', 'Rogi tylne rdzenia kręgowego (substantia gelatinosa)', 'VTA (na interneuronach GABA)', 'Wzgórze', 'Pień mózgu (ośrodek oddechowy)'],
    functionalRole: 'Główny receptor przeciwbólowy; wyzwala silną euforię i uzależnienie (odhamowanie dopaminy w VTA); hamuje napęd oddechowy.',
    signalingCascade: {
      title: 'Tłumienie nocycepcji i odhamowanie dopaminy w VTA',
      steps: [
        'Opioid (endorfina, morfina) wiąże kieszeń MOR',
        'Presynaptycznie w rdzeniu: Gβγ blokuje Cav2.2, zatrzymując wyrzut substancji P i glutaminianu z włókien C',
        'Postsynaptycznie: Gβγ otwiera kanały GIRK, hiperpolaryzując neurony projekcyjne drogi rdzeniowo-wzgórzowej',
        'W VTA: MOR znajduje się na interneuronach GABA-ergicznych; ich wygaszenie odhamowuje (disinhibition) neurony dopaminergiczne, wyzwalając wyrzut dopaminy w NAc'
      ],
      primaryEffectors: ['Cav2.2 (blokada)', 'GIRK (aktywacja)', 'Cyklaza adenylanowa (hamowanie)'],
      cellularOutcome: 'Całkowite zablokowanie wstępującej transmisji bólu, głęboka euforia, sedacja, depresja ośrodka oddechowego.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'cb1',
        nature: 'synergy',
        description: 'MOR i CB1 wykazują silną synergię antynocyceptywną w rogach tylnych rdzenia kręgowego.'
      },
      {
        partnerReceptor: 'd2',
        nature: 'synergy',
        description: 'Odhamowanie dopaminy przez MOR pośrednio aktywuje układ dopaminergiczny nagrody.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['β-endorfina', 'Endomorfina-1', 'Endomorfina-2'],
      clinicalAgonists: ['Morfina', 'Fentanyl', 'Oksykodon', 'Buprenorfina (częściowy agonista)', 'Metadon'],
      clinicalAntagonistsOrBlockers: ['Nalokson (antidotum w przedawkowaniu opioidów)', 'Naltrekson (leczenie uzależnień od alkoholu i opiatów)'],
      clinicalApplications: ['Ciężki ostry i przewlekły ból (onkologiczny, pooperacyjny)', 'Leczenie substytucyjne uzależnień', 'Odwracanie depresji oddechowej']
    },
    badgeColor: 'rose'
  },
  {
    id: 'kor_opioid',
    name: 'Receptor Opioidowy κ (KOR)',
    codeName: 'OPRK1',
    family: 'opioid',
    transduction: 'gpcr_gi',
    couplingOrConductance: 'Białko Gαi/o',
    structureSubunits: 'Monomer GPCR klasy A',
    synapticLocation: ['presynaptic', 'postsynaptic'],
    cnsRegions: ['Układ limbiczny', 'Ciało migdałowate', 'Jądro półleżące', 'Podwzgórze'],
    functionalRole: 'Endogenny mediator dysforii, awersji, lęku i anhedonii w przewlekłym stresie; obwodowo wykazuje działanie przeciwbólowe bez ryzyka nadużywania.',
    signalingCascade: {
      title: 'Hamowanie wyrzutu dopaminy w prążkowiu i dysforia',
      steps: [
        'Dynorfina uwalniana w stresie wiąże KOR na terminalach dopaminergicznych',
        'Blokada napływu Ca2+ hamuje uwalnianie dopaminy w NAc',
        'Powstanie głębokiego stanu awersyjnego i anhedonii'
      ],
      primaryEffectors: ['Cav2', 'P38 MAPK', 'Cyklaza adenylanowa'],
      cellularOutcome: 'Poczucie dysforii, spadek motywacji, modulacja uwalniania hormonów stresu (CRH).'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'mor_opioid',
        nature: 'antagonism',
        description: 'KOR przeciwdziała nagradzającym efektom MOR, redukując poziom dopaminy w jądrze półleżącym.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['Dynorfiny (Dynorfina A, Dynorfina B)'],
      clinicalAgonists: ['Salwinoryna A (z Salvia divinorum - silny naturalny halucynogen dysforyczny)', 'Difelikefalin (Korsuva - obwodowy agonista przeciwświądowy)'],
      clinicalAntagonistsOrBlockers: ['Aticaprant (JNJ-67953964 - badany w lekoopornej depresji i anhedonii)', 'Nor-binaltorfimina (nor-BNI)'],
      clinicalApplications: ['Świąd mocznicowy w dializoterapii (difelikefalin)', 'Lekooporna depresja z anhedonią (antagoniści KOR)']
    },
    badgeColor: 'rose'
  },

  // CANNABINOID
  {
    id: 'cb1',
    name: 'Receptor Kannabinoidowy CB1',
    codeName: 'CNR1',
    family: 'cannabinoid',
    transduction: 'gpcr_gi',
    couplingOrConductance: 'Białko Gαi/o oraz wolne podjednostki Gβγ',
    structureSubunits: 'Monomer GPCR klasy A (najliczniejszy GPCR w mózgu ssaków)',
    synapticLocation: ['presynaptic'],
    cnsRegions: ['Kora mózgowa', 'Hipokamp', 'Zwoje podstawy', 'Móżdżek', 'Rdzeń kręgowy'],
    functionalRole: 'Główny receptor retrogradnego hamowania synaptycznego: DSI (tłumienie hamowania) i DSE (tłumienie pobudzenia); kontrola apetytu i nastroju.',
    signalingCascade: {
      title: 'Retrogradne wygaszanie egzocytozy neurotransmitera',
      steps: [
        'Postsynaptyczna synteza 2-AG (przez DAGLα pod wpływem Ca2+ i Gq)',
        '2-AG dyfunduje retrogradnie wstecz przez szczelinę synaptyczną',
        'Wiązanie z presynaptycznym CB1 i aktywacja białka Gi/o',
        'Uwolniony dimer Gβγ blokuje presynaptyczne kanały Cav2.1 (P/Q) i Cav2.2 (N)',
        'Gβγ otwiera presynaptyczne kanały potasowe GIRK, skracając czas trwania potencjału czynnościowego',
        'Zatrzymanie wyrzutu neurotransmitera (GABA w DSI lub glutaminianu w DSE)'
      ],
      primaryEffectors: ['Cav2.1 / Cav2.2 (blokada)', 'GIRK (aktywacja)', 'PKA (hamowanie)'],
      cellularOutcome: 'Krótkotrwałe (DSI/DSE) lub długotrwałe (eCB-LTD) wyciszenie transmisji synaptycznej.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'mglur1_5',
        nature: 'retrograde',
        description: 'Postsynaptyczny mGluR1/5 stymuluje enzym DAGLα do wytworzenia 2-AG, który aktywuje presynaptyczny CB1.'
      },
      {
        partnerReceptor: 'd2',
        nature: 'synergy',
        description: 'W prążkowiu CB1 współdziała z D2 w koordynacji hamowania wyrzutu neurotransmiterów.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['2-Arachidonoiloglicerol (2-AG)', 'Anandamid (AEA)'],
      clinicalAgonists: ['THC (Tetrahydrokannabinol - częściowy agonista)', 'Nabilon', 'Dronabinol'],
      clinicalAntagonistsOrBlockers: ['Rimonabant (odwrotny agonista wycofany z powodu ciężkiej depresji)'],
      allostericModulators: ['CBD (Kannabidiol - negatywny allosteryczny modulator NAM receptora CB1)'],
      clinicalApplications: ['Ból neuropatyczny i spastyczność w stwardnieniu rozsianym (Sativex)', 'Lekooporna padaczka dziecięca (Epidiolex)', 'Nudności po chemioterapii', 'Kacheksja w AIDS']
    },
    badgeColor: 'rose'
  },

  // PURINERGIC & ADENOSINE
  {
    id: 'a1_adenosine',
    name: 'Receptor Adenozynowy A1',
    codeName: 'ADORA1',
    family: 'purinergic',
    transduction: 'gpcr_gi',
    couplingOrConductance: 'Białko Gαi/o oraz Gβγ -> GIRK i spadek cAMP',
    structureSubunits: 'Monomer GPCR klasy A',
    synapticLocation: ['presynaptic', 'postsynaptic'],
    cnsRegions: ['Kora mózgowa', 'Hipokamp', 'Wzgórze', 'Móżdżek', 'Pień mózgu'],
    functionalRole: 'Homeostatyczny mediator presji snu; potężny neuroprotektor wygaszający metabolizm i pobudzenie w warunkach niedotlenienia mózgu.',
    signalingCascade: {
      title: 'Presja snu i presynaptyczne hamowanie wyrzutu glutaminianu',
      steps: [
        'W miarę czuwania stężenie zewnątrzkomórkowej adenozyny rośnie w wyniku rozpadu ATP',
        'Adenozyna wiąże A1 o bardzo wysokim powinowactwie',
        'Gi/o hamuje cyklazę adenylanową, a Gβγ otwiera kanały GIRK i blokuje Cav2',
        'Stopniowe wyciszanie pobudliwości neuronów kory i wzgórza, narastanie presji snu fali wolnej (SWS)'
      ],
      primaryEffectors: ['Cyklaza adenylanowa', 'GIRK', 'Cav2.1'],
      cellularOutcome: 'Indukcja snu głębokiego, oszczędzanie energii komórkowej, ochrona przed ekscytotoksycznością.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'a2a',
        nature: 'antagonism',
        description: 'A1 (Gi) wygasza transmisję, podczas gdy A2A (Gs) stymuluje wybrane obwody prążkowia.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['Adenozyna'],
      clinicalAntagonistsOrBlockers: ['Kofeina (nieselektywny antagonista A1 i A2A - znosi presję snu)', 'Teofilina'],
      clinicalApplications: ['Sen i czuwanie (blokada przez kofeinę)', 'Neuroprotekcja w udarze niedokrwiennym (badawczo)']
    },
    badgeColor: 'rose'
  },
  {
    id: 'a2a_adenosine',
    name: 'Receptor Adenozynowy A2A',
    codeName: 'ADORA2A',
    family: 'purinergic',
    transduction: 'gpcr_gs',
    couplingOrConductance: 'Białko Gαs / Gαolf -> ↑ cAMP / PKA',
    structureSubunits: 'Monomer GPCR klasy A',
    synapticLocation: ['postsynaptic'],
    cnsRegions: ['Prążkowie (wysokie zagęszczenie na neuronach drogi pośredniej iMSN)', 'Jądro półleżące', 'Opuszka węchowa'],
    functionalRole: 'Modulacja zwojów podstawy; bezpośredni partner heterodimeryczny receptora D2 wyznaczający podatność na zmęczenie.',
    signalingCascade: {
      title: 'Stymulacja drogi pośredniej w prążkowiu',
      steps: [
        'Związanie adenozyny aktywuje Gαolf w neuronach prążkowia',
        'Stymulacja AC5 i wzrost poziomu cAMP',
        'Aktywacja PKA fosforyluje DARPP-32 na Thr34 w neuronach drogi pośredniej, hamując ruch'
      ],
      primaryEffectors: ['AC5', 'PKA', 'DARPP-32'],
      cellularOutcome: 'Aktywacja drogi hamującej ruch; przeciwdziałanie nadmiernemu napędowi ruchowemu.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'd2',
        nature: 'heterodimer',
        description: 'Tworzy heterodimer A2A-D2. Związanie adenozyny z A2A allosterycznie obniża powinowactwo dopaminy do D2, odhamowując iMSN.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['Adenozyna'],
      clinicalAntagonistsOrBlockers: ['Kofeina (antagonista)', 'Istradefylina (Nourianz - selektywny antagonista A2A stosowany w ch. Parkinsona)'],
      clinicalApplications: ['Choroba Parkinsona (skracanie epizodów off)', 'Pobudzenie psychoruchowe (kofeina)']
    },
    badgeColor: 'sky'
  },
  {
    id: 'p2x7_purinergic',
    name: 'Receptor Purynergiczny P2X7',
    codeName: 'P2RX7',
    family: 'purinergic',
    transduction: 'ionotropic',
    couplingOrConductance: 'Ca2+, Na+ (przy przedłużonej aktywacji tworzy makropor przepuszczalny dla cząsteczek do 900 Da)',
    structureSubunits: 'Homotrimer podjednostek P2X7',
    synapticLocation: ['glial', 'presynaptic'],
    cnsRegions: ['Mikroglej (powszechnie w całym OUN)', 'Astrocyty', 'Oligodendrocyty'],
    functionalRole: 'Czujnik uszkodzenia tkanki mózgowej (DAMP - Danger Associated Molecular Pattern); inicjator kaskady neurozapalnej i aktywacji inflamasomu NLRP3.',
    signalingCascade: {
      title: 'Aktywacja inflamasomu NLRP3 i makropor',
      steps: [
        'Wysokie stężenie zewnątrzkomórkowego ATP (powyżej 100 μM, z uszkodzonych komórek) wiąże P2X7',
        'Gwałtowny dokomórkowy napływ Ca2+ oraz masywny wypływ jonów K+',
        'Spadek wewnątrzkomórkowego K+ jest bezpośrednim wyzwalaczem asamblażu inflamasomu NLRP3',
        'Aktywacja kaspazy-1 rozcina pro-IL-1β i pro-IL-18 do aktywnych form zapalnych',
        'Długotrwała stymulacja tworzy nielityczny makropor prowadzący do pyroptozy komórki'
      ],
      primaryEffectors: ['Inflamasom NLRP3', 'Kaspaza-1', 'Interleukina-1β (IL-1β)'],
      cellularOutcome: 'Inicjacja ostrego neurozapalenia, rekrutacja komórek odpornościowych, neurodegeneracja.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'nachr_a7',
        nature: 'antagonism',
        description: 'nAChR α7 hamuje transkrypcję i dojrzewanie cytokin zależnych od inflamasomu NLRP3 wyzwalanego przez P2X7.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['ATP (adenozynotrifosforan) w wysokich stężeniach'],
      clinicalAgonists: ['BzATP (badawczy)'],
      clinicalAntagonistsOrBlockers: ['JNJ-54175446 (badany w lekoopornej depresji z komponentem zapalnym)', 'A-438079'],
      clinicalApplications: ['Lekooporna depresja o podłożu neurozapalnym', 'Stwardnienie zanikowe boczne (SLA)', 'Choroba Alzheimera']
    },
    badgeColor: 'emerald'
  },

  // NEUROTROPHIN RTK
  {
    id: 'trkb',
    name: 'Receptor Neurotrofiny TrkB',
    codeName: 'NTRK2',
    family: 'neurotrophin',
    transduction: 'rtk',
    couplingOrConductance: 'Autofosforylacja kinazy tyrozynowej (brak sprzężenia z białkiem G)',
    structureSubunits: 'Transbłonowy homodimer o wewnętrznej domenie kinazy tyrozynowej',
    synapticLocation: ['postsynaptic', 'presynaptic'],
    cnsRegions: ['Hipokamp (CA1, CA3, zakręt zębaty)', 'Kora mózgowa', 'Prążkowie', 'Neurony cholinergiczne przodomózgowia'],
    functionalRole: 'Naczelny promotor przeżywalności neuronów, synaptogenezy, dorosłej neurogenezy w hipokampie oraz utrwalenia LTP.',
    signalingCascade: {
      title: 'Potrójny szlak: MAPK/ERK, PI3K/Akt/mTOR oraz PLCγ1',
      steps: [
        'Dimer BDNF wiąże domenę zewnątrzkomórkową TrkB, indukując autofosforylację reszt tyrozynowych (Tyr515, Tyr816)',
        'Tyr515 rekrutuje białko Shc -> szlak Ras-Raf-MEK-ERK1/2 -> translokacja do jądra i fosforylacja CREB (ekspresja genów plastyczności)',
        'Fosforylacja PI3K -> aktywacja Akt (PKB) -> inaktywacja proapoptotycznego białka Bad oraz aktywacja mTORC1 (lokalna translacja białek w dendrycie)',
        'Tyr816 aktywuje PLCγ1 -> synteza IP3 i DAG -> mobilizacja Ca2+ i ułatwienie otwarcia receptorów NMDA'
      ],
      primaryEffectors: ['ERK1/2', 'Akt / PKB', 'mTORC1', 'PLCγ1', 'CREB'],
      cellularOutcome: 'Synaptogeneza, wzrost nowych kolców dendrytycznych, długofalowa konsolidacja pamięci, odporność na stres.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'p75ntr',
        nature: 'antagonism',
        description: 'TrkB promuje przeżycie neuronu i LTP w odpowiedzi na dojrzały BDNF, podczas gdy p75NTR wiąże proBDNF i promuje apoptozę oraz LTD.'
      },
      {
        partnerReceptor: 'nmda',
        nature: 'synergy',
        description: 'Szlak TrkB/PLCγ1 bezpośrednio wzmacnia prądy wapniowe przez NMDA i ułatwia indukcję LTP.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['BDNF (Brain-Derived Neurotrophic Factor)', 'Neurotrofina-4 (NT-4)'],
      clinicalAgonists: ['7,8-Dihydroksyflawon (7,8-DHF - badawczy małocząsteczkowy mimetyk BDNF)'],
      clinicalApplications: ['Leki przeciwdepresyjne (SSRI, ketamina nasilają sygnalizację TrkB)', 'Choroby neurodegeneracyjne (Alzheimer, Parkinson)', 'Rehabilitacja poudarowa']
    },
    badgeColor: 'purple'
  },
  {
    id: 'p75ntr',
    name: 'Receptor Neurotrofiny p75 (p75NTR)',
    codeName: 'NGFR',
    family: 'neurotrophin',
    transduction: 'rtk',
    couplingOrConductance: 'Białko domeny śmierci (Death Domain - TNFR)',
    structureSubunits: 'Monomer / multimer z nadrodziny TNF receptor',
    synapticLocation: ['postsynaptic', 'glial'],
    cnsRegions: ['Rozsiany w OUN; wysoka ekspresja po urazach mózgu, udarach i w niedokrwieniu'],
    functionalRole: 'Wiązanie niedojrzałych neurotrofin (proBDNF, proNGF); uruchamia kaskadę apoptozy komórkowej lub długotrwałego osłabienia synaps (LTD).',
    signalingCascade: {
      title: 'Kaskada domen śmierci i apoptoza',
      steps: [
        'Związanie proBDNF w kompleksie z koreceptorem sortiliną',
        'Rekrutacja białek adaptorowych TRAF6 i NRIF do domeny śmierci',
        'Aktywacja kinazy JNK oraz kaskady kaspaz',
        'Degradacja cytoszkieletu i eliminacja kolców dendrytycznych lub apoptoza komórki'
      ],
      primaryEffectors: ['JNK', 'Kaspaza-3', 'Kaspaza-9', 'Sortilina'],
      cellularOutcome: 'Regresja kolców dendrytycznych, indukcja LTD, zaprogramowana śmierć uszkodzonych neuronów.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'trkb',
        nature: 'antagonism',
        description: 'Tworzy molekularny przełącznik życia i śmierci: wysoki stosunek BDNF/TrkB promuje LTP, a wysoki proBDNF/p75NTR indukuje LTD i apoptozę.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['proBDNF', 'proNGF'],
      clinicalAntagonistsOrBlockers: ['LM11A-31 (badawczy ligand p75 chroniący neurony w chorobie Alzheimera)'],
      clinicalApplications: ['Hamowanie neurodegeneracji w ch. Alzheimera', 'Leczenie urazów rdzenia kręgowego i mózgu']
    },
    badgeColor: 'purple'
  },

  // NEUROPEPTIDES & HISTAMINE
  {
    id: 'oxtr',
    name: 'Receptor Oksytocynowy (OXTR)',
    codeName: 'OXTR',
    family: 'neuropeptide',
    transduction: 'gpcr_gq',
    couplingOrConductance: 'Białko Gαq/11 -> Fosfolipaza C-β (PLCβ)',
    structureSubunits: 'Monomer GPCR klasy A',
    synapticLocation: ['postsynaptic'],
    cnsRegions: ['Ciało migdałowate', 'Pole przedwzrokowe podwzgórza', 'Jądro półleżące', 'Kora przedczołowa'],
    functionalRole: 'Mediator więzi społecznych, zaufania, zachowań opiekuńczych; silny hamulec reakcji lękowych w ciele migdałowatym.',
    signalingCascade: {
      title: 'Mobilizacja Ca2+ i wyciszenie lęku w ciele migdałowatym',
      steps: [
        'Oksytocyna wiąże OXTR na interneuronach GABA-ergicznych ciała migdałowatego',
        'Gαq aktywuje PLCβ, powodując wyrzut Ca2+ z ER',
        'Interneurony uwalniają GABA, wyciszając wyładowania jądra środkowego ciała migdałowatego'
      ],
      primaryEffectors: ['PLCβ', 'IP3R', 'Wyrzut GABA w ciele migdałowatym'],
      cellularOutcome: 'Redukcja odczuwania strachu i lęku, wzmocnienie empatii i zachowań prospołecznych.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'gaba_a',
        nature: 'synergy',
        description: 'OXTR stymuluje wyrzut GABA na postsynaptyczne receptory GABA_A w obwodach lękowych ciała migdałowatego.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['Oksytocyna'],
      clinicalAgonists: ['Oksytocyna donosowa (badania w autyzmie i lęku społecznym)'],
      clinicalApplications: ['Zaburzenia ze spektrum autyzmu (ASD)', 'Fobia społeczna', 'Depresja poporodowa']
    },
    badgeColor: 'amber'
  },
  {
    id: 'ox1_ox2_orexin',
    name: 'Receptory Oreksynowe (OX1R, OX2R)',
    codeName: 'HCRTR1, HCRTR2',
    family: 'neuropeptide',
    transduction: 'gpcr_gq',
    couplingOrConductance: 'Białko Gαq/11 oraz Gαs -> mobilizacja Ca2+',
    structureSubunits: 'Monomery GPCR klasy A',
    synapticLocation: ['postsynaptic'],
    cnsRegions: ['Locus coeruleus', 'Jądra szwu', 'VTA', 'Guzkowo-brodawkowe jądro podwzgórza (TMN)'],
    functionalRole: 'Stabilizator stanu czuwania i metabolizmu; brak oreksyny prowadzi bezpośrednio do narkolepsji z katapleksją.',
    signalingCascade: {
      title: 'Pobudzenie monoaminergicznych ośrodków czuwania',
      steps: [
        'Oreksyna-A i B uwalniane z podwzgórza bocznego wiążą OX1R i OX2R',
        'Masywna mobilizacja Ca2+ i depolaryzacja neuronów noradrenergicznych, histaminergicznych i dopaminergicznych',
        'Utrzymanie stabilnego stanu pobudzenia korowego i napięcia mięśniowego'
      ],
      primaryEffectors: ['PLCβ', 'Wapń', 'Układy monoaminergiczne'],
      cellularOutcome: 'Stabilny stan czuwania, prewencja nagłego zasypiania, regulacja łaknienia.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'alpha2_adrenergic',
        nature: 'antagonism',
        description: 'Oreksyna stymuluje neurony locus coeruleus, przeciwstawiając się hamującemu wpływowi autoreceptorów α2.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['Oreksyna A (Hipokretyna-1)', 'Oreksyna B (Hipokretyna-2)'],
      clinicalAntagonistsOrBlockers: ['Suworeksant (Belsomra)', 'Lemboreksant (Dayvigo)', 'Daridoreksant (Quviviq - nowoczesne leki nasenne blokujące receptory oreksynowe)'],
      clinicalApplications: ['Bezsenność pierwotna (podwójni antagoniści DORA)', 'Narkolepsja z katapleksją (badania nad agonistami OX2R)']
    },
    badgeColor: 'amber'
  },
  {
    id: 'h1_histamine',
    name: 'Receptor Histaminowy H1',
    codeName: 'HRH1',
    family: 'histamine',
    transduction: 'gpcr_gq',
    couplingOrConductance: 'Białko Gαq/11 -> PLCβ -> ↑ Ca2+',
    structureSubunits: 'Monomer GPCR klasy A',
    synapticLocation: ['postsynaptic'],
    cnsRegions: ['Wzgórze', 'Kora mózgowa', 'Układ siatkowaty wzbudzający'],
    functionalRole: 'Główny mediator histaminergicznego wzbudzenia korowego i czuwania; blokada tego receptora wywołuje ciężką senność i przyrost masy ciała.',
    signalingCascade: {
      title: 'Aktywacja kory i promowanie czuwania',
      steps: [
        'Histamina z jądra TMN podwzgórza wiąże H1 w korze i wzgórzu',
        'PLCβ mobilizuje Ca2+, co znosi przewodnictwo potasowe i depolaryzuje neurony',
        'Przejście wzgórza z trybu salwowego (sen) do trybu tonicznego (czuwanie)'
      ],
      primaryEffectors: ['PLCβ', 'Ca2+ cytozolowy'],
      cellularOutcome: 'Promowanie czuwania, uwaga, regulacja pobierania pokarmu.'
    },
    crossTalkAndInteractions: [
      {
        partnerReceptor: 'gaba_a',
        nature: 'antagonism',
        description: 'Histaminergiczne pobudzenie H1 przeciwstawia się sennemu działaniu GABA uwalnianego z jądra VLPO.'
      }
    ],
    pharmacology: {
      endogenousLigands: ['Histamina'],
      clinicalAntagonistsOrBlockers: ['Difenhydramina', 'Hydroksyzyna (leki uspokajające i nasenne I generacji)', 'Doksapina', 'Klozapina / Olanzapina (silna blokada H1 = sedacja i tycie)'],
      clinicalApplications: ['Leczenie bezsenności i lęku (hydroksyzyna)', 'Alergie (leki II generacji nie przenikają OUN)']
    },
    badgeColor: 'amber'
  }
];
