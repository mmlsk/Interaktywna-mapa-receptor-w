export interface CascadeNode {
  id: string;
  label: string;
  sublabel?: string;
  type: 'receptor' | 'enzyme' | 'channel' | 'g_protein' | 'messenger' | 'organelle' | 'scaffold';
  x: number;
  y: number;
  width?: number;
  height?: number;
  color: string;
  iconName?: string;
  activeSteps: number[]; // 1-indexed steps where this node is actively firing/processing
  stepStateDescriptions: { [step: number]: { state: string; badge: string; type: 'active' | 'inhibited' | 'primed' | 'phosphorylated' | 'open' | 'closed' | 'neutral' } };
}

export interface FlowPath {
  id: string;
  label: string;
  flowType: 'ion_flow' | 'molecule_movement' | 'translocation' | 'retrograde';
  substance: 'ca2' | 'cl' | 'k' | 'camp' | 'ip3' | '2ag' | 'dopamine' | 'gaba' | 'glutamate' | 'bdnf' | 'g_protein' | 'erk';
  d: string;
  particleColor: string;
  particleSymbol: string;
  particleCount: number;
  speedSec: number;
  activeSteps: number[]; // 1-indexed steps
  description: string;
}

export interface DownstreamEffectorFeedback {
  id: string;
  name: string;
  type: 'Enzym' | 'Kanał Jonowy' | 'Białko Regulatorowe' | 'Fosfataza' | 'Kinaza' | 'Transkrypcja';
  unit?: string;
  stepReadouts: {
    [step: number]: {
      valuePercent: number;
      displayValue: string;
      status: string;
      state: 'active' | 'inhibited' | 'open' | 'closed' | 'phosphorylated' | 'neutral' | 'primed';
    };
  };
}

export interface CascadeVisualData {
  cascadeId: string;
  canvasHeight: number;
  cleftY: number; // approximate Y boundary of synaptic cleft
  nodes: CascadeNode[];
  flowPaths: FlowPath[];
  downstreamEffectors: DownstreamEffectorFeedback[];
  synapticMetricsByStep: {
    [step: number]: {
      membranePotentialMv: number;
      calciumIntracellularNm: number;
      campLevelNm?: number;
      ip3LevelUm?: number;
      netSynapticState: string;
      clinicalNote: string;
    };
  };
}

