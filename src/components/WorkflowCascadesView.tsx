import React, { useState, useEffect } from 'react';
import { WorkflowCascade, ReceptorInfo } from '../types';
import { 
  CASCADE_VISUAL_REGISTRY, 
  CascadeNode 
} from '../data/cascadeAnimationData';
import { CascadeDiagramCanvas } from './CascadeDiagramCanvas';
import { DownstreamEffectorPanel } from './DownstreamEffectorPanel';
import { D1D2ComparisonCard } from './D1D2ComparisonCard';
import { CascadeKineticsBadge } from './CascadeKineticsOverlay';
import { 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Cpu,
  GitFork,
  Columns,
  Layers,
  GitCompare,
  SlidersHorizontal,
  ArrowLeftRight,
  Info
} from 'lucide-react';

interface WorkflowCascadesViewProps {
  cascades: WorkflowCascade[];
  receptors: ReceptorInfo[];
  onSelectReceptorById: (receptorId: string) => void;
  isAnimating?: boolean;
  initialViewMode?: 'single' | 'dual';
  initialCascadeA?: string;
  initialCascadeB?: string;
}

export const WorkflowCascadesView: React.FC<WorkflowCascadesViewProps> = ({
  cascades,
  receptors,
  onSelectReceptorById,
  isAnimating: isAnimatingProp,
  initialViewMode = 'dual',
  initialCascadeA,
  initialCascadeB
}) => {
  // View mode: 'single' or 'dual' (side-by-side comparison)
  const [viewMode, setViewMode] = useState<'single' | 'dual'>(initialViewMode);

  // Cascade A (Primary / Left in Dual View, defaults to D1 DARPP-32)
  const [selectedCascadeIdA, setSelectedCascadeIdA] = useState<string>(
    initialCascadeA || cascades.find(c => c.id === 'darpp32_cascade')?.id || cascades[0]?.id || ''
  );
  const [activeStepIdxA, setActiveStepIdxA] = useState<number>(0);
  const [isPlayingA, setIsPlayingA] = useState<boolean>(false);

  // Cascade B (Secondary / Right in Dual View, defaults to D2 Gi/o GIRK for immediate side-by-side comparison)
  const [selectedCascadeIdB, setSelectedCascadeIdB] = useState<string>(
    initialCascadeB || cascades.find(c => c.id === 'gio_girk_cav_pathway')?.id || cascades[1]?.id || cascades[0]?.id || ''
  );
  const [activeStepIdxB, setActiveStepIdxB] = useState<number>(0);
  const [isPlayingB, setIsPlayingB] = useState<boolean>(false);

  // Global playback settings
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState<boolean>(
    isAnimatingProp !== undefined ? isAnimatingProp : true
  );

  useEffect(() => {
    if (isAnimatingProp !== undefined) {
      setIsAnimating(isAnimatingProp);
    }
  }, [isAnimatingProp]);

  // Derived cascade objects & visual registries
  const currentCascadeA = cascades.find(c => c.id === selectedCascadeIdA) || cascades[0];
  const visualDataA = CASCADE_VISUAL_REGISTRY[currentCascadeA.id] || CASCADE_VISUAL_REGISTRY['darpp32_cascade'];

  const currentCascadeB = cascades.find(c => c.id === selectedCascadeIdB) || cascades[1] || cascades[0];
  const visualDataB = CASCADE_VISUAL_REGISTRY[currentCascadeB.id] || CASCADE_VISUAL_REGISTRY['gio_girk_cav_pathway'];

  // Automated playback simulation for Cascade A
  useEffect(() => {
    if (!isPlayingA) return;
    const intervalMs = Math.round(3600 / speedMultiplier);
    const timer = setInterval(() => {
      setActiveStepIdxA(prev => {
        if (prev >= currentCascadeA.steps.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlayingA, speedMultiplier, currentCascadeA.steps.length]);

  // Automated playback simulation for Cascade B
  useEffect(() => {
    if (!isPlayingB) return;
    const intervalMs = Math.round(3600 / speedMultiplier);
    const timer = setInterval(() => {
      setActiveStepIdxB(prev => {
        if (prev >= currentCascadeB.steps.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlayingB, speedMultiplier, currentCascadeB.steps.length]);

  // Change handlers
  const handleCascadeChangeA = (id: string) => {
    setSelectedCascadeIdA(id);
    setActiveStepIdxA(0);
    setIsPlayingA(false);
  };

  const handleCascadeChangeB = (id: string) => {
    setSelectedCascadeIdB(id);
    setActiveStepIdxB(0);
    setIsPlayingB(false);
  };

  const handleNodeSelectA = (node: CascadeNode) => {
    if (node.activeSteps && node.activeSteps.length > 0) {
      setActiveStepIdxA(node.activeSteps[0] - 1);
    }
  };

  const handleNodeSelectB = (node: CascadeNode) => {
    if (node.activeSteps && node.activeSteps.length > 0) {
      setActiveStepIdxB(node.activeSteps[0] - 1);
    }
  };

  // Synchronized playback controls
  const handleToggleSyncPlay = () => {
    const bothPlaying = isPlayingA && isPlayingB;
    const nextPlay = !bothPlaying;
    setIsPlayingA(nextPlay);
    setIsPlayingB(nextPlay);
  };

  const handleSyncReset = () => {
    setActiveStepIdxA(0);
    setActiveStepIdxB(0);
    setIsPlayingA(false);
    setIsPlayingB(false);
  };

  const handleSyncNext = () => {
    setActiveStepIdxA(prev => Math.min(currentCascadeA.steps.length - 1, prev + 1));
    setActiveStepIdxB(prev => Math.min(currentCascadeB.steps.length - 1, prev + 1));
  };

  const handleSyncPrev = () => {
    setActiveStepIdxA(prev => Math.max(0, prev - 1));
    setActiveStepIdxB(prev => Math.max(0, prev - 1));
  };

  // Quick Preset switcher
  const applyPreset = (idA: string, idB: string) => {
    setSelectedCascadeIdA(idA);
    setSelectedCascadeIdB(idB);
    setActiveStepIdxA(0);
    setActiveStepIdxB(0);
    setIsPlayingA(false);
    setIsPlayingB(false);
    setViewMode('dual');
  };

  // Swap Left and Right Panels
  const handleSwapCascades = () => {
    const tempId = selectedCascadeIdA;
    const tempStep = activeStepIdxA;
    const tempPlay = isPlayingA;
    setSelectedCascadeIdA(selectedCascadeIdB);
    setActiveStepIdxA(activeStepIdxB);
    setIsPlayingA(isPlayingB);
    setSelectedCascadeIdB(tempId);
    setActiveStepIdxB(tempStep);
    setIsPlayingB(tempPlay);
  };

  const getReceptorObj = (id: string) => receptors.find(r => r.id === id);

  return (
    <div id="workflow-cascades-container" className="space-y-6">
      {/* Top Header with Mode Toggles & Flow Animation Switch */}
      <div id="workflow-cascades-header" className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <GitFork className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Przekaźnictwo Synaptyczne & Kaskady Wewnątrzkomórkowe
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Szlaki Transdukcji Sygnału (Workflows)
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mt-0.5">
            Interaktywne modele biofizyczne kaskad białkowych, dynamiki przepływu jonów i modulacji postsynaptycznej.
          </p>
        </div>

        {/* Header Controls: Single vs Dual View + Animate Flow Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              id="view-mode-single-btn"
              onClick={() => setViewMode('single')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                viewMode === 'single'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60 font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Widok pojedynczej kaskady z pełnym schematem"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Pojedyncza</span>
            </button>
            <button
              id="view-mode-dual-btn"
              onClick={() => setViewMode('dual')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                viewMode === 'dual'
                  ? 'bg-indigo-600 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Widok Dual View: renderowanie dwóch kaskad obok siebie do porównania"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Dual View (Porównanie)</span>
            </button>
          </div>

          {/* D1 vs D2 Quick Comparison Shortcut Pill */}
          <button
            id="dual-view-preset-d1-d2"
            onClick={() => applyPreset('darpp32_cascade', 'gio_girk_cav_pathway')}
            className={`px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === 'dual' && selectedCascadeIdA === 'darpp32_cascade' && selectedCascadeIdB === 'gio_girk_cav_pathway'
                ? 'bg-amber-500/10 text-amber-900 border-amber-300 ring-2 ring-amber-400/30'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100/80 shadow-2xs'
            }`}
            title="Włącz porównanie szlaków dopaminergicznych D1 vs D2 (kinetyka PKA vs GIRK)"
          >
            <GitCompare className="w-3.5 h-3.5 text-amber-600" />
            <span>D1 vs D2 (Preset)</span>
          </button>

          {/* Animate Flow Toggle Switch */}
          <button
            id="workflow-header-animate-flow-toggle"
            onClick={() => setIsAnimating(prev => !prev)}
            className={`group px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2.5 shadow-xs ${
              isAnimating
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-indigo-100 hover:bg-indigo-700 ring-2 ring-indigo-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
            title="Przełącz animację przepływu cząsteczek wzdłuż ścieżek SVG (Animate Flow)"
            aria-pressed={isAnimating}
          >
            <div
              className={`w-7 h-4 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                isAnimating ? 'bg-indigo-950/40 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-white shadow-xs transition-transform duration-200" />
            </div>
            <Activity className={`w-3.5 h-3.5 ${isAnimating ? 'animate-pulse text-indigo-200' : 'text-slate-400'}`} />
            <span className="tracking-tight whitespace-nowrap">Animate Flow</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold ${
                isAnimating ? 'bg-indigo-700/80 text-indigo-100' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {isAnimating ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: DUAL VIEW (SIDE-BY-SIDE COMPARISON)                               */}
      {/* ========================================================================= */}
      {viewMode === 'dual' && (
        <div id="dual-view-workspace" className="space-y-6 animate-in fade-in duration-300">
          {/* Dual View Quick Presets & Master Synchronized Playback Bar */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <Columns className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    Dual View Master Bar
                  </span>
                  <h3 className="text-sm font-black text-white">
                    Synchroniczne Sterowanie & Presety Porównawcze
                  </h3>
                </div>
              </div>

              {/* Master Synchronized Playback Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  id="sync-play-btn"
                  onClick={handleToggleSyncPlay}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs ${
                    isPlayingA && isPlayingB
                      ? 'bg-rose-600 text-white hover:bg-rose-700'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                  title="Odtwarzaj obie kaskady synchronicznie w tym samym tempie"
                >
                  {isPlayingA && isPlayingB ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Zatrzymaj Obie (Sync Pause)</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Odtwarzaj Obie (Sync Play)</span>
                    </>
                  )}
                </button>

                <button
                  id="sync-reset-btn"
                  onClick={handleSyncReset}
                  className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  title="Resetuj obie kaskady do etapu 1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  id="swap-cascades-btn"
                  onClick={handleSwapCascades}
                  className="px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-xs font-semibold flex items-center gap-1.5"
                  title="Zamień Panel A z Panelem B miejscami"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Zamień A ⇄ B</span>
                </button>

                <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
                  <button
                    onClick={handleSyncPrev}
                    disabled={activeStepIdxA === 0 && activeStepIdxB === 0}
                    className="p-1 rounded-lg text-slate-300 hover:text-white disabled:opacity-30 transition-colors"
                    title="Poprzedni krok dla obu"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono text-slate-400 px-1">
                    Krok Sync
                  </span>
                  <button
                    onClick={handleSyncNext}
                    disabled={
                      activeStepIdxA === currentCascadeA.steps.length - 1 &&
                      activeStepIdxB === currentCascadeB.steps.length - 1
                    }
                    className="p-1 rounded-lg text-slate-300 hover:text-white disabled:opacity-30 transition-colors"
                    title="Następny krok dla obu"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Speed Multiplier */}
                <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-[11px] font-semibold text-slate-300">
                  <button
                    onClick={() => setSpeedMultiplier(0.5)}
                    className={`px-2 py-1 rounded-lg transition-all ${speedMultiplier === 0.5 ? 'bg-indigo-600 text-white font-bold' : 'hover:text-white'}`}
                  >
                    0.5x
                  </button>
                  <button
                    onClick={() => setSpeedMultiplier(1)}
                    className={`px-2 py-1 rounded-lg transition-all ${speedMultiplier === 1 ? 'bg-indigo-600 text-white font-bold' : 'hover:text-white'}`}
                  >
                    1x
                  </button>
                  <button
                    onClick={() => setSpeedMultiplier(2)}
                    className={`px-2 py-1 rounded-lg transition-all ${speedMultiplier === 2 ? 'bg-indigo-600 text-white font-bold' : 'hover:text-white'}`}
                  >
                    2x
                  </button>
                </div>
              </div>
            </div>

            {/* Presets List */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1 text-[11px]">
                <GitCompare className="w-3 h-3 text-indigo-400" /> Presety Porównań:
              </span>

              <button
                onClick={() => applyPreset('darpp32_cascade', 'gio_girk_cav_pathway')}
                className={`px-2.5 py-1 rounded-lg border font-semibold text-[11px] transition-colors ${
                  selectedCascadeIdA === 'darpp32_cascade' && selectedCascadeIdB === 'gio_girk_cav_pathway'
                    ? 'bg-amber-500/20 text-amber-200 border-amber-500/50'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                D1 vs D2 (Dopamina: Gs/PKA vs Gi/o/GIRK)
              </button>

              <button
                onClick={() => applyPreset('gq_plc_m_current', 'gio_girk_cav_pathway')}
                className={`px-2.5 py-1 rounded-lg border font-semibold text-[11px] transition-colors ${
                  selectedCascadeIdA === 'gq_plc_m_current' && selectedCascadeIdB === 'gio_girk_cav_pathway'
                    ? 'bg-amber-500/20 text-amber-200 border-amber-500/50'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                Gq vs Gi/o (Pobudzenie PLCβ vs Hamowanie GIRK)
              </button>

              <button
                onClick={() => applyPreset('ei_balance_circuit', 'retrograde_endocannabinoid')}
                className={`px-2.5 py-1 rounded-lg border font-semibold text-[11px] transition-colors ${
                  selectedCascadeIdA === 'ei_balance_circuit' && selectedCascadeIdB === 'retrograde_endocannabinoid'
                    ? 'bg-amber-500/20 text-amber-200 border-amber-500/50'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                E/I Balance vs CB1 Retrogradny (DSI/DSE)
              </button>

              <button
                onClick={() => applyPreset('trkb_bdnf_rtk_cascade', 'darpp32_cascade')}
                className={`px-2.5 py-1 rounded-lg border font-semibold text-[11px] transition-colors ${
                  selectedCascadeIdA === 'trkb_bdnf_rtk_cascade' && selectedCascadeIdB === 'darpp32_cascade'
                    ? 'bg-amber-500/20 text-amber-200 border-amber-500/50'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                RTK (TrkB / BDNF) vs GPCR (DARPP-32)
              </button>
            </div>
          </div>

          {/* D1 vs D2 / Comparative Pharmacodynamics Matrix Card */}
          <D1D2ComparisonCard
            cascadeA={currentCascadeA}
            cascadeB={currentCascadeB}
            stepIdxA={activeStepIdxA}
            stepIdxB={activeStepIdxB}
            speedMultiplier={speedMultiplier}
            visualDataA={visualDataA}
            visualDataB={visualDataB}
          />

          {/* Guidance if identical cascade is selected in both panels */}
          {selectedCascadeIdA === selectedCascadeIdB && (
            <div className="p-4 bg-amber-950/40 rounded-2xl border border-amber-500/40 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  W obu panelach wybrano tę samą kaskadę (<strong>{currentCascadeA.title.split('(')[0].trim()}</strong>). Wybierz inny szlak w Panelu B, aby bezpośrednio porównać kinetykę i latencję dwóch różnych ścieżek transdukcji.
                </span>
              </div>
              <button
                onClick={() => handleCascadeChangeB(selectedCascadeIdA === 'darpp32_cascade' ? 'gio_girk_cav_pathway' : 'darpp32_cascade')}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition-colors shadow-xs"
              >
                Przełącz Panel B na {selectedCascadeIdA === 'darpp32_cascade' ? 'D2 (Gi/o GIRK)' : 'D1 (DARPP-32)'}
              </button>
            </div>
          )}

          {/* Side-by-Side Dual Column Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            {/* ============================================================= */}
            {/* COLUMN A: CASCADE A (e.g. D1 / DARPP-32)                      */}
            {/* ============================================================= */}
            <div id="dual-view-column-a" className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-5">
              {/* Column A Selector Header */}
              <div className="space-y-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                    PANEL A (Lewa Strona)
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    ID: {currentCascadeA.id}
                  </span>
                </div>

                {/* Cascade Selector Dropdown */}
                <div>
                  <label htmlFor="select-cascade-a" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Wybierz Kaskadę A:
                  </label>
                  <select
                    id="select-cascade-a"
                    value={selectedCascadeIdA}
                    onChange={(e) => handleCascadeChangeA(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {cascades.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.category})
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {currentCascadeA.subtitle}
                </p>

                {/* Involved Receptors Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Receptory:</span>
                  {currentCascadeA.receptorsInvolved.map(recId => {
                    const rec = getReceptorObj(recId);
                    return (
                      <button
                        key={recId}
                        onClick={() => onSelectReceptorById(recId)}
                        className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center gap-1"
                        title="Kliknij, aby otworzyć kartę receptora"
                      >
                        <span>{rec ? rec.name : recId.toUpperCase()}</span>
                        <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Column A Stepper & Playback Bar */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlayingA(!isPlayingA)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        isPlayingA ? 'bg-rose-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {isPlayingA ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                      <span>{isPlayingA ? 'Pauza' : 'Graj A'}</span>
                    </button>
                    <button
                      onClick={() => { setActiveStepIdxA(0); setIsPlayingA(false); }}
                      className="p-1 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
                      title="Reset do etapu 1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    {/* Column A Kinetic Parameters Tooltip Badge */}
                    <CascadeKineticsBadge
                      flowPaths={visualDataA.flowPaths}
                      currentStepNumber={activeStepIdxA + 1}
                      totalSteps={currentCascadeA.steps.length}
                      speedMultiplier={speedMultiplier}
                      cascadeId={`dual-a-${currentCascadeA.id}`}
                    />
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <span className="font-mono text-[11px]">
                      Etap {activeStepIdxA + 1} / {currentCascadeA.steps.length}
                    </span>
                    <button
                      onClick={() => setActiveStepIdxA(Math.max(0, activeStepIdxA - 1))}
                      disabled={activeStepIdxA === 0}
                      className="p-1 rounded border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-100"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setActiveStepIdxA(Math.min(currentCascadeA.steps.length - 1, activeStepIdxA + 1))}
                      disabled={activeStepIdxA === currentCascadeA.steps.length - 1}
                      className="p-1 rounded border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-100"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Stepper Tabs */}
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                  {currentCascadeA.steps.map((st, idx) => {
                    const isActive = idx === activeStepIdxA;
                    const isPast = idx < activeStepIdxA;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveStepIdxA(idx)}
                        className={`p-1.5 rounded-lg text-left border transition-all text-[11px] ${
                          isActive
                            ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                            : isPast
                            ? 'bg-blue-50 text-blue-900 border-blue-200'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span>Krok {st.stepNumber}</span>
                          {isPast && <CheckCircle2 className="w-3 h-3 text-blue-500" />}
                        </div>
                        <div className="truncate font-medium text-[10px] mt-0.5">
                          {st.action}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Diagram Canvas A */}
              <CascadeDiagramCanvas
                visualData={visualDataA}
                activeStepIdx={activeStepIdxA}
                onSelectNode={handleNodeSelectA}
                speedMultiplier={speedMultiplier}
                isAnimating={isAnimating}
                canvasId="dual-canvas-a"
              />

              {/* Downstream Effector Feedback Panel A */}
              <DownstreamEffectorPanel
                effectors={visualDataA.downstreamEffectors}
                activeStepIdx={activeStepIdxA}
                clinicalNote={visualDataA.synapticMetricsByStep[activeStepIdxA + 1]?.clinicalNote}
              />

              {/* Active Step Deep-Dive Card A */}
              {currentCascadeA.steps[activeStepIdxA] && (
                <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                      {currentCascadeA.steps[activeStepIdxA].stepNumber}
                    </span>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
                        {currentCascadeA.steps[activeStepIdxA].compartment}
                      </span>
                      <h4 className="font-bold text-white text-xs truncate">
                        {currentCascadeA.steps[activeStepIdxA].action}
                      </h4>
                    </div>
                  </div>
                  <div className="space-y-1 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Mechanizm Molekularny & Aktor: {currentCascadeA.steps[activeStepIdxA].actor}
                    </span>
                    <p className="text-slate-200 leading-relaxed">
                      {currentCascadeA.steps[activeStepIdxA].molecularDetail}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ============================================================= */}
            {/* COLUMN B: CASCADE B (e.g. D2 / Gi/o / GIRK)                   */}
            {/* ============================================================= */}
            <div id="dual-view-column-b" className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-5">
              {/* Column B Selector Header */}
              <div className="space-y-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200">
                    PANEL B (Prawa Strona)
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    ID: {currentCascadeB.id}
                  </span>
                </div>

                {/* Cascade Selector Dropdown */}
                <div>
                  <label htmlFor="select-cascade-b" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Wybierz Kaskadę B:
                  </label>
                  <select
                    id="select-cascade-b"
                    value={selectedCascadeIdB}
                    onChange={(e) => handleCascadeChangeB(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    {cascades.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.category})
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {currentCascadeB.subtitle}
                </p>

                {/* Involved Receptors Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Receptory:</span>
                  {currentCascadeB.receptorsInvolved.map(recId => {
                    const rec = getReceptorObj(recId);
                    return (
                      <button
                        key={recId}
                        onClick={() => onSelectReceptorById(recId)}
                        className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 hover:border-purple-400 hover:text-purple-600 transition-colors flex items-center gap-1"
                        title="Kliknij, aby otworzyć kartę receptora"
                      >
                        <span>{rec ? rec.name : recId.toUpperCase()}</span>
                        <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Column B Stepper & Playback Bar */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlayingB(!isPlayingB)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        isPlayingB ? 'bg-rose-600 text-white' : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {isPlayingB ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                      <span>{isPlayingB ? 'Pauza' : 'Graj B'}</span>
                    </button>
                    <button
                      onClick={() => { setActiveStepIdxB(0); setIsPlayingB(false); }}
                      className="p-1 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
                      title="Reset do etapu 1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    {/* Column B Kinetic Parameters Tooltip Badge */}
                    <CascadeKineticsBadge
                      flowPaths={visualDataB.flowPaths}
                      currentStepNumber={activeStepIdxB + 1}
                      totalSteps={currentCascadeB.steps.length}
                      speedMultiplier={speedMultiplier}
                      cascadeId={`dual-b-${currentCascadeB.id}`}
                    />
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <span className="font-mono text-[11px]">
                      Etap {activeStepIdxB + 1} / {currentCascadeB.steps.length}
                    </span>
                    <button
                      onClick={() => setActiveStepIdxB(Math.max(0, activeStepIdxB - 1))}
                      disabled={activeStepIdxB === 0}
                      className="p-1 rounded border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-100"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setActiveStepIdxB(Math.min(currentCascadeB.steps.length - 1, activeStepIdxB + 1))}
                      disabled={activeStepIdxB === currentCascadeB.steps.length - 1}
                      className="p-1 rounded border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-100"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Stepper Tabs */}
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                  {currentCascadeB.steps.map((st, idx) => {
                    const isActive = idx === activeStepIdxB;
                    const isPast = idx < activeStepIdxB;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveStepIdxB(idx)}
                        className={`p-1.5 rounded-lg text-left border transition-all text-[11px] ${
                          isActive
                            ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs'
                            : isPast
                            ? 'bg-purple-50 text-purple-900 border-purple-200'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span>Krok {st.stepNumber}</span>
                          {isPast && <CheckCircle2 className="w-3 h-3 text-purple-500" />}
                        </div>
                        <div className="truncate font-medium text-[10px] mt-0.5">
                          {st.action}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Diagram Canvas B */}
              <CascadeDiagramCanvas
                visualData={visualDataB}
                activeStepIdx={activeStepIdxB}
                onSelectNode={handleNodeSelectB}
                speedMultiplier={speedMultiplier}
                isAnimating={isAnimating}
                canvasId="dual-canvas-b"
              />

              {/* Downstream Effector Feedback Panel B */}
              <DownstreamEffectorPanel
                effectors={visualDataB.downstreamEffectors}
                activeStepIdx={activeStepIdxB}
                clinicalNote={visualDataB.synapticMetricsByStep[activeStepIdxB + 1]?.clinicalNote}
              />

              {/* Active Step Deep-Dive Card B */}
              {currentCascadeB.steps[activeStepIdxB] && (
                <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                    <span className="w-6 h-6 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
                      {currentCascadeB.steps[activeStepIdxB].stepNumber}
                    </span>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
                        {currentCascadeB.steps[activeStepIdxB].compartment}
                      </span>
                      <h4 className="font-bold text-white text-xs truncate">
                        {currentCascadeB.steps[activeStepIdxB].action}
                      </h4>
                    </div>
                  </div>
                  <div className="space-y-1 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Mechanizm Molekularny & Aktor: {currentCascadeB.steps[activeStepIdxB].actor}
                    </span>
                    <p className="text-slate-200 leading-relaxed">
                      {currentCascadeB.steps[activeStepIdxB].molecularDetail}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: SINGLE CASCADE VIEW (CLASSIC FULL LAYOUT)                         */}
      {/* ========================================================================= */}
      {viewMode === 'single' && (
        <div id="single-view-workspace" className="space-y-6 animate-in fade-in duration-300">
          {/* Top Selector: 6 Major CNS Workflows */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {cascades.map(cascade => {
              const isSelected = cascade.id === currentCascadeA.id;
              return (
                <button
                  key={cascade.id}
                  id={`cascade-btn-${cascade.id}`}
                  onClick={() => handleCascadeChangeA(cascade.id)}
                  className={`p-4 rounded-2xl text-left border transition-all relative overflow-hidden ${
                    isSelected 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-indigo-500/50' 
                      : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className={`px-2 py-0.5 rounded font-semibold text-[10px] uppercase tracking-wider ${
                      isSelected ? 'bg-indigo-500/30 text-indigo-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {cascade.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {cascade.steps.length} etapów
                    </span>
                  </div>
                  <h3 className="font-bold text-sm line-clamp-1">{cascade.title}</h3>
                  <p className={`text-xs mt-1 line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {cascade.subtitle}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Main Cascade Workspace */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Cascade Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                    {currentCascadeA.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">ID: {currentCascadeA.id}</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{currentCascadeA.title}</h2>
                <p className="text-sm text-slate-600 max-w-3xl">{currentCascadeA.subtitle}</p>
              </div>

              {/* Involved Receptors Chips & Quick Dual View Trigger */}
              <div className="flex flex-col items-start md:items-end gap-2">
                <div className="flex items-center gap-2">
                  <button
                    id="single-view-compare-btn"
                    onClick={() => {
                      if (currentCascadeA.id === 'darpp32_cascade') {
                        applyPreset('darpp32_cascade', 'gio_girk_cav_pathway');
                      } else if (currentCascadeA.id === 'gio_girk_cav_pathway') {
                        applyPreset('darpp32_cascade', 'gio_girk_cav_pathway');
                      } else {
                        setSelectedCascadeIdB(currentCascadeA.id === 'darpp32_cascade' ? 'gio_girk_cav_pathway' : 'darpp32_cascade');
                        setViewMode('dual');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    title="Otwórz tryb Dual View dla porównania kinetyki side-by-side"
                  >
                    <Columns className="w-3.5 h-3.5" />
                    <span>Porównaj w Dual View</span>
                  </button>
                </div>

                <div className="flex flex-col items-start md:items-end gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Uczestniczące Receptory OUN:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentCascadeA.receptorsInvolved.map(recId => {
                      const rec = getReceptorObj(recId);
                      return (
                        <button
                          key={recId}
                          onClick={() => onSelectReceptorById(recId)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 hover:border-indigo-500 hover:text-indigo-600 transition-colors flex items-center gap-1 shadow-2xs"
                          title="Kliknij, aby otworzyć kartę receptora"
                        >
                          <span>{rec ? rec.name : recId.toUpperCase()}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Biological Summary Bar */}
            <div className="px-6 py-4 bg-indigo-50/30 border-b border-indigo-100/50 grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-indigo-900 uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-600" /> Istota Biologiczna
                </span>
                <p className="text-slate-700 leading-relaxed">{currentCascadeA.summary}</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-indigo-900 uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Activity className="w-3 h-3 text-indigo-600" /> Skutek Elektrofizjologiczny
                </span>
                <p className="text-slate-700 leading-relaxed">{currentCascadeA.electrophysiologicalEffect}</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-indigo-900 uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-indigo-600" /> Znaczenie Kliniczne
                </span>
                <p className="text-slate-700 leading-relaxed">{currentCascadeA.clinicalRelevance}</p>
              </div>
            </div>

            {/* Stepper Timeline & Playback Controls Bar */}
            <div className="px-6 pt-6 pb-2 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    id="play-cascade-toggle-btn"
                    onClick={() => setIsPlayingA(!isPlayingA)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs ${
                      isPlayingA 
                        ? 'bg-rose-600 text-white hover:bg-rose-700' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {isPlayingA ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Zatrzymaj Symulację</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Odtwarzaj Kaskadę (Live)</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setActiveStepIdxA(0);
                      setIsPlayingA(false);
                    }}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                    title="Resetuj do etapu 1"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* Speed Multipliers */}
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-600">
                    <button
                      onClick={() => setSpeedMultiplier(0.5)}
                      className={`px-2 py-0.5 rounded-md transition-all ${speedMultiplier === 0.5 ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'hover:text-slate-900'}`}
                    >
                      0.5x
                    </button>
                    <button
                      onClick={() => setSpeedMultiplier(1)}
                      className={`px-2 py-0.5 rounded-md transition-all ${speedMultiplier === 1 ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'hover:text-slate-900'}`}
                    >
                      1x
                    </button>
                    <button
                      onClick={() => setSpeedMultiplier(2)}
                      className={`px-2 py-0.5 rounded-md transition-all ${speedMultiplier === 2 ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'hover:text-slate-900'}`}
                    >
                      2x
                    </button>
                  </div>

                  {/* Single View Kinetic Parameters Tooltip Badge */}
                  <CascadeKineticsBadge
                    flowPaths={visualDataA.flowPaths}
                    currentStepNumber={activeStepIdxA + 1}
                    totalSteps={currentCascadeA.steps.length}
                    speedMultiplier={speedMultiplier}
                    cascadeId={`single-${currentCascadeA.id}`}
                  />
                </div>

                {/* Stepper Navigation Buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">
                    Etap {activeStepIdxA + 1} z {currentCascadeA.steps.length}
                  </span>
                  <button
                    onClick={() => setActiveStepIdxA(Math.max(0, activeStepIdxA - 1))}
                    disabled={activeStepIdxA === 0}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-100 transition-colors"
                    title="Poprzedni krok"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveStepIdxA(Math.min(currentCascadeA.steps.length - 1, activeStepIdxA + 1))}
                    disabled={activeStepIdxA === currentCascadeA.steps.length - 1}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-100 transition-colors"
                    title="Następny krok"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stepper Progress Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {currentCascadeA.steps.map((st, idx) => {
                  const isActive = idx === activeStepIdxA;
                  const isPast = idx < activeStepIdxA;
                  return (
                    <button
                      key={idx}
                      id={`step-tab-${idx}`}
                      onClick={() => setActiveStepIdxA(idx)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        isActive 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-semibold' 
                          : isPast 
                          ? 'bg-indigo-50/50 text-indigo-900 border-indigo-200' 
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span>Etap {st.stepNumber}</span>
                        {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />}
                      </div>
                      <div className="text-xs truncate font-medium">
                        {st.action}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Diagram Canvas & Panels */}
            <div className="p-6 space-y-6">
              {/* PRIMARY WORKFLOW DIAGRAM: Animated SVG Paths & Ion Flows */}
              <CascadeDiagramCanvas
                visualData={visualDataA}
                activeStepIdx={activeStepIdxA}
                onSelectNode={handleNodeSelectA}
                speedMultiplier={speedMultiplier}
                isAnimating={isAnimating}
                canvasId="cascade-svg-canvas-container"
              />

              {/* DOWNSTREAM EFFECTOR FEEDBACK PANEL */}
              <DownstreamEffectorPanel
                effectors={visualDataA.downstreamEffectors}
                activeStepIdx={activeStepIdxA}
                clinicalNote={visualDataA.synapticMetricsByStep[activeStepIdxA + 1]?.clinicalNote}
              />

              {/* Active Step Deep-Dive Card */}
              {currentCascadeA.steps[activeStepIdxA] && (
                <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                        {currentCascadeA.steps[activeStepIdxA].stepNumber}
                      </span>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                          Przedział komórkowy: {currentCascadeA.steps[activeStepIdxA].compartment}
                        </span>
                        <h3 className="text-lg font-bold text-white">
                          {currentCascadeA.steps[activeStepIdxA].action}
                        </h3>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-indigo-300">
                      Aktor molekularny: {currentCascadeA.steps[activeStepIdxA].actor}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Mechanizm Molekularny
                      </span>
                      <p className="text-slate-200 leading-relaxed text-sm">
                        {currentCascadeA.steps[activeStepIdxA].molecularDetail}
                      </p>
                    </div>

                    <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Konsekwencja Fizjologiczna dla Synapsy
                      </span>
                      <p className="text-slate-200 leading-relaxed text-sm">
                        {currentCascadeA.steps[activeStepIdxA].significance}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
