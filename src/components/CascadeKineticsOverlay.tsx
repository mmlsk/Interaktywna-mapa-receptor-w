import React, { useState, useMemo } from 'react';
import { 
  Gauge, 
  Timer, 
  Activity, 
  Zap, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp, 
  Maximize2, 
  Minimize2, 
  AlertCircle,
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';
import { FlowPath, getMessengerKineticProfile } from '../data/cascadeAnimationData';

export interface KineticParametersResult {
  // Estimated step biological latency (in milliseconds)
  stepBiologicalLatencyMs: number;
  // Formatted step latency (e.g., "28 ms" or "1.45 s")
  formattedStepLatency: string;
  // Cumulative latency from Step 1 to current step
  cumulativeLatencyMs: number;
  formattedCumulativeLatency: string;
  // Simulated flow transit duration in seconds (factoring in speed multiplier)
  effectiveFlowDurationSec: number;
  // Nominal flow transit duration in seconds (baseline 1x speed)
  nominalFlowDurationSec: number;
  // Relative Activation Probability (0 to 100%)
  activationProbabilityPercent: number;
  // Qualitative classification of activation efficiency
  activationStatus: string;
  activationColorClass: string;
  // Total particle flux across active paths (particles / second)
  particleFluxPerSec: number;
  // Rate-limiting pathway in current step
  rateLimitingPath: {
    label: string;
    substance: string;
    symbol: string;
    durationSec: number;
    color: string;
  } | null;
  // Active paths detail
  activePathsCount: number;
  pathBreakdown: Array<{
    id: string;
    label: string;
    symbol: string;
    substance: string;
    color: string;
    flowDurationSec: number;
    estimatedLatencyMs: number;
    particleCount: number;
  }>;
}

/**
 * Computes data-driven kinetic parameters from active molecule flow paths and step progression.
 */
export function calculateCascadeKinetics(
  flowPaths: FlowPath[],
  currentStepNumber: number, // 1-indexed
  totalSteps: number,
  speedMultiplier: number = 1
): KineticParametersResult {
  const activePaths = flowPaths.filter(p => p.activeSteps.includes(currentStepNumber));
  const fallbackPaths = activePaths.length > 0 ? activePaths : flowPaths;

  let maxNominalDuration = 0;
  let totalNominalDuration = 0;
  let totalFlux = 0;
  let maxBioLatencyMs = 0;
  let slowestPath: FlowPath | null = null;

  const pathBreakdown = (activePaths.length > 0 ? activePaths : [fallbackPaths[0]]).map(p => {
    const profile = getMessengerKineticProfile(p);
    const nominalDuration = p.speedSec * profile.speedFactor;
    const effectiveDuration = nominalDuration / Math.max(0.2, speedMultiplier);

    if (nominalDuration > maxNominalDuration) {
      maxNominalDuration = nominalDuration;
      slowestPath = p;
    }
    totalNominalDuration += nominalDuration;
    totalFlux += (p.particleCount || 6) / Math.max(0.4, effectiveDuration);

    // Biological latency estimation based on messenger biophysics:
    // Ions (Ca2+, Cl-, K+): 8-40 ms electrodiffusion through pores
    // G-proteins: 120-350 ms lateral lipid bilayer diffusion
    // Second messengers (cAMP, IP3): 250-800 ms cytosolic microdomain diffusion
    // Kinases / nuclear translocation: 1200-4500 ms enzyme cascade & docking
    let bioLatencyMs = 250;
    if (profile.type === 'ion') {
      bioLatencyMs = Math.round(nominalDuration * 28);
    } else if (profile.type === 'g_protein') {
      bioLatencyMs = Math.round(nominalDuration * 160);
    } else if (profile.type === 'second_messenger') {
      bioLatencyMs = Math.round(nominalDuration * 360);
    } else if (profile.type === 'protein_kinase') {
      bioLatencyMs = Math.round(nominalDuration * 1150);
    } else if (profile.type === 'neurotransmitter') {
      bioLatencyMs = Math.round(nominalDuration * 45);
    }

    if (bioLatencyMs > maxBioLatencyMs) {
      maxBioLatencyMs = bioLatencyMs;
    }

    return {
      id: p.id,
      label: p.label,
      symbol: p.particleSymbol || '●',
      substance: p.substance,
      color: p.particleColor,
      flowDurationSec: Number(effectiveDuration.toFixed(2)),
      estimatedLatencyMs: bioLatencyMs,
      particleCount: p.particleCount || 6
    };
  });

  const count = activePaths.length > 0 ? activePaths.length : 1;
  const avgNominalDuration = totalNominalDuration / count;
  const effectiveFlowDurationSec = Number((avgNominalDuration / Math.max(0.2, speedMultiplier)).toFixed(2));
  const nominalFlowDurationSec = Number(avgNominalDuration.toFixed(2));

  // Compute cumulative latency across previous steps up to current step
  let cumulativeLatencyMs = 0;
  for (let s = 1; s <= currentStepNumber; s++) {
    const stepPaths = flowPaths.filter(p => p.activeSteps.includes(s));
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
      cumulativeLatencyMs += 120; // default transition step latency
    }
  }

  // Format step latency string
  const formattedStepLatency = maxBioLatencyMs >= 1000 
    ? `${(maxBioLatencyMs / 1000).toFixed(2)} s` 
    : `${Math.round(maxBioLatencyMs)} ms`;

  const formattedCumulativeLatency = cumulativeLatencyMs >= 1000
    ? `${(cumulativeLatencyMs / 1000).toFixed(2)} s`
    : `${Math.round(cumulativeLatencyMs)} ms`;

  // Relative Activation Probability Model:
  // Derived from molecular flow flux and cascade progression index (k / N)
  // Faster flow duration -> higher flux -> higher collision rate -> higher activation probability
  const stepRatio = Math.min(1, Math.max(0.2, currentStepNumber / Math.max(1, totalSteps)));
  const normalizedFlux = totalFlux / Math.max(1, count);
  // Probability saturation curve P = 1 - exp(-k * flux)
  const lambda = (normalizedFlux / 3.8) * (0.6 + 0.5 * stepRatio);
  const rawProb = (1 - Math.exp(-lambda)) * 100;
  const activationProbabilityPercent = Math.min(98, Math.max(22, Math.round(rawProb)));

  // Status determination
  let activationStatus = 'Umiarkowane (sprzężenie pośrednie)';
  let activationColorClass = 'text-amber-400 bg-amber-950/40 border-amber-800/60';
  if (activationProbabilityPercent >= 85) {
    activationStatus = 'Bardzo wysokie (szybka aktywacja)';
    activationColorClass = 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60';
  } else if (activationProbabilityPercent >= 70) {
    activationStatus = 'Wysokie (efektywny przepływ)';
    activationColorClass = 'text-indigo-400 bg-indigo-950/40 border-indigo-800/60';
  } else if (activationProbabilityPercent < 45) {
    activationStatus = 'Wstępne / Progowe';
    activationColorClass = 'text-slate-400 bg-slate-950/40 border-slate-800/60';
  }

  const rateLimitingPath = slowestPath ? {
    label: (slowestPath as FlowPath).label,
    substance: (slowestPath as FlowPath).substance,
    symbol: (slowestPath as FlowPath).particleSymbol || '●',
    durationSec: Number(maxNominalDuration.toFixed(2)),
    color: (slowestPath as FlowPath).particleColor
  } : null;

  return {
    stepBiologicalLatencyMs: maxBioLatencyMs,
    formattedStepLatency,
    cumulativeLatencyMs,
    formattedCumulativeLatency,
    effectiveFlowDurationSec,
    nominalFlowDurationSec,
    activationProbabilityPercent,
    activationStatus,
    activationColorClass,
    particleFluxPerSec: Number(totalFlux.toFixed(1)),
    rateLimitingPath,
    activePathsCount: activePaths.length,
    pathBreakdown
  };
}

