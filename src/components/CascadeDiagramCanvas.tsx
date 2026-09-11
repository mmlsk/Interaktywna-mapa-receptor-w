import React, { useState } from 'react';
import { 
  CascadeVisualData, 
  CascadeNode, 
  FlowPath 
} from '../data/cascadeAnimationData';
import { 
  Zap, 
  Activity, 
  Eye, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface CascadeDiagramCanvasProps {
  visualData: CascadeVisualData;
  activeStepIdx: number; // 0-indexed
  onSelectNode?: (node: CascadeNode) => void;
  speedMultiplier: number;
}

export const CascadeDiagramCanvas: React.FC<CascadeDiagramCanvasProps> = ({
  visualData,
  activeStepIdx,
  onSelectNode,
  speedMultiplier
}) => {
  const [animateFlow, setAnimateFlow] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const currentStepNumber = activeStepIdx + 1; // 1-indexed

  // Helper to check if a path is active in the current step
  const isPathActive = (path: FlowPath) => {
    return path.activeSteps.includes(currentStepNumber);
  };

  // Helper to check if a node is active in the current step
  const isNodeActive = (node: CascadeNode) => {
    return node.activeSteps.includes(currentStepNumber);
  };

  const activeMetrics = visualData.synapticMetricsByStep[currentStepNumber] || {
    membranePotentialMv: -70,
    calciumIntracellularNm: 100,
    netSynapticState: 'Stan spoczynkowy',
    clinicalNote: ''
  };

  return (
    <div id="cascade-svg-canvas-container" className="relative bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden select-none">
      {/* Top Telemetry & Controls Bar */}
      <div className="px-4 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-bold text-slate-200 tracking-wide flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            Biofizyczny Schemat Kaskady Transdukcji
          </span>
          <span className="px-2 py-0.5 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 font-mono text-[10px]">
            Etap {currentStepNumber}
          </span>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-2">
          <button
            id="cascade-diagram-animate-flow-toggle"
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

      {/* SVG Canvas */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 760 ${visualData.canvasHeight}`}
          className="w-full h-auto min-w-[700px] block"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, #0f172a 0%, #020617 100%)' }}
        >
          {/* DEFINITIONS: Gradients, Filters, Markers */}
          <defs>
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

            <filter id="glow-rose" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Linear gradients for membranes */}
            <linearGradient id="cleft-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.08" />
            </linearGradient>

            <linearGradient id="lipid-bilayer-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="50%" stopColor="#475569" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            {/* Pattern for lipid head groups */}
            <pattern id="lipid-bilayer-pattern" width="16" height="14" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="2.8" fill="#64748b" opacity="0.6" />
              <circle cx="12" cy="4" r="2.8" fill="#64748b" opacity="0.6" />
              <line x1="4" y1="6.8" x2="4" y2="12" stroke="#475569" strokeWidth="1" strokeDasharray="1,1" />
              <line x1="12" y1="6.8" x2="12" y2="12" stroke="#475569" strokeWidth="1" strokeDasharray="1,1" />
            </pattern>

            {/* Arrow markers for directed paths */}
            <marker id="arrow-active" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#6366f1" />
            </marker>

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
              <text x="12" y="15" textAnchor="middle" fontSize="6.2" fontWeight="900" fill="#4c0519" fontFamily="monospace">
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
          </defs>

          {/* BACKGROUND COMPARTMENTS */}
          {/* Presynaptic Compartment (Top) */}
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
            Przedział Presynaptyczny (Kolbka Aksonalna / Terminal)
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
            SZCZELINA SYNAPTYCZNA (~20-25 nm) • Płyn Zewnątrzkomórkowy
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
          {/* FLOW PATHS: Render under nodes so nodes appear crisp on top */}
          {/* ------------------------------------------------------------- */}
          {visualData.flowPaths.map((path) => {
            const isActive = isPathActive(path);
            const isRetrograde = path.flowType === 'retrograde';
            const strokeClass = isActive 
              ? isRetrograde 
                ? 'animate-svg-flow-reverse' 
                : speedMultiplier > 1 
                ? 'animate-svg-flow-fast' 
                : speedMultiplier < 1 
                ? 'animate-svg-flow-slow' 
                : 'animate-svg-flow'
              : '';

            const pathMarker = path.particleColor === '#facc15' || path.particleColor === '#fbbf24' 
              ? 'url(#arrow-gold)' 
              : path.particleColor === '#06b6d4' || path.particleColor === '#38bdf8' 
              ? 'url(#arrow-cyan)' 
              : path.particleColor === '#ef4444' || path.particleColor === '#f43f5e'
              ? 'url(#arrow-rose)'
              : path.particleColor === '#34d399' || path.particleColor === '#84cc16'
              ? 'url(#arrow-green)'
              : 'url(#arrow-active)';

            const durationSec = Math.max(0.6, path.speedSec / speedMultiplier);

            return (
              <g key={path.id} id={`path-group-${path.id}`}>
                {/* Glow underlay track */}
                {isActive && (
                  <path
                    d={path.d}
                    fill="none"
                    stroke={path.particleColor}
                    strokeWidth="6"
                    strokeOpacity="0.25"
                    strokeLinecap="round"
                    filter="url(#glow-indigo)"
                  />
                )}

                {/* Base guide line */}
                <path
                  id={`molecule-path-${path.id}`}
                  d={path.d}
                  fill="none"
                  stroke={isActive ? path.particleColor : '#334155'}
                  strokeWidth={isActive ? (path.substance === 'ca2' || path.substance === 'camp' ? 3 : 2.5) : 1.2}
                  strokeOpacity={isActive ? 0.95 : 0.35}
                  strokeDasharray={isActive ? '8 6' : '3 3'}
                  strokeLinecap="round"
                  className={strokeClass}
                  markerEnd={isActive ? `url(#particle-marker-${path.substance})` : undefined}
                />

                {/* INJECTION OF ANIMATED <circle> ELEMENTS TRAVELLING ALONG SVG PATHS */}
                {animateFlow && (
                  <>
                    {/* Active Step: Prominent multi-particle stream of signaling molecules */}
                    {isActive && (
                      <>
                        {/* 1. Leading signaling molecule circle */}
                        <circle
                          id={`canvas-flow-circle-${path.id}-lead`}
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
                          id={`canvas-flow-circle-${path.id}-secondary`}
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
                          id={`canvas-flow-circle-${path.id}-trail`}
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
                        id={`canvas-flow-circle-${path.id}-ambient`}
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

                {/* Flow descriptive path label if hovered */}
                {hoveredNodeId && (
                  <title>{path.label}: {path.description}</title>
                )}
              </g>
            );
          })}

          {/* ------------------------------------------------------------- */}
          {/* NODES: Molecular effectors, receptors, enzymes, ion channels */}
          {/* ------------------------------------------------------------- */}
          {visualData.nodes.map((node) => {
            const isActive = isNodeActive(node);
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

            // Badge color styling
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
                onClick={() => onSelectNode && onSelectNode(node)}
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

                {/* Tooltip on hover */}
                {isHovered && (
                  <title>
                    {node.label} ({node.sublabel})&#10;Stan: {stateInfo.state}&#10;Status: {stateInfo.badge}
                  </title>
                )}
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
  );
};
