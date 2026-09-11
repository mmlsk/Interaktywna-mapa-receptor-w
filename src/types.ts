export type TransductionType = 
  | 'ionotropic' 
  | 'gpcr_gs' 
  | 'gpcr_gi' 
  | 'gpcr_gq' 
  | 'rtk';

export type NeurotransmitterFamily = 
  | 'glutamate'
  | 'gaba'
  | 'glycine'
  | 'dopamine'
  | 'serotonin'
  | 'acetylcholine'
  | 'norepinephrine'
  | 'histamine'
  | 'opioid'
  | 'cannabinoid'
  | 'purinergic'
  | 'neuropeptide'
  | 'neurotrophin';

export type SynapticLocation = 
  | 'presynaptic'
  | 'postsynaptic'
  | 'extrasynaptic'
  | 'glial';

export interface ReceptorInfo {
  id: string;
  name: string;
  codeName: string; // e.g. "GluN1/GluN2", "GABRA1", "DRD1"
  family: NeurotransmitterFamily;
  transduction: TransductionType;
  couplingOrConductance: string; // e.g. "Ca2+ >> Na+, K+", "Gαs / Gαolf", "Gαi/o, Gβγ"
  structureSubunits: string; // e.g. "Heterotetramer (2x GluN1 + 2x GluN2)", "Heteropentamer (2α1 2β2 1γ2)"
  synapticLocation: SynapticLocation[];
  cnsRegions: string[]; // e.g. ["Kora mózgowa (warstwy II-V)", "Hipokamp (CA1, CA3)", "Prążkowie"]
  functionalRole: string; // Concise functional summary
  signalingCascade: {
    title: string;
    steps: string[];
    primaryEffectors: string[];
    cellularOutcome: string;
  };
  crossTalkAndInteractions: {
    partnerReceptor: string;
    nature: 'heterodimer' | 'synergy' | 'antagonism' | 'retrograde' | 'scaffold';
    description: string;
  }[];
  pharmacology: {
    endogenousLigands: string[];
    clinicalAgonists?: string[];
    clinicalAntagonistsOrBlockers?: string[];
    allostericModulators?: string[];
    clinicalApplications: string[];
  };
  badgeColor: string;
}

export interface WorkflowStep {
  stepNumber: number;
  compartment: string;
  actor: string;
  action: string;
  molecularDetail: string;
  significance: string;
}

export interface WorkflowCascade {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  receptorsInvolved: string[];
  summary: string;
  steps: WorkflowStep[];
  electrophysiologicalEffect: string;
  clinicalRelevance: string;
}

export interface CrosstalkInteraction {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'heterodimer' | 'inhibition' | 'activation' | 'retrograde' | 'scaffold_complex';
  title: string;
  description: string;
  anatomicalSite: string;
  functionalConsequence: string;
  pharmacologicalImpact: string;
}

export interface SimulationDrug {
  id: string;
  name: string;
  targetReceptorId: string;
  actionType: 'agonist' | 'antagonist' | 'pam' | 'nam' | 'channel_blocker';
  description: string;
  affectedParameters: {
    cAMP?: number;
    intracellularCalcium?: number;
    pkaActivity?: number;
    pkcActivity?: number;
    membranePotentialMv?: number; // delta in mV
    girkConductance?: number;
    excitabilityIndex?: number;
    crebPhosphorylation?: number;
  };
}
