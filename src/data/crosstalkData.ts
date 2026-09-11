import { CrosstalkInteraction, SimulationDrug } from '../types';

export const CROSSTALK_INTERACTIONS: CrosstalkInteraction[] = [
  {
    id: 'xtalk_a2a_d2',
    sourceId: 'a2a_adenosine',
    targetId: 'd2',
    type: 'heterodimer',
    title: 'Heterodimer A2A - D2 w Prążkowiu',
    description: 'Fizyczny heterooligomer w błonie neuronów kolczastych drogi pośredniej (iMSN). Związanie adenozyny z receptorem A2A wywołuje allosteryczną zmianę w kieszeni wiążącej receptora D2, drastycznie zmniejszając jego powinowactwo do dopaminy.',
    anatomicalSite: 'Prążkowie (neurony drogi pośredniej hamującej ruch)',
    functionalConsequence: 'Adenozyna osłabia działanie hamujące dopaminy na drogę pośrednią, zwiększając napięcie hamowania motorycznego i potęgując zmęczenie.',
    pharmacologicalImpact: 'Antagoniści A2A (kofeina, istradefylina) odwracają to hamowanie, przywracając wrażliwość receptora D2 na dopaminę — mechanizm poprawy sprawności w chorobie Parkinsona.'
  },
  {
    id: 'xtalk_5ht2a_mglur2',
    sourceId: '5ht2a',
    targetId: 'mglur2_3',
    type: 'heterodimer',
    title: 'Heterokompleks 5-HT2A - mGluR2 w Korze Nowej',
    description: 'Kompleks łączący receptor pro-psychotyczny (5-HT2A, Gq) z receptorem hamującym (mGluR2, Gi). Agoniści psychodeliczni (LSD, psylocyna) poprzez konformację tego heteromeru wyzwalają specyficzny szlak białka Gi.',
    anatomicalSite: 'Warstwa V kory czołowej (neurony piramidowe projekcyjne)',
    functionalConsequence: 'Aktywacja mGluR2 przez jego swoistego agonistę wygasza transdukcję sygnału psychodelicznego z receptora 5-HT2A.',
    pharmacologicalImpact: 'Agoniści mGluR2 (np. pomaglumetad) stanowią innowacyjny mechanizm leczenia schizofrenii i psychoz bez konieczności bezpośredniej blokady receptorów dopaminowych D2.'
  },
  {
    id: 'xtalk_d1_d2_heteromer',
    sourceId: 'd1',
    targetId: 'd2',
    type: 'heterodimer',
    title: 'Nietypowy Heterodimer D1 - D2 w Układzie Nagrody',
    description: 'Specyficzny heterooligomer obecny w subpopulacji neuronów jądra półleżącego (NAc). Zamiast typowego sprzężenia z Gs lub Gi, dimer ten ulega selektywnemu sprzężeniu z białkiem Gαq/11.',
    anatomicalSite: 'Jądro półleżące (NAc) i gałka blada',
    functionalConsequence: 'Jednoczesne związanie dopaminy z oboma monomerami wyzwala wewnątrzkomórkowy wyrzut wapnia i aktywację kinazy CaMKII.',
    pharmacologicalImpact: 'Odkrycie istotne dla patofizjologii uzależnień od kokainy i amfetaminy oraz dyskinez motorycznych.'
  },
  {
    id: 'xtalk_nmda_d1_scaffold',
    sourceId: 'd1',
    targetId: 'nmda',
    type: 'scaffold_complex',
    title: 'Kompleks Rusztowania PSD: D1 - NMDA (GluN1)',
    description: 'Bezpośrednia fizyczna interakcja między domeną C-końcową receptora D1 a C-końcem podjednostki GluN1 receptora NMDA w gęstości postsynaptycznej.',
    anatomicalSite: 'Kolce dendrytyczne neuronów prążkowia i kory przedczołowej',
    functionalConsequence: 'Pobudzenie receptora D1 zapobiega endocytozie receptora NMDA, stabilizując go w błonie i zwiększając gotowość do indukcji plastyczności LTP.',
    pharmacologicalImpact: 'Kooperacja D1-NMDA jest krytyczna dla pamięci roboczej w korze przedczołowej oraz uczenia nagradzanego.'
  },
  {
    id: 'xtalk_retrograde_cb1',
    sourceId: 'mglur1_5',
    targetId: 'cb1',
    type: 'retrograde',
    title: 'Retrogradne Hamowanie Synaptyczne: mGluR1/5 -> CB1',
    description: 'Postsynaptyczna aktywacja mGluR1/5 uruchamia enzym DAGLα, syntetyzujący endokannabinoid 2-AG. 2-AG przenika wstecz przez szczelinę i hamuje presynaptyczny receptor CB1.',
    anatomicalSite: 'Hipokamp, móżdżek (komórki Purkinjego), kora mózgowa',
    functionalConsequence: 'Krótkotrwałe lub długotrwałe wyciszenie uwalniania neurotransmiterów (DSE dla glutaminianu, DSI dla GABA).',
    pharmacologicalImpact: 'Wyjaśnia mechanizm przeciwbólowego i przeciwdrgawkowego działania kannabinoidów (THC, CBD).'
  },
  {
    id: 'xtalk_trkb_p75',
    sourceId: 'trkb',
    targetId: 'p75ntr',
    type: 'inhibition',
    title: 'Przełącznik Neurotroficzny: TrkB vs p75NTR',
    description: 'TrkB (aktywowane przez dojrzały BDNF) promuje przeżycie neuronu, synaptogenezę i LTP, podczas gdy p75NTR (wiązany przez proBDNF) aktywuje kaspazy i kinazę JNK, wywołując apoptozę lub LTD.',
    anatomicalSite: 'Hipokamp, kora, pień mózgu, układ cholinergiczny',
    functionalConsequence: 'Stosunek stężeń BDNF/proBDNF w szczelinie synaptycznej determinuje, czy dany kolec dendrytyczny ulegnie wzmocnieniu, czy eliminacji (pruning).',
    pharmacologicalImpact: 'Cel terapeutyczny w chorobie Alzheimera, stwardnieniu zanikowym bocznym i depresji.'
  }
];

