import React from 'react';
import { DownstreamEffectorFeedback } from '../data/cascadeAnimationData';
import { 
  Activity, 
  Layers, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface DownstreamEffectorPanelProps {
  effectors: DownstreamEffectorFeedback[];
  activeStepIdx: number; // 0-indexed
  clinicalNote?: string;
}

export const DownstreamEffectorPanel: React.FC<DownstreamEffectorPanelProps> = ({
  effectors,
  activeStepIdx,
  clinicalNote
}) => {
  const currentStep = activeStepIdx + 1; // 1-indexed

  return (
    <div id="downstream-effector-feedback-panel" className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              Telemetria Efektorów Downstream w Czasie Rzeczywistym
            </h3>
            <p className="text-[11px] text-slate-500">
              Dynamiczny stan aktywacji kaskady enzymów, kanałów jonowych i przekaźników (Etap {currentStep})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
          <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Sygnał Aktywny</span>
        </div>
      </div>

      {/* Downstream Effectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {effectors.map((effector) => {
          const readout = effector.stepReadouts[currentStep] || {
            valuePercent: 0,
            displayValue: '0%',
            status: 'Brak danych',
            state: 'neutral' as const
          };

          // Theme according to state
          let barBg = 'bg-slate-400';
          let badgeClass = 'bg-slate-100 text-slate-700 border-slate-200';
          let textColor = 'text-slate-700';

          if (readout.state === 'active' || readout.state === 'open') {
            barBg = 'bg-emerald-500';
            badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            textColor = 'text-emerald-700';
          } else if (readout.state === 'inhibited' || readout.state === 'closed') {
            barBg = 'bg-rose-500';
            badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
            textColor = 'text-rose-700';
          } else if (readout.state === 'phosphorylated') {
            barBg = 'bg-pink-500';
            badgeClass = 'bg-pink-50 text-pink-700 border-pink-200';
            textColor = 'text-pink-700';
          } else if (readout.state === 'primed') {
            barBg = 'bg-amber-500';
            badgeClass = 'bg-amber-50 text-amber-800 border-amber-200';
            textColor = 'text-amber-800';
          }

          return (
            <div
              key={effector.id}
              id={`effector-card-${effector.id}`}
              className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-xs transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-800 text-xs">
                    {effector.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200/70 text-slate-600 font-semibold uppercase tracking-wider">
                    {effector.type}
                  </span>
                </div>
                <span className={`font-mono font-black text-sm ${textColor}`}>
                  {readout.displayValue}
                </span>
              </div>

              {/* Progress Gauge Bar */}
              <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${barBg}`}
                  style={{ width: `${Math.min(100, Math.max(4, readout.valuePercent))}%` }}
                />
              </div>

              {/* Status and Functional Impact */}
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border tracking-wide truncate ${badgeClass}`}>
                  {readout.status}
                </span>
                {effector.unit && (
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {effector.unit}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Clinical / Electrophysiological Takeaway Note */}
      {clinicalNote && (
        <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-900">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider text-[10px] text-indigo-700 block">
              Komentarz Kliniczny i Farmakodynamiczny
            </span>
            <p className="text-slate-700 leading-relaxed text-xs mt-0.5">
              {clinicalNote}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
