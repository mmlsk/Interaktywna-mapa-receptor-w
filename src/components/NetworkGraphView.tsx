import React, { useState } from 'react';
import { CrosstalkInteraction, ReceptorInfo } from '../types';
import { 
  Share2, 
  Layers, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  ShieldAlert, 
  Info,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface NetworkGraphViewProps {
  interactions: CrosstalkInteraction[];
  receptors: ReceptorInfo[];
  onSelectReceptorById: (receptorId: string) => void;
}

export const NetworkGraphView: React.FC<NetworkGraphViewProps> = ({
  interactions,
  receptors,
  onSelectReceptorById
}) => {
  const [selectedInteraction, setSelectedInteraction] = useState<CrosstalkInteraction>(interactions[0]);
  const [filterType, setFilterType] = useState<string>('all');

  const filteredInteractions = interactions.filter(i => {
    if (filterType === 'all') return true;
    return i.type === filterType;
  });

  const getReceptorObj = (id: string) => receptors.find(r => r.id === id);

  return (
    <div id="network-graph-container" className="space-y-6">
      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-2">
            <Share2 className="w-3.5 h-3.5 text-indigo-600" />
            Typ Relacji Międzyreceptorowej:
          </span>
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterType === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Wszystkie ({interactions.length})
          </button>
          <button
            onClick={() => setFilterType('heterodimer')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterType === 'heterodimer' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Heterodimery 7TM
          </button>
          <button
            onClick={() => setFilterType('scaffold_complex')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterType === 'scaffold_complex' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Rusztowania PSD
          </button>
          <button
            onClick={() => setFilterType('retrograde')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterType === 'retrograde' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Sygnały Retrogradne
          </button>
          <button
            onClick={() => setFilterType('inhibition')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterType === 'inhibition' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Antagonizm / Balans
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Kliknij relację, aby rozwinąć model allosteryczny i farmakologiczny
        </div>
      </div>

      {/* Main Content Layout: List / Cards & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Cards list */}
        <div className="lg:col-span-6 space-y-3">
          {filteredInteractions.map(xt => {
            const isSelected = selectedInteraction?.id === xt.id;
            const srcRec = getReceptorObj(xt.sourceId);
            const tgtRec = getReceptorObj(xt.targetId);

            return (
              <div
                key={xt.id}
                onClick={() => setSelectedInteraction(xt)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-indigo-50/70 border-indigo-500 shadow-md ring-1 ring-indigo-500' 
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded ${
                    xt.type === 'heterodimer' ? 'bg-purple-100 text-purple-800' :
                    xt.type === 'scaffold_complex' ? 'bg-indigo-100 text-indigo-800' :
                    xt.type === 'retrograde' ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {xt.type === 'heterodimer' ? 'Heterodimer Błonowy (7TM)' :
                     xt.type === 'scaffold_complex' ? 'Kompleks Rusztowania (PSD)' :
                     xt.type === 'retrograde' ? 'Sygnalizacja Wsteczna' : 'Przeciwstawny Balans'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {xt.sourceId.toUpperCase()} ↔ {xt.targetId.toUpperCase()}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm mb-1">{xt.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{xt.description}</p>

                {/* Node Chips */}
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>{srcRec ? srcRec.name : xt.sourceId}</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>{tgtRec ? tgtRec.name : xt.targetId}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 6 Cols: Deep Dive Inspector for Selected Interaction */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          {selectedInteraction ? (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
                    Inspektor Allosteryczny & Strukturalny
                  </span>
                  <span className="text-xs text-slate-400 font-mono">ID: {selectedInteraction.id}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{selectedInteraction.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedInteraction.description}</p>
              </div>

              {/* Source & Target Receptor Interactive Cards */}
              <div className="grid grid-cols-2 gap-3">
                {(() => {
                  const s = getReceptorObj(selectedInteraction.sourceId);
                  return (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Receptor 1 (Monomer A)
                      </span>
                      <div className="font-bold text-slate-900 text-sm">{s?.name || selectedInteraction.sourceId}</div>
                      <div className="text-[11px] text-slate-600 font-mono">{s?.couplingOrConductance}</div>
                      <button
                        onClick={() => onSelectReceptorById(selectedInteraction.sourceId)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-2"
                      >
                        Zobacz kartę <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })()}

                {(() => {
                  const t = getReceptorObj(selectedInteraction.targetId);
                  return (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Receptor 2 (Monomer B)
                      </span>
                      <div className="font-bold text-slate-900 text-sm">{t?.name || selectedInteraction.targetId}</div>
                      <div className="text-[11px] text-slate-600 font-mono">{t?.couplingOrConductance}</div>
                      <button
                        onClick={() => onSelectReceptorById(selectedInteraction.targetId)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-2"
                      >
                        Zobacz kartę <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })()}
              </div>

              {/* Detail Blocks */}
              <div className="space-y-3 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    Topografia Anatomiczna & Błonowa
                  </div>
                  <p className="text-slate-700 leading-relaxed">{selectedInteraction.anatomicalSite}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-indigo-900 font-bold uppercase tracking-wider text-[11px]">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Konsekwencja Funkcjonalna dla Transmisji
                  </div>
                  <p className="text-slate-700 leading-relaxed">{selectedInteraction.functionalConsequence}</p>
                </div>

                <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/70 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-950 font-bold uppercase tracking-wider text-[11px]">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    Wpływ Farmakologiczny & Terapia Kliniczna
                  </div>
                  <p className="text-amber-900 leading-relaxed">{selectedInteraction.pharmacologicalImpact}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              Wybierz relację z listy po lewej stronie.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
