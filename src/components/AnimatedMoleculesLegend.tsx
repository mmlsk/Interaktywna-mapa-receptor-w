import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  Zap,
  CheckCircle2,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { FlowPath, getMessengerKineticProfile } from '../data/cascadeAnimationData';

interface AnimatedMoleculesLegendProps {
  flowPaths: FlowPath[];
  currentStepNumber: number; // 1-indexed
  isAnimating: boolean;
  canvasId?: string;
  className?: string;
}

interface MoleculeLegendItem {
  id: string;
  substance: string;
  symbol: string;
  name: string;
  category: string;
  color: string;
  leadRadius: number;
  durationSec: number;
  speedFactor: number;
  kineticsDesc: string;
  isActiveNow: boolean;
  activePathLabels: string[];
}

export const AnimatedMoleculesLegend: React.FC<AnimatedMoleculesLegendProps> = ({
  flowPaths,
  currentStepNumber,
  isAnimating,
  canvasId = 'default',
  className = ''
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // If animations are toggled off, do not render the floating overlay
  if (!isAnimating) {
    return null;
  }

  // Derive unique molecule types currently active and idle in this step
  const moleculeItems = useMemo(() => {
    const itemsMap = new Map<string, MoleculeLegendItem>();

    flowPaths.forEach(path => {
      const isActive = path.activeSteps.includes(currentStepNumber);
      const profile = getMessengerKineticProfile(path);

      // Determine standardized metadata
      let displayName = path.label;
      let category = 'Przekaźnik';
      let cleanSymbol = path.particleSymbol || '●';
      let assignedColor = path.particleColor;

      switch (path.substance) {
        case 'ca2':
          displayName = 'Jony wapnia (Ca²⁺)';
          category = 'Jon dwudodatni (szybki napływ)';
          cleanSymbol = 'Ca²⁺';
          assignedColor = path.particleColor || '#10b981';
          break;
        case 'camp':
          displayName = 'Cykliczny AMP (cAMP)';
          category = 'II Przekaźnik (dyfuzja cytoplazmatyczna)';
          cleanSymbol = 'cAMP';
          assignedColor = path.particleColor || '#3b82f6';
          break;
        case 'ip3':
          displayName = 'Trójfosforan inozytolu (IP₃)';
          category = 'II Przekaźnik (mobilizacja Ca²⁺ z ER)';
          cleanSymbol = 'IP₃';
          assignedColor = path.particleColor || '#f59e0b';
          break;
        case '2ag':
          displayName = '2-Arachidonoiloglicerol (2-AG)';
          category = 'Endokannabinoid (sygnalizacja retrogradna)';
          cleanSymbol = '2-AG';
          assignedColor = path.particleColor || '#10b981';
          break;
        case 'k':
          displayName = 'Jony potasu (K⁺)';
          category = 'Jon jednododatni (wypływ GIRK)';
          cleanSymbol = 'K⁺';
          assignedColor = path.particleColor || '#818cf8';
          break;
        case 'cl':
          displayName = 'Jony chlorkowe (Cl⁻)';
          category = 'Jon jednoujemny (napływ IPSP GABA-A)';
          cleanSymbol = 'Cl⁻';
          assignedColor = path.particleColor || '#06b6d4';
          break;
        case 'dopamine':
          displayName = 'Dopamina (DA)';
          category = 'Neuroprzekaźnik aminowy (szczelina)';
          cleanSymbol = 'DA';
          assignedColor = path.particleColor || '#38bdf8';
          break;
        case 'glutamate':
          displayName = 'Glutaminian (Glu)';
          category = 'Neuroprzekaźnik pobudzający';
          cleanSymbol = 'Glu';
          assignedColor = path.particleColor || '#fbbf24';
          break;
        case 'gaba':
          displayName = 'Kwas γ-aminomasłowy (GABA)';
          category = 'Neuroprzekaźnik hamujący';
          cleanSymbol = 'GABA';
          assignedColor = path.particleColor || '#14b8a6';
          break;
        case 'bdnf':
          displayName = 'Czynnik BDNF';
          category = 'Neurotrofina (ligand TrkB)';
          cleanSymbol = 'BDNF';
          assignedColor = path.particleColor || '#f43f5e';
          break;
        case 'g_protein':
          displayName = 'Białko G (Gα / Gβγ)';
          category = 'Translokacja błonowa heterotrimeru';
          cleanSymbol = cleanSymbol === '●' ? 'Gα' : cleanSymbol;
          assignedColor = path.particleColor || '#a855f7';
          break;
        case 'erk':
          displayName = 'Kinaza pERK1/2';
          category = 'Fosforylowana kinaza białkowa';
          cleanSymbol = 'pERK';
          assignedColor = path.particleColor || '#ec4899';
          break;
        default:
          displayName = path.label;
          category = profile.label;
          break;
      }

      // Unique key by substance and symbol
      const key = `${path.substance}_${cleanSymbol}`;

      if (!itemsMap.has(key)) {
        itemsMap.set(key, {
          id: key,
          substance: path.substance,
          symbol: cleanSymbol,
          name: displayName,
          category,
          color: assignedColor,
          leadRadius: profile.leadRadius,
          durationSec: Math.max(0.6, path.speedSec * profile.speedFactor),
          speedFactor: profile.speedFactor,
          kineticsDesc: profile.kineticsDescription,
          isActiveNow: isActive,
          activePathLabels: isActive ? [path.label] : []
        });
      } else {
        const existing = itemsMap.get(key)!;
        if (isActive) {
          existing.isActiveNow = true;
          if (!existing.activePathLabels.includes(path.label)) {
            existing.activePathLabels.push(path.label);
          }
        }
      }
    });

    const items = Array.from(itemsMap.values());
    // Sort active ones first, then alphabetical
    return items.sort((a, b) => {
      if (a.isActiveNow && !b.isActiveNow) return -1;
      if (!a.isActiveNow && b.isActiveNow) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [flowPaths, currentStepNumber]);

  const activeCount = moleculeItems.filter(m => m.isActiveNow).length;

  return (
    <div
      id={`floating-dynamic-legend-${canvasId}`}
      className={`absolute z-30 transition-all duration-300 pointer-events-auto ${className || 'top-14 right-3.5 sm:right-4'}`}
      style={{ maxWidth: isMinimized ? '220px' : '340px' }}
      aria-live="polite"
    >
      <div className="bg-slate-900/90 hover:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden transition-all text-white">
        {/* Header Bar */}
        <div className="px-3.5 py-2.5 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between gap-2 select-none">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </div>
            <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider truncate">
              Dynamiczna Legenda Cząsteczek
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="px-1.5 py-0.5 rounded-md bg-indigo-950/90 text-indigo-300 border border-indigo-800/60 font-mono text-[9px]">
              {activeCount} w ruchu
            </span>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isMinimized ? 'Rozwiń legendę' : 'Zwiń legendę'}
              aria-label={isMinimized ? 'Rozwiń legendę' : 'Zwiń legendę'}
            >
              {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Minimized View Pill */}
        {isMinimized ? (
          <button
            onClick={() => setIsMinimized(false)}
            className="w-full px-3 py-2 text-left flex items-center justify-between gap-2 text-xs hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-1.5 overflow-hidden">
              {moleculeItems.slice(0, 3).map(m => (
                <span
                  key={m.id}
                  className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                  style={{ backgroundColor: m.color }}
                  title={`${m.symbol}: ${m.name}`}
                />
              ))}
              <span className="text-[10px] text-slate-300 truncate">
                {activeCount > 0 ? `${activeCount} cząst. aktywnych` : 'Stan spoczynkowy'}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
          </button>
        ) : (
          /* Expanded Full Legend Content */
          <div className="p-3 space-y-2.5 max-h-[300px] overflow-y-auto custom-scrollbar text-xs">
            <div className="text-[10px] text-slate-400 font-medium flex items-center justify-between border-b border-slate-800/60 pb-1.5">
              <span>Etap {currentStepNumber}: Animowane Cząsteczki</span>
              <span className="font-mono text-[9px] text-slate-500">Mnożnik kinetyczny</span>
            </div>

            {moleculeItems.length === 0 ? (
              <div className="text-[11px] text-slate-400 py-1 italic">
                Brak zarejestrowanych cząsteczek w tym schemacie.
              </div>
            ) : (
              <div className="space-y-2">
                {moleculeItems.map(item => {
                  return (
                    <div
                      key={item.id}
                      className={`p-2 rounded-xl border transition-all ${
                        item.isActiveNow
                          ? 'bg-slate-800/80 border-slate-700/80 shadow-xs ring-1 ring-white/5'
                          : 'bg-slate-900/40 border-slate-800/40 opacity-55'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        {/* Molecule Visual Swatch & Symbol */}
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="relative flex items-center justify-center flex-shrink-0">
                            {/* Animated Outer Glow Ring if currently flowing */}
                            {item.isActiveNow && (
                              <span
                                className="absolute w-5 h-5 rounded-full animate-ping opacity-35"
                                style={{ backgroundColor: item.color }}
                              />
                            )}
                            <span
                              className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-slate-950 font-mono shadow-xs border border-white/20"
                              style={{ 
                                backgroundColor: item.color,
                                boxShadow: item.isActiveNow ? `0 0 8px ${item.color}` : 'none'
                              }}
                            >
                              •
                            </span>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="font-mono font-bold text-[11px]"
                                style={{ color: item.color }}
                              >
                                {item.symbol}
                              </span>
                              <span className="text-[11px] font-semibold text-slate-200 truncate">
                                {item.name}
                              </span>
                            </div>
                            <span className="text-[9.5px] text-slate-400 block truncate">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge & Speed Metric */}
                        <div className="flex flex-col items-end flex-shrink-0">
                          {item.isActiveNow ? (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                              W RUCHU
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono text-slate-500">
                              Czuwanie
                            </span>
                          )}
                          <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                            {item.durationSec.toFixed(1)}s • r={item.leadRadius}px
                          </span>
                        </div>
                      </div>

                      {/* Active Path Description when Active */}
                      {item.isActiveNow && item.activePathLabels.length > 0 && (
                        <div className="mt-1.5 pt-1.5 border-t border-slate-700/40 text-[9.5px] text-slate-300 flex items-center gap-1 line-clamp-1">
                          <Zap className="w-2.5 h-2.5 text-amber-400 flex-shrink-0" />
                          <span className="truncate">{item.activePathLabels[0]}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
