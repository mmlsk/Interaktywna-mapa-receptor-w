import { CascadeNode, CascadeVisualData, FlowPath, getMessengerKineticProfile } from '../data/cascadeAnimationData';

export interface NodePredictiveKinetics {
  // Signal Latency
  localLatencyMs: number;
  formattedLocalLatency: string;
  cumulativeLatencyMs: number;
  formattedCumulativeLatency: string;
  latencyClass: 'ultrafast' | 'fast' | 'intermediate' | 'slow' | 'genomic';
  latencyClassLabel: string;

  // Predictive Activation Probability
  activationProbabilityPercent: number;
  activationPhase: 'peak_active' | 'forward_predicted' | 'primed' | 'refractory' | 'quiescent' | 'inhibited';
  activationPhaseLabel: string;
  activationProbabilityColor: string;

  // Biophysical Turnover & Constants
  biophysicalConstant: {
    symbol: string;
    value: string;
    description: string;
  };

  // Kinetic Role & Rate Limiting Status
  isRateLimiting: boolean;
  amplificationFactor: string;
  kineticRole: string;

  // Pathway Connection
  connectedPathsCount: number;
  activeInCurrentStep: boolean;
  currentStepStatus: {
    state: string;
    badge: string;
    type: 'active' | 'inhibited' | 'primed' | 'phosphorylated' | 'open' | 'closed' | 'neutral';
  };
}

/**
 * Known biophysical parameters database for canonical cascade nodes
 */
