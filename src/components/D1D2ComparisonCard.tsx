import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Activity, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  Layers, 
  GitCompare, 
  Scale, 
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Gauge,
  Timer,
  TrendingUp,
  TrendingDown,
  Flame,
  Info
} from 'lucide-react';
import { WorkflowCascade } from '../types';
import { CascadeVisualData } from '../data/cascadeAnimationData';
import { calculateCascadeKinetics } from './CascadeKineticsOverlay';

interface D1D2ComparisonCardProps {
  cascadeA: WorkflowCascade;
  cascadeB: WorkflowCascade;
  stepIdxA: number;
  stepIdxB: number;
  speedMultiplier: number;
  visualDataA?: CascadeVisualData;
  visualDataB?: CascadeVisualData;
}

export const D1D2ComparisonCard: React.FC<D1D2ComparisonCardProps> = ({
  cascadeA,
  cascadeB,
  stepIdxA,
  stepIdxB,
  speedMultiplier,
  visualDataA,
  visualDataB
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Check if current pair is specifically D1 (DARPP-32) and D2 (Gi/o GIRK/Cav)
  const isD1D2Pair = 
    (cascadeA.id === 'darpp32_cascade' && cascadeB.id === 'gio_girk_cav_pathway') ||
    (cascadeA.id === 'gio_girk_cav_pathway' && cascadeB.id === 'darpp32_cascade');

  // Compute real-time kinetics for Cascade A and Cascade B
  const kineticsA = useMemo(() => {
    if (!visualDataA) return null;
    return calculateCascadeKinetics(
      visualDataA.flowPaths,
      stepIdxA + 1,
      cascadeA.steps.length,
      speedMultiplier
    );
  }, [visualDataA, stepIdxA, cascadeA.steps.length, speedMultiplier]);

  const kineticsB = useMemo(() => {
    if (!visualDataB) return null;
    return calculateCascadeKinetics(
      visualDataB.flowPaths,
      stepIdxB + 1,
      cascadeB.steps.length,
      speedMultiplier
    );
  }, [visualDataB, stepIdxB, cascadeB.steps.length, speedMultiplier]);

  // Relative speed ratio comparison
  const speedRatio = useMemo(() => {
    if (!kineticsA || !kineticsB) return null;
    const latA = kineticsA.stepBiologicalLatencyMs;
    const latB = kineticsB.stepBiologicalLatencyMs;
    if (latA <= 0 || latB <= 0) return null;
    if (latA > latB) {
      const factor = (latA / latB).toFixed(1);
      return {
        faster: 'B',
        factor,
        text: `Panel B (${cascadeB.title.split('(')[0].trim()}) jest ~${factor}× szybszy w latencji sygnału niż Panel A`
      };
    } else if (latB > latA) {
      const factor = (latB / latA).toFixed(1);
      return {
        faster: 'A',
        factor,
        text: `Panel A (${cascadeA.title.split('(')[0].trim()}) jest ~${factor}× szybszy w latencji sygnału niż Panel B`
      };
    }
    return {
      faster: 'equal',
      factor: '1.0',
      text: 'Oba szlaki wykazują zbliżoną latencję transdukcji sygnału na tych etapach'
    };
  }, [kineticsA, kineticsB, cascadeA.title, cascadeB.title]);

  return (
    <div 
      id="dual-view-comparative-matrix-card"
      className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 border border-indigo-900/40 shadow-xl space-y-5"
    >
      {/* Header with expand/collapse */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-800/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 shadow-inner">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono uppercase tracking-wider font-bold">
                Biofizyczna Analiza Różnicowa
              </span>
              {isD1D2Pair && (
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono uppercase tracking-wider font-bold">
                  D1 (Gs/Golf) vs D2 (Gi/o)
                </span>
              )}
            </div>
            <h3 className="text-lg font-black tracking-tight text-white mt-0.5">
              {isD1D2Pair 
                ? 'Porównanie Kinetyki & Efektorów: Receptor D1 vs Receptor D2' 
                : `Porównanie Kaskad: ${cascadeA.title.split('-')[0]} vs ${cascadeB.title.split('-')[0]}`}
            </h3>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-2 transition-colors"
        >
          <span>{isExpanded ? 'Zwiń Analizę' : 'Rozwiń Pełną Matrycę'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* ========================================================================= */}
          {/* LIVE DATA-DRIVEN SIGNALING KINETICS DIRECT COMPARISON (GAUGES & METRICS) */}
          {/* ========================================================================= */}
          {kineticsA && kineticsB && (
            <div className="bg-slate-950/80 rounded-2xl p-4 border border-indigo-500/30 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
                    <Gauge className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-indigo-300">
                      Komparator Kinetyki Transdukcji Sygnału (Live)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Parametry wyliczone z aktywnych ścieżek cząsteczek na bieżącym kroku (Panel A: Krok {stepIdxA + 1} vs Panel B: Krok {stepIdxB + 1})
                    </p>
                  </div>
                </div>

                {speedRatio && (
                  <div className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
                    speedRatio.faster === 'B' 
                      ? 'bg-purple-950/50 text-purple-200 border-purple-500/40 shadow-xs' 
                      : speedRatio.faster === 'A'
                      ? 'bg-blue-950/50 text-blue-200 border-blue-500/40 shadow-xs'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>{speedRatio.text}</span>
                  </div>
                )}
              </div>

              {/* Metric Grid: Latency, Activation Probability, Particle Flux */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* 1. Step & Cumulative Latency Comparison */}
                <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
                      <Timer className="w-3.5 h-3.5 text-amber-400" />
                      Latencja Sygnału (&tau;)
                    </span>
                    <span className="text-[10px] text-slate-500">Bieżący krok</span>
                  </div>

                  <div className="space-y-2">
                    {/* Pathway A */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-blue-300 font-semibold truncate max-w-[140px]">
                          A: {cascadeA.title.split('(')[0]}
                        </span>
                        <span className="font-mono font-bold text-white">
                          {kineticsA.formattedStepLatency}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-500 h-full rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min(100, Math.max(8, (kineticsA.stepBiologicalLatencyMs / Math.max(kineticsA.stepBiologicalLatencyMs, kineticsB.stepBiologicalLatencyMs, 1)) * 100))}%` 
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 mt-0.5 font-mono">
                        <span>Kumulatywna:</span>
                        <span className="text-slate-300">{kineticsA.formattedCumulativeLatency}</span>
                      </div>
                    </div>

                    {/* Pathway B */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-purple-300 font-semibold truncate max-w-[140px]">
                          B: {cascadeB.title.split('(')[0]}
                        </span>
                        <span className="font-mono font-bold text-white">
                          {kineticsB.formattedStepLatency}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-purple-500 h-full rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min(100, Math.max(8, (kineticsB.stepBiologicalLatencyMs / Math.max(kineticsA.stepBiologicalLatencyMs, kineticsB.stepBiologicalLatencyMs, 1)) * 100))}%` 
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 mt-0.5 font-mono">
                        <span>Kumulatywna:</span>
                        <span className="text-slate-300">{kineticsB.formattedCumulativeLatency}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Relative Activation Probability Comparison */}
                <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      Prawdopodobieństwo Aktywacji (Pakt)
                    </span>
                    <span className="text-[10px] text-slate-500">Względne</span>
                  </div>

                  <div className="space-y-2">
                    {/* Pathway A */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-blue-300 font-semibold truncate max-w-[140px]">
                          A: {kineticsA.activationStatus}
                        </span>
                        <span className="font-mono font-bold text-white">
                          {kineticsA.activationProbabilityPercent}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-400 h-full rounded-full transition-all duration-300"
                          style={{ width: `${kineticsA.activationProbabilityPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Pathway B */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-purple-300 font-semibold truncate max-w-[140px]">
                          B: {kineticsB.activationStatus}
                        </span>
                        <span className="font-mono font-bold text-white">
                          {kineticsB.activationProbabilityPercent}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-purple-400 h-full rounded-full transition-all duration-300"
                          style={{ width: `${kineticsB.activationProbabilityPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                      <span>Różnica &Delta;P(akt):</span>
                      <span className="font-mono font-bold text-indigo-300">
                        {Math.abs(kineticsA.activationProbabilityPercent - kineticsB.activationProbabilityPercent)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Particle Flux & Bottleneck Comparison */}
                <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      Strumień Cząsteczek & Wąskie Gardło
                    </span>
                    <span className="text-[10px] text-slate-500">Gęstość &Phi;</span>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                      <span className="text-slate-400">Strumień A vs B:</span>
                      <div className="font-mono text-[10px] space-x-1">
                        <span className="text-blue-300">{kineticsA.particleFluxPerSec} cz/s</span>
                        <span className="text-slate-500">vs</span>
                        <span className="text-purple-300">{kineticsB.particleFluxPerSec} cz/s</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-[10px]">
                      <div className="truncate">
                        <span className="text-blue-400 font-bold">Wąskie gardło A: </span>
                        <span className="text-slate-300">
                          {kineticsA.rateLimitingPath ? kineticsA.rateLimitingPath.label : 'Brak'} ({kineticsA.rateLimitingPath?.durationSec}s)
                        </span>
                      </div>
                      <div className="truncate">
                        <span className="text-purple-400 font-bold">Wąskie gardło B: </span>
                        <span className="text-slate-300">
                          {kineticsB.rateLimitingPath ? kineticsB.rateLimitingPath.label : 'Brak'} ({kineticsB.rateLimitingPath?.durationSec}s)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* LIVE EFFECTOR RESPONSES SIDE-BY-SIDE COMPARATOR (DOWNSTREAM EFFECTORS)    */}
          {/* ========================================================================= */}
          {visualDataA && visualDataB && (
            <div id="dual-view-effector-comparator" className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Activity className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-300">
                      Porównanie Bezpośrednich Odpowiedzi Efektorowych (Downstream Effectors)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Stany aktywacji enzymów, kinaz, fosfataz i kanałów jonowych w czasie rzeczywistym
                    </p>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span>Panel A (Krok {stepIdxA + 1})</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    <span>Panel B (Krok {stepIdxB + 1})</span>
                  </span>
                </div>
              </div>

              {/* Side-by-Side Dual Effector Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Column A Effectors */}
                <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-blue-900/30">
                  <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-800">
                    <span className="font-bold text-blue-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      Efektory: {cascadeA.title.split('(')[0]}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {visualDataA.downstreamEffectors.length} efektorów monitorowanych
                    </span>
                  </div>

                  <div className="space-y-2">
                    {visualDataA.downstreamEffectors.map(eff => {
                      const readout = eff.stepReadouts[stepIdxA + 1] || {
                        valuePercent: 0,
                        displayValue: '0%',
                        status: 'Brak danych',
                        state: 'neutral' as const
                      };

                      let barColor = 'bg-blue-500';
                      let statusBadge = 'bg-blue-950/60 text-blue-300 border-blue-800';
                      if (readout.state === 'active' || readout.state === 'open') {
                        barColor = 'bg-emerald-500';
                        statusBadge = 'bg-emerald-950/60 text-emerald-300 border-emerald-800';
                      } else if (readout.state === 'inhibited' || readout.state === 'closed') {
                        barColor = 'bg-rose-500';
                        statusBadge = 'bg-rose-950/60 text-rose-300 border-rose-800';
                      } else if (readout.state === 'phosphorylated') {
                        barColor = 'bg-pink-500';
                        statusBadge = 'bg-pink-950/60 text-pink-300 border-pink-800';
                      } else if (readout.state === 'primed') {
                        barColor = 'bg-amber-500';
                        statusBadge = 'bg-amber-950/60 text-amber-300 border-amber-800';
                      }

                      return (
                        <div key={eff.id} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="font-bold text-slate-200 truncate">{eff.name}</span>
                              <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                                {eff.type}
                              </span>
                            </div>
                            <span className="font-mono font-bold text-white text-xs">
                              {readout.displayValue}
                            </span>
                          </div>

                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`${barColor} h-full rounded-full transition-all duration-300`} 
                              style={{ width: `${Math.max(4, Math.min(100, readout.valuePercent))}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-400">{readout.status}</span>
                            <span className={`px-1.5 py-0.5 rounded border text-[9px] font-semibold ${statusBadge}`}>
                              {readout.state}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Column B Effectors */}
                <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-purple-900/30">
                  <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-800">
                    <span className="font-bold text-purple-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      Efektory: {cascadeB.title.split('(')[0]}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {visualDataB.downstreamEffectors.length} efektorów monitorowanych
                    </span>
                  </div>

                  <div className="space-y-2">
                    {visualDataB.downstreamEffectors.map(eff => {
                      const readout = eff.stepReadouts[stepIdxB + 1] || {
                        valuePercent: 0,
                        displayValue: '0%',
                        status: 'Brak danych',
                        state: 'neutral' as const
                      };

                      let barColor = 'bg-purple-500';
                      let statusBadge = 'bg-purple-950/60 text-purple-300 border-purple-800';
                      if (readout.state === 'active' || readout.state === 'open') {
                        barColor = 'bg-emerald-500';
                        statusBadge = 'bg-emerald-950/60 text-emerald-300 border-emerald-800';
                      } else if (readout.state === 'inhibited' || readout.state === 'closed') {
                        barColor = 'bg-rose-500';
                        statusBadge = 'bg-rose-950/60 text-rose-300 border-rose-800';
                      } else if (readout.state === 'phosphorylated') {
                        barColor = 'bg-pink-500';
                        statusBadge = 'bg-pink-950/60 text-pink-300 border-pink-800';
                      } else if (readout.state === 'primed') {
                        barColor = 'bg-amber-500';
                        statusBadge = 'bg-amber-950/60 text-amber-300 border-amber-800';
                      }

                      return (
                        <div key={eff.id} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="font-bold text-slate-200 truncate">{eff.name}</span>
                              <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                                {eff.type}
                              </span>
                            </div>
                            <span className="font-mono font-bold text-white text-xs">
                              {readout.displayValue}
                            </span>
                          </div>

                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`${barColor} h-full rounded-full transition-all duration-300`} 
                              style={{ width: `${Math.max(4, Math.min(100, readout.valuePercent))}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-400">{readout.status}</span>
                            <span className={`px-1.5 py-0.5 rounded border text-[9px] font-semibold ${statusBadge}`}>
                              {readout.state}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Kinetic & Mechanistic Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* 1. Kinetic speed & Messenger Type */}
            <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Clock className="w-4 h-4" />
                <span className="uppercase tracking-wider text-[11px]">Kinetyka & Czas Transdukcji</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                {isD1D2Pair ? (
                  <>
                    <strong className="text-blue-300">D1 (PKA/DARPP-32)</strong>: Wolna kinetyka enzymatyczna (~sekundy, mnożnik 2.25×). Wymaga akumulacji cAMP i kaskady translokacji kinaz.<br/>
                    <strong className="text-purple-300">D2 (Gi/o/GIRK)</strong>: Błyskawiczna kinetyka jonowa (~milisekundy, mnożnik 0.52×). Wolny dimer Gβγ bezpośrednio wiąże kanały GIRK i Cav.
                  </>
                ) : (
                  'Różnica w kinetyce wynika z obecności kanałów jonowych (przepływ jonowy w milisekundach) w stosunku do wieloetapowych kaskad kinazowych i transkrypcyjnych (sekundy do godzin).'
                )}
              </p>
            </div>

            {/* 2. Electrophysiological Outcome */}
            <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-bold">
                <Activity className="w-4 h-4" />
                <span className="uppercase tracking-wider text-[11px]">Kierunek Potencjału Błony (Vm)</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                {isD1D2Pair ? (
                  <>
                    <strong className="text-blue-300">D1</strong>: Depolaryzacja i facilitacja LTP. Fosforylacja AMPA GluA1 (Ser845) i NMDA zwielokrotnia dokomórkowy prąd depolaryzacyjny.<br/>
                    <strong className="text-purple-300">D2</strong>: Hiperpolaryzacja (Vm ~ -82 mV). Wypływ K⁺ przez GIRK podnosi próg wyładowań i wygasza salwy potencjałów.
                  </>
                ) : (
                  'Bezpośrednie zestawienie zmian potencjału transbłonowego wywołanych prądami dokomórkowymi (depolaryzacja) vs odkomórkowymi prądami potasowymi (hiperpolaryzacja).'
                )}
              </p>
            </div>

            {/* 3. Striatal Circuit / Physiological Impact */}
            <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Sparkles className="w-4 h-4" />
                <span className="uppercase tracking-wider text-[11px]">Integracja w Obwodzie Prążkowia</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                {isD1D2Pair ? (
                  <>
                    <strong className="text-blue-300">dMSN (Droga bezpośrednia)</strong>: D1 inicjuje pożądany program motoryczny (&quot;GO&quot;) poprzez odhamowanie wzgórza (GPi/SNr).<br/>
                    <strong className="text-purple-300">iMSN (Droga pośrednia)</strong>: D2 hamuje wyładowania iMSN, zdejmując hamulec motoryczny (&quot;NO-GO&quot;) + autoreceptory presynaptyczne.
                  </>
                ) : (
                  'Wpływ na globalną równowagę neurotransmisji w pętli korowo-podkorowej i modulacja plastyczności synaptycznej.'
                )}
              </p>
            </div>
          </div>

          {/* D1 vs D2 High-Resolution Differential Table */}
          {isD1D2Pair && (
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
              <table className="w-full text-left text-xs border-collapse min-w-[620px]">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/90 text-[11px] font-bold text-slate-300">
                    <th className="p-3 w-1/4">Parametr / Oś Sygnałowa</th>
                    <th className="p-3 w-[37.5%] text-blue-300 bg-blue-950/20 border-r border-slate-800">
                      Szlak D1: Gs/Golf - PKA - DARPP-32
                    </th>
                    <th className="p-3 w-[37.5%] text-purple-300 bg-purple-950/20">
                      Szlak D2: Gi/o - Gβγ - GIRK / Cav
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11.5px]">
                  <tr className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3 font-semibold text-slate-200">Sprzężone Białko G</td>
                    <td className="p-3 bg-blue-950/10 border-r border-slate-800 text-blue-200 font-mono">
                      Gαolf (prążkowie) / Gαs (kora)
                    </td>
                    <td className="p-3 bg-purple-950/10 text-purple-200 font-mono">
                      Gαi/o (podtypy Gi1-3, Go1-2)
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3 font-semibold text-slate-200">Wpływ na Cyklazę Adenylanową (AC5)</td>
                    <td className="p-3 bg-blue-950/10 border-r border-slate-800 text-emerald-300 font-semibold">
                      ▲ Stymulacja AC5 → Masywny wyrzut cAMP
                    </td>
                    <td className="p-3 bg-purple-950/10 text-rose-300 font-semibold">
                      ▼ Zahamowanie AC5 → Spadek cAMP
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3 font-semibold text-slate-200">Kinetyka Przepływu (Biofizyka)</td>
                    <td className="p-3 bg-blue-950/10 border-r border-slate-800">
                      <span className="text-amber-300 font-medium">Powolna translokacja kinaz</span> (promień cząstki r=10.5px, czas ~2.25×)
                    </td>
                    <td className="p-3 bg-purple-950/10">
                      <span className="text-emerald-300 font-medium">Błyskawiczny prąd jonowy</span> (promień cząstki r=4.2px, czas ~0.52×)
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3 font-semibold text-slate-200">Stan Fosforylacji DARPP-32</td>
                    <td className="p-3 bg-blue-950/10 border-r border-slate-800 text-slate-200">
                      Fosforylacja <strong className="text-amber-400">Thr34</strong> przez PKA → silne <strong className="text-rose-400">zablokowanie fosfatazy PP1</strong>
                    </td>
                    <td className="p-3 bg-purple-950/10 text-slate-200">
                      Defosforylacja Thr34 przez kalcyneurynę (PP2B) → <strong className="text-emerald-400">odhamowanie fosfatazy PP1</strong>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3 font-semibold text-slate-200">Modulacja Kanałów Jonowych</td>
                    <td className="p-3 bg-blue-950/10 border-r border-slate-800 text-slate-200">
                      Fosforylacja GluA1 (Ser845) i GluN2B → większa przewodność AMPA i brak desensytyzacji
                    </td>
                    <td className="p-3 bg-purple-950/10 text-slate-200">
                      Uwolniony <strong className="text-purple-300">Gβγ</strong> otwiera kanały GIRK (Kir3) i zamyka kanały Cav2.1/2.2 (P/Q, N)
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3 font-semibold text-slate-200">Zastosowanie Kliniczne & Farmakologia</td>
                    <td className="p-3 bg-blue-950/10 border-r border-slate-800 text-slate-300">
                      Agoniści D1 (badania nad funkcjami poznawczymi w schizofrenii i ADHD); facylitacja plastyczności kory przedczołowej
                    </td>
                    <td className="p-3 bg-purple-950/10 text-slate-300">
                      Leki przeciwpsychotyczne (antagoniści D2: haloperidol, olanzapina); agoniści D2 w ch. Parkinsona (pramipeksol, ropinirol)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
