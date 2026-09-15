import React from 'react';
import { 
  Activity, 
  Timer, 
  Zap, 
  Gauge, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Info,
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { CascadeNode, CascadeVisualData } from '../data/cascadeAnimationData';
import { calculateNodePredictiveKinetics, NodePredictiveKinetics } from '../utils/nodeKineticsCalculator';

interface CascadeNodeKineticTooltipProps {
  node: CascadeNode;
  visualData: CascadeVisualData;
  currentStepNumber: number; // 1-indexed
  speedMultiplier?: number;
  // Position coordinates in canvas space or container percent
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  onClose?: () => void;
  isPinned?: boolean;
}

export const CascadeNodeKineticTooltip: React.FC<CascadeNodeKineticTooltipProps> = ({
  node,
  visualData,
  currentStepNumber,
  speedMultiplier = 1,
  xPercent,
  yPercent,
  onClose,
  isPinned = false
}) => {
  const kinetics: NodePredictiveKinetics = calculateNodePredictiveKinetics(
    node,
    visualData,
    currentStepNumber,
    speedMultiplier
  );

  // Position alignment logic to prevent overflow outside canvas
  const isRightSide = xPercent > 55;
  const isBottomSide = yPercent > 60;

  // Derive status badge colors
  let statusBadgeStyle = 'bg-slate-800 text-slate-300 border-slate-700';
  if (kinetics.currentStepStatus.type === 'active' || kinetics.currentStepStatus.type === 'open') {
    statusBadgeStyle = 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80';
  } else if (kinetics.currentStepStatus.type === 'inhibited' || kinetics.currentStepStatus.type === 'closed') {
    statusBadgeStyle = 'bg-rose-950/80 text-rose-300 border-rose-700/80';
  } else if (kinetics.currentStepStatus.type === 'phosphorylated') {
    statusBadgeStyle = 'bg-pink-950/80 text-pink-300 border-pink-700/80';
  } else if (kinetics.currentStepStatus.type === 'primed') {
    statusBadgeStyle = 'bg-amber-950/80 text-amber-300 border-amber-700/80';
  }

  return (
    <div
      id={`node-kinetic-tooltip-${node.id}`}
      role="tooltip"
      aria-label={`Parametry kinetyczne dla ${node.label}`}
      className={`absolute z-30 pointer-events-auto transition-all duration-200 animate-in fade-in zoom-in-95 ${
        isRightSide ? 'origin-top-right' : 'origin-top-left'
      }`}
      style={{
        left: `${xPercent}%`,
        top: `${yPercent}%`,
        transform: `translate(${isRightSide ? '-105%' : '5%'}, ${isBottomSide ? '-105%' : '5%'})`,
        maxWidth: '350px',
        width: 'max-content'
      }}
    >
      <div className="bg-slate-950/95 backdrop-blur-md rounded-xl border border-indigo-500/40 shadow-2xl shadow-black/80 p-3.5 space-y-3 text-slate-200 text-xs font-sans ring-1 ring-white/10 w-80">
        {/* Header: Node Name, Type & Real-Time Status */}
        <div className="border-b border-slate-800/90 pb-2.5 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span 
                  className="w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-xs" 
                  style={{ backgroundColor: node.color }} 
                />
                <h4 className="font-bold text-slate-100 text-sm leading-tight truncate">
                  {node.label}
                </h4>
              </div>
              {node.sublabel && (
                <p className="text-[10.5px] text-slate-400 font-medium pl-4">
                  {node.sublabel}
                </p>
              )}
            </div>

            {/* Type badge */}
            <span 
              className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border shrink-0"
              style={{
                borderColor: `${node.color}60`,
                backgroundColor: `${node.color}15`,
                color: node.color
              }}
            >
              {node.type}
            </span>
          </div>

          {/* Current Step Biological State Readout */}
          <div className="flex items-center justify-between text-[10.5px] pt-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-indigo-400" />
              <span>Etap {currentStepNumber}:</span>
            </span>
            <span className={`px-2 py-0.5 rounded-md border text-[9.5px] font-bold uppercase tracking-wider ${statusBadgeStyle}`}>
              {kinetics.currentStepStatus.badge}
            </span>
          </div>
          <p className="text-[10px] text-slate-300 italic bg-slate-900/80 px-2 py-1 rounded border border-slate-800/80">
            "{kinetics.currentStepStatus.state}"
          </p>
        </div>

        {/* 1. Predictive Latency Parameters (Signal Latency) */}
        <div className="bg-slate-900/80 rounded-lg p-2.5 border border-slate-800/90 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-indigo-300 flex items-center gap-1">
              <Timer className="w-3 h-3 text-indigo-400" />
              Latencja Transdukcji (Signal Latency)
            </span>
            <span className="text-[9px] font-mono text-slate-400">
              τ_lat
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            {/* Local node response latency */}
            <div className="bg-slate-950/70 p-1.5 rounded border border-slate-800/70">
              <span className="text-[9px] text-slate-400 block font-medium">Czas reakcji węzła</span>
              <span className="font-mono text-xs font-black text-white flex items-baseline gap-1">
                {kinetics.formattedLocalLatency}
                <span className="text-[9px] text-slate-500 font-normal">(τ_local)</span>
              </span>
            </div>

            {/* Cumulative pathway latency */}
            <div className="bg-slate-950/70 p-1.5 rounded border border-slate-800/70">
              <span className="text-[9px] text-slate-400 block font-medium">Od bodźca (Krok 1)</span>
              <span className="font-mono text-xs font-black text-cyan-300 flex items-baseline gap-1">
                {kinetics.formattedCumulativeLatency}
                <span className="text-[9px] text-slate-500 font-normal">(Στ_cum)</span>
              </span>
            </div>
          </div>

          <div className="text-[9.5px] text-slate-400 flex items-center justify-between pt-0.5">
            <span>Klasyfikacja kinetyczna:</span>
            <span className="font-semibold text-slate-300 text-right">
              {kinetics.latencyClassLabel}
            </span>
          </div>
        </div>

        {/* 2. Predictive Activation Probability (P_act) */}
        <div className="bg-slate-900/80 rounded-lg p-2.5 border border-slate-800/90 space-y-2">
          <div className="flex items-center justify-between text-[10px]">
            <span className="uppercase font-bold text-emerald-300 flex items-center gap-1">
              <Gauge className="w-3 h-3 text-emerald-400" />
              Prawdopodobieństwo Aktywacji (P_act)
            </span>
            <span className="font-mono font-bold text-white text-xs">
              {kinetics.activationProbabilityPercent}%
            </span>
          </div>

          {/* Progress gauge */}
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                kinetics.activationProbabilityPercent >= 80 
                  ? 'bg-emerald-500' 
                  : kinetics.activationProbabilityPercent >= 50 
                  ? 'bg-amber-500' 
                  : 'bg-rose-500'
              }`}
              style={{ width: `${Math.max(6, kinetics.activationProbabilityPercent)}%` }}
            />
          </div>

          {/* Activation Phase description */}
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Faza sprzężenia:</span>
            <span className={`px-1.5 py-0.5 rounded border text-[9px] font-semibold ${kinetics.activationProbabilityColor}`}>
              {kinetics.activationPhaseLabel}
            </span>
          </div>
        </div>

        {/* 3. Biophysical Constant & Amplification Factor */}
        <div className="bg-slate-900/80 rounded-lg p-2.5 border border-slate-800/90 space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-bold text-amber-300 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Stała Biofizyczna & Wydajność
            </span>
            <span className="font-mono font-bold text-amber-200 text-[10.5px]">
              {kinetics.biophysicalConstant.symbol}
            </span>
          </div>

          <div className="bg-slate-950/70 p-2 rounded border border-slate-800/70 space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-white font-mono font-bold text-xs">
                {kinetics.biophysicalConstant.value}
              </span>
              <span className="text-[9.5px] text-slate-400 font-mono">
                {kinetics.amplificationFactor}
              </span>
            </div>
            <p className="text-[9.5px] text-slate-400 leading-tight">
              {kinetics.biophysicalConstant.description}
            </p>
          </div>
        </div>

        {/* 4. Kinetic Role & Rate-Limiting Flag */}
        <div className="flex items-center justify-between gap-2 text-[10px] pt-0.5">
          <div className="flex items-center gap-1 text-slate-400">
            <Layers className="w-3 h-3 text-slate-500" />
            <span>Rola w szlaku:</span>
          </div>
          <span className="font-medium text-slate-200 text-right truncate max-w-[180px]">
            {kinetics.kineticRole}
          </span>
        </div>

        {kinetics.isRateLimiting && (
          <div className="bg-amber-950/40 border border-amber-800/60 rounded-lg px-2 py-1.5 flex items-center gap-1.5 text-[10px] text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              <strong>Wąskie gardło kinetyczne:</strong> Etap enzymatyczny determinujący maksymalną przepustowość szlaku.
            </span>
          </div>
        )}

        {/* 5. Pathway Steps Active Indicator */}
        <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between text-[10px]">
          <span className="text-slate-400">Aktywność w krokach:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].slice(0, Object.keys(visualData.synapticMetricsByStep).length).map(stepNum => {
              const isStepActive = node.activeSteps.includes(stepNum);
              const isCurrent = stepNum === currentStepNumber;

              let pillClass = 'bg-slate-900 text-slate-600 border-slate-800';
              if (isStepActive) {
                pillClass = isCurrent 
                  ? 'bg-indigo-600 text-white font-bold border-indigo-400 shadow-xs' 
                  : 'bg-indigo-950/80 text-indigo-300 border-indigo-800';
              } else if (isCurrent) {
                pillClass = 'bg-slate-800 text-slate-300 font-bold border-slate-600';
              }

              return (
                <span
                  key={stepNum}
                  className={`w-4 h-4 rounded-sm flex items-center justify-center text-[9px] border font-mono ${pillClass}`}
                  title={`Krok ${stepNum}: ${isStepActive ? 'Aktywny' : 'Nieaktywny'}`}
                >
                  {stepNum}
                </span>
              );
            })}
          </div>
        </div>

        {/* Action Hint */}
        <div className="text-[9px] text-slate-500 text-center font-mono pt-0.5">
          Kliknij węzeł, aby przejść do szczegółowej analizy receptora
        </div>
      </div>
    </div>
  );
};