const NODE_BIOPHYSICAL_REGISTRY: Record<string, {
  baseLatencyMs: number;
  constantSymbol: string;
  constantValue: string;
  constantDesc: string;
  amplification: string;
  kineticRole: string;
  isRateLimiting: boolean;
}> = {
  // D1 / DARPP-32 Pathway
  rec_d1: {
    baseLatencyMs: 65,
    constantSymbol: 'Kd / EC50',
    constantValue: '25 nM / 40 nM',
    constantDesc: 'Powinowactwo dopaminy do receptora D1 sprzężonego z Gαolf',
    amplification: '1:12 (GPCR -> Gαolf)',
    kineticRole: 'Wyzwalacz Kaskady GPCR (Gs)',
    isRateLimiting: false
  },
  rec_d2: {
    baseLatencyMs: 50,
    constantSymbol: 'Kd (stan wysoki)',
    constantValue: '4.5 nM',
    constantDesc: 'Wysokie powinowactwo do Gi/o w komórkach prążkowia iMSN',
    amplification: '1:18 (GPCR -> Gαi)',
    kineticRole: 'Inhibitor Transdukcji Gi/o',
    isRateLimiting: false
  },
  rec_nmda: {
    baseLatencyMs: 12,
    constantSymbol: 'γ / P_open',
    constantValue: '50 pS / 0.65',
    constantDesc: 'Jednostkowe przewodnictwo poru Ca²⁺/Na⁺ po odblokowaniu Mg²⁺',
    amplification: '10⁶ jonów Ca²⁺/sek',
    kineticRole: 'Jonotropowy Wzmacniacz Ca²⁺',
    isRateLimiting: false
  },
  enzyme_ac5: {
    baseLatencyMs: 220,
    constantSymbol: 'k_cat / Km',
    constantValue: '100 s⁻¹ / 45 µM ATP',
    constantDesc: 'Kataliza syntezy cyklicznego AMP przez cyklazę AC5',
    amplification: '1:800 (AC5 -> cAMP)',
    kineticRole: 'Węzeł Wzmacniający Drugi Przekaźnik',
    isRateLimiting: true
  },
  enzyme_pka: {
    baseLatencyMs: 650,
    constantSymbol: 'k_cat / Ka',
    constantValue: '240 s⁻¹ / 200 nM cAMP',
    constantDesc: 'Kinetyka dysocjacji holoenzymu i fosforylacji substratów',
    amplification: '1:250 (Kinaza PKA -> Substraty)',
    kineticRole: 'Enzymatyczne Wąskie Gardło Kinazy',
    isRateLimiting: true
  },
  protein_darpp32: {
    baseLatencyMs: 380,
    constantSymbol: 'Ki (dla PP1)',
    constantValue: '1.0 nM (Thr34-P)',
    constantDesc: 'Subnanomolarne wiązanie i inhibicja fosfatazy białkowej 1',
    amplification: 'Bistabilny Przełącznik Progowy',
    kineticRole: 'Bistabilny Przełącznik Fosfo-Białkowy',
    isRateLimiting: true
  },
  enzyme_pp1: {
    baseLatencyMs: 420,
    constantSymbol: 'k_cat / Blokada',
    constantValue: '15 s⁻¹ / >95% hamowania',
    constantDesc: 'Defosforylacja receptorów NMDA i AMPA zniesiona przez Thr34-P',
    amplification: 'Brak defosforylacji (Potencjacja)',
    kineticRole: 'Wygaszona Fosfataza (Bramka LTP)',
    isRateLimiting: false
  },

  // D2 Gi/o & GIRK Pathway
  rec_d2_pre: {
    baseLatencyMs: 45,
    constantSymbol: 'Kd / k_on',
    constantValue: '2.5 nM / 1.2×10⁷ M⁻¹s⁻¹',
    constantDesc: 'Autoreceptor presynaptyczny regulujący zwrotny wyrzut DA',
    amplification: '1:15 (Sprzężenie Gi/o)',
    kineticRole: 'Presynaptyczny Autoreceptor Hamujący',
    isRateLimiting: false
  },
  rec_d2_post: {
    baseLatencyMs: 52,
    constantSymbol: 'Kd / EC50',
    constantValue: '4.8 nM / 15 nM',
    constantDesc: 'Postsynaptyczny receptor iMSN drogi pośredniej',
    amplification: '1:18 (Sprzężenie Gi/o)',
    kineticRole: 'Postsynaptyczny Przekaźnik Gi/o',
    isRateLimiting: false
  },
  g_protein_gio: {
    baseLatencyMs: 110,
    constantSymbol: 'k_GTP / t1/2',
    constantValue: '0.8 s⁻¹ / 120 ms',
    constantDesc: 'Wymiana nukleotydów GDP na GTP i rozpad heterotrimeru',
    amplification: '1:1 (Uwolnienie dimeru Gβγ)',
    kineticRole: 'Szybki Rozłącznik Membranowy',
    isRateLimiting: false
  },
  channel_girk: {
    baseLatencyMs: 22,
    constantSymbol: 'γ / E_K',
    constantValue: '35 pS / -90 mV',
    constantDesc: 'Prąd potasowy otwierany bezpośrednio przez 4 dimery Gβγ',
    amplification: '10⁵ jonów K⁺/sek (Hiperpolaryzacja)',
    kineticRole: 'Ultraszybki Bocznik Membranowy (Membrane-Delimited)',
    isRateLimiting: false
  },
  chan_cav_pre_gio: {
    baseLatencyMs: 38,
    constantSymbol: 'Inhibicja I_Ca',
    constantValue: '-85% napływu Ca²',
    constantDesc: 'Allosteryczna blokada bramki napięciowej Cav2.1 przez Gβγ',
    amplification: 'Wyciszenie exocytozy kwantowej',
    kineticRole: 'Presynaptyczny Hamulec Neurosekrecji',
    isRateLimiting: false
  },
  enzyme_ac_gio: {
    baseLatencyMs: 340,
    constantSymbol: 'Ki (Gαi-GTP)',
    constantValue: '18 nM',
    constantDesc: 'Bezpośrednie hamowanie domeny C1 cyklazy adenylanowej',
    amplification: '-90% poziomu cAMP',
    kineticRole: 'Enzymatyczny Wygaszacz PKA',
    isRateLimiting: true
  },

  // Gq / PLC / IP3 Pathway
  rec_gq: {
    baseLatencyMs: 60,
    constantSymbol: 'Kd / EC50',
    constantValue: '12 nM / 28 nM',
    constantDesc: 'Receptor metabotropowy Gq (5-HT2A / M1) aktywujący Gαq',
    amplification: '1:10 (GPCR -> Gαq)',
    kineticRole: 'Wyzwalacz Kaskady Gq/11',
    isRateLimiting: false
  },
  enzyme_plcb: {
    baseLatencyMs: 310,
    constantSymbol: 'k_cat / Vmax',
    constantValue: '45 s⁻¹ / 12 µM/s',
    constantDesc: 'Kataliza hydrolizy fosfatydyloinozytolo-4,5-bisfosforanu',
    amplification: '1:450 (PLCβ -> IP3 + DAG)',
    kineticRole: 'Enzymatyczne Wąskie Gardło Fosfolipazy',
    isRateLimiting: true
  },
  organelle_er: {
    baseLatencyMs: 160,
    constantSymbol: 'Gęstość IP3R / Strumień',
    constantValue: '18 / µm² | 1400 jonów/s',
    constantDesc: 'Otwarcie receptorów IP3R i wyrzut wapnia z magazynu ER',
    amplification: 'Masywna Fala Wapniowa (+600 nM)',
    kineticRole: 'Magazyn Wewnątrzkomórkowego Ca²⁺',
    isRateLimiting: false
  },
  chan_kv7_m: {
    baseLatencyMs: 42,
    constantSymbol: 'γ / P_open',
    constantValue: '15 pS / Zależne od PIP2',
    constantDesc: 'Prąd potasowy M stabilizujący próg pobudliwości neuronu',
    amplification: 'Zniesienie prądu M -> Wyładowania salwowe',
    kineticRole: 'Regulator Progu Pobudliwości (M-Current)',
    isRateLimiting: false
  },
  enzyme_pkc: {
    baseLatencyMs: 540,
    constantSymbol: 'Km / Ka',
    constantValue: '35 µM / DAG + Ca²⁺',
    constantDesc: 'Translacja do błony i fosforylacja kanałów przez PKC',
    amplification: '1:180 (Kinaza C -> Efektory)',
    kineticRole: 'Wielofunkcyjna Kinaza Błonowa',
    isRateLimiting: true
  },

  // TrkB - BDNF Pathway
  dimer_bdnf: {
    baseLatencyMs: 85,
    constantSymbol: 'Kd (TrkB)',
    constantValue: '1.5 nM',
    constantDesc: 'Powinowactwo neurotrofiny BDNF do ektodomeny receptora TrkB',
    amplification: '1:2 (Ligand -> Dimer)',
    kineticRole: 'Zewnątrzkomórkowy Dimer Neurotroficzny',
    isRateLimiting: false
  },
  rec_trkb: {
    baseLatencyMs: 240,
    constantSymbol: 'k_autofosfo',
    constantValue: '0.4 s⁻¹ (Tyr701/706)',
    constantDesc: 'Trans-autofosforylacja pętli katalitycznej kinazy tyrozynowej',
    amplification: 'Rekrutacja Shc-Grb2-SOS & PLCγ1',
    kineticRole: 'Receptorowa Kinaza Tyrozynowa (RTK)',
    isRateLimiting: true
  },
  path_mapk_erk: {
    baseLatencyMs: 2800,
    constantSymbol: 'Amplifikacja MAP / t_transl',
    constantValue: '10³-krotna / 3.5 s do jądra',
    constantDesc: 'Sekwencyjna kaskada Ras-Raf-MEK-ERK i translokacja jądrowa',
    amplification: '1:1000 (Fosforylacja CREB Ser133)',
    kineticRole: 'Kinazowe Wąskie Gardło Ekspresji Genów',
    isRateLimiting: true
  },
  path_pi3k_akt_mtor: {
    baseLatencyMs: 1450,
    constantSymbol: 'Vmax translacji',
    constantValue: '18 fmol/min w kolcu',
    constantDesc: 'Aktywacja p70S6K i 4E-BP1 przez mTORC1 w kolcu dendrytycznym',
    amplification: 'Lokalna Synteza Białek PSD-95 i AMPA',
    kineticRole: 'Translacyjny Węzeł Remodelingu Kolca',
    isRateLimiting: true
  },
  target_plcg_camkii: {
    baseLatencyMs: 820,
    constantSymbol: 'Autofosforylacja',
    constantValue: 'Thr286 (Autonomiczna CaMKII)',
    constantDesc: 'Fosforylacja podjednostki GluA1 Ser831 i utrwalenie L-LTP',
    amplification: 'Utrwalenie Śladu Pamięciowego',
    kineticRole: 'Enzymatyczny Węzeł Plastyczności Synaptycznej',
    isRateLimiting: true
  }
};