interface CascadeKineticsOverlayProps {
  flowPaths: FlowPath[];
  currentStepNumber: number; // 1-indexed
  totalSteps: number;
  speedMultiplier?: number;
  cascadeId?: string;
  className?: string;
}

export const CascadeKineticsOverlay: React.FC<CascadeKineticsOverlayProps> = ({
  flowPaths,
  currentStepNumber,
  totalSteps,
  speedMultiplier = 1,
  cascadeId = 'cascade',
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const kinetics = useMemo(() => {
    return calculateCascadeKinetics(flowPaths, currentStepNumber, totalSteps, speedMultiplier);
  }, [flowPaths, currentStepNumber, totalSteps, speedMultiplier]);

  return (
    <div
      id={`kinetics-overlay-${cascadeId}`}
      className={`absolute z-20 pointer-events-auto transition-all duration-300 ${className || 'top-3 left-3 sm:left-4'}`}
      style={{ maxWidth: isExpanded ? '340px' : '260px' }}
    >
      <div className="bg-slate-900/90 hover:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden transition-all text-white">
        {/* Header Bar */}
        <div className="px-3.5 py-2.5 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between gap-2 select-none">
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex-shrink-0">
              <Gauge className="w-3.5 h-3.5" />
            </span>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider truncate block">
                Kinetyka Przepływu
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="px-1.5 py-0.5 rounded-md bg-indigo-950/90 text-indigo-300 border border-indigo-800/60 font-mono text-[9px]">
              Etap {currentStepNumber}/{totalSteps}
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isExpanded ? 'Zwiń szczegóły kinetyki' : 'Rozwiń szczegóły kinetyki'}
              aria-label={isExpanded ? 'Zwiń szczegóły kinetyki' : 'Rozwiń szczegóły kinetyki'}
            >
              {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Primary Compact Summary (Always Visible) */}
        <div className="p-3 space-y-2.5">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Predicted Latency */}
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
                <Clock className="w-3 h-3 text-indigo-400" />
                <span>Latencja Sygnału</span>
              </div>
              <div className="text-sm font-black text-indigo-300 font-mono">
                {kinetics.formattedStepLatency}
              </div>
              <div className="text-[9px] text-slate-500 truncate mt-0.5">
                Σ narast.: {kinetics.formattedCumulativeLatency}
              </div>
            </div>

            {/* Relative Activation Probability */}
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span>P(aktywacji)</span>
              </div>
              <div className="text-sm font-black text-emerald-400 font-mono flex items-baseline gap-1">
                <span>{kinetics.activationProbabilityPercent}%</span>
              </div>
              <div className="text-[9px] text-slate-500 truncate mt-0.5">
                Przepływ: {kinetics.effectiveFlowDurationSec}s
              </div>
            </div>
          </div>

          {/* Activation Probability Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Prawdopodobieństwo sprzężenia:</span>
              <span className={`px-1.5 py-0.2 rounded border font-mono font-bold text-[9px] ${kinetics.activationColorClass}`}>
                {kinetics.activationProbabilityPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-indigo-500 via-amber-400 to-emerald-400"
                style={{ width: `${kinetics.activationProbabilityPercent}%` }}
              />
            </div>
          </div>

          {/* Rate-Limiting Component Indicator */}
          {kinetics.rateLimitingPath && (
            <div className="bg-slate-950/40 px-2.5 py-1.5 rounded-lg border border-slate-800/60 flex items-center justify-between gap-2 text-[10px]">
              <span className="text-slate-400 truncate flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                <span>Wąskie gardło:</span>
              </span>
              <span className="font-mono font-bold text-amber-300 truncate max-w-[120px]" title={kinetics.rateLimitingPath.label}>
                {kinetics.rateLimitingPath.symbol} ({kinetics.rateLimitingPath.durationSec}s)
              </span>
            </div>
          )}

          {/* Toggle Expand / Breakdown Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-1 text-center text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <span>{isExpanded ? 'Ukryj rozbicie ścieżek' : 'Rozwiń parametry biofizyczne'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Expanded Deep-Dive Details */}
        {isExpanded && (
          <div className="px-3.5 pb-3 pt-1 border-t border-slate-800/80 space-y-2.5 text-xs animate-in fade-in duration-200">
            {/* Status note */}
            <div className="text-[10px] text-slate-300 bg-slate-950/70 p-2 rounded-xl border border-slate-800">
              <div className="font-bold text-indigo-300 uppercase tracking-wider text-[9px] mb-0.5">
                Ocena kinetyczna etapu
              </div>
              <p className="leading-snug text-slate-300">
                {kinetics.activationStatus}. Całkowity strumień nośników: <strong className="text-white font-mono">{kinetics.particleFluxPerSec} cząst./s</strong>.
              </p>
            </div>

            {/* Individual Pathway Kinetic Breakdown */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Aktywne Ścieżki Molekularne ({kinetics.pathBreakdown.length})
              </span>
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {kinetics.pathBreakdown.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800/70 flex items-center justify-between gap-2 text-[10px]"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="font-mono font-bold text-slate-200">{p.symbol}</span>
                      <span className="text-slate-400 truncate max-w-[110px]" title={p.label}>
                        {p.label}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0 font-mono text-[9px] text-slate-400">
                      <span className="text-indigo-300 font-semibold">{p.flowDurationSec}s</span>
                      <span className="text-slate-600 mx-1">•</span>
                      <span>~{p.estimatedLatencyMs}ms</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Biophysical Calculation Footnote */}
            <div className="text-[9px] text-slate-500 leading-tight border-t border-slate-800/60 pt-1.5 flex items-start gap-1">
              <HelpCircle className="w-2.5 h-2.5 text-slate-500 flex-shrink-0 mt-0.5" />
              <span>
                Latencja i P(akt) estymowane z czasu przepływu cząsteczek (<code className="text-slate-400">t = speedSec × speedFactor</code>) oraz gęstości cząstek.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface CascadeKineticsBadgeProps {
  flowPaths: FlowPath[];
  currentStepNumber: number;
  totalSteps: number;
  speedMultiplier?: number;
  cascadeId?: string;
  compact?: boolean;
}

/**
 * Compact toolbar/header badge with hover/click tooltip for quick inspection.
 */
export const CascadeKineticsBadge: React.FC<CascadeKineticsBadgeProps> = ({
  flowPaths,
  currentStepNumber,
  totalSteps,
  speedMultiplier = 1,
  cascadeId = 'badge',
  compact = false
}) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const kinetics = useMemo(() => {
    return calculateCascadeKinetics(flowPaths, currentStepNumber, totalSteps, speedMultiplier);
  }, [flowPaths, currentStepNumber, totalSteps, speedMultiplier]);

  return (
    <div className="relative inline-block text-left">
      <button
        id={`kinetics-badge-btn-${cascadeId}`}
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="px-2.5 py-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white transition-all shadow-xs flex items-center gap-2 group cursor-pointer"
        title="Kliknij, aby otworzyć szczegóły kinetyki kaskady"
        aria-expanded={showTooltip}
      >
        <span className="p-0.5 rounded bg-indigo-500/20 text-indigo-400">
          <Gauge className="w-3 h-3 group-hover:rotate-12 transition-transform" />
        </span>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-slate-400 text-[10px]">Latencja:</span>
          <span className="font-bold text-indigo-300">{kinetics.formattedStepLatency}</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400 text-[10px]">P(akt):</span>
          <span className="font-bold text-emerald-400">{kinetics.activationProbabilityPercent}%</span>
        </div>

        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      </button>

      {/* Floating Tooltip Popover */}
      {showTooltip && (
        <div
          className="absolute z-50 mt-1.5 left-0 w-72 bg-slate-900/95 backdrop-blur-md rounded-2xl p-3 border border-slate-700 shadow-2xl text-white text-xs space-y-2 pointer-events-none select-none animate-in fade-in zoom-in-95 duration-150"
          role="tooltip"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[11px] text-slate-200">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Parametry Kinetyczne Kaskady</span>
            </div>
            <span className="text-[9px] font-mono text-indigo-300 bg-indigo-950/80 px-1 rounded border border-indigo-800/60">
              Krok {currentStepNumber}/{totalSteps}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[9px]">Przewidywana Latencja</span>
              <span className="font-bold text-indigo-300 font-mono text-xs">{kinetics.formattedStepLatency}</span>
              <span className="text-[8px] text-slate-500 block">Narast.: {kinetics.formattedCumulativeLatency}</span>
            </div>

            <div className="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[9px]">P(aktywacji)</span>
              <span className="font-bold text-emerald-400 font-mono text-xs">{kinetics.activationProbabilityPercent}%</span>
              <span className="text-[8px] text-slate-500 block">Strumień: {kinetics.particleFluxPerSec}/s</span>
            </div>
          </div>

          {kinetics.rateLimitingPath && (
            <div className="text-[9px] text-slate-300 bg-slate-950/50 p-1.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Limitujący:</span>
              <span className="font-mono text-amber-300 font-semibold">{kinetics.rateLimitingPath.symbol} ({kinetics.rateLimitingPath.durationSec}s)</span>
            </div>
          )}

          <div className="text-[8.5px] text-slate-400 leading-tight pt-1 border-t border-slate-800/80">
            Oparte na estymacji czasu przepływu cząsteczek (<code className="text-slate-300">speedSec × speedFactor</code>).
          </div>
        </div>
      )}
    </div>
  );
};
