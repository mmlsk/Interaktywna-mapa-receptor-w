/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RECEPTORS_DATABASE } from './data/receptorsData';
import { WORKFLOW_CASCADES } from './data/pathwaysData';
import { CROSSTALK_INTERACTIONS, SIMULATION_DRUGS } from './data/crosstalkData';
import { ReceptorInfo } from './types';

// Components
import { SynapticMapView } from './components/SynapticMapView';
import { ReceptorCatalogView } from './components/ReceptorCatalogView';
import { WorkflowCascadesView } from './components/WorkflowCascadesView';
import { NetworkGraphView } from './components/NetworkGraphView';
import { PathwaySimulatorView } from './components/PathwaySimulatorView';
import { ReceptorModal } from './components/ReceptorModal';

// Icons
import { 
  Network, 
  Layers, 
  GitFork, 
  Share2, 
  Activity, 
  Brain, 
  Sparkles,
  Search,
  BookOpen
} from 'lucide-react';

type ViewMode = 'synapse' | 'catalog' | 'workflows' | 'crosstalk' | 'simulator';

export default function App() {
  const [activeView, setActiveView] = useState<ViewMode>('synapse');
  const [selectedReceptor, setSelectedReceptor] = useState<ReceptorInfo | null>(null);
  const [inspectModalReceptor, setInspectModalReceptor] = useState<ReceptorInfo | null>(null);
  const [simulatorPresetReceptorId, setSimulatorPresetReceptorId] = useState<string | null>(null);

  const handleSelectReceptorById = (receptorId: string) => {
    const rec = RECEPTORS_DATABASE.find(r => r.id === receptorId);
    if (rec) {
      setInspectModalReceptor(rec);
    }
  };

  const handleTestInSimulator = (receptorId: string) => {
    setSimulatorPresetReceptorId(receptorId);
    setActiveView('simulator');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Application Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 shrink-0">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    NeuroReceptor OUN
                  </h1>
                  <span className="hidden sm:inline px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Atlas & Workflows
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden md:block">
                  Interaktywna mapa receptorów chemicznych ludzkiego OUN, relacji i szlaków transdukcji
                </p>
              </div>
            </div>

            {/* Quick Stats Chips */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-semibold">
              <span className="px-2.5 py-1 rounded-xl bg-slate-50 text-slate-700 border border-slate-200">
                <strong>{RECEPTORS_DATABASE.length}</strong> Receptorów
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-slate-50 text-slate-700 border border-slate-200">
                <strong>{WORKFLOW_CASCADES.length}</strong> Szlaków Transdukcji
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-slate-50 text-slate-700 border border-slate-200">
                <strong>{CROSSTALK_INTERACTIONS.length}</strong> Heterodimerów & Sprzężeń
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 text-xs font-semibold border-t border-slate-100 scrollbar-none">
            <button
              id="nav-tab-synapse"
              onClick={() => setActiveView('synapse')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                activeView === 'synapse'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Network className="w-4 h-4" />
              <span>Interaktywna Synapsa</span>
            </button>

            <button
              id="nav-tab-catalog"
              onClick={() => setActiveView('catalog')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                activeView === 'catalog'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Atlas & Matryca ({RECEPTORS_DATABASE.length})</span>
            </button>

            <button
              id="nav-tab-workflows"
              onClick={() => setActiveView('workflows')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                activeView === 'workflows'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <GitFork className="w-4 h-4" />
              <span>Szlaki Transdukcji (Workflows)</span>
            </button>

            <button
              id="nav-tab-crosstalk"
              onClick={() => setActiveView('crosstalk')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                activeView === 'crosstalk'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Heterodimery & Relacje</span>
            </button>

            <button
              id="nav-tab-simulator"
              onClick={() => setActiveView('simulator')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                activeView === 'simulator'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Symulator Farmakodynamiczny</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main App Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* VIEW 1: SYNAPTIC MAP */}
        {activeView === 'synapse' && (
          <SynapticMapView
            receptors={RECEPTORS_DATABASE}
            onSelectReceptor={(rec) => {
              setSelectedReceptor(rec);
              setInspectModalReceptor(rec);
            }}
            selectedReceptor={selectedReceptor}
          />
        )}

        {/* VIEW 2: RECEPTOR CATALOG & MATRIX */}
        {activeView === 'catalog' && (
          <ReceptorCatalogView
            receptors={RECEPTORS_DATABASE}
            onSelectReceptor={(rec) => setInspectModalReceptor(rec)}
          />
        )}

        {/* VIEW 3: WORKFLOW CASCADES */}
        {activeView === 'workflows' && (
          <WorkflowCascadesView
            cascades={WORKFLOW_CASCADES}
            receptors={RECEPTORS_DATABASE}
            onSelectReceptorById={handleSelectReceptorById}
          />
        )}

        {/* VIEW 4: NETWORK & HETERODIMERS */}
        {activeView === 'crosstalk' && (
          <NetworkGraphView
            interactions={CROSSTALK_INTERACTIONS}
            receptors={RECEPTORS_DATABASE}
            onSelectReceptorById={handleSelectReceptorById}
          />
        )}

        {/* VIEW 5: PHARMACODYNAMIC SIMULATOR */}
        {activeView === 'simulator' && (
          <PathwaySimulatorView
            drugs={SIMULATION_DRUGS}
            receptors={RECEPTORS_DATABASE}
            onSelectReceptorById={handleSelectReceptorById}
            presetReceptorId={simulatorPresetReceptorId}
          />
        )}
      </main>

      {/* Deep-Dive Inspector Modal */}
      {inspectModalReceptor && (
        <ReceptorModal
          receptor={inspectModalReceptor}
          onClose={() => setInspectModalReceptor(null)}
          onSelectRelated={handleSelectReceptorById}
          onTestInSimulator={handleTestInSimulator}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-slate-500 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Neurobiologia & Farmakologia Molekularna OUN — Baza IUPHAR/BPS & Allen Brain Atlas</span>
          </div>
          <div className="text-slate-400">
            Klasyfikacja: LGIC, GPCR (Gs/Gi/Gq), RTK | E/I Balance, DARPP-32, GIRK/Cav2, Endokannabinoidy
          </div>
        </div>
      </footer>
    </div>
  );
}