/**
 * Calculates predictive kinetic parameters for a specific cascade node.
 */
export function calculateNodePredictiveKinetics(
  node: CascadeNode,
  visualData: CascadeVisualData,
  currentStepNumber: number, // 1-indexed
  speedMultiplier: number = 1
): NodePredictiveKinetics {
  const activeInCurrentStep = node.activeSteps.includes(currentStepNumber);
  const currentStepStatus = node.stepStateDescriptions[currentStepNumber] || {
    state: 'Stan spoczynkowy',
    badge: 'SPOCZYNEK',
    type: 'neutral' as const
  };

  // 1. Determine base registry data or fall back to node type heuristics
  const registryEntry = NODE_BIOPHYSICAL_REGISTRY[node.id];

  let baseLatencyMs = registryEntry ? registryEntry.baseLatencyMs : 250;
  if (!registryEntry) {
    switch (node.type) {
      case 'channel':
        baseLatencyMs = 18;
        break;
      case 'receptor':
        baseLatencyMs = 60;
        break;
      case 'g_protein':
        baseLatencyMs = 120;
        break;
      case 'messenger':
        baseLatencyMs = 280;
        break;
      case 'enzyme':
        baseLatencyMs = 450;
        break;
      case 'organelle':
        baseLatencyMs = 180;
        break;
      case 'scaffold':
        baseLatencyMs = 90;
        break;
    }
  }

  // Factor in effective speed
  const effectiveLatencyMs = Math.round(baseLatencyMs / Math.max(0.2, speedMultiplier));
  const formattedLocalLatency = effectiveLatencyMs >= 1000
    ? `${(effectiveLatencyMs / 1000).toFixed(2)} s`
    : `${effectiveLatencyMs} ms`;

  // Latency class
  let latencyClass: NodePredictiveKinetics['latencyClass'] = 'intermediate';
  let latencyClassLabel = 'Kinetyka Enzymatyczna (100–500 ms)';
  if (baseLatencyMs <= 25) {
    latencyClass = 'ultrafast';
    latencyClassLabel = 'Ultraszybka / Jonotropowa (<25 ms)';
  } else if (baseLatencyMs <= 100) {
    latencyClass = 'fast';
    latencyClassLabel = 'Membranowa / GPCR (25–100 ms)';
  } else if (baseLatencyMs <= 1000) {
    latencyClass = 'intermediate';
    latencyClassLabel = 'Kaskada Enzymatyczna (100–1000 ms)';
  } else if (baseLatencyMs <= 5000) {
    latencyClass = 'slow';
    latencyClassLabel = 'Kaskada Kinazowa (>1 s)';
  } else {
    latencyClass = 'genomic';
    latencyClassLabel = 'Translokacja Jądrowa / Genomowa (>5 s)';
  }

  // 2. Cumulative latency from Step 1 to this node
  let cumulativeLatencyMs = 0;
  const firstStepNodeParticipates = Math.min(...node.activeSteps, currentStepNumber);
  for (let s = 1; s <= Math.max(1, firstStepNodeParticipates); s++) {
    const stepPaths = visualData.flowPaths.filter(p => p.activeSteps.includes(s));
    if (stepPaths.length > 0) {
      const stepMaxLat = Math.max(...stepPaths.map(p => {
        const prof = getMessengerKineticProfile(p);
        const nom = p.speedSec * prof.speedFactor;
        if (prof.type === 'ion') return nom * 28;
        if (prof.type === 'g_protein') return nom * 160;
        if (prof.type === 'second_messenger') return nom * 360;
        if (prof.type === 'protein_kinase') return nom * 1150;
        return nom * 50;
      }));
      cumulativeLatencyMs += stepMaxLat;
    } else {
      cumulativeLatencyMs += 120;
    }
  }
  cumulativeLatencyMs = Math.round(cumulativeLatencyMs + effectiveLatencyMs * 0.4);
  const formattedCumulativeLatency = cumulativeLatencyMs >= 1000
    ? `${(cumulativeLatencyMs / 1000).toFixed(2)} s`
    : `${cumulativeLatencyMs} ms`;

  // 3. Predictive Activation Probability Calculation
  let activationProbabilityPercent = 50;
  let activationPhase: NodePredictiveKinetics['activationPhase'] = 'quiescent';
  let activationPhaseLabel = 'Stan spoczynkowy (oczekiwanie)';
  let activationProbabilityColor = 'text-slate-400 bg-slate-800 border-slate-700';

  const minActiveStep = Math.min(...node.activeSteps);
  const maxActiveStep = Math.max(...node.activeSteps);

  if (activeInCurrentStep) {
    if (currentStepStatus.type === 'active' || currentStepStatus.type === 'open') {
      activationProbabilityPercent = Math.min(99, 90 + (currentStepNumber % 7));
      activationPhase = 'peak_active';
      activationPhaseLabel = 'Szczytowa Aktywacja (Krok Bieżący)';
      activationProbabilityColor = 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
    } else if (currentStepStatus.type === 'phosphorylated') {
      activationProbabilityPercent = 95;
      activationPhase = 'peak_active';
      activationPhaseLabel = 'Stan Utrwalonej Fosforylacji';
      activationProbabilityColor = 'text-pink-400 bg-pink-950/60 border-pink-800';
    } else if (currentStepStatus.type === 'primed') {
      activationProbabilityPercent = 78;
      activationPhase = 'primed';
      activationPhaseLabel = 'Gotowość / Stan Przygotowania (Primed)';
      activationProbabilityColor = 'text-amber-400 bg-amber-950/60 border-amber-800';
    } else if (currentStepStatus.type === 'inhibited' || currentStepStatus.type === 'closed') {
      activationProbabilityPercent = 14;
      activationPhase = 'inhibited';
      activationPhaseLabel = 'Zahamowany / Zablokowany Katalitycznie';
      activationProbabilityColor = 'text-rose-400 bg-rose-950/60 border-rose-800';
    } else {
      activationProbabilityPercent = 58;
      activationPhase = 'quiescent';
      activationPhaseLabel = 'Umiarkowana Aktywność Bazowa';
      activationProbabilityColor = 'text-blue-400 bg-blue-950/60 border-blue-800';
    }
  } else if (currentStepNumber < minActiveStep) {
    // Forward prediction: Signal is traveling towards this node
    const stepDelta = minActiveStep - currentStepNumber;
    // Decay curve based on steps remaining to reach this node
    const predicted = Math.round(85 * Math.pow(0.82, stepDelta));
    activationProbabilityPercent = Math.max(25, predicted);
    activationPhase = 'forward_predicted';
    activationPhaseLabel = `Predykcja Sygnału za ${stepDelta} ${stepDelta === 1 ? 'krok' : 'kroki'}`;
    activationProbabilityColor = 'text-cyan-400 bg-cyan-950/60 border-cyan-800';
  } else if (currentStepNumber > maxActiveStep) {
    // Post-activation phase: Desensitization / Refractory
    activationProbabilityPercent = Math.max(12, 42 - (currentStepNumber - maxActiveStep) * 10);
    activationPhase = 'refractory';
    activationPhaseLabel = 'Faza Wygaszania / Po Przejściu Sygnału';
    activationProbabilityColor = 'text-purple-400 bg-purple-950/60 border-purple-800';
  } else {
    // Intermediate step between active steps
    activationProbabilityPercent = 62;
    activationPhase = 'primed';
    activationPhaseLabel = 'Podtrzymanie Pomiędzy Falami Sygnału';
    activationProbabilityColor = 'text-amber-400 bg-amber-950/60 border-amber-800';
  }

  // 4. Biophysical constants
  const biophysicalConstant = registryEntry ? {
    symbol: registryEntry.constantSymbol,
    value: registryEntry.constantValue,
    description: registryEntry.constantDesc
  } : {
    symbol: node.type === 'channel' ? 'γ_poru' : (node.type === 'enzyme' ? 'k_cat' : 'Kd'),
    value: node.type === 'channel' ? '30 pS' : (node.type === 'enzyme' ? '120 s⁻¹' : '15 nM'),
    description: `Szacowany parametr biofizyczny dla elementu typu ${node.type}`
  };

  // 5. Rate limiting & amplification
  const isRateLimiting = registryEntry ? registryEntry.isRateLimiting : (node.type === 'enzyme');
  const amplificationFactor = registryEntry ? registryEntry.amplification : (
    node.type === 'enzyme' ? '1:200 (Amplifikacja kaskadowa)' : (
      node.type === 'channel' ? '10⁶ jonów/s' : 'Sprzężenie bezpośrednie'
    )
  );
  const kineticRole = registryEntry ? registryEntry.kineticRole : (
    node.type === 'channel' ? 'Kanał Jonowy' : (
      node.type === 'enzyme' ? 'Enzym Katalityczny' : 'Węzeł Transdukcji'
    )
  );

  // Connected flow paths count
  const connectedPathsCount = visualData.flowPaths.filter(p => 
    p.activeSteps.some(s => node.activeSteps.includes(s))
  ).length;

  return {
    localLatencyMs: effectiveLatencyMs,
    formattedLocalLatency,
    cumulativeLatencyMs,
    formattedCumulativeLatency,
    latencyClass,
    latencyClassLabel,
    activationProbabilityPercent,
    activationPhase,
    activationPhaseLabel,
    activationProbabilityColor,
    biophysicalConstant,
    isRateLimiting,
    amplificationFactor,
    kineticRole,
    connectedPathsCount,
    activeInCurrentStep,
    currentStepStatus
  };
}
