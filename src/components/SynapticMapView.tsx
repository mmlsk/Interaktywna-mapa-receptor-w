import React, { useState } from 'react';
import { ReceptorInfo, SynapticLocation } from '../types';
import { 
  Sparkles, 
  Info, 
  Layers, 
  Activity, 
  Zap, 
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';

interface SynapticMapViewProps {
  receptors: ReceptorInfo[];
  onSelectReceptor: (receptor: ReceptorInfo) => void;
  selectedReceptor: ReceptorInfo | null;
}

export const SynapticMapView: React.FC<SynapticMapViewProps> = ({
  receptors,
  onSelectReceptor,
  selectedReceptor
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'excitatory' | 'inhibitory' | 'modulatory'>('all');
  const [activeZone, setActiveZone] = useState<SynapticLocation | 'all'>('all');
  const [showParticles, setShowParticles] = useState(true);

  // Group receptors by compartment
  const presynapticReceptors = receptors.filter(r => r.synapticLocation.includes('presynaptic'));
  const postsynapticReceptors = receptors.filter(r => r.synapticLocation.includes('postsynaptic'));
  const extrasynapticReceptors = receptors.filter(r => r.synapticLocation.includes('extrasynaptic'));
  const glialReceptors = receptors.filter(r => r.synapticLocation.includes('glial'));

  const filterReceptors = (list: ReceptorInfo[]) => {
    return list.filter(r => {
      if (filterMode === 'all') return true;
      if (filterMode === 'excitatory') {
        return r.family === 'glutamate' || r.transduction === 'gpcr_gs' || r.transduction === 'gpcr_gq' || r.id.includes('nachr');
      }
      if (filterMode === 'inhibitory') {
        return r.family === 'gaba' || r.family === 'glycine' || r.transduction === 'gpcr_gi';
      }
      if (filterMode === 'modulatory') {
        return r.family === 'dopamine' || r.family === 'serotonin' || r.family === 'opioid' || r.family === 'cannabinoid' || r.family === 'neuropeptide';
      }
      return true;
    });
  };

  const getReceptorColor = (transduction: string) => {
    switch (transduction) {
      case 'ionotropic': return 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-300';
      case 'gpcr_gs': return 'bg-sky-500 hover:bg-sky-600 text-white border-sky-300';
      case 'gpcr_gi': return 'bg-rose-500 hover:bg-rose-600 text-white border-rose-300';
      case 'gpcr_gq': return 'bg-amber-500 hover:bg-amber-600 text-white border-amber-300';
      case 'rtk': return 'bg-purple-500 hover:bg-purple-600 text-white border-purple-300';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div id="synaptic-map-container" className="space-y-6">
      {/* Top Filter & Legend Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            Filtruj obwód:
          </span>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterMode === 'all' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Wszystkie receptory
          </button>
          <button
            onClick={() => setFilterMode('excitatory')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterMode === 'excitatory' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pobudzające (E)
          </button>
          <button
            onClick={() => setFilterMode('inhibitory')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterMode === 'inhibitory' 
                ? 'bg-rose-600 text-white shadow-xs' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Hamujące (I)
          </button>
          <button
            onClick={() => setFilterMode('modulatory')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterMode === 'modulatory' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Neuromodulatory
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 font-medium">Jonotropowe</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span className="text-slate-600 font-medium">Gs / Golf (↑cAMP)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-600 font-medium">Gi / Go (↓cAMP / GIRK)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600 font-medium">Gq / 11 (PLCβ / Ca2+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-slate-600 font-medium">RTK (TrkB)</span>
          </div>
          <button
            onClick={() => setShowParticles(!showParticles)}
            className={`ml-2 px-2.5 py-1 text-[11px] font-semibold rounded border transition-colors flex items-center gap-1 ${
              showParticles 
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            {showParticles ? 'Animacja szczeliny: WŁ' : 'Animacja: WYŁ'}
          </button>
        </div>
      </div>

      {/* Main Synaptic Schematic Canvas & Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Visual Synapse Representation */}
        <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden border border-slate-800 shadow-xl min-h-[620px] flex flex-col justify-between">
          {/* Subtle Synapse Background Gradient Overlay */}
          <div className="absolute inset-0 bg-radial from-slate-800/60 via-slate-900 to-slate-950 pointer-events-none" />

          {/* Section 1: Presynaptic Terminal (Kolbka Aksonalna) */}
          <div className="relative z-10 bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4 backdrop-blur-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 rounded border border-rose-500/40">
                  Strefa Aktywna Presynapsy
                </span>
                <h3 className="text-sm font-bold text-slate-100">Błona Presynaptyczna & Autoreceptory</h3>
              </div>
              <span className="text-xs text-slate-400">
                Pęcherzyki synaptyczne & Kanały Cav2.1 / Cav2.2 (P/Q, N)
              </span>
            </div>

            {/* Presynaptic Receptors Cloud */}
            <div className="flex flex-wrap gap-2">
              {filterReceptors(presynapticReceptors).map(rec => {
                const isSelected = selectedReceptor?.id === rec.id;
                return (
                  <button
                    key={rec.id}
                    id={`syn-rec-${rec.id}`}
                    onClick={() => onSelectReceptor(rec)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all transform flex items-center gap-1.5 border shadow-xs ${
                      isSelected 
                        ? 'ring-2 ring-white scale-105 shadow-lg ' + getReceptorColor(rec.transduction)
                        : 'hover:scale-105 ' + getReceptorColor(rec.transduction)
                    }`}
                  >
                    <span>{rec.name}</span>
                    <span className="text-[10px] opacity-80 font-mono">({rec.id})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Synaptic Cleft (Szczelina Synaptyczna) */}
          <div className="relative z-10 my-4 py-4 px-6 border-y border-dashed border-indigo-500/30 bg-indigo-950/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span>Szczelina Synaptyczna (~20-30 nm)</span>
            </div>

            {/* Animated Neurotransmitter particles */}
            {showParticles && (
              <div className="flex items-center gap-3 overflow-hidden text-[11px] font-mono text-indigo-300/80">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ● L-Glutaminian
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  ● GABA
                </span>
                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  ● Dopamina
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ● 2-AG (Retrogradnie ⬆)
                </span>
              </div>
            )}

            <span className="text-xs text-slate-400">Diffusion & Transporter Clearance (EAAT/GAT)</span>
          </div>

          {/* Section 3: Postsynaptic Density & Dendrite (Dendryt & PSD-95 / Gefiryna) */}
          <div className="relative z-10 bg-slate-800/80 border border-indigo-500/40 rounded-2xl p-4 backdrop-blur-xs shadow-inner">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/40">
                  Gęstość Postsynaptyczna (PSD)
                </span>
                <h3 className="text-sm font-bold text-slate-100">Błona Postsynaptyczna & Kompleksy Rusztowania</h3>
              </div>
              <span className="text-xs text-slate-400">Białka PSD-95 / Gefiryna / Shank / Homer</span>
            </div>

            {/* Postsynaptic Receptors Cloud */}
            <div className="flex flex-wrap gap-2">
              {filterReceptors(postsynapticReceptors).map(rec => {
                const isSelected = selectedReceptor?.id === rec.id;
                return (
                  <button
                    key={rec.id}
                    id={`syn-rec-${rec.id}`}
                    onClick={() => onSelectReceptor(rec)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all transform flex items-center gap-1.5 border shadow-xs ${
                      isSelected 
                        ? 'ring-2 ring-white scale-105 shadow-lg ' + getReceptorColor(rec.transduction)
                        : 'hover:scale-105 ' + getReceptorColor(rec.transduction)
                    }`}
                  >
                    <span>{rec.name}</span>
                    <span className="text-[10px] opacity-80 font-mono">({rec.id})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Extrasynaptic & Glial Zones (Peryferie synapsy) */}
          <div className="relative z-10 mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Extrasynaptic */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3">
              <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Strefa Ekstrasynaptyczna (Toniczna)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {filterReceptors(extrasynapticReceptors).map(rec => (
                  <button
                    key={rec.id}
                    onClick={() => onSelectReceptor(rec)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                      selectedReceptor?.id === rec.id ? 'ring-2 ring-white' : ''
                    } ${getReceptorColor(rec.transduction)}`}
                  >
                    {rec.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Glial Endfoot */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3">
              <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Nóżka Astrocytarna / Mikroglej
              </div>
              <div className="flex flex-wrap gap-1.5">
                {filterReceptors(glialReceptors).map(rec => (
                  <button
                    key={rec.id}
                    onClick={() => onSelectReceptor(rec)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                      selectedReceptor?.id === rec.id ? 'ring-2 ring-white' : ''
                    } ${getReceptorColor(rec.transduction)}`}
                  >
                    {rec.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Live Bio-Inspector for Selected Receptor */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          {selectedReceptor ? (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Inspektor Synaptyczny
                  </span>
                  <span className="text-xs text-slate-400 font-mono">ID: {selectedReceptor.id}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{selectedReceptor.name}</h3>
                <p className="text-xs font-mono text-slate-500 mt-0.5">{selectedReceptor.codeName}</p>
              </div>

              {/* Quick Specs */}
              <div className="space-y-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                    Przewodnictwo / Sprzężenie
                  </span>
                  <span className="font-semibold text-slate-900">{selectedReceptor.couplingOrConductance}</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                    Główny Szlak Wewnątrzkomórkowy
                  </span>
                  <span className="font-semibold text-indigo-700">{selectedReceptor.signalingCascade.title}</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                    Lokalizacja Synaptyczna
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedReceptor.synapticLocation.map(loc => (
                      <span key={loc} className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[11px] font-medium">
                        {loc === 'presynaptic' ? 'Błona Presynaptyczna' :
                         loc === 'postsynaptic' ? 'Błona Postsynaptyczna' :
                         loc === 'extrasynaptic' ? 'Ekstrasynaptyczna' : 'Komórki Glejowe'}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                    Rola Funkcjonalna
                  </span>
                  <p className="text-slate-700 mt-0.5 text-[11px] leading-relaxed">
                    {selectedReceptor.functionalRole}
                  </p>
                </div>
              </div>

              {/* Crosstalk partners */}
              {selectedReceptor.crossTalkAndInteractions.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Partnerzy Heterodimeryzacji / Przesłuchu:
                  </span>
                  <div className="space-y-1">
                    {selectedReceptor.crossTalkAndInteractions.slice(0, 2).map((xt, idx) => (
                      <div key={idx} className="p-2 bg-indigo-50/60 rounded-lg border border-indigo-100 text-[11px] flex items-center justify-between">
                        <span className="font-bold text-indigo-900 uppercase">
                          {xt.partnerReceptor} ({xt.nature})
                        </span>
                        <span className="text-slate-500 text-[10px] truncate max-w-[150px]">{xt.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-700">Wybierz receptor na mapie</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
                  Kliknij dowolny kafel na schemacie synapsy, aby otworzyć szczegółowy inspektor biofizyczny i kaskadowy.
                </p>
              </div>
            </div>
          )}

          {selectedReceptor && (
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => onSelectReceptor(selectedReceptor)}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                Otwórz Pełną Kartę Biofizyczną <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
