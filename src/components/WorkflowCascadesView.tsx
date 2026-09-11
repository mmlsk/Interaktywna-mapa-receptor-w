import React, { useState, useEffect } from 'react';
import { WorkflowCascade, ReceptorInfo } from '../types';
import { CASCADE_VISUAL_REGISTRY, CascadeNode } from '../data/cascadeAnimationData';
import { DownstreamEffectorPanel } from './DownstreamEffectorPanel';
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
  Eye, 
  Zap, 
  Cpu 
} from 'lucide-react';

interface WorkflowCascadesViewProps {
  cascades: WorkflowCascade[];
  receptors: ReceptorInfo[];
  onSelectReceptorById: (receptorId: string) => void;
}

export const WorkflowCascadesView: React.FC<WorkflowCascadesViewProps> = ({
  cascades,
  receptors,
  onSelectReceptorById
}) => {
  const [selectedCascadeId, setSelectedCascadeId] = useState<string>(cascades[0]?.id || '');
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [animateFlow, setAnimateFlow] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const currentCascade = cascades.find(c => c.id === selectedCascadeId) || cascades[0];
  const visualData = CASCADE_VISUAL_REGISTRY[currentCascade.id] || CASCADE_VISUAL_REGISTRY['darpp32_cascade'];
  const currentStepNumber = activeStepIdx + 1; // 1-indexed

  // Automated playback simulation
  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = Math.round(3600 / speedMultiplier);
    const timer = setInterval(() => {
      setActiveStepIdx(prev => {
        if (prev >= currentCascade.steps.length - 1) {
          return 0; // loop back to first step
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, speedMultiplier, currentCascade.steps.length]);

  const handleCascadeChange = (id: string) => {
    setSelectedCascadeId(id);
    setActiveStepIdx(0);
    setIsPlaying(false);
  };

  const handleNodeSelect = (node: CascadeNode) => {
    if (node.activeSteps && node.activeSteps.length > 0) {
      setActiveStepIdx(node.activeSteps[0] - 1);
    }
  };

  const getReceptorObj = (id: string) => receptors.find(r => r.id === id);

  const activeMetrics = visualData.synapticMetricsByStep[currentStepNumber] || {
    membranePotentialMv: -70,
    calciumIntracellularNm: 100,
    netSynapticState: 'Stan spoczynkowy',
    clinicalNote: ''
  };

  return (
    <div id="workflow-cascades-container" className="space-y-6">
      {/* Top Selector: 6 Major CNS Workflows */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {cascades.map(cascade => {
          const isSelected = cascade.id === currentCascade.id;
          return (
            <button
              key={cascade.id}
              id={`cascade-btn-${cascade.id}`}
              onClick={() => handleCascadeChange(cascade.id)}
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
                {currentCascade.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {currentCascade.id}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{currentCascade.title}</h2>
            <p className="text-sm text-slate-600 max-w-3xl">{currentCascade.subtitle}</p>
          </div>

          {/* Header Controls: Animate Flow Toggle & Involved Receptors Chips */}
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start md:items-end lg:items-center gap-3">
            {/* 'Animate Flow' Toggle Control in Header */}
            <button
              id="animate-flow-toggle"
              onClick={() => setAnimateFlow(prev => !prev)}
              className={`group px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2.5 shadow-xs ${
                animateFlow
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-indigo-100 hover:bg-indigo-700 ring-2 ring-indigo-500/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
              title="Przełącz animację przepływu cząsteczek wzdłuż ścieżek SVG (Animate Flow)"
              aria-pressed={animateFlow}
            >
              {/* Toggle Switch Pill */}
              <div
                className={`w-7 h-4 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                  animateFlow ? 'bg-indigo-900/40 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-white shadow-xs transition-transform duration-200" />
              </div>
              <Activity className={`w-3.5 h-3.5 ${animateFlow ? 'animate-pulse text-indigo-200' : 'text-slate-400'}`} />
              <span className="tracking-tight whitespace-nowrap">Animate Flow</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold ${
                  animateFlow ? 'bg-indigo-700/80 text-indigo-100' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {animateFlow ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Involved Receptors Chips */}
            <div className="flex flex-col items-start md:items-end gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Uczestniczące Receptory OUN:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentCascade.receptorsInvolved.map(recId => {
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
            <p className="text-slate-700 leading-relaxed">{currentCascade.summary}</p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-indigo-900 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <Activity className="w-3 h-3 text-indigo-600" /> Skutek Elektrofizjologiczny
            </span>
            <p className="text-slate-700 leading-relaxed">{currentCascade.electrophysiologicalEffect}</p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-indigo-900 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-indigo-600" /> Znaczenie Kliniczne
            </span>
            <p className="text-slate-700 leading-relaxed">{currentCascade.clinicalRelevance}</p>
          </div>
        </div>

        {/* Stepper Timeline & Playback Controls Bar */}
        <div className="px-6 pt-6 pb-2 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                id="play-cascade-toggle-btn"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs ${
                  isPlaying 
                    ? 'bg-rose-600 text-white hover:bg-rose-700' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isPlaying ? (
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
                  setActiveStepIdx(0);
                  setIsPlaying(false);
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
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">
                Etap {activeStepIdx + 1} z {currentCascade.steps.length}
              </span>
              <button
                onClick={() => setActiveStepIdx(Math.max(0, activeStepIdx - 1))}
                disabled={activeStepIdx === 0}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-100 transition-colors"
                title="Poprzedni krok"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveStepIdx(Math.min(currentCascade.steps.length - 1, activeStepIdx + 1))}
                disabled={activeStepIdx === currentCascade.steps.length - 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-100 transition-colors"
                title="Następny krok"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {currentCascade.steps.map((st, idx) => {
              const isActive = idx === activeStepIdx;
              const isPast = idx < activeStepIdx;
              return (
                <button
                  key={idx}
                  id={`step-tab-${idx}`}
                  onClick={() => setActiveStepIdx(idx)}
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

        {/* PRIMARY WORKFLOW DIAGRAM: Animated SVG Paths & Ion Flows with Particles */}
        <div className="p-6 space-y-6">
          <div id="cascade-svg-canvas-container" className="relative bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden select-none">
            {/* Top Telemetry & Controls Bar */}
            <div className="px-4 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-bold text-slate-200 tracking-wide flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-400" />
                  Biofizyczny Schemat Kaskady Transdukcji (Ścieżki & Przepływ Jonów)
                </span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 font-mono text-[10px]">
                  Etap {currentStepNumber}
                </span>
              </div>

              {/* View toggles */}
              <div className="flex items-center gap-2">
                <button
                  id="canvas-animate-flow-toggle"
                  onClick={() => setAnimateFlow(!animateFlow)}
                  className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 text-[11px] font-medium ${
                    animateFlow 
                      ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500/50 shadow-xs' 
                      : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                  title="Włącz / Wyłącz animację przepływu cząsteczek i jonów (Animate Flow)"
                  aria-pressed={animateFlow}
                >
                  <Activity className={`w-3 h-3 ${animateFlow ? 'text-indigo-400 animate-pulse' : ''}`} />
                  <span>Animate Flow: {animateFlow ? 'WŁ' : 'WYŁ'}</span>
                </button>

                <button
                  onClick={() => setShowLabels(!showLabels)}
                  className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 text-[11px] font-medium ${
                    showLabels 
                      ? 'bg-slate-800 text-slate-200 border-slate-700' 
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                  title="Przełącz etykiety molekularne"
                >
                  <Eye className="w-3 h-3" />
                  <span>Etykiety</span>
                </button>
              </div>
            </div>

            {/* SVG Canvas with Animated Path Markers & Molecules */}
            <div className="relative w-full overflow-x-auto">
              <svg
                viewBox={`0 0 760 ${visualData.canvasHeight}`}
                className="w-full h-auto min-w-[700px] block"
                style={{ background: 'radial-gradient(ellipse at 50% 30%, #0f172a 0%, #020617 100%)' }}
              >
                {/* DEFINITIONS: Animated SVG Path Markers ('Particles'), Gradients, Filters */}
                <defs>
                  {/* --- ANIMATED SVG PATH MARKERS ('PARTICLES') --- */}
                  {/* Ca2+ Ion Particle Marker */}
                  <marker
                    id="particle-marker-ca2"
                    viewBox="0 0 24 24"
                    refX="12"
                    refY="12"
                    markerWidth="14"
                    markerHeight="14"
                    orient="auto"
                  >
                    <circle cx="12" cy="12" r="8.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5">
                      <animate attributeName="r" values="7.5;9.5;7.5" dur="1.2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.85;1;0.85" dur="1.2s" repeatCount="indefinite" />
                    </circle>
                    <text x="12" y="15" textAnchor="middle" fontSize="7" fontWeight="900" fill="#713f12" fontFamily="monospace">
                      Ca²⁺
                    </text>
                  </marker>

                  {/* cAMP Molecule Particle Marker */}
                  <marker
                    id="particle-marker-camp"
                    viewBox="0 0 28 28"
                    refX="14"
                    refY="14"
                    markerWidth="16"
                    markerHeight="16"
                    orient="auto"
                  >
                    <circle cx="14" cy="14" r="9.5" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5">
                      <animate attributeName="r" values="8.5;11;8.5" dur="1.3s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.85;1;0.85" dur="1.3s" repeatCount="indefinite" />
                    </circle>
                    <text x="14" y="16.5" textAnchor="middle" fontSize="6.2" fontWeight="900" fill="#78350f" fontFamily="monospace">
                      cAMP
                    </text>
                  </marker>

                  {/* IP3 Molecule Particle Marker */}
                  <marker
                    id="particle-marker-ip3"
                    viewBox="0 0 24 24"
                    refX="12"
                    refY="12"
                    markerWidth="14"
                    markerHeight="14"
                    orient="auto"
                  >
                    <circle cx="12" cy="12" r="8.5" fill="#06b6d4" stroke="#0891b2" strokeWidth="1.5">
                      <animate attributeName="r" values="7.5;9.5;7.5" dur="1.2s" repeatCount="indefinite" />
                    </circle>
                    <text x="12" y="15" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#164e63" fontFamily="monospace">
                      IP₃
                    </text>
                  </marker>

                  {/* 2-AG Endocannabinoid Particle Marker */}
                  <marker
                    id="particle-marker-2ag"
                    viewBox="0 0 26 26"
                    refX="13"
                    refY="13"
                    markerWidth="15"
                    markerHeight="15"
                    orient="auto"
                  >
                    <circle cx="13" cy="13" r="9.5" fill="#34d399" stroke="#059669" strokeWidth="1.5">
                      <animate attributeName="r" values="8.5;10.5;8.5" dur="1.4s" repeatCount="indefinite" />
                    </circle>
                    <text x="13" y="16" textAnchor="middle" fontSize="6.2" fontWeight="900" fill="#064e3b" fontFamily="monospace">
                      2-AG
                    </text>
                  </marker>

                  {/* K+ Ion Particle Marker */}
                  <marker
                    id="particle-marker-k"
                    viewBox="0 0 24 24"
                    refX="12"
                    refY="12"
                    markerWidth="14"
                    markerHeight="14"
                    orient="auto"
                  >
                    <circle cx="12" cy="12" r="8.5" fill="#c084fc" stroke="#9333ea" strokeWidth="1.5">
                      <animate attributeName="r" values="7.5;9.5;7.5" dur="1.2s" repeatCount="indefinite" />
                    </circle>
                    <text x="12" y="15" textAnchor="middle" fontSize="7" fontWeight="900" fill="#581c87" fontFamily="monospace">
                      K⁺
                    </text>
                  </marker>

                  {/* Cl- Ion Particle Marker */}
                  <marker
                    id="particle-marker-cl"
                    viewBox="0 0 24 24"
                    refX="12"
                    refY="12"
                    markerWidth="14"
                    markerHeight="14"
                    orient="auto"
                  >
                    <circle cx="12" cy="12" r="8.5" fill="#fb7185" stroke="#e11d48" strokeWidth="1.5">
                      <animate attributeName="r" values="7.5;9.5;7.5" dur="1.2s" repeatCount="indefinite" />
                    </circle>
                    <text x="12" y="15" textAnchor="middle" fontSize="7" fontWeight="900" fill="#881337" fontFamily="monospace">
                      Cl⁻
                    </text>
                  </marker>

                  {/* Dopamine Particle Marker */}
                  <marker
                    id="particle-marker-dopamine"
                    viewBox="0 0 24 24"
                    refX="12"
                    refY="12"
                    markerWidth="13"
                    markerHeight="13"
                    orient="auto"
                  >
                    <circle cx="12" cy="12" r="8.5" fill="#60a5fa" stroke="#2563eb" strokeWidth="1.5" />
                    <text x="12" y="15" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#1e3a8a" fontFamily="monospace">
                      DA
                    </text>
                  </marker>

                  {/* Glutamate Particle Marker */}
                  <marker
                    id="particle-marker-glutamate"
                    viewBox="0 0 24 24"
                    refX="12"
                    refY="12"
                    markerWidth="13"
                    markerHeight="13"
                    orient="auto"
                  >
                    <circle cx="12" cy="12" r="8.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
                    <text x="12" y="15" textAnchor="middle" fontSize="6.2" fontWeight="900" fill="#0c4a6e" fontFamily="monospace">
                      Glu
                    </text>
                  </marker>

                  {/* GABA Particle Marker */}
                  <marker
                    id="particle-marker-gaba"
                    viewBox="0 0 24 24"
                    refX="12"
                    refY="12"
                    markerWidth="13"
                    markerHeight="13"
                    orient="auto"
                  >
                    <circle cx="12" cy="12" r="8.5" fill="#f43f5e" stroke="#be123c" strokeWidth="1.5" />
                    <text x="12" y="15" textAnchor="middle" fontSize="6" fontWeight="900" fill="#4c0519" fontFamily="monospace">
                      GABA
                    </text>
                  </marker>

                  {/* BDNF Particle Marker */}
                  <marker
                    id="particle-marker-bdnf"
                    viewBox="0 0 24 24"
                    refX="12"
                    refY="12"
                    markerWidth="13"
                    markerHeight="13"
                    orient="auto"
                  >
                    <circle cx="12" cy="12" r="8.5" fill="#34d399" stroke="#059669" strokeWidth="1.5" />
                    <text x="12" y="15" textAnchor="middle" fontSize="5.5" fontWeight="900" fill="#064e3b" fontFamily="monospace">
                      BDNF
                    </text>
                  </marker>

                  {/* G-protein / Kinase translocation marker */}
                  <marker
                    id="particle-marker-g_protein"
                    viewBox="0 0 24 24"
                    refX="12"
                    refY="12"
                    markerWidth="12"
                    markerHeight="12"
                    orient="auto"
                  >
                    <circle cx="12" cy="12" r="7.5" fill="#a855f7" stroke="#7e22ce" strokeWidth="1.2" />
                    <text x="12" y="15" textAnchor="middle" fontSize="6" fontWeight="900" fill="#3b0764" fontFamily="monospace">
                      Gα
                    </text>
                  </marker>

                  {/* ERK Particle Marker */}
                  <marker
                    id="particle-marker-erk"
                    viewBox="0 0 24 24"
                    refX="12"
                    refY="12"
                    markerWidth="13"
                    markerHeight="13"
                    orient="auto"
                  >
                    <circle cx="12" cy="12" r="8.5" fill="#ec4899" stroke="#be185d" strokeWidth="1.5" />
                    <text x="12" y="15" textAnchor="middle" fontSize="5.5" fontWeight="900" fill="#500724" fontFamily="monospace">
                      pERK
                    </text>
                  </marker>

                  {/* Directional Glow Arrowhead */}
                  <marker id="arrow-flow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 9 5 L 0 9 z" fill="#6366f1" />
                  </marker>

                  {/* Glow filters */}
                  <filter id="glow-gold" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <filter id="glow-indigo" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Gradients */}
                  <linearGradient id="cleft-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.08" />
                    <stop offset="50%" stopColor="#818cf8" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.08" />
                  </linearGradient>

                  <pattern id="lipid-bilayer-pattern" width="16" height="14" patternUnits="userSpaceOnUse">
                    <circle cx="4" cy="4" r="2.8" fill="#64748b" opacity="0.6" />
                    <circle cx="12" cy="4" r="2.8" fill="#64748b" opacity="0.6" />
                    <line x1="4" y1="6.8" x2="4" y2="12" stroke="#475569" strokeWidth="1" strokeDasharray="1,1" />
                    <line x1="12" y1="6.8" x2="12" y2="12" stroke="#475569" strokeWidth="1" strokeDasharray="1,1" />
                  </pattern>
                </defs>

                {/* BIOLOGICAL COMPARTMENTS */}
                {/* Presynaptic Compartment */}
                <rect
                  x="20"
                  y="12"
                  width="720"
                  height={visualData.cleftY - 35}
                  rx="16"
                  fill="#0b1329"
                  stroke="#1e293b"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                />
                <text x="36" y="32" fill="#64748b" fontSize="11" fontWeight="700" letterSpacing="0.08em" className="uppercase font-mono">
                  Przedział Presynaptyczny (Kolbka Aksonalna / Pęcherzyki Synaptyczne)
                </text>

                {/* Synaptic Cleft (~20 nm Zone) */}
                <rect
                  x="20"
                  y={visualData.cleftY - 25}
                  width="720"
                  height="50"
                  fill="url(#cleft-gradient)"
                  stroke="#38bdf8"
                  strokeWidth="0.8"
                  strokeDasharray="2,4"
                  opacity="0.75"
                />
                <text x="36" y={visualData.cleftY + 6} fill="#38bdf8" fontSize="10" fontWeight="700" letterSpacing="0.05em" className="font-mono">
                  SZCZELINA SYNAPTYCZNA (~20-25 nm) • Przestrzeń Zewnątrzkomórkowa
                </text>

                {/* Postsynaptic Lipid Bilayer */}
                <rect
                  x="20"
                  y={visualData.cleftY + 25}
                  width="720"
                  height="18"
                  fill="url(#lipid-bilayer-pattern)"
                  stroke="#475569"
                  strokeWidth="1"
                  rx="4"
                />
                <text x="590" y={visualData.cleftY + 38} fill="#94a3b8" fontSize="9" fontWeight="600" className="font-mono">
                  Dwuwarstwa Lipidowa
                </text>

                {/* Postsynaptic Cytosol & Dendritic Spine Compartment */}
                <rect
                  x="20"
                  y={visualData.cleftY + 45}
                  width="720"
                  height={visualData.canvasHeight - visualData.cleftY - 60}
                  rx="16"
                  fill="#030712"
                  stroke="#1e293b"
                  strokeWidth="1.5"
                />
                <text x="36" y={visualData.canvasHeight - 24} fill="#475569" fontSize="11" fontWeight="700" letterSpacing="0.08em" className="uppercase font-mono">
                  Przedział Postsynaptyczny (Kolec Dendrytyczny / Cytozol / PSD-95)
                </text>

                {/* PSD Scaffold Accent Bar */}
                <rect
                  x="60"
                  y={visualData.cleftY + 44}
                  width="640"
                  height="4"
                  fill="#4338ca"
                  rx="2"
                  opacity="0.8"
                />

                {/* ------------------------------------------------------------- */}
                {/* NEW <path> ELEMENTS WITH CSS 'animate-svg-flow' CLASS: */}
                {/* Visual flow from receptor node toward downstream effectors upon activation */}
                {/* ------------------------------------------------------------- */}
                {visualData.flowPaths.map((path) => {
                  const isActive = path.activeSteps.includes(currentStepNumber);
                  const isRetrograde = path.flowType === 'retrograde';
                  const isCa2OrCamp = path.substance === 'ca2' || path.substance === 'camp';
                  
                  // Primary CSS animation class for active flow
                  const flowClass = isActive 
                    ? isRetrograde 
                      ? 'animate-svg-flow-reverse' 
                      : 'animate-svg-flow'
                    : '';

                  const markerUrl = `url(#particle-marker-${path.substance})`;
                  const durationSec = Math.max(0.6, path.speedSec / speedMultiplier);

                  return (
                    <g key={path.id} id={`path-group-${path.id}`}>
                      {/* Active glow halo underlay */}
                      {isActive && (
                        <path
                          d={path.d}
                          fill="none"
                          stroke={path.particleColor}
                          strokeWidth="6"
                          strokeOpacity="0.3"
                          strokeLinecap="round"
                          filter="url(#glow-indigo)"
                        />
                      )}

                      {/* NEW <path> element representing molecule flow (Ca2+, cAMP, IP3, etc.) with CSS 'animate-svg-flow' */}
                      <path
                        id={`molecule-path-${path.id}`}
                        d={path.d}
                        fill="none"
                        stroke={isActive ? path.particleColor : '#334155'}
                        strokeWidth={isActive ? (isCa2OrCamp ? 3 : 2.5) : 1.2}
                        strokeOpacity={isActive ? 0.95 : 0.3}
                        strokeDasharray={isActive ? '8 6' : '3 3'}
                        strokeLinecap="round"
                        className={flowClass}
                        markerEnd={isActive ? markerUrl : undefined}
                      />

                      {/* INJECTION OF ANIMATED <circle> ELEMENTS TRAVELLING ALONG SVG PATHS */}
                      {animateFlow && (
                        <>
                          {/* Active Step: Prominent multi-particle stream of signaling molecules */}
                          {isActive && (
                            <>
                              {/* 1. Lead signaling molecule circle */}
                              <circle
                                id={`flow-circle-${path.id}-lead`}
                                r={path.flowType === 'ion_flow' ? 5.5 : 6.5}
                                fill={path.particleColor}
                                stroke="#0f172a"
                                strokeWidth="1.5"
                                filter="url(#glow-gold)"
                                className="opacity-95"
                              >
                                <animateMotion
                                  path={path.d}
                                  dur={`${durationSec}s`}
                                  repeatCount="indefinite"
                                  keyPoints={isRetrograde ? "1;0" : "0;1"}
                                  keyTimes="0;1"
                                />
                              </circle>

                              {/* 2. Staggered secondary signaling molecule circle */}
                              <circle
                                id={`flow-circle-${path.id}-secondary`}
                                r={path.flowType === 'ion_flow' ? 4.5 : 5.5}
                                fill={path.particleColor}
                                stroke="#0f172a"
                                strokeWidth="1.2"
                                className="opacity-90"
                              >
                                <animateMotion
                                  path={path.d}
                                  dur={`${durationSec}s`}
                                  begin={`-${durationSec * 0.35}s`}
                                  repeatCount="indefinite"
                                  keyPoints={isRetrograde ? "1;0" : "0;1"}
                                  keyTimes="0;1"
                                />
                              </circle>

                              {/* 3. Trailing tertiary micro-pulse circle */}
                              <circle
                                id={`flow-circle-${path.id}-trail`}
                                r={path.flowType === 'ion_flow' ? 3.5 : 4}
                                fill={path.particleColor}
                                stroke="#0f172a"
                                strokeWidth="1"
                                className="opacity-80"
                              >
                                <animateMotion
                                  path={path.d}
                                  dur={`${durationSec}s`}
                                  begin={`-${durationSec * 0.7}s`}
                                  repeatCount="indefinite"
                                  keyPoints={isRetrograde ? "1;0" : "0;1"}
                                  keyTimes="0;1"
                                />
                              </circle>

                              {/* Molecular symbol label tracking along the path */}
                              {showLabels && (
                                <g>
                                  <text
                                    dy="3.5"
                                    textAnchor="middle"
                                    fill="#0f172a"
                                    fontSize="7"
                                    fontWeight="900"
                                    className="font-mono pointer-events-none"
                                  >
                                    {path.particleSymbol}
                                  </text>
                                  <animateMotion
                                    path={path.d}
                                    dur={`${durationSec}s`}
                                    repeatCount="indefinite"
                                    keyPoints={isRetrograde ? "1;0" : "0;1"}
                                    keyTimes="0;1"
                                  />
                                </g>
                              )}
                            </>
                          )}

                          {/* Inactive paths: Gentle baseline molecular turnover circle when Animate Flow is enabled */}
                          {!isActive && (
                            <circle
                              id={`flow-circle-${path.id}-quiescent`}
                              r={3}
                              fill={path.particleColor}
                              stroke="#0f172a"
                              strokeWidth="0.8"
                              className="opacity-35"
                            >
                              <animateMotion
                                path={path.d}
                                dur={`${Math.max(2.5, durationSec * 2)}s`}
                                repeatCount="indefinite"
                                keyPoints={isRetrograde ? "1;0" : "0;1"}
                                keyTimes="0;1"
                              />
                            </circle>
                          )}
                        </>
                      )}
                    </g>
                  );
                })}

                {/* ------------------------------------------------------------- */}
                {/* RECEPTORS & DOWNSTREAM EFFECTOR NODES */}
                {/* ------------------------------------------------------------- */}
                {visualData.nodes.map((node) => {
                  const isActive = node.activeSteps.includes(currentStepNumber);
                  const isHovered = hoveredNodeId === node.id;
                  const stateInfo = node.stepStateDescriptions[currentStepNumber] || {
                    state: 'Stan spoczynkowy',
                    badge: 'SPOCZYNEK',
                    type: 'neutral'
                  };

                  const nodeWidth = node.width || 135;
                  const nodeHeight = node.height || 64;
                  const nodeX = node.x - nodeWidth / 2;
                  const nodeY = node.y - nodeHeight / 2;

                  let badgeBg = '#1e293b';
                  let badgeText = '#94a3b8';
                  let badgeBorder = '#334155';

                  if (stateInfo.type === 'active' || stateInfo.type === 'open') {
                    badgeBg = '#064e3b';
                    badgeText = '#34d399';
                    badgeBorder = '#059669';
                  } else if (stateInfo.type === 'inhibited' || stateInfo.type === 'closed') {
                    badgeBg = '#4c0519';
                    badgeText = '#fb7185';
                    badgeBorder = '#e11d48';
                  } else if (stateInfo.type === 'phosphorylated') {
                    badgeBg = '#4a044e';
                    badgeText = '#f472b6';
                    badgeBorder = '#c026d3';
                  } else if (stateInfo.type === 'primed') {
                    badgeBg = '#451a03';
                    badgeText = '#fbbf24';
                    badgeBorder = '#d97706';
                  }

                  return (
                    <g
                      key={node.id}
                      id={`node-${node.id}`}
                      className="cursor-pointer transition-all duration-300"
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      onClick={() => handleNodeSelect(node)}
                    >
                      {/* Active Pulsing Halo Ring */}
                      {isActive && (
                        <rect
                          x={nodeX - 5}
                          y={nodeY - 5}
                          width={nodeWidth + 10}
                          height={nodeHeight + 10}
                          rx="18"
                          fill="none"
                          stroke={node.color}
                          strokeWidth="2.5"
                          strokeOpacity="0.8"
                          className="animate-pulse"
                          filter="url(#glow-cyan)"
                        />
                      )}

                      {/* Node Box Frame */}
                      <rect
                        x={nodeX}
                        y={nodeY}
                        width={nodeWidth}
                        height={nodeHeight}
                        rx="14"
                        fill={isActive ? '#0f172a' : '#090d16'}
                        stroke={isActive ? node.color : isHovered ? '#64748b' : '#1e293b'}
                        strokeWidth={isActive ? 2 : 1}
                        className="transition-colors shadow-lg"
                      />

                      {/* Type Accent Pill / Icon Bar */}
                      <rect
                        x={nodeX + 8}
                        y={nodeY + 8}
                        width="5"
                        height={nodeHeight - 16}
                        rx="2.5"
                        fill={node.color}
                      />

                      {/* Node Primary Label */}
                      <text
                        x={nodeX + 18}
                        y={nodeY + 22}
                        fill="#f8fafc"
                        fontSize="10.5"
                        fontWeight="800"
                        className="font-sans"
                      >
                        {node.label.length > 20 ? node.label.substring(0, 19) + '…' : node.label}
                      </text>

                      {/* Node Sublabel */}
                      {node.sublabel && (
                        <text
                          x={nodeX + 18}
                          y={nodeY + 34}
                          fill="#94a3b8"
                          fontSize="8.5"
                          fontWeight="500"
                          className="font-sans"
                        >
                          {node.sublabel}
                        </text>
                      )}

                      {/* Real-time State Badge */}
                      <g transform={`translate(${nodeX + 18}, ${nodeY + 41})`}>
                        <rect
                          x="0"
                          y="0"
                          width={nodeWidth - 26}
                          height="16"
                          rx="4"
                          fill={badgeBg}
                          stroke={badgeBorder}
                          strokeWidth="0.8"
                        />
                        <text
                          x={(nodeWidth - 26) / 2}
                          y="11.5"
                          textAnchor="middle"
                          fill={badgeText}
                          fontSize="7.5"
                          fontWeight="800"
                          letterSpacing="0.04em"
                          className="font-mono uppercase"
                        >
                          {stateInfo.badge}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Real-time Synaptic Microdomain Status Footer */}
            <div className="p-4 bg-slate-900/95 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {/* Membrane Potential Readout */}
              <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div className="w-9 h-9 rounded-lg bg-indigo-950 flex items-center justify-center text-indigo-400 font-bold border border-indigo-800 shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Potencjał Błony (Vm)
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-base font-black font-mono ${
                      activeMetrics.membranePotentialMv < -70 
                        ? 'text-purple-400' 
                        : activeMetrics.membranePotentialMv > -60 
                        ? 'text-amber-400' 
                        : 'text-slate-200'
                    }`}>
                      {activeMetrics.membranePotentialMv} mV
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {activeMetrics.membranePotentialMv < -70 
                        ? '(Hiperpolaryzacja)' 
                        : activeMetrics.membranePotentialMv > -60 
                        ? '(Depolaryzacja)' 
                        : '(Spoczynek)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Intracellular Calcium Readout */}
              <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div className="w-9 h-9 rounded-lg bg-amber-950/60 flex items-center justify-center text-amber-400 font-bold border border-amber-800/80 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Wapń Cytozolowy [Ca²⁺]i
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-base font-black font-mono ${
                      activeMetrics.calciumIntracellularNm > 300 
                        ? 'text-amber-300' 
                        : 'text-slate-200'
                    }`}>
                      {activeMetrics.calciumIntracellularNm} nM
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {activeMetrics.calciumIntracellularNm > 500 
                        ? '(Mikrodomena Ca²⁺)' 
                        : '(Poziom bazowy)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Net Synaptic State Summary */}
              <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div className="w-9 h-9 rounded-lg bg-emerald-950/60 flex items-center justify-center text-emerald-400 font-bold border border-emerald-800/80 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Stan Czynnościowy Synapsy
                  </span>
                  <p className="text-xs font-semibold text-slate-200 truncate" title={activeMetrics.netSynapticState}>
                    {activeMetrics.netSynapticState}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* DOWNSTREAM EFFECTOR FEEDBACK PANEL */}
          <DownstreamEffectorPanel
            effectors={visualData.downstreamEffectors}
            activeStepIdx={activeStepIdx}
            clinicalNote={visualData.synapticMetricsByStep[activeStepIdx + 1]?.clinicalNote}
          />

          {/* Active Step Deep-Dive Card */}
          {currentCascade.steps[activeStepIdx] && (
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    {currentCascade.steps[activeStepIdx].stepNumber}
                  </span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                      Przedział komórkowy: {currentCascade.steps[activeStepIdx].compartment}
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      {currentCascade.steps[activeStepIdx].action}
                    </h3>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-indigo-300">
                  Aktor molekularny: {currentCascade.steps[activeStepIdx].actor}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Mechanizm Molekularny
                  </span>
                  <p className="text-slate-200 leading-relaxed text-sm">
                    {currentCascade.steps[activeStepIdx].molecularDetail}
                  </p>
                </div>

                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Konsekwencja Fizjologiczna dla Synapsy
                  </span>
                  <p className="text-slate-200 leading-relaxed text-sm">
                    {currentCascade.steps[activeStepIdx].significance}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
