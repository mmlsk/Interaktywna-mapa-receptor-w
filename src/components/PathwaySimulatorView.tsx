import React, { useState } from 'react';
import { SimulationDrug, ReceptorInfo } from '../types';
import { 
  Zap, 
  RotateCcw, 
  Activity, 
  Pill, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Play,
  Gauge
} from 'lucide-react';

interface PathwaySimulatorViewProps {
  drugs: SimulationDrug[];
  receptors: ReceptorInfo[];
  onSelectReceptorById: (receptorId: string) => void;
  presetReceptorId?: string | null;
}

export const PathwaySimulatorView: React.FC<PathwaySimulatorViewProps> = ({
  drugs,
  receptors,
  onSelectReceptorById,
  presetReceptorId
}) => {
  const [activeDrugId, setActiveDrugId] = useState<string | null>(null);

  // Baseline cellular resting parameters
  const baseline = {
    membranePotentialMv: -70, // resting mV
    cAMP: 100, // baseline index (nM)
    pkaActivity: 50, // %
    intracellularCalcium: 100, // nM
    pkcActivity: 50, // %
    girkConductance: 20, // pS
    excitabilityIndex: 50, // %
    crebPhosphorylation: 40 // %
  };

  const activeDrug = drugs.find(d => d.id === activeDrugId);

  // Calculate simulated values
  const currentValues = {
    membranePotentialMv: baseline.membranePotentialMv + (activeDrug?.affectedParameters.membranePotentialMv || 0),
    cAMP: Math.max(10, baseline.cAMP + (activeDrug?.affectedParameters.cAMP || 0)),
    pkaActivity: Math.min(100, Math.max(5, baseline.pkaActivity + (activeDrug?.affectedParameters.pkaActivity || 0))),
    intracellularCalcium: Math.max(30, baseline.intracellularCalcium + (activeDrug?.affectedParameters.intracellularCalcium || 0)),
    pkcActivity: Math.min(100, Math.max(5, baseline.pkcActivity + (activeDrug?.affectedParameters.pkcActivity || 0))),
    girkConductance: Math.min(100, Math.max(0, baseline.girkConductance + (activeDrug?.affectedParameters.girkConductance || 0))),
    excitabilityIndex: Math.min(100, Math.max(5, baseline.excitabilityIndex + (activeDrug?.affectedParameters.excitabilityIndex || 0))),
    crebPhosphorylation: Math.min(100, Math.max(5, baseline.crebPhosphorylation + (activeDrug?.affectedParameters.crebPhosphorylation || 0)))
  };

  const targetReceptor = activeDrug ? receptors.find(r => r.id === activeDrug.targetReceptorId) : null;

  return (
    <div id="pathway-simulator-container" className="space-y-6">
      {/* Simulation Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              Laboratorium Farmakodynamiczne OUN
            </span>
            <span className="text-xs text-slate-400 font-medium">Model Elektrofizjologiczny & Wtórnych Przekaźników</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Wirtualny Reaktor Synaptyczny</h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Wprowadź cząsteczkę modulującą lub substancję psychoaktywną, aby zaobserwować dynamiczną rekonfigurację potencjału błonowego, kaskad kinazowych i ekspresji genomowej.
          </p>
        </div>

        <button
          onClick={() => setActiveDrugId(null)}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors flex items-center gap-2 self-start md:self-auto"
        >
          <RotateCcw className="w-4 h-4" />
          Resetuj do Stanu Spoczynkowego
        </button>
      </div>

      {/* Drug Selection Pills */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Pill className="w-4 h-4 text-indigo-600" />
            Wybierz Substancję / Ligand do Podania:
          </span>
          {activeDrug && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Podano: {activeDrug.name}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {drugs.map(drug => {
            const isSelected = drug.id === activeDrugId;
            return (
              <button
                key={drug.id}
                id={`drug-btn-${drug.id}`}
                onClick={() => setActiveDrugId(isSelected ? null : drug.id)}
                className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-indigo-500' 
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-white hover:border-indigo-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className={`font-mono uppercase ${isSelected ? 'text-indigo-300' : 'text-slate-400'}`}>
                      {drug.targetReceptorId.toUpperCase()}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded font-bold ${
                      drug.actionType === 'agonist' ? 'bg-emerald-500/20 text-emerald-400' :
                      drug.actionType === 'antagonist' ? 'bg-rose-500/20 text-rose-400' :
                      drug.actionType === 'pam' ? 'bg-sky-500/20 text-sky-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {drug.actionType.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs line-clamp-1">{drug.name}</h4>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-Time Telemetry Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Potencjał Błonowy Em */}
        <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Potencjał Błonowy (Em)</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight">{currentValues.membranePotentialMv}</span>
            <span className="text-slate-400 text-sm font-mono">mV</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden relative">
            <div 
              className={`h-full transition-all duration-500 ${
                currentValues.membranePotentialMv > -70 ? 'bg-amber-500' : 'bg-sky-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(10, ((currentValues.membranePotentialMv + 90) / 40) * 100))}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            {currentValues.membranePotentialMv > -70 
              ? 'Depolaryzacja błony (zbliżenie do progu pobudzenia -55 mV)' 
              : currentValues.membranePotentialMv < -70 
              ? 'Hiperpolaryzacja błony (wygaszenie wyładowań)' 
              : 'Spoczynkowy potencjał polaryzacji'}
          </p>
        </div>

        {/* Metric 2: cAMP & PKA */}
        <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Sygnalizacja cAMP / PKA</span>
            <Zap className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight">{currentValues.cAMP}</span>
            <span className="text-slate-400 text-sm font-mono">nM cAMP</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-sky-500 transition-all duration-500"
              style={{ width: `${(currentValues.cAMP / 160) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>PKA Aktywność:</span>
            <span className="font-bold text-sky-400 font-mono">{currentValues.pkaActivity}%</span>
          </div>
        </div>

        {/* Metric 3: Wapń [Ca2+]i & PKC */}
        <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Wapń Cytozolowy [Ca2+]i</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight">{currentValues.intracellularCalcium}</span>
            <span className="text-slate-400 text-sm font-mono">nM</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-amber-500 transition-all duration-500"
              style={{ width: `${Math.min(100, (currentValues.intracellularCalcium / 180) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>PKC Aktywność:</span>
            <span className="font-bold text-amber-400 font-mono">{currentValues.pkcActivity}%</span>
          </div>
        </div>

        {/* Metric 4: Pobudliwość & Prąd GIRK */}
        <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Indeks Pobudliwości Sieci</span>
            <Gauge className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight">{currentValues.excitabilityIndex}%</span>
            <span className="text-slate-400 text-sm font-mono">wzbudzenia</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                currentValues.excitabilityIndex > 50 ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${currentValues.excitabilityIndex}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>GIRK Przewodnictwo:</span>
            <span className="font-bold text-emerald-400 font-mono">{currentValues.girkConductance} pS</span>
          </div>
        </div>
      </div>

      {/* Drug Explanation Panel */}
      {activeDrug ? (
        <div className="bg-white p-6 rounded-3xl border border-indigo-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                Analiza Mechanizmu Działania
              </span>
              <h3 className="text-xl font-bold text-slate-900">{activeDrug.name}</h3>
            </div>
            {targetReceptor && (
              <button
                onClick={() => onSelectReceptorById(targetReceptor.id)}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto border border-indigo-200"
              >
                Karta Receptora {targetReceptor.name} <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {activeDrug.description}
          </p>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block mb-0.5">Integracja Kliniczna</span>
              Zaobserwowane przesunięcia parametrów korelują bezpośrednio z efektami obserwowanymi w EEG i mikroskopii dwufotonowej u ludzi i modeli naczelnych.
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 bg-slate-50 rounded-3xl border border-dashed border-slate-300 text-center text-slate-500 text-xs">
          Wybierz jedną z powyższych substancji, aby zaaplikować ją do wirtualnej synapsy i przeanalizować kaskadowy rezonans.
        </div>
      )}
    </div>
  );
};