export const CASCADE_VISUAL_REGISTRY: Record<string, CascadeVisualData> = {
  // 1. DARPP-32 CASCADE
  darpp32_cascade: {
    cascadeId: 'darpp32_cascade',
    canvasHeight: 520,
    cleftY: 130,
    nodes: [
      {
        id: 'rec_d1',
        label: 'Receptor D1',
        sublabel: 'Gαolf / Gs',
        type: 'receptor',
        x: 140,
        y: 110,
        color: '#3b82f6',
        activeSteps: [1],
        stepStateDescriptions: {
          1: { state: 'Związanie dopaminy, aktywacja Gαolf', badge: 'STYMULACJA', type: 'active' },
          2: { state: 'Podtrzymana stymulacja cyklazy', badge: 'SYGNAŁ Gs', type: 'active' },
          3: { state: 'Faza wykonawcza PKA', badge: 'AKTYWNY', type: 'active' },
          4: { state: 'Wygaszanie przez receptor D2', badge: 'WYPIERANIE', type: 'inhibited' },
          5: { state: 'Reset przez napływ Ca²⁺', badge: 'RESET', type: 'neutral' }
        }
      },
      {
        id: 'rec_d2',
        label: 'Receptor D2',
        sublabel: 'Gαi/o',
        type: 'receptor',
        x: 350,
        y: 110,
        color: '#ef4444',
        activeSteps: [4],
        stepStateDescriptions: {
          1: { state: 'Nieaktywny w dMSN', badge: 'SPOCZYNEK', type: 'neutral' },
          2: { state: 'Brak stymulacji Gi', badge: 'SPOCZYNEK', type: 'neutral' },
          3: { state: 'Brak stymulacji Gi', badge: 'SPOCZYNEK', type: 'neutral' },
          4: { state: 'Wiązanie dopaminy w iMSN, wyrzut Gαi-GTP', badge: 'HAMOWANIE AC', type: 'inhibited' },
          5: { state: 'Stan wygaszania', badge: 'WYGASZENIE', type: 'neutral' }
        }
      },
      {
        id: 'rec_nmda',
        label: 'Receptor NMDA',
        sublabel: 'Kanał Ca²⁺/Na⁺',
        type: 'channel',
        x: 580,
        y: 110,
        color: '#f59e0b',
        activeSteps: [3, 5],
        stepStateDescriptions: {
          1: { state: 'Częściowa blokada Mg²⁺', badge: 'BLOKADA Mg²', type: 'neutral' },
          2: { state: 'Oczekiwanie na fosforylację', badge: 'SPOCZYNEK', type: 'neutral' },
          3: { state: 'Tyr1472 fosforylowany, wzmocnienie prądu', badge: 'POTENCJACJA', type: 'active' },
          4: { state: 'Standardowa aktywność', badge: 'BAZOWY', type: 'neutral' },
          5: { state: 'Masywny napływ Ca²⁺ aktywuje PP2B', badge: 'NAPŁYW Ca²⁺', type: 'open' }
        }
      },
      {
        id: 'enzyme_ac5',
        label: 'Cyklaza Adenylanowa AC5',
        sublabel: 'Błona postsynaptyczna',
        type: 'enzyme',
        x: 180,
        y: 200,
        color: '#06b6d4',
        activeSteps: [1, 2],
        stepStateDescriptions: {
          1: { state: 'Gwałtowna synteza cyklicznego AMP z ATP', badge: '100% AKTYWNA', type: 'active' },
          2: { state: 'Utrzymany wysoki poziom cAMP', badge: 'AKTYWNA', type: 'active' },
          3: { state: 'Umiarkowane wydzielanie cAMP', badge: 'ŚREDNIA', type: 'active' },
          4: { state: 'Zablokowana allosterycznie przez Gαi-GTP', badge: 'ZAHAMOWANA', type: 'inhibited' },
          5: { state: 'Poziom podstawowy', badge: 'BAZOWA', type: 'neutral' }
        }
      },
      {
        id: 'enzyme_pka',
        label: 'Kinaza Białkowa A (PKA)',
        sublabel: 'Tetramer 2R:2C',
        type: 'enzyme',
        x: 220,
        y: 300,
        color: '#8b5cf6',
        activeSteps: [1, 2, 3],
        stepStateDescriptions: {
          1: { state: 'Wiązanie 4 cząsteczek cAMP z podjednostkami R', badge: 'DYSOCJACJA', type: 'active' },
          2: { state: 'Wolne podjednostki katalityczne C fosforylują DARPP-32', badge: 'FOSFORYLACJA', type: 'active' },
          3: { state: 'Fosforylacja GluA1 na Ser845', badge: 'FOSFORYLACJA AMPA', type: 'active' },
          4: { state: 'Reasocjacja podjednostek R i C przy niskim cAMP', badge: 'DEZAKTYWACJA', type: 'inhibited' },
          5: { state: 'Stan spoczynkowy', badge: 'SPOCZYNEK', type: 'neutral' }
        }
      },
      {
        id: 'protein_darpp32',
        label: 'Białko DARPP-32',
        sublabel: 'Przełącznik fosfo-Thr34',
        type: 'messenger',
        x: 360,
        y: 350,
        color: '#ec4899',
        activeSteps: [2, 3],
        stepStateDescriptions: {
          1: { state: 'Defosforylowana forma spoczynkowa', badge: 'STAN BAZOWY', type: 'neutral' },
          2: { state: 'PKA fosforyluje Treoninę-34: subnanomolarny inhibitor PP1', badge: 'Thr34-P (ON)', type: 'phosphorylated' },
          3: { state: 'Związanie i zablokowanie fosfatazy PP1', badge: 'INHIBICJA PP1', type: 'active' },
          4: { state: 'Defosforylacja przez fosfatazy cytozolowe', badge: 'SPADEK Thr34-P', type: 'inhibited' },
          5: { state: 'Kalcyneuryna (PP2B) gwałtownie odcina fosforan z Thr34', badge: 'DEFOSFORYLACJA', type: 'neutral' }
        }
      },
      {
        id: 'enzyme_pp1',
        label: 'Fosfataza Białkowa 1 (PP1)',
        sublabel: 'Główna fosfataza kolca',
        type: 'enzyme',
        x: 490,
        y: 350,
        color: '#64748b',
        activeSteps: [4, 5],
        stepStateDescriptions: {
          1: { state: 'Normalna aktywność defosforylująca', badge: 'AKTYWNA', type: 'neutral' },
          2: { state: 'Wiązanie przez DARPP-32 Thr34-P', badge: 'BLOKOWANA', type: 'inhibited' },
          3: { state: 'Całkowity paraliż katalityczny: ochrona fosfo-GluA1', badge: 'ZAHAMOWANA (OFF)', type: 'inhibited' },
          4: { state: 'Uwolnienie spod inhibicji po spadku Thr34-P', badge: 'ODHAMOWANA', type: 'active' },
          5: { state: 'Maksymalnie aktywna: defosforylacja AMPA/NMDA (indukcja LTD)', badge: 'NADAKTYWNA', type: 'active' }
        }
      },
      {
        id: 'enzyme_calcineurin',
        label: 'Kalcyneuryna (PP2B)',
        sublabel: 'Zależna od Ca²⁺/Kalmoduliny',
        type: 'enzyme',
        x: 580,
        y: 260,
        color: '#10b981',
        activeSteps: [5],
        stepStateDescriptions: {
          1: { state: 'Nieaktywna przy bazowym Ca²⁺ (70 nM)', badge: 'SPOCZYNEK', type: 'neutral' },
          2: { state: 'Nieaktywna', badge: 'SPOCZYNEK', type: 'neutral' },
          3: { state: 'Częściowe związanie mikrodrobin Ca²⁺', badge: 'ŚLADOWA', type: 'neutral' },
          4: { state: 'Brak aktywacji', badge: 'SPOCZYNEK', type: 'neutral' },
          5: { state: 'Związanie Ca²⁺/CaM: enzymatyczne odcięcie fosforanu z Thr34 DARPP-32', badge: 'AKTYWNY RESET', type: 'active' }
        }
      },
      {
        id: 'target_ampa_psd',
        label: 'Kompleks PSD (GluA1 / GluN2B)',
        sublabel: 'Gęstość postsynaptyczna',
        type: 'scaffold',
        x: 520,
        y: 450,
        color: '#0284c7',
        activeSteps: [3, 5],
        stepStateDescriptions: {
          1: { state: 'Poziom podstawowy fosforylacji Ser845', badge: 'BAZOWY', type: 'neutral' },
          2: { state: 'Kinaza PKA zbliża się do receptora', badge: 'PRZYGOTOWANIE', type: 'primed' },
          3: { state: 'Maksymalna fosforylacja GluA1 i GluN2B: potężne prądy EPSP (LTP)', badge: 'MAKS. PRZEWODNICTWO', type: 'active' },
          4: { state: 'Spadek wrażliwości po odhamowaniu PP1', badge: 'OSŁABIENIE', type: 'inhibited' },
          5: { state: 'Głęboka defosforylacja przez PP1: wygaszenie synapsy (LTD)', badge: 'RESET (LTD)', type: 'inhibited' }
        }
      }
    ],
    flowPaths: [
      // Dopamine diffusion from cleft to D1
      {
        id: 'flow_da_d1',
        label: 'Dyfuzja Dopaminy do D1',
        flowType: 'molecule_movement',
        substance: 'dopamine',
        d: 'M 140,30 L 140,95',
        particleColor: '#60a5fa',
        particleSymbol: 'DA',
        particleCount: 5,
        speedSec: 2.2,
        activeSteps: [1, 2, 3],
        description: 'Dopamina w szczelinie synaptycznej wiąże postsynaptyczny receptor D1'
      },
      // Galpha-olf lateral translocation to AC5
      {
        id: 'flow_golf_ac5',
        label: 'Translokacja błonowa Gαolf-GTP do AC5',
        flowType: 'translocation',
        substance: 'g_protein',
        d: 'M 160,135 Q 170,170 180,185',
        particleColor: '#38bdf8',
        particleSymbol: 'Gα',
        particleCount: 4,
        speedSec: 1.8,
        activeSteps: [1, 2],
        description: 'Podjednostka Gαolf migruje w wewnętrznej warstwie błony do domeny katalitycznej AC5'
      },
      // cAMP flow from AC5 to PKA
      {
        id: 'flow_camp_pka',
        label: 'Prąd cząsteczek cAMP z AC5 do PKA',
        flowType: 'molecule_movement',
        substance: 'camp',
        d: 'M 190,230 Q 200,270 220,285',
        particleColor: '#fbbf24',
        particleSymbol: 'cAMP',
        particleCount: 7,
        speedSec: 1.4,
        activeSteps: [1, 2, 3],
        description: 'Wysokie stężenie cyklicznego AMP zalewa holoenzym PKA, uwalniając podjednostki katalityczne'
      },
      // PKA to DARPP-32 phosphorylation path
      {
        id: 'flow_pka_darpp',
        label: 'Fosforylacja DARPP-32 przez PKA (Thr34)',
        flowType: 'translocation',
        substance: 'g_protein',
        d: 'M 255,320 Q 300,340 335,355',
        particleColor: '#f43f5e',
        particleSymbol: 'Ⓟ',
        particleCount: 5,
        speedSec: 2.0,
        activeSteps: [2, 3],
        description: 'Podjednostka C kinazy PKA transferuje grupę fosforanową na resztę Thr34'
      },
      // DARPP-32 Thr34-P docking to PP1
      {
        id: 'flow_darpp_pp1',
        label: 'Inhibicja allosteryczna PP1 przez DARPP-32-P',
        flowType: 'translocation',
        substance: 'g_protein',
        d: 'M 405,360 L 465,360',
        particleColor: '#e11d48',
        particleSymbol: '🔒',
        particleCount: 4,
        speedSec: 1.6,
        activeSteps: [2, 3],
        description: 'DARPP-32 z fosfo-Thr34 blokuje kieszeń katalityczną fosfatazy PP1'
      },
      // Dopamine binding to D2 (step 4)
      {
        id: 'flow_da_d2',
        label: 'Dyfuzja Dopaminy do D2 i wyrzut Gαi',
        flowType: 'molecule_movement',
        substance: 'dopamine',
        d: 'M 350,30 L 350,95',
        particleColor: '#f87171',
        particleSymbol: 'DA',
        particleCount: 6,
        speedSec: 1.8,
        activeSteps: [4],
        description: 'Aktywacja receptora D2 prowadzi do uwolnienia podjednostki Gαi hamującej cyklazę AC5'
      },
      // Galpha-i inhibiting AC5
      {
        id: 'flow_gai_ac5',
        label: 'Inhibicja AC5 przez Gαi',
        flowType: 'translocation',
        substance: 'g_protein',
        d: 'M 330,125 Q 260,180 205,200',
        particleColor: '#ef4444',
        particleSymbol: 'Gαi',
        particleCount: 4,
        speedSec: 1.5,
        activeSteps: [4],
        description: 'Gαi-GTP migruje do domeny katalitycznej AC5 wyłączając produkcję cAMP'
      },
      // Calcium ion influx through NMDA pore (step 5)
      {
        id: 'flow_ca_nmda',
        label: 'Napływ jonów Ca²⁺ przez por NMDA',
        flowType: 'ion_flow',
        substance: 'ca2',
        d: 'M 580,30 L 580,170',
        particleColor: '#facc15',
        particleSymbol: 'Ca²⁺',
        particleCount: 8,
        speedSec: 1.2,
        activeSteps: [3, 5],
        description: 'Jony wapnia wnikają z płynu zewnątrzkomórkowego przez otwarty kanał GluN1/GluN2B'
      },
      // Calcium activating Calcineurin and dephosphorylating Thr34
      {
        id: 'flow_ca_calcineurin',
        label: 'Aktywacja Kalcyneuryny i defosforylacja Thr34',
        flowType: 'ion_flow',
        substance: 'ca2',
        d: 'M 580,180 Q 580,225 580,245',
        particleColor: '#10b981',
        particleSymbol: 'Ca²⁺',
        particleCount: 6,
        speedSec: 1.3,
        activeSteps: [5],
        description: 'Wysokie stężenie Ca²⁺ wiąże kalmodulinę, indukując aktywność fosfatazy kalcyneuryny'
      },
      // Calcineurin dephosphorylating DARPP-32
      {
        id: 'flow_calcineurin_darpp',
        label: 'Reset: Odcięcie fosforanu z Thr34',
        flowType: 'translocation',
        substance: 'g_protein',
        d: 'M 550,280 Q 450,330 395,350',
        particleColor: '#10b981',
        particleSymbol: '✂Ⓟ',
        particleCount: 5,
        speedSec: 1.7,
        activeSteps: [5],
        description: 'Kalcyneuryna zdejmuje grupę fosforanową z Treoniny-34, dezaktywując DARPP-32'
      }
    ],
    downstreamEffectors: [
      {
        id: 'eff_ac5',
        name: 'Cyklaza Adenylanowa (AC5)',
        type: 'Enzym',
        unit: '% maks. aktywności',
        stepReadouts: {
          1: { valuePercent: 95, displayValue: '95%', status: 'Gwałtowny wyrzut cAMP (Gαolf)', state: 'active' },
          2: { valuePercent: 88, displayValue: '88%', status: 'Wysoka stała synteza', state: 'active' },
          3: { valuePercent: 75, displayValue: '75%', status: 'Utrzymana aktywność', state: 'active' },
          4: { valuePercent: 12, displayValue: '12%', status: 'Głęboka blokada przez D2 (Gαi)', state: 'inhibited' },
          5: { valuePercent: 18, displayValue: '18%', status: 'Spadek do poziomu spoczynkowego', state: 'neutral' }
        }
      },
      {
        id: 'eff_pka',
        name: 'Aktywność Kinazy PKA',
        type: 'Kinaza',
        unit: '% wolnych podjednostek C',
        stepReadouts: {
          1: { valuePercent: 72, displayValue: '72%', status: 'Dysocjacja holoenzymu', state: 'active' },
          2: { valuePercent: 96, displayValue: '96%', status: 'Maks. fosforylacja substratów', state: 'active' },
          3: { valuePercent: 90, displayValue: '90%', status: 'Fosforylacja GluA1 Ser845', state: 'active' },
          4: { valuePercent: 25, displayValue: '25%', status: 'Wygaszanie przez spadek cAMP', state: 'inhibited' },
          5: { valuePercent: 15, displayValue: '15%', status: 'Stan spoczynkowy', state: 'neutral' }
        }
      },
      {
        id: 'eff_darpp_thr34',
        name: 'DARPP-32 (Fosfo-Thr34)',
        type: 'Białko Regulatorowe',
        unit: '% sfosforylowanej puli',
        stepReadouts: {
          1: { valuePercent: 15, displayValue: '15%', status: 'Inicjacja fosforylacji', state: 'neutral' },
          2: { valuePercent: 98, displayValue: '98%', status: 'Silny inhibitor fosfatazy PP1', state: 'phosphorylated' },
          3: { valuePercent: 94, displayValue: '94%', status: 'Zablokowanie PP1 utrwalone', state: 'phosphorylated' },
          4: { valuePercent: 45, displayValue: '45%', status: 'Spadek po aktywacji D2', state: 'inhibited' },
          5: { valuePercent: 8, displayValue: '8%', status: 'Całkowity reset przez kalcyneurynę', state: 'neutral' }
        }
      },
      {
        id: 'eff_pp1_block',
        name: 'Inhibicja Fosfatazy PP1',
        type: 'Fosfataza',
        unit: '% zahamowania enzymu',
        stepReadouts: {
          1: { valuePercent: 10, displayValue: '10%', status: 'Enzym aktywny (odhamowany)', state: 'neutral' },
          2: { valuePercent: 92, displayValue: '92%', status: 'Wiązanie przez DARPP-32 Thr34-P', state: 'inhibited' },
          3: { valuePercent: 97, displayValue: '97%', status: 'Brak defosforylacji receptorów', state: 'inhibited' },
          4: { valuePercent: 30, displayValue: '30%', status: 'Odhamowanie katalityczne', state: 'active' },
          5: { valuePercent: 5, displayValue: '5%', status: 'Pełna reaktywacja: indukcja LTD', state: 'active' }
        }
      },
      {
        id: 'eff_epsp_conductance',
        name: 'Przewodnictwo Synaptyczne EPSP',
        type: 'Kanał Jonowy',
        unit: '% potencjacji bazowej',
        stepReadouts: {
          1: { valuePercent: 105, displayValue: '+5%', status: 'Rozpoczęcie kaskady', state: 'neutral' },
          2: { valuePercent: 140, displayValue: '+40%', status: 'Przygotowanie kanałów AMPA', state: 'active' },
          3: { valuePercent: 195, displayValue: '+95%', status: 'Potężne wzmocnienie EPSP (LTP)', state: 'active' },
          4: { valuePercent: 95, displayValue: '-5%', status: 'Wygaszenie odpowiedzi przez D2', state: 'neutral' },
          5: { valuePercent: 60, displayValue: '-40%', status: 'Depresja synaptyczna (LTD)', state: 'inhibited' }
        }
      }
    ],
    synapticMetricsByStep: {
      1: { membranePotentialMv: -68, calciumIntracellularNm: 85, campLevelNm: 480, netSynapticState: 'Inicjacja sygnalizacji dopaminergicznej D1', clinicalNote: 'Aktywacja drogi bezpośredniej w prążkowiu (ułatwienie ruchu).' },
      2: { membranePotentialMv: -65, calciumIntracellularNm: 95, campLevelNm: 820, netSynapticState: 'DARPP-32 zablokował PP1 (punkt krytyczny plastyczności)', clinicalNote: 'Podstawa wzmocnienia śladu motorycznego w zwojach podstawy.' },
      3: { membranePotentialMv: -52, calciumIntracellularNm: 340, campLevelNm: 680, netSynapticState: 'Maksymalna potencjacja synapsy korowo-prążkowiowej', clinicalNote: 'Silny EPSP zapobiega dyskinezom, faworyzuje płynność motoryczną.' },
      4: { membranePotentialMv: -70, calciumIntracellularNm: 80, campLevelNm: 120, netSynapticState: 'Wygaszenie drogi pośredniej przez D2 (hamowanie AC5)', clinicalNote: 'Leki przeciwpsychotyczne blokujące D2 znoszą ten hamulec (efekty pozapiramidowe).' },
      5: { membranePotentialMv: -74, calciumIntracellularNm: 920, campLevelNm: 90, netSynapticState: 'Masywny napływ Ca²⁺ przez NMDA: reset kalcyneurynowy (LTD)', clinicalNote: 'Zabezpieczenie przed ekscytotoksycznością i reset starych wzorców ruchowych.' }
    }
  },

  // 2. E/I BALANCE CIRCUIT
  ei_balance_circuit: {
    cascadeId: 'ei_balance_circuit',
    canvasHeight: 520,
    cleftY: 130,
    nodes: [
      {
        id: 'term_glut',
        label: 'Kolbka Glutaminianergiczna',
        sublabel: 'Piramida korowa (Presynapsa)',
        type: 'organelle',
        x: 160,
        y: 40,
        color: '#f59e0b',
        activeSteps: [1],
        stepStateDescriptions: {
          1: { state: 'Exocytoza pęcherzyków VGLUT1', badge: 'WYRZUT Glu', type: 'active' },
          2: { state: 'Dyfuzja w szczelinie', badge: 'DYFUZJA', type: 'active' },
          3: { state: 'Utrzymany wyrzut', badge: 'ŚREDNI', type: 'neutral' },
          4: { state: 'Zahamowanie przez autoreceptory mGluR2/3', badge: 'HAMOWANIE PRE', type: 'inhibited' }
        }
      },
      {
        id: 'rec_cp_ampa_pv',
        label: 'AMPA GluA2-lacking (CP-AMPA)',
        sublabel: 'Interneuron PV+ (Kosz)',
        type: 'channel',
        x: 160,
        y: 120,
        color: '#f97316',
        activeSteps: [1, 2],
        stepStateDescriptions: {
          1: { state: 'Wiązanie glutaminianu', badge: 'OTWARCIE KANAŁU', type: 'open' },
          2: { state: 'Gwałtowny dokomórkowy prąd Na⁺/Ca²⁺ (<1 ms)', badge: 'ULTRA-SZYBKI EPSP', type: 'active' },
          3: { state: 'Generacja potencjału czynnościowego PV+', badge: 'WYŁADOWANIE', type: 'active' },
          4: { state: 'Zakończenie salwy', badge: 'SPOCZYNEK', type: 'neutral' }
        }
      },
      {
        id: 'term_gaba_pv',
        label: 'Terminale GABA interneuronu PV+',
        sublabel: 'Okołosomatyczne zakończenie',
        type: 'organelle',
        x: 420,
        y: 60,
        color: '#10b981',
        activeSteps: [2, 3],
        stepStateDescriptions: {
          1: { state: 'Oczekiwanie na impuls', badge: 'SPOCZYNEK', type: 'neutral' },
          2: { state: 'Dotarcie potencjału czynnościowego do kolbki', badge: 'POBUDZENIE', type: 'active' },
          3: { state: 'Masywny wyrzut GABA bezpośrednio na somę piramidy', badge: 'WYRZUT GABA', type: 'active' },
          4: { state: 'Wyciszenie wyrzutu', badge: 'HAMOWANIE', type: 'neutral' }
        }
      },
      {
        id: 'rec_gaba_a',
        label: 'Receptor GABA_A (α1β2γ2)',
        sublabel: 'Soma komórki piramidowej',
        type: 'channel',
        x: 420,
        y: 160,
        color: '#06b6d4',
        activeSteps: [3],
        stepStateDescriptions: {
          1: { state: 'Kanał zamknięty', badge: 'ZAMKNIĘTY', type: 'closed' },
          2: { state: 'GABA dociera do miejsc wiązania α/β', badge: 'WIĄZANIE LIGANDA', type: 'primed' },
          3: { state: 'Otwarcie poru Cl⁻: prąd bocznikujący (shunting)', badge: 'NAPŁYW Cl⁻ (IPSP)', type: 'open' },
          4: { state: 'Desensytyzacja receptora', badge: 'ZAMYKANIE', type: 'closed' }
        }
      },
      {
        id: 'rec_presyn_brake',
        label: 'Presynaptyczne GABA_B & mGluR2/3',
        sublabel: 'Błona presynaptyczna',
        type: 'receptor',
        x: 620,
        y: 70,
        color: '#8b5cf6',
        activeSteps: [4],
        stepStateDescriptions: {
          1: { state: 'Brak stymulacji', badge: 'SPOCZYNEK', type: 'neutral' },
          2: { state: 'Wzrost stężenia przekaźników na obrzeżu', badge: 'SPILLOVER', type: 'neutral' },
          3: { state: 'Wiązanie nadmiaru GABA i glutaminianu', badge: 'AKTYWACJA Gi', type: 'active' },
          4: { state: 'Dimery Gβγ blokują kanały Cav2.1 w kolbce', badge: 'HAMULEC PRE (OFF)', type: 'inhibited' }
        }
      },
      {
        id: 'chan_cav_presyn',
        label: 'Kanał Cav2.1 (P/Q)',
        sublabel: 'Wapniowy wyzwalacz SNARE',
        type: 'channel',
        x: 620,
        y: 190,
        color: '#e11d48',
        activeSteps: [1, 4],
        stepStateDescriptions: {
          1: { state: 'Otwarty przez depolaryzację kolbki', badge: 'NAPŁYW Ca²⁺', type: 'open' },
          2: { state: 'Podtrzymany napływ wapnia', badge: 'OTWARTY', type: 'open' },
          3: { state: 'Rozpoczęcie wiązania Gβγ', badge: 'BLOKOWANIE', type: 'inhibited' },
          4: { state: 'Zablokowany przez Gβγ: brak fuzji pęcherzyków', badge: 'ZABLOKOWANY', type: 'inhibited' }
        }
      },
      {
        id: 'soma_pyramidal',
        label: 'Soma Komórki Piramidowej',
        sublabel: 'Strefa inicjacji iglicy (AIS)',
        type: 'scaffold',
        x: 420,
        y: 380,
        color: '#334155',
        activeSteps: [2, 3],
        stepStateDescriptions: {
          1: { state: 'Dendrytyczne pobudzenie przez AMPA', badge: 'DEPOLARYZACJA', type: 'active' },
          2: { state: 'Zagrożenie niekontrolowaną salwą', badge: 'RYZYKO DRGAWEK', type: 'active' },
          3: { state: 'Prąd Cl⁻ obniża oporność błony: bocznikowanie wygasza potencjał', badge: 'BOCZNIKOWANIE (SHUNT)', type: 'inhibited' },
          4: { state: 'Przywrócenie idealnej równowagi E/I (30-80 Hz)', badge: 'RYTM GAMMA OK', type: 'active' }
        }
      }
    ],
    flowPaths: [
      // Glutamate exocytosis from terminal to PV+
      {
        id: 'flow_glu_pv',
        label: 'Wyrzut glutaminianu na interneuron PV+',
        flowType: 'molecule_movement',
        substance: 'glutamate',
        d: 'M 160,70 L 160,110',
        particleColor: '#fbbf24',
        particleSymbol: 'Glu',
        particleCount: 6,
        speedSec: 1.5,
        activeSteps: [1, 2],
        description: 'Pęcherzyki synaptyczne uwalniają kwanty kwasu glutaminowego'
      },
      // Fast inward current in PV+
      {
        id: 'flow_na_pv',
        label: 'Dokomórkowy prąd pobudzający w komórce koszyczkowej',
        flowType: 'ion_flow',
        substance: 'ca2',
        d: 'M 160,140 L 160,260 Q 250,260 380,100',
        particleColor: '#f97316',
        particleSymbol: 'Na⁺',
        particleCount: 7,
        speedSec: 1.2,
        activeSteps: [2],
        description: 'Brak podjednostki GluA2 pozwala na natychmiastowy prąd wyzwalający potencjał czynnościowy'
      },
      // GABA exocytosis onto pyramidal soma
      {
        id: 'flow_gaba_soma',
        label: 'Uwalnianie GABA z interneuronu PV+ na somę piramidy',
        flowType: 'molecule_movement',
        substance: 'gaba',
        d: 'M 420,95 L 420,150',
        particleColor: '#34d399',
        particleSymbol: 'GABA',
        particleCount: 8,
        speedSec: 1.4,
        activeSteps: [2, 3],
        description: 'Kwantowy wyrzut GABA w strefie okołosomatycznej komórki piramidowej'
      },
      // Chloride influx (shunting current)
      {
        id: 'flow_cl_shunt',
        label: 'Dokomórkowy prąd Cl⁻ (bocznikowanie shunting)',
        flowType: 'ion_flow',
        substance: 'cl',
        d: 'M 420,180 L 420,350',
        particleColor: '#06b6d4',
        particleSymbol: 'Cl⁻',
        particleCount: 10,
        speedSec: 1.1,
        activeSteps: [3],
        description: 'Jony chlorkowe gwałtownie obniżają oporność wejściową błony, bocznikując EPSP'
      },
      // Spillover to presynaptic brake
      {
        id: 'flow_spillover',
        label: 'Dyfuzja obwodowa (Spillover) do receptorów presynaptycznych',
        flowType: 'molecule_movement',
        substance: 'gaba',
        d: 'M 440,150 Q 530,120 600,80',
        particleColor: '#a78bfa',
        particleSymbol: 'GABA',
        particleCount: 5,
        speedSec: 2.1,
        activeSteps: [3, 4],
        description: 'Nadmiar neurotransmitera dociera do presynaptycznych receptorów GABA_B i mGluR2/3'
      },
      // G-beta-gamma blocking presynaptic Cav2
      {
        id: 'flow_bg_cav',
        label: 'Dimer Gβγ blokuje por wapniowy Cav2.1',
        flowType: 'translocation',
        substance: 'g_protein',
        d: 'M 620,90 L 620,170',
        particleColor: '#e11d48',
        particleSymbol: 'Gβγ',
        particleCount: 5,
        speedSec: 1.6,
        activeSteps: [4],
        description: 'Uwolniony heterodimer Gβγ wiąże pętlę podjednostki α1 Cav2.1 wyłączając napływ Ca²⁺'
      }
    ],
    downstreamEffectors: [
      {
        id: 'eff_pv_firing',
        name: 'Wyładowanie Interneuronu PV+',
        type: 'Kanał Jonowy',
        unit: 'Hz (częstotliwość)',
        stepReadouts: {
          1: { valuePercent: 20, displayValue: '20 Hz', status: 'Docierający prąd AMPA', state: 'neutral' },
          2: { valuePercent: 95, displayValue: '180 Hz', status: 'Salwa fast-spiking PV+', state: 'active' },
          3: { valuePercent: 85, displayValue: '140 Hz', status: 'Podtrzymana oscylacja', state: 'active' },
          4: { valuePercent: 30, displayValue: '35 Hz', status: 'Powrót do poziomu bazowego', state: 'neutral' }
        }
      },
      {
        id: 'eff_gaba_a_conductance',
        name: 'Przewodnictwo Chlorkowe GABA_A',
        type: 'Kanał Jonowy',
        unit: 'nS (prąd Cl-)',
        stepReadouts: {
          1: { valuePercent: 5, displayValue: '2 nS', status: 'Spoczynkowe', state: 'neutral' },
          2: { valuePercent: 35, displayValue: '18 nS', status: 'Narastanie w szczelinie', state: 'primed' },
          3: { valuePercent: 98, displayValue: '85 nS', status: 'Masywny prąd bocznikujący Cl⁻', state: 'open' },
          4: { valuePercent: 25, displayValue: '12 nS', status: 'Wygaszanie desensytyzacyjne', state: 'closed' }
        }
      },
      {
        id: 'eff_cav_influx',
        name: 'Presynaptyczny Napływ Ca²⁺ (Cav2.1)',
        type: 'Kanał Jonowy',
        unit: '% wydajności wyrzutu',
        stepReadouts: {
          1: { valuePercent: 95, displayValue: '95%', status: 'Maksymalny napływ wapnia', state: 'open' },
          2: { valuePercent: 85, displayValue: '85%', status: 'Utrzymana exocytoza', state: 'open' },
          3: { valuePercent: 60, displayValue: '60%', status: 'Początek wiązania Gβγ', state: 'neutral' },
          4: { valuePercent: 12, displayValue: '12%', status: 'Pełna blokada przez Gβγ (Hamulec)', state: 'inhibited' }
        }
      },
      {
        id: 'eff_ei_ratio',
        name: 'Wskaźnik Równowagi E/I',
        type: 'Białko Regulatorowe',
        unit: 'Wskaźnik stabilności',
        stepReadouts: {
          1: { valuePercent: 88, displayValue: 'E >> I', status: 'Dominacja wzbudzenia glutaminianu', state: 'active' },
          2: { valuePercent: 65, displayValue: 'E > I', status: 'Rekrutacja interneuronów koszyczkowych', state: 'active' },
          3: { valuePercent: 50, displayValue: 'E ≈ I', status: 'Idealna koordynacja czasowa (1-2 ms)', state: 'active' },
          4: { valuePercent: 48, displayValue: 'Zabezpieczona', status: 'Prewencja wyładowań padaczkowych', state: 'neutral' }
        }
      }
    ],
    synapticMetricsByStep: {
      1: { membranePotentialMv: -62, calciumIntracellularNm: 180, netSynapticState: 'Gwałtowny impuls glutaminianowy piramidy', clinicalNote: 'Brak szybkiej odpowiedzi PV+ stwarza ryzyko mikronapadów drgawkowych.' },
      2: { membranePotentialMv: -50, calciumIntracellularNm: 310, netSynapticState: 'Ultraszybkie wyładowanie interneuronów PV+ (CP-AMPA)', clinicalNote: 'Deficyt CP-AMPA na PV+ koreluje z objawami poznawczymi w schizofrenii.' },
      3: { membranePotentialMv: -71, calciumIntracellularNm: 120, netSynapticState: 'Okołosomatyczne bocznikowanie Cl- wycina szum i zawęża okno iglicy', clinicalNote: 'Podstawa powstawania rytmu gamma (40 Hz) niezbędnego dla pamięci roboczej.' },
      4: { membranePotentialMv: -69, calciumIntracellularNm: 75, netSynapticState: 'Presynaptyczny hamulec (GABA_B/mGluR) gasi salwę', clinicalNote: 'Baklofen i agonisty mGluR2 wykazują działanie przeciwpadaczkowe.' }
    }
  },

  // 3. RETROGRADE ENDOCANNABINOID
  retrograde_endocannabinoid: {
    cascadeId: 'retrograde_endocannabinoid',
    canvasHeight: 520,
    cleftY: 220,
    nodes: [
      {
        id: 'rec_nmda_spine',
        label: 'Receptor NMDA / mGluR1',
        sublabel: 'Gęstość postsynaptyczna',
        type: 'receptor',
        x: 180,
        y: 280,
        color: '#f59e0b',
        activeSteps: [1],
        stepStateDescriptions: {
          1: { state: 'Masywny napływ Ca²⁺ lub aktywacja Gαq', badge: 'WYBUCH Ca²⁺', type: 'open' },
          2: { state: 'Podtrzymana wysoka mikroskopowa domena Ca²⁺', badge: 'Ca²⁺ AKTYWNY', type: 'active' },
          3: { state: 'Powolny powrót do normy', badge: 'REPOLARYZACJA', type: 'neutral' },
          4: { state: 'Zabezpieczenie przed ekscytotoksycznością', badge: 'SUKCES DSE', type: 'neutral' }
        }
      },
      {
        id: 'enzyme_dagla',
        label: 'Lipaza DAGLα',
        sublabel: 'Błona postsynaptyczna',
        type: 'enzyme',
        x: 360,
        y: 300,
        color: '#10b981',
        activeSteps: [1, 2],
        stepStateDescriptions: {
          1: { state: 'Aktywacja katalityczna przez Ca²⁺ i DAG', badge: 'AKTYWACJA', type: 'active' },
          2: { state: 'Synteza 2-Arachidonoiloglicerolu (2-AG) na żądanie', badge: 'SYNTEZA 2-AG', type: 'active' },
          3: { state: 'Zakończenie syntezy (brak magazynowania)', badge: 'SPOCZYNEK', type: 'neutral' },
          4: { state: 'Inaktywacja enzymu', badge: 'SPOCZYNEK', type: 'neutral' }
        }
      },
      {
        id: 'cleft_2ag',
        label: 'Dyfuzja Retrogradna 2-AG',
        sublabel: 'Szczelina synaptyczna (~25 nm)',
        type: 'messenger',
        x: 360,
        y: 200,
        color: '#84cc16',
        activeSteps: [2, 3],
        stepStateDescriptions: {
          1: { state: 'Brak wolnego liganda', badge: 'BRAK 2-AG', type: 'neutral' },
          2: { state: 'Lipid 2-AG przenika przez błonę do szczeliny', badge: 'PRZENIKANIE WSTECZNE', type: 'active' },
          3: { state: 'Dyfuzja retrogradna ku górze do kolbki presynaptycznej', badge: 'DYFUZJA WSTECZNA', type: 'active' },
          4: { state: 'Degradacja enzymatyczna przez MAGL w kolbce', badge: 'ROZKŁAD MAGL', type: 'neutral' }
        }
      },
      {
        id: 'rec_cb1_pre',
        label: 'Presynaptyczny Receptor CB1',
        sublabel: 'Sprzężony z Gi/o (Kolbka)',
        type: 'receptor',
        x: 360,
        y: 100,
        color: '#059669',
        activeSteps: [3, 4],
        stepStateDescriptions: {
          1: { state: 'Spoczynkowy receptor 7TM', badge: 'SPOCZYNEK', type: 'neutral' },
          2: { state: 'Wyczuwanie nadpływającego 2-AG', badge: 'WIĄZANIE LIGANDA', type: 'primed' },
          3: { state: 'Związanie 2-AG: wymiana GDP na GTP w Gi', badge: 'DYSOCJACJA Gi', type: 'active' },
          4: { state: 'Uwolnione dimery Gβγ migrują do kanałów Cav2', badge: 'SYGNAŁ Gβγ', type: 'active' }
        }
      },
      {
        id: 'chan_cav_pre_cb1',
        label: 'Kanał Wapniowy Cav2.1 / Cav2.2',
        sublabel: 'Strefa aktywna uwalniania SNARE',
        type: 'channel',
        x: 540,
        y: 100,
        color: '#ef4444',
        activeSteps: [1, 4],
        stepStateDescriptions: {
          1: { state: 'Aktywny napływ Ca²⁺ podtrzymujący wyrzut', badge: 'OTWARTY', type: 'open' },
          2: { state: 'Prąd wapniowy nadal obecny', badge: 'OTWARTY', type: 'open' },
          3: { state: 'Dimer Gβγ zbliża się do pętli I-II podjednostki α1', badge: 'WSTĘPNA BLOKADA', type: 'inhibited' },
          4: { state: 'Całkowita blokada napływu Ca²⁺: zatrzymanie fuzji SNARE', badge: 'ZABLOKOWANY (DSI/DSE)', type: 'inhibited' }
        }
      },
      {
        id: 'vesicles_snare',
        label: 'Pęcherzyki Synaptyczne SNARE',
        sublabel: 'Kolbka presynaptyczna',
        type: 'organelle',
        x: 200,
        y: 80,
        color: '#6366f1',
        activeSteps: [1],
        stepStateDescriptions: {
          1: { state: 'Aktywna exocytoza neurotransmitera', badge: 'WYRZUT', type: 'active' },
          2: { state: 'Spowolnienie exocytozy', badge: 'SPADEK', type: 'neutral' },
          3: { state: 'Brak lokalnej mikrodomeny Ca²⁺', badge: 'ZATRZYMANIE', type: 'inhibited' },
          4: { state: 'Cisza synaptyczna (Depolarization-induced Suppression)', badge: 'WYCISZONA', type: 'inhibited' }
        }
      }
    ],
    flowPaths: [
      // Postsynaptic Ca2+ influx activating DAGLa
      {
        id: 'flow_post_ca',
        label: 'Postsynaptyczny wybuch Ca²⁺ aktywujący DAGLα',
        flowType: 'ion_flow',
        substance: 'ca2',
        d: 'M 180,310 Q 270,350 340,320',
        particleColor: '#fbbf24',
        particleSymbol: 'Ca²⁺',
        particleCount: 7,
        speedSec: 1.4,
        activeSteps: [1, 2],
        description: 'Jony wapnia z NMDA stymulują domenę katalityczną lipazy DAGLα'
      },
      // 2-AG Retrograde stream (UPWARDS across the cleft!)
      {
        id: 'flow_2ag_retrograde',
        label: 'WSTECZNY PRZEPŁYW 2-AG (Retrograde Messenger)',
        flowType: 'retrograde',
        substance: '2ag',
        d: 'M 360,280 L 360,130',
        particleColor: '#84cc16',
        particleSymbol: '2-AG',
        particleCount: 8,
        speedSec: 1.6,
        activeSteps: [2, 3],
        description: 'Lipofilny 2-AG dyfunduje WSTECZNIE przez szczelinę synaptyczną ku kolbce presynaptycznej'
      },
      // Presynaptic G-beta-gamma translocation to Cav2
      {
        id: 'flow_gbetagamma_cb1',
        label: 'Translokacja Gβγ do kanału wapniowego Cav2',
        flowType: 'translocation',
        substance: 'g_protein',
        d: 'M 395,100 L 515,100',
        particleColor: '#f43f5e',
        particleSymbol: 'Gβγ',
        particleCount: 6,
        speedSec: 1.5,
        activeSteps: [3, 4],
        description: 'Uwolniony dimer Gβγ z CB1 zamyka bramkę napięciową kanału Cav2.1'
      }
    ],
    downstreamEffectors: [
      {
        id: 'eff_dagla_synth',
        name: 'Synteza 2-AG przez DAGLα',
        type: 'Enzym',
        unit: 'pmol / mg białka',
        stepReadouts: {
          1: { valuePercent: 40, displayValue: 'Aktywacja Ca²⁺', status: 'Start kaskady', state: 'primed' },
          2: { valuePercent: 98, displayValue: 'Maks. synteza', status: 'Gwałtowne uwalnianie 2-AG', state: 'active' },
          3: { valuePercent: 60, displayValue: 'Faza dyfuzji', status: 'Wygaszanie syntezy', state: 'neutral' },
          4: { valuePercent: 10, displayValue: 'Rozkład przez MAGL', status: 'Stan podstawowy', state: 'neutral' }
        }
      },
      {
        id: 'eff_cb1_gi_active',
        name: 'Aktywacja Presynaptyczna CB1',
        type: 'Białko Regulatorowe',
        unit: '% zajętych receptorów',
        stepReadouts: {
          1: { valuePercent: 5, displayValue: '5%', status: 'Spoczynek', state: 'neutral' },
          2: { valuePercent: 30, displayValue: '30%', status: 'Wiązanie 2-AG', state: 'primed' },
          3: { valuePercent: 95, displayValue: '95%', status: 'Maksymalny sygnał Gi/o', state: 'active' },
          4: { valuePercent: 80, displayValue: '80%', status: 'Trwałe zablokowanie Cav2', state: 'active' }
        }
      },
      {
        id: 'eff_cav_pre_block',
        name: 'Inhibicja Kanałów Wapniowych Cav2',
        type: 'Kanał Jonowy',
        unit: '% zahamowania napływu Ca²',
        stepReadouts: {
          1: { valuePercent: 0, displayValue: '0%', status: 'Pełny napływ Ca²⁺ do kolbki', state: 'open' },
          2: { valuePercent: 10, displayValue: '10%', status: 'Brak wpływu', state: 'open' },
          3: { valuePercent: 65, displayValue: '65%', status: 'Związanie Gβγ', state: 'inhibited' },
          4: { valuePercent: 92, displayValue: '92%', status: 'Zatrzymanie napływu Ca²⁺ (DSI/DSE)', state: 'inhibited' }
        }
      },
      {
        id: 'eff_transmitter_release',
        name: 'Wyrzut Neurotransmitera (SNARE)',
        type: 'Kanał Jonowy',
        unit: '% uwalniania kwantowego',
        stepReadouts: {
          1: { valuePercent: 100, displayValue: '100%', status: 'Maksymalna transmisja', state: 'active' },
          2: { valuePercent: 90, displayValue: '90%', status: 'Transmisja aktywna', state: 'active' },
          3: { valuePercent: 40, displayValue: '40%', status: 'Gwałtowne tłumienie', state: 'inhibited' },
          4: { valuePercent: 8, displayValue: '8%', status: 'Cisza synaptyczna (DSI/DSE)', state: 'inhibited' }
        }
      }
    ],
    synapticMetricsByStep: {
      1: { membranePotentialMv: -45, calciumIntracellularNm: 850, netSynapticState: 'Silna postsynaptyczna depolaryzacja (wyzwalacz DSI/DSE)', clinicalNote: 'Mechanizm ochrony przed uszkodzeniem ekscytotoksycznym neuronu.' },
      2: { membranePotentialMv: -55, calciumIntracellularNm: 520, netSynapticState: 'Synteza 2-AG na żądanie przez DAGLα', clinicalNote: 'Endokannabinoidy nie są gromadzone w pęcherzykach lecz syntetyzowane de novo.' },
      3: { membranePotentialMv: -65, calciumIntracellularNm: 220, netSynapticState: 'Wsteczna dyfuzja 2-AG do presynaptycznego receptora CB1', clinicalNote: 'Kannabinoidy (THC, CBD) modulują ten mechanizm w padaczce i bólu neuropatycznym.' },
      4: { membranePotentialMv: -72, calciumIntracellularNm: 85, netSynapticState: 'Presynaptyczne wyłączenie Cav2: zablokowanie wyrzutu pęcherzyków', clinicalNote: 'W synapsach GABA następuje DSI (odhamowanie), w synapsach Glu – DSE (ochrona).' }
    }
  },

  // 4. GQ / PLC / M-CURRENT
  gq_plc_m_current: {
    cascadeId: 'gq_plc_m_current',
    canvasHeight: 520,
    cleftY: 130,
    nodes: [
      {
        id: 'rec_gq',
        label: 'Receptor Gq (M1 / 5-HT2A)',
        sublabel: 'GPCR Gαq/11',
        type: 'receptor',
        x: 160,
        y: 110,
        color: '#ec4899',
        activeSteps: [1],
        stepStateDescriptions: {
          1: { state: 'Związanie agonisty, wymiana GDP->GTP w Gαq', badge: 'AKTYWACJA Gq', type: 'active' },
          2: { state: 'Gαq stymuluje domenę katalityczną PLCβ', badge: 'SYGNAŁ PLC', type: 'active' },
          3: { state: 'Utrzymana stymulacja', badge: 'AKTYWNY', type: 'active' },
          4: { state: 'Wygaszanie przez RGS', badge: 'WYGASZENIE', type: 'neutral' }
        }
      },
      {
        id: 'enzyme_plcb',
        label: 'Fosfolipaza C-β (PLCβ)',
        sublabel: 'Błona postsynaptyczna',
        type: 'enzyme',
        x: 320,
        y: 180,
        color: '#8b5cf6',
        activeSteps: [1, 2],
        stepStateDescriptions: {
          1: { state: 'Związanie Gαq-GTP z pętlą enzymu', badge: 'DOKOWANIE', type: 'primed' },
          2: { state: 'Hydroliza błonowego PIP2 do IP3 i DAG', badge: 'HYDROLIZA PIP2', type: 'active' },
          3: { state: 'Spadek puli PIP2 w błonie (<15%)', badge: 'ZUBOŻENIE PIP2', type: 'active' },
          4: { state: 'Powrót do poziomu podstawowego', badge: 'SPOCZYNEK', type: 'neutral' }
        }
      },
      {
        id: 'chan_kv7_m',
        label: 'Kanał Kv7.2 / Kv7.3 (KCNQ)',
        sublabel: 'Generujący prąd M (Potasowy)',
        type: 'channel',
        x: 520,
        y: 120,
        color: '#06b6d4',
        activeSteps: [2, 3],
        stepStateDescriptions: {
          1: { state: 'Konstytutywnie otwarty dzięki obecności PIP2', badge: 'OTWARTY (Prąd M)', type: 'open' },
          2: { state: 'Utrata kofaktora PIP2 oraz fosforylacja przez PKC', badge: 'ZAMYKANIE', type: 'inhibited' },
          3: { state: 'ZAMKNIĘTY POR: zanik prądu K⁺, oporność rośnie dramatycznie', badge: 'ZAMKNIĘTY (BURST)', type: 'closed' },
          4: { state: 'Stopniowa resynteza PIP2 otwiera kanał', badge: 'RESYNTEZA', type: 'neutral' }
        }
      },
      {
        id: 'organelle_er',
        label: 'Siateczka Śródplazmatyczna (ER)',
        sublabel: 'Magazyn jonów wapnia Ca²⁺',
        type: 'organelle',
        x: 320,
        y: 360,
        color: '#0284c7',
        activeSteps: [2, 4],
        stepStateDescriptions: {
          1: { state: 'Zmagazynowany Ca²⁺ w świetle ER (SERCA aktywna)', badge: 'PEŁNY MAGAZYN', type: 'neutral' },
          2: { state: 'IP3 dyfunduje w cytozolu ku receptorom IP3R', badge: 'NAPŁYW IP3', type: 'primed' },
          3: { state: 'Wiązanie IP3 z kanałem IP3R', badge: 'OTWARCIE IP3R', type: 'open' },
          4: { state: 'Masywny wyrzut Ca²⁺ do cytozolu (fala wapniowa)', badge: 'FALA Ca²⁺', type: 'active' }
        }
      },
      {
        id: 'enzyme_pkc',
        label: 'Kinaza Białkowa C (PKC)',
        sublabel: 'Aktywowana przez DAG + Ca²⁺',
        type: 'enzyme',
        x: 180,
        y: 280,
        color: '#f59e0b',
        activeSteps: [3, 4],
        stepStateDescriptions: {
          1: { state: 'Spoczynkowa w cytozolu', badge: 'SPOCZYNEK', type: 'neutral' },
          2: { state: 'DAG w błonie rekrutuje domenę C1 PKC', badge: 'REKRUTACJA DAG', type: 'primed' },
          3: { state: 'Ca²⁺ aktywuje domenę C2: pełna aktywność enzymu', badge: 'AKTYWNA PKC', type: 'active' },
          4: { state: 'Fosforylacja Kv7 i receptorów AMPA', badge: 'FOSFORYLACJA', type: 'active' }
        }
      }
    ],
    flowPaths: [
      // Galpha-q translocation to PLC
      {
        id: 'flow_gq_plc',
        label: 'Translokacja Gαq do PLCβ',
        flowType: 'translocation',
        substance: 'g_protein',
        d: 'M 185,135 Q 240,165 300,180',
        particleColor: '#ec4899',
        particleSymbol: 'Gαq',
        particleCount: 5,
        speedSec: 1.6,
        activeSteps: [1, 2],
        description: 'Gαq-GTP aktywuje domenę katalityczną fosfolipazy C-β'
      },
      // PIP2 hydrolysis into IP3 (streaming to ER)
      {
        id: 'flow_ip3_er',
        label: 'Strumień cząsteczek IP3 do kanałów IP3R w siateczce ER',
        flowType: 'molecule_movement',
        substance: 'ip3',
        d: 'M 320,210 L 320,335',
        particleColor: '#38bdf8',
        particleSymbol: 'IP₃',
        particleCount: 7,
        speedSec: 1.3,
        activeSteps: [2, 3, 4],
        description: 'Rozpuszczalny IP3 dyfunduje w cytozolu i wiąże kanały IP3R na błonie ER'
      },
      // Calcium surge out of ER
      {
        id: 'flow_er_ca_surge',
        label: 'Masywny wyrzut Ca²⁺ z ER do cytozolu',
        flowType: 'ion_flow',
        substance: 'ca2',
        d: 'M 350,350 Q 420,300 400,240',
        particleColor: '#facc15',
        particleSymbol: 'Ca²⁺',
        particleCount: 9,
        speedSec: 1.1,
        activeSteps: [4],
        description: 'Jony wapnia zalewają dendryt, aktywując kinazę CaMKII oraz PKC'
      },
      // K+ efflux cessation at Kv7 (M-current blocked)
      {
        id: 'flow_k_m_current',
        label: 'Wypływ jonów K⁺ (zamknięty w kroku 3)',
        flowType: 'ion_flow',
        substance: 'k',
        d: 'M 520,150 L 520,40',
        particleColor: '#a855f7',
        particleSymbol: 'K⁺',
        particleCount: 5,
        speedSec: 2.0,
        activeSteps: [1], // only open in step 1! In steps 2 & 3 it closes!
        description: 'Wypływ K⁺ stabilizuje potencjał spoczynkowy; zamknięcie kanału wywołuje wyładowania salwowe'
      }
    ],
    downstreamEffectors: [
      {
        id: 'eff_plcb_activity',
        name: 'Aktywność PLCβ (Hydroliza PIP2)',
        type: 'Enzym',
        unit: '% maks. szybkości Vmax',
        stepReadouts: {
          1: { valuePercent: 75, displayValue: '75%', status: 'Wiązanie Gαq', state: 'active' },
          2: { valuePercent: 98, displayValue: '98%', status: 'Maksymalne cięcie PIP2', state: 'active' },
          3: { valuePercent: 65, displayValue: '65%', status: 'Zubożenie substratu', state: 'neutral' },
          4: { valuePercent: 20, displayValue: '20%', status: 'Powrót do normy', state: 'neutral' }
        }
      },
      {
        id: 'eff_pip2_membrane',
        name: 'Stężenie Błonowego PIP2',
        type: 'Białko Regulatorowe',
        unit: '% puli wyjściowej',
        stepReadouts: {
          1: { valuePercent: 100, displayValue: '100%', status: 'Optymalne stężenie w błonie', state: 'neutral' },
          2: { valuePercent: 40, displayValue: '40%', status: 'Szybki spadek przez PLCβ', state: 'inhibited' },
          3: { valuePercent: 12, displayValue: '12%', status: 'Krytyczny deficyt PIP2', state: 'inhibited' },
          4: { valuePercent: 35, displayValue: '35%', status: 'Resynteza przez kinazy lipidowe', state: 'neutral' }
        }
      },
      {
        id: 'eff_kv7_conductance',
        name: 'Prąd Potasowy M (Kanał Kv7)',
        type: 'Kanał Jonowy',
        unit: 'pS (Przewodnictwo K+)',
        stepReadouts: {
          1: { valuePercent: 95, displayValue: '100% Otwarty', status: 'Stabilizacja hiperpolaryzacyjna', state: 'open' },
          2: { valuePercent: 45, displayValue: '45% Zamyka się', status: 'Utrata wiązania PIP2', state: 'inhibited' },
          3: { valuePercent: 5, displayValue: 'ZAMKNIĘTY', status: 'Zanik prądu M: burst firing!', state: 'closed' },
          4: { valuePercent: 20, displayValue: '20% Zamknięty', status: 'Podtrzymana pobudliwość', state: 'closed' }
        }
      },
      {
        id: 'eff_er_ca_release',
        name: 'Cytozolowy Wzrost Ca²⁺ z ER',
        type: 'Kanał Jonowy',
        unit: 'nM [Ca2+]i',
        stepReadouts: {
          1: { valuePercent: 15, displayValue: '80 nM', status: 'Spoczynkowy poziom cytozolu', state: 'neutral' },
          2: { valuePercent: 30, displayValue: '150 nM', status: 'Otwieranie kanałów IP3R', state: 'primed' },
          3: { valuePercent: 70, displayValue: '480 nM', status: 'Narastanie fali wapniowej', state: 'active' },
          4: { valuePercent: 98, displayValue: '950 nM', status: 'Masywny pik wapniowy (ER rush)', state: 'active' }
        }
      }
    ],
    synapticMetricsByStep: {
      1: { membranePotentialMv: -70, calciumIntracellularNm: 80, ip3LevelUm: 0.1, netSynapticState: 'Pobudzenie receptora Gq (M1/5-HT2A)', clinicalNote: 'Leki cholinergiczne (ksanomelina) i psychodeliki (5-HT2A) aktywują tę oś.' },
      2: { membranePotentialMv: -64, calciumIntracellularNm: 150, ip3LevelUm: 1.8, netSynapticState: 'Gwałtowna hydroliza PIP2 do IP3 i DAG', clinicalNote: 'Deficyt PIP2 bezpośrednio zamyka kanały potasowe stabilizujące spoczynek.' },
      3: { membranePotentialMv: -54, calciumIntracellularNm: 480, ip3LevelUm: 2.6, netSynapticState: 'Zamknięcie kanałów M (Kv7): neuron przechodzi w salwy wyładowań', clinicalNote: 'Retygabina (lek przeciwpadaczkowy) otwiera kanały Kv7, przeciwdziałając temu stanowi.' },
      4: { membranePotentialMv: -52, calciumIntracellularNm: 950, ip3LevelUm: 1.2, netSynapticState: 'Wyrzut wapnia z ER aktywuje PKC, CaMKII i ekspresję genów', clinicalNote: 'Podstawa plastyczności korowej i zwiększonej synchronizacji sieciowej.' }
    }
  },

  // 5. GI/O - GIRK - CAV
  gio_girk_cav_pathway: {
    cascadeId: 'gio_girk_cav_pathway',
    canvasHeight: 520,
    cleftY: 130,
    nodes: [
      {
        id: 'rec_gio',
        label: 'Receptor Gi/o (GABA_B / MOR / D2)',
        sublabel: 'Heterotrimer Gαi-βγ',
        type: 'receptor',
        x: 180,
        y: 110,
        color: '#6366f1',
        activeSteps: [1],
        stepStateDescriptions: {
          1: { state: 'Związanie agonisty (baklofen, morfina), wymiana GDP->GTP', badge: 'DYSOCJACJA Gi/o', type: 'active' },
          2: { state: 'Rozdział ramion Gαi oraz dimeru Gβγ', badge: 'UWOLNIENIE Gβγ', type: 'active' },
          3: { state: 'Równoległe hamowanie postsynaptyczne i presynaptyczne', badge: 'HAMOWANIE', type: 'inhibited' },
          4: { state: 'Hydroliza GTP przez aktywność GTPazową Gαi', badge: 'REASOCJACJA', type: 'neutral' }
        }
      },
      {
        id: 'chan_girk',
        label: 'Kanał Potasowy GIRK (Kir3)',
        sublabel: 'Błona postsynaptyczna',
        type: 'channel',
        x: 360,
        y: 110,
        color: '#8b5cf6',
        activeSteps: [2],
        stepStateDescriptions: {
          1: { state: 'Zamknięty por potasowy', badge: 'ZAMKNIĘTY', type: 'closed' },
          2: { state: 'Bezpośrednie wiązanie 4 dimerów Gβγ: otwarcie poru K⁺', badge: 'OTWARTY (Wypływ K⁺)', type: 'open' },
          3: { state: 'Głęboka hiperpolaryzacja o 12-15 mV (wolny IPSP)', badge: 'HIPERPOLARYZACJA', type: 'active' },
          4: { state: 'Zamykanie po dysocjacji Gβγ', badge: 'ZAMYKANIE', type: 'closed' }
        }
      },
      {
        id: 'chan_cav_pre_gio',
        label: 'Presynaptyczny Kanał Cav2.1/Cav2.2',
        sublabel: 'Kolbka aksonalna',
        type: 'channel',
        x: 540,
        y: 110,
        color: '#ef4444',
        activeSteps: [3],
        stepStateDescriptions: {
          1: { state: 'Wysoka przewodność wapniowa', badge: 'NAPŁYW Ca²⁺', type: 'open' },
          2: { state: 'Dimer Gβγ dokuje do pętli cytoplazmatycznej', badge: 'WSTĘPNA BLOKADA', type: 'primed' },
          3: { state: 'Przesunięcie krzywej aktywacji: zablokowanie napływu Ca²⁺', badge: 'ZABLOKOWANY (-85%)', type: 'inhibited' },
          4: { state: 'Wygaszenie blokady', badge: 'POWRÓT', type: 'neutral' }
        }
      },
      {
        id: 'enzyme_ac_gio',
        label: 'Cyklaza Adenylanowa (AC)',
        sublabel: 'Enzym błonowy',
        type: 'enzyme',
        x: 180,
        y: 280,
        color: '#06b6d4',
        activeSteps: [4],
        stepStateDescriptions: {
          1: { state: 'Podstawowa synteza cAMP', badge: 'BAZOWA', type: 'neutral' },
          2: { state: 'Podjednostka Gαi-GTP migruje do domeny C1/C2', badge: 'MIGRACJA Gαi', type: 'primed' },
          3: { state: 'Zahamowanie katalityczne', badge: 'HAMOWANIE', type: 'inhibited' },
          4: { state: 'Całkowity spadek cAMP: wygaszenie aktywności kinazy PKA', badge: 'SPADEK cAMP', type: 'inhibited' }
        }
      }
    ],
    flowPaths: [
      // Gbetagamma migration to GIRK
      {
        id: 'flow_bg_girk',
        label: 'Migracja dimeru Gβγ w błonie do kanału GIRK',
        flowType: 'translocation',
        substance: 'g_protein',
        d: 'M 215,115 L 325,115',
        particleColor: '#a855f7',
        particleSymbol: 'Gβγ',
        particleCount: 6,
        speedSec: 1.4,
        activeSteps: [1, 2],
        description: 'Dimer Gβγ ślizga się w dwuwarstwie lipidowej bezpośrednio do domen GIRK'
      },
      // Massive K+ efflux through GIRK
      {
        id: 'flow_k_girk_efflux',
        label: 'Masywny wypływ jonów K⁺ wywołujący hiperpolaryzację',
        flowType: 'ion_flow',
        substance: 'k',
        d: 'M 360,140 L 360,30',
        particleColor: '#8b5cf6',
        particleSymbol: 'K⁺',
        particleCount: 10,
        speedSec: 1.1,
        activeSteps: [2, 3],
        description: 'Jony K⁺ uciekają z komórki zgodnie z gradientem stężeń, zbliżając potencjał do EK (-90 mV)'
      },
      // Gbetagamma to presynaptic Cav
      {
        id: 'flow_bg_cav_pre',
        label: 'Hamowanie presynaptycznego Cav2 przez Gβγ',
        flowType: 'translocation',
        substance: 'g_protein',
        d: 'M 390,115 L 505,115',
        particleColor: '#f43f5e',
        particleSymbol: 'Gβγ',
        particleCount: 5,
        speedSec: 1.6,
        activeSteps: [3],
        description: 'Dimer Gβγ blokuje otwarcie poru Cav2 przy fizjologicznym potencjale iglicowym'
      },
      // Gai migrating to AC
      {
        id: 'flow_gai_ac',
        label: 'Inaktywacja Cyklazy Adenylanowej przez Gαi',
        flowType: 'translocation',
        substance: 'g_protein',
        d: 'M 180,140 L 180,245',
        particleColor: '#38bdf8',
        particleSymbol: 'Gαi',
        particleCount: 5,
        speedSec: 1.8,
        activeSteps: [4],
        description: 'Gαi-GTP wyłącza syntezę cAMP w cytozolu'
      }
    ],
    downstreamEffectors: [
      {
        id: 'eff_girk_current',
        name: 'Prąd Potasowy GIRK (IK,ACh/GABA)',
        type: 'Kanał Jonowy',
        unit: 'pA (Prąd wychodzący K+)',
        stepReadouts: {
          1: { valuePercent: 5, displayValue: '0 pA', status: 'Kanał zamknięty', state: 'closed' },
          2: { valuePercent: 96, displayValue: '340 pA', status: 'Maksymalny wypływ K⁺ (Gβγ)', state: 'open' },
          3: { valuePercent: 88, displayValue: '290 pA', status: 'Utrzymana hiperpolaryzacja', state: 'open' },
          4: { valuePercent: 20, displayValue: '40 pA', status: 'Zamykanie poru', state: 'closed' }
        }
      },
      {
        id: 'eff_hyperpol_vm',
        name: 'Hiperpolaryzacja Błony ΔVm',
        type: 'Białko Regulatorowe',
        unit: 'mV względem spoczynku',
        stepReadouts: {
          1: { valuePercent: 0, displayValue: '0 mV', status: 'Potencjał spoczynkowy (-70 mV)', state: 'neutral' },
          2: { valuePercent: 85, displayValue: '-14 mV', status: 'Głęboki potencjał IPSP (do -84 mV)', state: 'active' },
          3: { valuePercent: 90, displayValue: '-15 mV', status: 'Pełne wyciszenie neuronu', state: 'active' },
          4: { valuePercent: 30, displayValue: '-4 mV', status: 'Powrót ku spoczynkowi', state: 'neutral' }
        }
      },
      {
        id: 'eff_cav_pre_suppression',
        name: 'Tłumienie Presynaptycznego Cav2',
        type: 'Kanał Jonowy',
        unit: '% redukcji napływu Ca2+',
        stepReadouts: {
          1: { valuePercent: 0, displayValue: '0%', status: 'Brak blokady', state: 'neutral' },
          2: { valuePercent: 25, displayValue: '25%', status: 'Początek wiązania Gβγ', state: 'primed' },
          3: { valuePercent: 86, displayValue: '86%', status: 'Maksymalna blokada wyrzutu', state: 'inhibited' },
          4: { valuePercent: 15, displayValue: '15%', status: 'Ustępowanie hamowania', state: 'neutral' }
        }
      },
      {
        id: 'eff_camp_pka_level',
        name: 'Stężenie cAMP & Aktywność PKA',
        type: 'Enzym',
        unit: '% poziomu podstawowego',
        stepReadouts: {
          1: { valuePercent: 100, displayValue: '100%', status: 'Poziom bazowy', state: 'neutral' },
          2: { valuePercent: 80, displayValue: '80%', status: 'Powolny spadek', state: 'neutral' },
          3: { valuePercent: 45, displayValue: '45%', status: 'Spadek syntezy cAMP', state: 'inhibited' },
          4: { valuePercent: 15, displayValue: '15%', status: 'Maksymalne wygaszenie PKA (Gαi)', state: 'inhibited' }
        }
      }
    ],
    synapticMetricsByStep: {
      1: { membranePotentialMv: -70, calciumIntracellularNm: 80, campLevelNm: 350, netSynapticState: 'Związanie agonisty z receptorem Gi/o (GABA_B, MOR, D2)', clinicalNote: 'Baklofen łagodzi spastyczność, opioidy blokują przewodnictwo nocyceptywne.' },
      2: { membranePotentialMv: -84, calciumIntracellularNm: 60, campLevelNm: 280, netSynapticState: 'Otwarcie kanałów GIRK przez Gβγ: głęboki wypływ K⁺', clinicalNote: 'GIRK stanowi fundament powolnego hamowania postsynaptycznego w całym mózgu.' },
      3: { membranePotentialMv: -83, calciumIntracellularNm: 45, campLevelNm: 150, netSynapticState: 'Presynaptyczna blokada Cav2: wygaszenie wyrzutu kwantowego', clinicalNote: 'Podwójny mechanizm: komórka postsynaptyczna staje się niewrażliwa, a presynapsa cicha.' },
      4: { membranePotentialMv: -74, calciumIntracellularNm: 50, campLevelNm: 65, netSynapticState: 'Gαi wyłącza cyklazę adenylanową (długotrwałe wygaszenie PKA)', clinicalNote: 'Trwałe obniżenie pobudliwości neuronu zapobiega neurotoksyczności.' }
    }
  },

  // 6. TRKB - BDNF - RTK
  trkb_bdnf_rtk_cascade: {
    cascadeId: 'trkb_bdnf_rtk_cascade',
    canvasHeight: 520,
    cleftY: 130,
    nodes: [
      {
        id: 'dimer_bdnf',
        label: 'Dimer Neurotrofiny BDNF',
        sublabel: 'Szczelina synaptyczna',
        type: 'messenger',
        x: 180,
        y: 40,
        color: '#ec4899',
        activeSteps: [1],
        stepStateDescriptions: {
          1: { state: 'Wiązanie do ektodomeny LRR receptora TrkB', badge: 'DOKOWANIE BDNF', type: 'active' },
          2: { state: 'Wymuszenie zbliżenia podjednostek kinazy', badge: 'DIMERYZACJA', type: 'active' },
          3: { state: 'Internalizacja kompleksu liganda', badge: 'ENDOCYTOZA', type: 'neutral' },
          4: { state: 'Sygnalizacja w endosomach sygnałowych', badge: 'SYGNAŁ RETRO', type: 'active' }
        }
      },
      {
        id: 'rec_trkb',
        label: 'Receptor RTK TrkB (Kinaza)',
        sublabel: 'Błona postsynaptyczna',
        type: 'receptor',
        x: 180,
        y: 130,
        color: '#8b5cf6',
        activeSteps: [1, 2, 4],
        stepStateDescriptions: {
          1: { state: 'Autofosforylacja pętli aktywacyjnej Tyr701/Tyr706', badge: 'AUTOFOSFORYLACJA', type: 'phosphorylated' },
          2: { state: 'Fosforylacja Tyr515: rekrutacja kompleksu Shc-Grb2-SOS', badge: 'Tyr515-P (Shc)', type: 'phosphorylated' },
          3: { state: 'Aktywacja szlaku PI3K / Akt przez p-Tyr515', badge: 'Akt / mTORC1', type: 'active' },
          4: { state: 'Fosforylacja Tyr816: rekrutacja PLCγ1 i mobilizacja Ca²⁺', badge: 'Tyr816-P (PLCγ)', type: 'phosphorylated' }
        }
      },
      {
        id: 'path_mapk_erk',
        label: 'Szlak Ras - Raf - MEK1/2 - ERK1/2',
        sublabel: 'Kaskada kinazowa MAP',
        type: 'enzyme',
        x: 380,
        y: 200,
        color: '#f97316',
        activeSteps: [2],
        stepStateDescriptions: {
          1: { state: 'Spoczynkowe kinazy w cytozolu', badge: 'SPOCZYNEK', type: 'neutral' },
          2: { state: 'Sekwencyjna fosforylacja Ras->Raf->MEK->ERK1/2', badge: 'AKTYWACJA MAPK', type: 'active' },
          3: { state: 'Translokacja fosfo-ERK do jądra komórkowego', badge: 'MIGRACJA ERK', type: 'active' },
          4: { state: 'Fosforylacja czynnika CREB na Ser133', badge: 'CREB (ON)', type: 'phosphorylated' }
        }
      },
      {
        id: 'path_pi3k_akt_mtor',
        label: 'Kompleks PI3K / Akt - mTORC1',
        sublabel: 'Translacja w kolcu dendrytycznym',
        type: 'enzyme',
        x: 380,
        y: 320,
        color: '#06b6d4',
        activeSteps: [3],
        stepStateDescriptions: {
          1: { state: 'Zahamowanie przez TSC1/2', badge: 'SPOCZYNEK', type: 'neutral' },
          2: { state: 'Akt zdejmuje hamulec TSC, aktywując białko Rheb', badge: 'AKTYWACJA Rheb', type: 'primed' },
          3: { state: 'mTORC1 aktywuje p70S6K i 4E-BP1: lokalna translacja białek PSD', badge: 'SYNTEZA BIAŁEK PSD', type: 'active' },
          4: { state: 'Powiększenie główki kolca (L-LTP)', badge: 'REMODELING', type: 'active' }
        }
      },
      {
        id: 'target_plcg_camkii',
        label: 'Fosfolipaza C-γ1 & CaMKII',
        sublabel: 'Synergia z receptorem NMDA',
        type: 'enzyme',
        x: 180,
        y: 380,
        color: '#10b981',
        activeSteps: [4],
        stepStateDescriptions: {
          1: { state: 'PLCγ1 nieaktywna', badge: 'SPOCZYNEK', type: 'neutral' },
          2: { state: 'Wiązanie z fosfo-Tyr816 TrkB przez domenę SH2', badge: 'DOKOWANIE SH2', type: 'primed' },
          3: { state: 'Hydroliza PIP2 i wyrzut Ca²⁺', badge: 'WAPŃ', type: 'active' },
          4: { state: 'Autofosforylacja CaMKII Thr286 i fosforylacja GluA1 Ser831', badge: 'LTP UTRWALONE', type: 'active' }
        }
      }
    ],
    flowPaths: [
      // BDNF binding to TrkB
      {
        id: 'flow_bdnf_trkb',
        label: 'Wiązanie dimeru BDNF do TrkB',
        flowType: 'molecule_movement',
        substance: 'bdnf',
        d: 'M 180,65 L 180,110',
        particleColor: '#f472b6',
        particleSymbol: 'BDNF',
        particleCount: 5,
        speedSec: 1.6,
        activeSteps: [1],
        description: 'Dimer BDNF wiąże domenę pozakomórkową, wymuszając autofosforylację'
      },
      // Phospho-Tyr515 activating Ras/Raf/ERK
      {
        id: 'flow_trkb_mapk',
        label: 'Aktywacja kaskady Ras-Raf-MEK-ERK',
        flowType: 'translocation',
        substance: 'erk',
        d: 'M 215,150 Q 280,170 340,195',
        particleColor: '#fb923c',
        particleSymbol: 'ERK',
        particleCount: 6,
        speedSec: 1.4,
        activeSteps: [2],
        description: 'Kaskada kinaz MAP przekazuje sygnał proliferacji i transkrypcji wczesnych genów'
      },
      // Akt to mTORC1 protein synthesis
      {
        id: 'flow_akt_mtor',
        label: 'Sygnał Akt-mTORC1 (translacja dendrytyczna)',
        flowType: 'molecule_movement',
        substance: 'camp',
        d: 'M 215,170 Q 270,250 340,310',
        particleColor: '#38bdf8',
        particleSymbol: 'mTOR',
        particleCount: 6,
        speedSec: 1.5,
        activeSteps: [3],
        description: 'Kinaza mTORC1 stymuluje lokalną syntezę białek budulcowych kolca dendrytycznego'
      },
      // Phospho-Tyr816 to PLCg1 and CaMKII
      {
        id: 'flow_trkb_plcg',
        label: 'Sygnał PLCγ1 i potencjacja CaMKII',
        flowType: 'translocation',
        substance: 'g_protein',
        d: 'M 180,170 L 180,345',
        particleColor: '#34d399',
        particleSymbol: 'PLCγ',
        particleCount: 5,
        speedSec: 1.7,
        activeSteps: [4],
        description: 'Mobilizacja Ca²⁺ aktywuje kinazę CaMKII potęgującą przewodnictwo receptorów AMPA'
      }
    ],
    downstreamEffectors: [
      {
        id: 'eff_trkb_phospho',
        name: 'Autofosforylacja TrkB (Tyr515/816)',
        type: 'Kinaza',
        unit: '% aktywacji kinazy',
        stepReadouts: {
          1: { valuePercent: 95, displayValue: '95%', status: 'Maks. dimeryzacja i autofosforylacja', state: 'phosphorylated' },
          2: { valuePercent: 90, displayValue: '90%', status: 'Aktywność kinazy utrzymana', state: 'phosphorylated' },
          3: { valuePercent: 80, displayValue: '80%', status: 'Endocytoza sygnałowa', state: 'active' },
          4: { valuePercent: 70, displayValue: '70%', status: 'Fosforylacja PLCγ1', state: 'active' }
        }
      },
      {
        id: 'eff_erk_creb',
        name: 'Aktywność ERK1/2 & Fosforylacja CREB',
        type: 'Transkrypcja',
        unit: '% aktywnego p-ERK',
        stepReadouts: {
          1: { valuePercent: 15, displayValue: '15%', status: 'Stan spoczynkowy', state: 'neutral' },
          2: { valuePercent: 98, displayValue: '98%', status: 'Maksymalny szczyt kaskady MAPK', state: 'active' },
          3: { valuePercent: 85, displayValue: '85%', status: 'Translokacja do jądra', state: 'active' },
          4: { valuePercent: 92, displayValue: '92%', status: 'Fosforylacja CREB Ser133 (Arc, c-Fos)', state: 'phosphorylated' }
        }
      },
      {
        id: 'eff_mtor_translation',
        name: 'Translacja w Kolcu (mTORC1)',
        type: 'Białko Regulatorowe',
        unit: '% wskaźnika translacji',
        stepReadouts: {
          1: { valuePercent: 20, displayValue: '20%', status: 'Synteza podstawowa', state: 'neutral' },
          2: { valuePercent: 45, displayValue: '45%', status: 'Znoszenie hamulca TSC2', state: 'primed' },
          3: { valuePercent: 96, displayValue: '96%', status: 'Maksymalna translacja dendrytyczna', state: 'active' },
          4: { valuePercent: 88, displayValue: '88%', status: 'Budowa nowych rusztowań PSD-95', state: 'active' }
        }
      },
      {
        id: 'eff_spine_enlargement',
        name: 'Ekspansja Kolca Dendrytycznego (L-LTP)',
        type: 'Białko Regulatorowe',
        unit: 'Objętość główki kolca',
        stepReadouts: {
          1: { valuePercent: 100, displayValue: '1.0x', status: 'Objętość wyjściowa kolca', state: 'neutral' },
          2: { valuePercent: 110, displayValue: '1.1x', status: 'Przebudowa aktyny', state: 'neutral' },
          3: { valuePercent: 145, displayValue: '1.45x', status: 'Wbudowywanie nowych białek', state: 'active' },
          4: { valuePercent: 185, displayValue: '1.85x', status: 'Trwałe powiększenie główki (L-LTP)', state: 'active' }
        }
      }
    ],
    synapticMetricsByStep: {
      1: { membranePotentialMv: -68, calciumIntracellularNm: 90, netSynapticState: 'Dimeryzacja receptora TrkB przez dojrzały BDNF', clinicalNote: 'Ketamina i leki SSRI stymulują ekspresję i uwalnianie BDNF w hipokampie.' },
      2: { membranePotentialMv: -65, calciumIntracellularNm: 120, netSynapticState: 'Aktywacja kaskady kinaz MAP (Ras-ERK1/2): sygnał jądrowy', clinicalNote: 'ERK1/2 fosforyluje CREB, indukując czynniki neurotroficzne i przeżycie komórki.' },
      3: { membranePotentialMv: -60, calciumIntracellularNm: 160, netSynapticState: 'Akt aktywuje mTORC1: de novo synteza białek w dendrycie', clinicalNote: 'Zahamowanie mTOR (np. rapamycyną) całkowicie blokuje późną fazę pamięci (L-LTP).' },
      4: { membranePotentialMv: -50, calciumIntracellularNm: 420, netSynapticState: 'Synergia PLCγ1 z NMDA utrwala strukturę kolca i synaptogenezę', clinicalNote: 'Naczelny motor neuroplastyczności przeciwdziałający atrofii neuronów w depresji.' }
    }
  }
};