export const SIMULATION_DRUGS: SimulationDrug[] = [
  {
    id: 'drug_ketamine',
    name: 'Ketamina / Esketamina',
    targetReceptorId: 'nmda',
    actionType: 'channel_blocker',
    description: 'Niekurencyjny bloker poru kanału NMDA. Wybiórczo blokuje receptory NMDA na interneuronach GABA-ergicznych, powodując przejściowe odhamowanie neuronów piramidowych i gwałtowny wyrzut glutaminianu, co wtórnie aktywuje AMPA i stymuluje syntezę BDNF (szlak TrkB/mTOR).',
    affectedParameters: {
      intracellularCalcium: -35,
      excitabilityIndex: +25,
      crebPhosphorylation: +40,
      membranePotentialMv: +4
    }
  },
  {
    id: 'drug_diazepam',
    name: 'Diazepam (Benzodiazepina)',
    targetReceptorId: 'gaba_a',
    actionType: 'pam',
    description: 'Pozytywny allosteryczny modulator (PAM) receptora GABA_A (miejsce wiązania między podjednostkami α1/2/3/5 i γ2). Zwiększa częstotliwość otwarć kanału chlorkowego w obecności GABA, generując silne hamowanie bocznikujące.',
    affectedParameters: {
      membranePotentialMv: -12,
      excitabilityIndex: -50,
      intracellularCalcium: -20
    }
  },
  {
    id: 'drug_dopamine_agonist',
    name: 'Pramipeksol (Agonista D2/D3)',
    targetReceptorId: 'd2',
    actionType: 'agonist',
    description: 'Silny agonista receptorów D2 i D3. Hamuje cyklazę adenylanową, otwiera kanały GIRK wywołując hiperpolaryzację i wygasza drogę pośrednią w prążkowiu, odblokowując sprawność ruchową.',
    affectedParameters: {
      cAMP: -45,
      pkaActivity: -40,
      girkConductance: +55,
      membranePotentialMv: -8,
      excitabilityIndex: -25
    }
  },
  {
    id: 'drug_caffeine',
    name: 'Kofeina (Antagonista A1 / A2A)',
    targetReceptorId: 'a2a_adenosine',
    actionType: 'antagonist',
    description: 'Nieselektywny antagonista receptorów adenozynowych A1 i A2A. Znosi homeostatyczną presję snu (blokada A1) oraz rozbija allosteryczne hamowanie heterodimeru A2A-D2, zwiększając wrażliwość na dopaminę i napęd ruchowy.',
    affectedParameters: {
      cAMP: +30,
      pkaActivity: +35,
      excitabilityIndex: +35,
      membranePotentialMv: +5
    }
  },
  {
    id: 'drug_psilocybin',
    name: 'Psylocyna (Agonista 5-HT2A)',
    targetReceptorId: '5ht2a',
    actionType: 'agonist',
    description: 'Agonista serotoninergiczny o selektywności funkcjonalnej (bias) wobec receptora 5-HT2A. Aktywuje kaskadę Gq/PLCβ i szlak β-arestyny-2, zwiększa asynchroniczny wyrzut glutaminianu w korze i indukuje silną neuroplastyczność zależną od TrkB/BDNF.',
    affectedParameters: {
      intracellularCalcium: +50,
      pkcActivity: +45,
      excitabilityIndex: +30,
      crebPhosphorylation: +60,
      membranePotentialMv: +6
    }
  },
  {
    id: 'drug_baclofen',
    name: 'Baklofen (Agonista GABA_B)',
    targetReceptorId: 'gaba_b',
    actionType: 'agonist',
    description: 'Specyficzny agonista receptora GABA_B. Poprzez wolny dimer Gβγ bezpośrednio otwiera postsynaptyczne kanały GIRK oraz zamyka presynaptyczne kanały wapniowe Cav2.1/2.2 w rdzeniu kręgowym, znosząc spastyczność mięśni.',
    affectedParameters: {
      cAMP: -35,
      girkConductance: +70,
      membranePotentialMv: -15,
      excitabilityIndex: -45,
      intracellularCalcium: -30
    }
  },
  {
    id: 'drug_cobenfy',
    name: 'Ksanomelina (Agonista M1 / M4)',
    targetReceptorId: 'm1_muscarinic',
    actionType: 'agonist',
    description: 'Podwójny agonista receptorów muskarynowych M1 i M4 (składnik nowatorskiego leku Cobenfy). Pobudza korowe M1 poprawiając funkcje poznawcze i zamykając kanały Kv7, a przez prążkowiowe M4 wycisza nadmierny wyrzut dopaminy bez blokady D2.',
    affectedParameters: {
      intracellularCalcium: +40,
      pkcActivity: +35,
      excitabilityIndex: +20,
      crebPhosphorylation: +30
    }
  },
  {
    id: 'drug_haloperidol',
    name: 'Haloperidol (Antagonista D2)',
    targetReceptorId: 'd2',
    actionType: 'antagonist',
    description: 'Klasyczny, silny antagonista receptorów D2 (oraz D3/D4). Blokuje postsynaptyczne receptory D2 w szlaku mezolimbicznym, wygaszając objawy wytwórcze psychozy (omamy, urojenia), lecz nasilając hamowanie drogi pośredniej w prążkowiu (objawy pozapiramidowe EPS).',
    affectedParameters: {
      cAMP: +35,
      pkaActivity: +30,
      girkConductance: -45,
      excitabilityIndex: +15
    }
  }
];
