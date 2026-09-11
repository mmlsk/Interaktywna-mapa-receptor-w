import React, { useState, useMemo } from 'react';
import { ReceptorInfo, NeurotransmitterFamily, TransductionType, SynapticLocation } from '../types';
import { 
  Search, 
  Filter, 
  Layers, 
  Table, 
  LayoutGrid, 
  MapPin, 
  Zap, 
  ArrowRight,
  Activity,
  Check
} from 'lucide-react';

interface ReceptorCatalogViewProps {
  receptors: ReceptorInfo[];
  onSelectReceptor: (receptor: ReceptorInfo) => void;
}

export const ReceptorCatalogView: React.FC<ReceptorCatalogViewProps> = ({
  receptors,
  onSelectReceptor
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransduction, setSelectedTransduction] = useState<TransductionType | 'all'>('all');
  const [selectedFamily, setSelectedFamily] = useState<NeurotransmitterFamily | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<SynapticLocation | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter logic
  const filteredReceptors = useMemo(() => {
    return receptors.filter(rec => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = rec.name.toLowerCase().includes(q);
        const matchesCode = rec.codeName.toLowerCase().includes(q);
        const matchesId = rec.id.toLowerCase().includes(q);
        const matchesFamily = rec.family.toLowerCase().includes(q);
        const matchesRole = rec.functionalRole.toLowerCase().includes(q);
        const matchesRegions = rec.cnsRegions.some(r => r.toLowerCase().includes(q));
        const matchesPharma = rec.pharmacology.clinicalApplications.some(a => a.toLowerCase().includes(q)) ||
          (rec.pharmacology.clinicalAgonists && rec.pharmacology.clinicalAgonists.some(a => a.toLowerCase().includes(q))) ||
          (rec.pharmacology.clinicalAntagonistsOrBlockers && rec.pharmacology.clinicalAntagonistsOrBlockers.some(a => a.toLowerCase().includes(q)));

        if (!matchesName && !matchesCode && !matchesId && !matchesFamily && !matchesRole && !matchesRegions && !matchesPharma) {
          return false;
        }
      }

      // Transduction
      if (selectedTransduction !== 'all' && rec.transduction !== selectedTransduction) {
        return false;
      }

      // Family
      if (selectedFamily !== 'all' && rec.family !== selectedFamily) {
        return false;
      }

      // Location
      if (selectedLocation !== 'all' && !rec.synapticLocation.includes(selectedLocation)) {
        return false;
      }

      return true;
    });
  }, [receptors, searchQuery, selectedTransduction, selectedFamily, selectedLocation]);

  const getTransductionBadge = (t: string) => {
    switch (t) {
      case 'ionotropic':
        return { label: 'Jonotropowy (Kanał)', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' };
      case 'gpcr_gs':
        return { label: 'GPCR (Gs / Golf)', color: 'bg-sky-50 text-sky-700 border-sky-300' };
      case 'gpcr_gi':
        return { label: 'GPCR (Gi / Go / GIRK)', color: 'bg-rose-50 text-rose-700 border-rose-300' };
      case 'gpcr_gq':
        return { label: 'GPCR (Gq / 11 - PLCβ)', color: 'bg-amber-50 text-amber-700 border-amber-300' };
      case 'rtk':
        return { label: 'RTK (Kinaza Tyrozynowa)', color: 'bg-purple-50 text-purple-700 border-purple-300' };
      default:
        return { label: t, color: 'bg-slate-50 text-slate-700 border-slate-300' };
    }
  };

  return (
    <div id="receptor-catalog-container" className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="receptor-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj po nazwie, genie, regionie (np. hipokamp), leku..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Wyczyść
              </button>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs text-slate-500 font-medium mr-1">
              Znaleziono: <strong className="text-slate-900">{filteredReceptors.length}</strong> z {receptors.length}
            </span>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Widok siatki kart"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Karty</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Widok tabeli matrycowej"
              >
                <Table className="w-4 h-4" />
                <span className="hidden sm:inline">Matryca</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 text-xs items-center">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mr-1">
            Typ Transdukcji:
          </span>
          {[
            { id: 'all', label: 'Wszystkie' },
            { id: 'ionotropic', label: 'LGIC (Jonotropowe)' },
            { id: 'gpcr_gs', label: 'GPCR Gs / Golf' },
            { id: 'gpcr_gi', label: 'GPCR Gi / Go' },
            { id: 'gpcr_gq', label: 'GPCR Gq / 11' },
            { id: 'rtk', label: 'RTK (TrkB)' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedTransduction(f.id as any)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedTransduction === f.id
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 text-xs items-center">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mr-1">
            Lokalizacja Synaptyczna:
          </span>
          {[
            { id: 'all', label: 'Dowolna' },
            { id: 'presynaptic', label: 'Presynapsa' },
            { id: 'postsynaptic', label: 'Postsynapsa (PSD)' },
            { id: 'extrasynaptic', label: 'Ekstrasynaptyczna' },
            { id: 'glial', label: 'Komórki Glejowe' }
          ].map(l => (
            <button
              key={l.id}
              onClick={() => setSelectedLocation(l.id as any)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedLocation === l.id
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Mode */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReceptors.map(receptor => {
            const badge = getTransductionBadge(receptor.transduction);
            return (
              <div
                key={receptor.id}
                id={`receptor-card-${receptor.id}`}
                onClick={() => onSelectReceptor(receptor)}
                className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-xs font-mono text-slate-400 uppercase">{receptor.family}</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {receptor.name}
                    </h3>
                    <p className="text-xs font-mono text-slate-500">{receptor.codeName}</p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {receptor.functionalRole}
                  </p>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Efektor / Prąd:</span>
                    <span className="font-mono text-slate-800 font-semibold truncate block mt-0.5">
                      {receptor.couplingOrConductance}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {receptor.cnsRegions.slice(0, 3).map((reg, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                        {reg}
                      </span>
                    ))}
                    {receptor.cnsRegions.length > 3 && (
                      <span className="px-1.5 py-0.5 text-slate-400 text-[10px]">
                        +{receptor.cnsRegions.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-semibold">
                  <span>Otwórz kartę biofizyczną</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table Matrix Mode */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Receptor & Geny</th>
                  <th className="py-3.5 px-4">Typ Transdukcji</th>
                  <th className="py-3.5 px-4">Przewodnictwo / Białko G</th>
                  <th className="py-3.5 px-4">Lokalizacja w OUN</th>
                  <th className="py-3.5 px-4">Kluczowe Szlaki & Efektory</th>
                  <th className="py-3.5 px-4">Zastosowanie Kliniczne</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReceptors.map(receptor => {
                  const badge = getTransductionBadge(receptor.transduction);
                  return (
                    <tr
                      key={receptor.id}
                      onClick={() => onSelectReceptor(receptor)}
                      className="hover:bg-indigo-50/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{receptor.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{receptor.codeName}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                        {receptor.couplingOrConductance}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-[200px] truncate">
                        {receptor.cnsRegions.join(', ')}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium max-w-[220px] truncate">
                        {receptor.signalingCascade.title}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-[200px] truncate">
                        {receptor.pharmacology.clinicalApplications.join(', ')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredReceptors.length === 0 && (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center space-y-3">
          <p className="text-slate-600 text-sm font-medium">Brak receptorów spełniających wybrane kryteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTransduction('all');
              setSelectedFamily('all');
              setSelectedLocation('all');
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700"
          >
            Zresetuj wszystkie filtry
          </button>
        </div>
      )}
    </div>
  );
};
