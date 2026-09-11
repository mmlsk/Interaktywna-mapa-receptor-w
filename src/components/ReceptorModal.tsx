import React, { useState } from 'react';
import { ReceptorInfo } from '../types';
import { 
  X, 
  Activity, 
  Zap, 
  Share2, 
  Pill, 
  Layers, 
  MapPin, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';

interface ReceptorModalProps {
  receptor: ReceptorInfo | null;
  onClose: () => void;
  onSelectRelated?: (receptorId: string) => void;
  onOpenWorkflow?: (workflowId: string) => void;
  onTestInSimulator?: (receptorId: string) => void;
}

export const ReceptorModal: React.FC<ReceptorModalProps> = ({
  receptor,
  onClose,
  onSelectRelated,
  onOpenWorkflow,
  onTestInSimulator
}) => {
  const [activeTab, setActiveTab] = useState<'bio' | 'cascade' | 'crosstalk' | 'pharma'>('bio');

  if (!receptor) return null;

  const getTransductionBadge = (t: string) => {
    switch (t) {
      case 'ionotropic':
        return { label: 'Jonotropowy (LGIC)', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' };
      case 'gpcr_gs':
        return { label: 'GPCR (Gαs / Gαolf)', color: 'bg-sky-50 text-sky-700 border-sky-300' };
      case 'gpcr_gi':
        return { label: 'GPCR (Gαi/o & Gβγ)', color: 'bg-rose-50 text-rose-700 border-rose-300' };
      case 'gpcr_gq':
        return { label: 'GPCR (Gαq/11 - PLCβ)', color: 'bg-amber-50 text-amber-700 border-amber-300' };
      case 'rtk':
        return { label: 'Kinaza Tyrozynowa (RTK)', color: 'bg-purple-50 text-purple-700 border-purple-300' };
      default:
        return { label: t, color: 'bg-gray-50 text-gray-700 border-gray-300' };
    }
  };

  const badge = getTransductionBadge(receptor.transduction);

  return (
    <div 
      id="receptor-modal-backdrop" 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="receptor-modal-dialog"
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/80 flex items-start justify-between relative">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${badge.color}`}>
                {badge.label}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-medium bg-slate-200 text-slate-700 rounded-full capitalize">
                {receptor.family}
              </span>
              {receptor.synapticLocation.map(loc => (
                <span key={loc} className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 rounded border border-slate-200">
                  {loc === 'presynaptic' ? 'Presynaptyczny' :
                   loc === 'postsynaptic' ? 'Postsynaptyczny' :
                   loc === 'extrasynaptic' ? 'Ekstrasynaptyczny' : 'Glejowy'}
                </span>
              ))}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{receptor.name}</h2>
            <p className="text-sm font-mono text-slate-500 mt-0.5">{receptor.codeName}</p>
          </div>
          <button
            id="close-receptor-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            title="Zamknij"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-2 overflow-x-auto text-sm">
          <button
            id="tab-bio"
            onClick={() => setActiveTab('bio')}
            className={`py-3 px-3 font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'bio' 
                ? 'border-indigo-600 text-indigo-700 font-semibold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            Biofizyka & Struktura
          </button>
          <button
            id="tab-cascade"
            onClick={() => setActiveTab('cascade')}
            className={`py-3 px-3 font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'cascade' 
                ? 'border-indigo-600 text-indigo-700 font-semibold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Zap className="w-4 h-4" />
            Kaskada Transdukcji
          </button>
          <button
            id="tab-crosstalk"
            onClick={() => setActiveTab('crosstalk')}
            className={`py-3 px-3 font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'crosstalk' 
                ? 'border-indigo-600 text-indigo-700 font-semibold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Share2 className="w-4 h-4" />
            Przesłuchy & Heterodimery ({receptor.crossTalkAndInteractions.length})
          </button>
          <button
            id="tab-pharma"
            onClick={() => setActiveTab('pharma')}
            className={`py-3 px-3 font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'pharma' 
                ? 'border-indigo-600 text-indigo-700 font-semibold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Pill className="w-4 h-4" />
            Farmakologia Kliniczna
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
          {/* TAB 1: BIOFIZYKA & STRUKTURA */}
          {activeTab === 'bio' && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Rola Fizjologiczna w OUN</h4>
                <p className="text-slate-800 leading-relaxed text-sm font-medium">{receptor.functionalRole}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
                    <Activity className="w-4 h-4" />
                    Przewodnictwo / Sprzężenie efektorowe
                  </div>
                  <p className="font-mono text-sm font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {receptor.couplingOrConductance}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
                    <Layers className="w-4 h-4" />
                    Budowa & Stechiometria Podjednostek
                  </div>
                  <p className="text-sm font-medium text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {receptor.structureSubunits}
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 text-slate-900 font-semibold mb-3 text-sm">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  Topografia Anatomiczna w Mózgu Człowieka
                </div>
                <div className="flex flex-wrap gap-2">
                  {receptor.cnsRegions.map((region, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1.5 bg-slate-100 text-slate-800 text-xs font-medium rounded-lg border border-slate-200 flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      {region}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-indigo-900 uppercase">Szybkie przejście do analizy kaskadowej</div>
                  <p className="text-xs text-indigo-700 mt-0.5">Sprawdź zachowanie tego receptora w wirtualnym obwodzie synaptycznym.</p>
                </div>
                {onTestInSimulator && (
                  <button
                    onClick={() => {
                      onClose();
                      onTestInSimulator(receptor.id);
                    }}
                    className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    Symuluj Receptor <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: KASKADA TRANSDUKCJI */}
          {activeTab === 'cascade' && (
            <div className="space-y-6">
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Główny szlak sygnałowy</span>
                <h4 className="text-lg font-bold text-slate-900 mt-0.5">{receptor.signalingCascade.title}</h4>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Wieloetapowa kaskada wewnątrzkomórkowa</h5>
                <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                  {receptor.signalingCascade.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-4 relative">
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 z-10 shadow-xs">
                        {idx + 1}
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex-1 shadow-xs">
                        <p className="text-sm font-medium text-slate-800">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kluczowe efektory</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {receptor.signalingCascade.primaryEffectors.map((eff, i) => (
                      <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-mono font-semibold text-indigo-700">
                        {eff}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Skutek komórkowy</span>
                  <p className="text-xs font-medium text-slate-800 mt-2 leading-relaxed">
                    {receptor.signalingCascade.cellularOutcome}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRZESŁUCHY & HETERODIMERY */}
          {activeTab === 'crosstalk' && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Udokumentowane interakcje biofizyczne, kompleksy rusztowania (scaffolding), heterodimeryzacje oraz wzajemna regulacja w OUN:
              </p>
              {receptor.crossTalkAndInteractions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl">Brak zarejestrowanych interakcji złożonych.</div>
              ) : (
                receptor.crossTalkAndInteractions.map((xt, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 text-xs font-bold rounded uppercase ${
                          xt.nature === 'heterodimer' ? 'bg-purple-100 text-purple-800' :
                          xt.nature === 'synergy' ? 'bg-emerald-100 text-emerald-800' :
                          xt.nature === 'antagonism' ? 'bg-rose-100 text-rose-800' :
                          xt.nature === 'retrograde' ? 'bg-amber-100 text-amber-800' :
                          'bg-indigo-100 text-indigo-800'
                        }`}>
                          {xt.nature === 'heterodimer' ? 'Heterodimer 7TM' :
                           xt.nature === 'synergy' ? 'Synergia czynnościowa' :
                           xt.nature === 'antagonism' ? 'Antagonizm' :
                           xt.nature === 'retrograde' ? 'Sygnalizacja wsteczna' : 'Kompleks rusztowania (PSD)'}
                        </span>
                        <span className="text-sm font-bold text-slate-900">Partner: {xt.partnerReceptor.toUpperCase()}</span>
                      </div>
                      {onSelectRelated && (
                        <button
                          onClick={() => onSelectRelated(xt.partnerReceptor)}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                        >
                          Zbadaj partnera <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{xt.description}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: FARMAKOLOGIA KLINICZNA */}
          {activeTab === 'pharma' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Endogenne Ligandy</span>
                <div className="flex flex-wrap gap-2">
                  {receptor.pharmacology.endogenousLigands.map((lig, i) => (
                    <span key={i} className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold">
                      {lig}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {receptor.pharmacology.clinicalAgonists && receptor.pharmacology.clinicalAgonists.length > 0 && (
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Agoniści kliniczni / badawczy
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-800">
                      {receptor.pharmacology.clinicalAgonists.map((ag, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                          <span>{ag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {receptor.pharmacology.clinicalAntagonistsOrBlockers && receptor.pharmacology.clinicalAntagonistsOrBlockers.length > 0 && (
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <ShieldCheck className="w-4 h-4 text-rose-600" />
                      Antagoniści / Blokery kanału
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-800">
                      {receptor.pharmacology.clinicalAntagonistsOrBlockers.map((ant, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 shrink-0" />
                          <span>{ant}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {receptor.pharmacology.allostericModulators && receptor.pharmacology.allostericModulators.length > 0 && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-2">
                    Modulatory Allosteryczne (PAM / NAM)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {receptor.pharmacology.allostericModulators.map((mod, i) => (
                      <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-md text-xs font-medium">
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Zastosowania Kliniczne & Wskazania Terapeutyczne
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-800">
                  {receptor.pharmacology.clinicalApplications.map((app, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                      <Pill className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="font-medium">{app}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>ID Systemowe: <span className="font-mono text-slate-700">{receptor.id}</span></div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-xs"
          >
            Zamknij panel
          </button>
        </div>
      </div>
    </div>
  );
};
