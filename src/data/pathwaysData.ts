import { WorkflowCascade } from '../types';

export const WORKFLOW_CASCADES: WorkflowCascade[] = [
  {
    id: 'darpp32_cascade',
    title: 'Kaskada DARPP-32 i Integracja Prążkowiowa',
    subtitle: 'Konwergencja szlaków D1, D2, A2A oraz receptorów NMDA w neuronach średnich kolczastych (MSN)',
    category: 'Zwoje Podstawy & Motoryka',
    receptorsInvolved: ['d1', 'd2', 'a2a_adenosine', 'nmda', 'ampa'],
    summary: 'Białko DARPP-32 (32 kDa) działa jako bifunkcyjny przełącznik molekularny integrujący pobudzenie dopaminergiczne, adenozynowe i glutaminianowe. Fosforylacja na Thr34 blokuje fosfatazę PP1, utrwalając stan pobudzenia synapsy, podczas gdy wapń przez kalcyneurynę wygasza ten sygnał.',
    electrophysiologicalEffect: 'Gwałtowne wzmocnienie prądów EPSP i ułatwienie plastyczności LTP (Thr34), bądź głęboka defosforylacja receptorów AMPA i wygaszenie synapsy (LTD).',
    clinicalRelevance: 'Patofizjologia choroby Parkinsona (utrata dopaminy faworyzuje drogę pośrednią), pląsawicy Huntingtona, dyskinez powikłanych lewodopą oraz mechanizm działania leków przeciwpsychotycznych.',
    steps: [
      {
        stepNumber: 1,
        compartment: 'Błona postsynaptyczna',
        actor: 'Receptor D1 / Gαolf oraz Receptor A2A / Gαs',
        action: 'Aktywacja Cyklazy Adenylanowej (AC5)',
        molecularDetail: 'Dopamina (na dMSN) lub adenozyna (na iMSN) stymuluje AC5, prowadząc do gwałtownego wzrostu stężenia cyklicznego AMP (cAMP).',
        significance: 'Uruchomienie dominującej kaskady kinazowej PKA.'
      },
      {
        stepNumber: 2,
        compartment: 'Cytozol',
        actor: 'Kinaza Białkowa A (PKA)',
        action: 'Fosforylacja DARPP-32 na reszcie Thr34',
        molecularDetail: 'PKA przenosi grupę fosforanową na resztę Treonina-34 białka DARPP-32, przekształcając je w subnanomolarny inhibitor fosfatazy białkowej 1 (PP1).',
        significance: 'Wyciszenie głównej fosfatazy komórkowej zabezpiecza synapsę przed inaktywacją.'
      },
      {
        stepNumber: 3,
        compartment: 'Błona postsynaptyczna',
        actor: 'Zahamowana Fosfataza PP1',
        action: 'Utrwalenie fosforylacji GluA1 i GluN2B',
        molecularDetail: 'Brak aktywnej PP1 uniemożliwia usunięcie fosforylacji z GluA1 (Ser845) oraz GluN2B (Tyr1472). Kanały AMPA i NMDA pozostają maksymalnie wrażliwe.',
        significance: 'Potężne wzmocnienie prądu pobudzającego (EPSP) w odpowiedzi na impuls kory.'
      },
      {
        stepNumber: 4,
        compartment: 'Szczelina i błona postsynaptyczna',
        actor: 'Receptor D2 / Gαi',
        action: 'Wygaszenie Cyklazy Adenylanowej (Przeciwstawny szlak D2)',
        molecularDetail: 'Pobudzenie D2 przez dopaminę w iMSN hamuje AC5, obniża cAMP, co zdejmuje fosforylację z DARPP-32 i aktywuje PP1.',
        significance: 'Mechanizm hamowania drogi pośredniej przez dopaminę ułatwiający płynność ruchu.'
      },
      {
        stepNumber: 5,
        compartment: 'Cytozol',
        actor: 'Receptor NMDA / Kalcyneuryna (PP2B)',
        action: 'Reset sygnału: Defosforylacja Thr34 przez Ca2+',
        molecularDetail: 'Silny napływ Ca2+ przez otwarty kanał NMDA aktywuje kalcyneurynę (PP2B), która swoiście odcina fosforan z Thr34 DARPP-32, odhamowując PP1 i indukując LTD.',
        significance: 'Zabezpieczenie przed przeładowaniem synapsy i mechanizm wygaszania starych śladów motorycznych.'
      }
    ]
  },
  {
    id: 'ei_balance_circuit',
    title: 'Równowaga Pobudzenie-Hamowanie (E/I Balance)',
    subtitle: 'Sprzężenie zwrotne i wyprzedzające między piramidami korowymi a interneuronami PV+ i SOM+',
    category: 'Sieci Korowe & Elektrofizjologia',
    receptorsInvolved: ['ampa', 'nmda', 'gaba_a', 'gaba_b', 'mglur2_3'],
    summary: 'Równowaga E/I decyduje o precyzji obliczeniowej kory nowej i zapobiega paroksyzmom drgawkowym. Wzbudzenie glutaminianowe (AMPA/NMDA) błyskawicznie rekrutuje interneurony PV+, które generują okołosomatyczne hamowanie bocznikujące przez GABA_A, podczas gdy presynaptyczne GABA_B i mGluR2/3 ograniczają kwantowy wyrzut neurotransmitera.',
    electrophysiologicalEffect: 'Ograniczenie okna integracji czasowej EPSP do 1-2 ms, koordynacja oscylacji gamma (30-80 Hz) oraz prewencja napadów padaczkowych.',
    clinicalRelevance: 'Zaburzenia osi E/I leżą u podstaw padaczki, spektrum autyzmu (ASD) oraz hipotezy dysfunkcji interneuronów PV+ w schizofrenii.',
    steps: [
      {
        stepNumber: 1,
        compartment: 'Szczelina synaptyczna',
        actor: 'Kolbka glutaminianergiczna',
        action: 'Wyrzut glutaminianu na neurony piramidowe i interneurony',
        molecularDetail: 'Potencjał czynnościowy powoduje napływ Ca2+ przez Cav2.1 i uwalnianie kwantów glutaminianu.',
        significance: 'Początek cyklu wzbudzenia korowego.'
      },
      {
        stepNumber: 2,
        compartment: 'Błona postsynaptyczna',
        actor: 'Receptory AMPA i NMDA interneuronów PV+ (parwalbuminowych)',
        action: 'Błyskawiczne wyładowanie interneuronów koszyczkowych',
        molecularDetail: 'Interneurony PV+ posiadają receptory AMPA pozbawione podjednostki GluA2 (CP-AMPA o ultrakrótkim czasie narastania i braku desensytyzacji), co wyzwala natychmiastowy potencjał czynnościowy.',
        significance: 'Hamowanie wyprzedzające (feedforward inhibition).'
      },
      {
        stepNumber: 3,
        compartment: 'Błona postsynaptyczna',
        actor: 'Receptory GABA_A komórek piramidowych',
        action: 'Hamowanie okołosomatyczne i bocznikujące (Shunting)',
        molecularDetail: 'Uwolniony GABA wiąże synaptyczne receptory GABA_A (α1β2γ2). Masywny prąd Cl- obniża oporność błony, bocznikując docierające prądy depolaryzacyjne z dendrytów.',
        significance: 'Zawężenie okna czasowego pobudzenia komórki piramidowej i wycięcie szumu tła.'
      },
      {
        stepNumber: 4,
        compartment: 'Błona presynaptyczna',
        actor: 'Presynaptyczne receptory GABA_B i mGluR2/3',
        action: 'Negatywne sprzężenie zwrotne hamujące wyrzut (Feedback brake)',
        molecularDetail: 'Nadmiar GABA i glutaminianu w perisynapsie aktywuje receptory presynaptyczne. Dimery Gβγ zamykają kanały wapniowe Cav2.1 i Cav2.2.',
        significance: 'Zatrzymanie dalszego uwalniania neurotransmiterów i wygaszenie salwy pobudzenia.'
      }
    ]
  },
  {
    id: 'retrograde_endocannabinoid',
    title: 'Retrogradna Sygnalizacja Endokannabinoidowa (DSI / DSE)',
    subtitle: 'Wsteczna modulacja plastyczności synaptycznej przez receptor CB1 w synapsach GABA i Glu',
    category: 'Neuroplastyczność Wsteczna',
    receptorsInvolved: ['cb1', 'mglur1_5', 'nmda', 'm1_muscarinic'],
    summary: 'W przeciwieństwie do klasycznej transmisji anterogradowej, endokannabinoidy (2-AG) są syntetyzowane postsynaptycznie "na żądanie" pod wpływem jonów Ca2+ i kaskady Gq, po czym dyfundują wstecz przez szczelinę do presynaptycznego receptora CB1, wyłączając napływ wapnia i blokując uwalnianie neurotransmitera.',
    electrophysiologicalEffect: 'Depolarization-induced Suppression of Inhibition (DSI - odhamowanie komórki) lub Depolarization-induced Suppression of Excitation (DSE - ochrona przed ekscytotoksycznością).',
    clinicalRelevance: 'Działanie przeciwbólowe kannabinoidów, zapobieganie napadom drgawkowym (Epidiolex), regulacja plastyczności hipokampa, wygaszanie traumy lękowej.',
    steps: [
      {
        stepNumber: 1,
        compartment: 'Błona postsynaptyczna',
        actor: 'Silna depolaryzacja (NMDA) lub receptor mGluR1/5 / M1 (Gq)',
        action: 'Wzrost stężenia cytozolowego Ca2+ i aktywacja enzymów',
        molecularDetail: 'Napływ Ca2+ przez NMDA lub aktywacja PLCβ przez Gαq uwalnia wolny Ca2+ z siateczki ER.',
        significance: 'Sygnał ostrzegawczy o nadmiernym pobudzeniu postsynaptycznym.'
      },
      {
        stepNumber: 2,
        compartment: 'Cytozol',
        actor: 'Lipaza diacyloglicerolowa (DAGLα)',
        action: 'Synteza 2-Arachidonoiloglicerolu (2-AG)',
        molecularDetail: 'DAGLα zależna od Ca2+ przekształca diacyloglicerol (DAG) w wysoce lipofilną cząsteczkę 2-AG.',
        significance: 'Wytworzenie wstecznego posłańca na żądanie (brak magazynowania w pęcherzykach).'
      },
      {
        stepNumber: 3,
        compartment: 'Szczelina synaptyczna',
        actor: '2-AG',
        action: 'Dyfuzja wsteczna przez dwuwarstwę lipidową',
        molecularDetail: 'Jako lipid 2-AG przenika swobodnie przez błonę postsynaptyczną, pokonuje szczelinę synaptyczną i dociera do kolbki presynaptycznej.',
        significance: 'Retrogradny transfer informacji o stanie komórki docelowej.'
      },
      {
        stepNumber: 4,
        compartment: 'Błona presynaptyczna',
        actor: 'Presynaptyczny receptor CB1 / Gαi/o',
        action: 'Zablokowanie kanałów Cav2.1 / Cav2.2 przez dimer Gβγ',
        molecularDetail: 'Związanie 2-AG aktywuje Gi/o. Uwolnione podjednostki Gβγ bezpośrednio wiążą się z kanałami wapniowymi Cav2.1 (P/Q) i Cav2.2 (N), znosząc dokomórkowy prąd wapniowy.',
        significance: 'Uniemożliwienie fuzji pęcherzyków SNARE i ugaszenie dalszego wyrzutu neurotransmitera.'
      }
    ]
  },
  {
    id: 'gq_plc_m_current',
    title: 'Szlak Gq/11 - PLCβ - IP3/DAG i Zamknięcie Kanałów M (Kv7)',
    subtitle: 'Mechanizm dramatycznego wzrostu pobudliwości neuronu przez receptory metabotropowe Gq',
    category: 'Pobudliwość Błonowa & Homeostaza',
    receptorsInvolved: ['m1_muscarinic', '5ht2a', 'mglur1_5', 'h1_histamine'],
    summary: 'Klasyczny szlak Gq nie tylko uwalnia zmagazynowany w ER wapń, ale poprzez zubożenie błonowego PIP2 oraz fosforylację PKC doprowadza do zamknięcia konstytutywnie otwartych kanałów potasowych Kv7 (KCNQ). Usunięcie prądu M powoduje, że neuron staje się ekstremalnie wrażliwy na bodźce depolaryzujące.',
    electrophysiologicalEffect: 'Zniesienie adaptacji częstotliwości wyładowań (spike frequency adaptation); przejście neuronu w tryb salw wieloimpulsowych (burst firing).',
    clinicalRelevance: 'Leczenie schizofrenii (ksanomelina w Cobenfy), mechanizm halucynogenny psychodelików (5-HT2A), leki przeciwpadaczkowe otwierające Kv7 (retygabina).',
    steps: [
      {
        stepNumber: 1,
        compartment: 'Błona postsynaptyczna',
        actor: 'Receptory M1, 5-HT2A, mGluR1/5, H1 / Białko Gαq/11',
        action: 'Stymulacja Fosfolipazy C-β (PLCβ)',
        molecularDetail: 'Wymiana GDP na GTP w podjednostce Gαq stymuluje domenę katalityczną enzymu PLCβ.',
        significance: 'Inicjacja kaskady hydrolizy fosfolipidów inozytolowych.'
      },
      {
        stepNumber: 2,
        compartment: 'Błona postsynaptyczna',
        actor: 'Fosfolipaza C-β',
        action: 'Hydroliza błonowego PIP2 do IP3 oraz DAG',
        molecularDetail: 'Błonowy difosforan fosfatydyloinozytolu (PIP2) jest rozszczepiany na rozpuszczalny w cytozolu inozytolo-1,4,5-trisfosforan (IP3) i błonowy diacyloglicerol (DAG).',
        significance: 'Spadek stężenia wolnego PIP2 w wewnętrznej warstwie dwuwarstwy lipidowej.'
      },
      {
        stepNumber: 3,
        compartment: 'Błona postsynaptyczna',
        actor: 'Kanały potasowe Kv7.2 / Kv7.3 (KCNQ - prąd M)',
        action: 'Zamknięcie kanałów z powodu braku PIP2 i fosforylacji przez PKC',
        molecularDetail: 'Kanały Kv7 wymagają bezpośredniej obecności PIP2 jako kofaktora do utrzymania stanu otwartego. Spadek PIP2 i fosforylacja przez PKC powodują natychmiastowe zamknięcie poru potasowego.',
        significance: 'Zanik prądu hiperpolaryzującego M; oporność błony rośnie, potencjał ulega długiej depolaryzacji.'
      },
      {
        stepNumber: 4,
        compartment: 'Siateczka śródplazmatyczna (ER)',
        actor: 'Receptory IP3R',
        action: 'Masywny wyrzut jonów Ca2+ z magazynów wewnątrzkomórkowych',
        molecularDetail: 'IP3 otwiera kanały wapniowe w błonie siateczki śródplazmatycznej, zalewając cytozol jonami Ca2+.',
        significance: 'Aktywacja kinazy CaMKII, enzymów szlaku eikozanoidów i czynników transkrypcyjnych (NFAT).'
      }
    ]
  },
  {
    id: 'gio_girk_cav_pathway',
    title: 'Szlak Gi/o - Kompleks Gβγ: GIRK i Presynaptyczna Blokada Cav',
    subtitle: 'Naczelny mechanizm hamowania elektrochemicznego przez GPCR w układzie nerwowym',
    category: 'Hamowanie Presynaptyczne & GIRK',
    receptorsInvolved: ['gaba_b', 'd2', '5ht1a', 'mor_opioid', 'alpha2_adrenergic', 'cb1'],
    summary: 'Większość kluczowych receptorów hamujących OUN (GABA_B, D2, 5-HT1A, MOR, α2, CB1) wykorzystuje białka Gi/o. Obok zahamowania produkcji cAMP, ich najpotężniejszym ramieniem efektorowym jest uwolniony dimer Gβγ, który bezpośrednio steruje kanałami jonowymi bez udziału wtórnych przekaźników chemicznych.',
    electrophysiologicalEffect: 'Postsynaptycznie: powolna hiperpolaryzacja o 10-15 mV (otwarcie GIRK). Presynaptycznie: spadek napływu Ca2+ o ponad 80% i zablokowanie wyrzutu kwantowego.',
    clinicalRelevance: 'Działanie leków uspokajających (baklofen), przeciwbólowych (fentanyl, morfina), przeciwpsychotycznych oraz mechanizm autoregulacji noradrenaliny (klonidyna).',
    steps: [
      {
        stepNumber: 1,
        compartment: 'Błona komórkowa',
        actor: 'Receptory Gi/o (GABA_B, MOR, D2, 5-HT1A, α2)',
        action: 'Dysocjacja heterotrimerów Gi na Gαi-GTP oraz dimery Gβγ',
        molecularDetail: 'Związanie liganda indukuje wymianę GDP na GTP w podjednostce Gαi, odłączając stabilny heterodimer Gβγ.',
        significance: 'Rozdział dwóch niezależnych ramion efektorowych: enzymatycznego (Gαi) i jonotropowo-modulatorowego (Gβγ).'
      },
      {
        stepNumber: 2,
        compartment: 'Błona postsynaptyczna',
        actor: 'Wolny dimer Gβγ',
        action: 'Bezpośrednie otwarcie kanałów potasowych GIRK (Kir3.1-3.4)',
        molecularDetail: 'Dimer Gβγ wiąże się bezpośrednio z domeną cytoplazmatyczną tetramerycznych kanałów GIRK, otwierając por selektywny dla K+.',
        significance: 'Wypływ jonów potasowych z komórki zgodnie z gradientem stężeń wywołuje głęboki, powolny potencjał IPSP.'
      },
      {
        stepNumber: 3,
        compartment: 'Błona presynaptyczna',
        actor: 'Wolny dimer Gβγ',
        action: 'Napięciowo-zmienna blokada kanałów wapniowych Cav2.1 (P/Q) i Cav2.2 (N)',
        molecularDetail: 'Gβγ wiąże pętlę I-II podjednostki α1 kanału wapniowego, przesuwając jego zależność aktywacyjną ku bardziej dodatnim potencjałom (zablokowanie otwarcia przy typowym potencjale czynnościowym).',
        significance: 'Brak lokalnego mikrodomeny Ca2+ uniemożliwia fuzję pęcherzyków z synaptotagminą.'
      },
      {
        stepNumber: 4,
        compartment: 'Cytozol',
        actor: 'Podjednostka Gαi-GTP',
        action: 'Inaktywacja Cyklazy Adenylanowej',
        molecularDetail: 'Gαi blokuje domeny C1/C2 cyklazy adenylanowej, uniemożliwiając syntezę cAMP i wygaszając aktywność kinazy PKA.',
        significance: 'Spadek fosforylacji białek synaptycznych utrwala stan wyciszenia komórki.'
      }
    ]
  },
  {
    id: 'trkb_bdnf_rtk_cascade',
    title: 'Szlak Neurotrofin RTK: TrkB - BDNF - MAPK / Akt-mTOR',
    subtitle: 'Naczelny molekularny motor neurogenezy, wzrostu kolców dendrytycznych i utrwalania pamięci',
    category: 'Neuroplastyczność Strukturalna & Przeżycie',
    receptorsInvolved: ['trkb', 'p75ntr', 'nmda'],
    summary: 'W przeciwieństwie do receptorów GPCR, kinazy tyrozynowe TrkB sterują architekturą cytoszkieletu i syntezą białek na poziomie dendrytu. Wiązanie dimeru BDNF wyzwala potrójny szlak wewnątrzkomórkowy decydujący o przeżyciu neuronu, synaptogenezie i konsolidacji śladów pamięciowych.',
    electrophysiologicalEffect: 'Trwałe zwiększenie gęstości postsynaptycznej (PSD), powiększenie główek kolców dendrytycznych i utrwalenie późnej fazy LTP (L-LTP).',
    clinicalRelevance: 'Współczesna hipoteza neurotroficzna depresji (mechanizm działania ketaminy i leków SSRI), otępienia, regeneracja neuronów po udarze mózgu.',
    steps: [
      {
        stepNumber: 1,
        compartment: 'Szczelina synaptyczna i błona postsynaptyczna',
        actor: 'Dimer BDNF / Receptor TrkB',
        action: 'Dimeryzacja receptora i autofosforylacja kinazy tyrozynowej',
        molecularDetail: 'Dojrzały BDNF wiąże domenę LRR TrkB, wymuszając przybliżenie domen katalitycznych i autofosforylację reszt tyrozynowych (m.in. Tyr515 i Tyr816).',
        significance: 'Utworzenie doków wiążących białka adaptorowe z domenami SH2 i PTB.'
      },
      {
        stepNumber: 2,
        compartment: 'Cytozol',
        actor: 'Fosforylowana Tyr515 / Kompleks Shc-Grb2-SOS',
        action: 'Aktywacja szlaku Ras - Raf - MEK1/2 - ERK1/2',
        molecularDetail: 'Wymiana nukleotydów na małym białku G Ras uruchamia kaskadę kinazową prowadzącą do aktywacji kinaz MAP (ERK1/2).',
        significance: 'ERK1/2 migruje do jądra i fosforyluje CREB, indukując transkrypcję genów wczesnej odpowiedzi (Arc, c-Fos, Egr1).'
      },
      {
        stepNumber: 3,
        compartment: 'Cytozol',
        actor: 'Kinaza PI3K / Akt (Kinaza białkowa B)',
        action: 'Aktywacja kompleksu mTORC1 i inaktywacja szlaku apoptozy Bad/GSK-3β',
        molecularDetail: 'Akt fosforyluje i inaktywuje czynnik proapoptotyczny Bad oraz kinazę GSK-3β, a także zdejmuje hamulec TSC2 z białka Rheb, aktywując kinazę mTORC1.',
        significance: 'Lokalna translacja białek strukturalnych bezpośrednio w kolcu dendrytycznym (p53/S6K) oraz ochrona neuronu przed śmiercią.'
      },
      {
        stepNumber: 4,
        compartment: 'Błona postsynaptyczna',
        actor: 'Fosforylowana Tyr816 / Fosfolipaza C-γ1 (PLCγ1)',
        action: 'Wzmocnienie prądu receptorów NMDA i mobilizacja Ca2+',
        molecularDetail: 'PLCγ1 katalizuje hydrolizę PIP2, generując IP3 i DAG. Wzrost Ca2+ aktywuje CaMKII, która fosforyluje GluA1 i ułatwia indukcję LTP.',
        significance: 'Ścisła synergia między sygnałem neurotroficznym a pobudzeniem glutaminianowym.'
      }
    ]
  }
];
