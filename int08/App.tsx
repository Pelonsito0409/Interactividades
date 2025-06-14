
import React, { useState, useCallback, useMemo } from 'react';
import { AtomState, ElementData } from './types';
import ParticleControl from './components/ParticleControl';
import AtomVisualizer from './components/AtomVisualizer';
import InfoPanel from './components/InfoPanel';
import FullscreenButton from './components/FullscreenButton'; // Import the new component
import { MAX_PARTICLES_CONTROL, MAX_PROTONS_DEFINED } from './constants/elements';
import { 
  getElementByProtons, 
  getMassNumber, 
  getIonState, 
  getIsotopeState,
  getElementName,
  getAtomStability
} from './utils/atomUtils';

// Helper for stability status color
const getStabilityColor = (status: string): string => {
  const lowerStatus = status.toLowerCase(); // Compare with lowercase Spanish terms
  if (lowerStatus.includes("estable")) { // "Estable", "Probablemente Estable"
    if (lowerStatus.includes("probablemente estable")) return "text-green-300";
    return "text-green-400"; 
  }
  if (lowerStatus.includes("larga vida")) return "text-yellow-500"; 

  if (lowerStatus.includes("inestable") || lowerStatus.includes("radiactivo")) {
    if (lowerStatus.includes("probablemente inestable")) return "text-orange-400";
    return "text-red-400"; 
  }
  return "text-slate-400"; // For "N/D" or other neutral states
};


const App: React.FC = () => {
  const [atomState, setAtomState] = useState<AtomState>({
    protons: 0,
    neutrons: 0,
    electrons: 0,
  });

  const handleParticleChange = useCallback((particle: keyof AtomState, delta: number) => {
    setAtomState(prev => {
      const currentVal = prev[particle];
      let maxVal = MAX_PARTICLES_CONTROL;
      if (particle === 'protons') {
        maxVal = MAX_PROTONS_DEFINED;
      }
      const newValue = Math.max(0, Math.min(currentVal + delta, maxVal));
      return { ...prev, [particle]: newValue };
    });
  }, []);

  const resetAtom = useCallback(() => {
    setAtomState({ protons: 0, neutrons: 0, electrons: 0 });
  }, []);

  const currentElement = useMemo(() => getElementByProtons(atomState.protons), [atomState.protons]);
  const elementNameStr = useMemo(() => getElementName(atomState.protons, currentElement), [atomState.protons, currentElement]);
  const massNumber = useMemo(() => getMassNumber(atomState.protons, atomState.neutrons), [atomState.protons, atomState.neutrons]);
  const ionState = useMemo(() => getIonState(atomState.protons, atomState.electrons), [atomState.protons, atomState.electrons]);
  const isotopeState = useMemo(() => getIsotopeState(atomState.protons, atomState.neutrons, currentElement), [atomState.protons, atomState.neutrons, currentElement]);
  const stabilityStatus = useMemo(() => getAtomStability(atomState.protons, atomState.neutrons, currentElement), [atomState.protons, atomState.neutrons, currentElement]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 selection:bg-sky-500 selection:text-sky-900 relative">
      <FullscreenButton />
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 pb-2">
          Constructor de Átomos Interactivo
        </h1>
        <p className="text-slate-400 text-lg">¡Construye átomos y explora sus propiedades!</p>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Controls Panel */}
        <section className="lg:col-span-1 bg-slate-800 p-6 rounded-xl shadow-2xl space-y-6">
          <h2 className="text-2xl font-semibold text-center text-sky-300 mb-4 border-b-2 border-slate-700 pb-2">Controles</h2>
          <ParticleControl
            name="Protones"
            count={atomState.protons}
            colorClass="border-red-500"
            onIncrement={() => handleParticleChange('protons', 1)}
            onDecrement={() => handleParticleChange('protons', -1)}
          />
          <ParticleControl
            name="Neutrones"
            count={atomState.neutrons}
            colorClass="border-gray-500"
            onIncrement={() => handleParticleChange('neutrons', 1)}
            onDecrement={() => handleParticleChange('neutrons', -1)}
          />
          <ParticleControl
            name="Electrones"
            count={atomState.electrons}
            colorClass="border-yellow-500"
            onIncrement={() => handleParticleChange('electrons', 1)}
            onDecrement={() => handleParticleChange('electrons', -1)}
          />
          <button
            onClick={resetAtom}
            className="w-full mt-4 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
          >
            Reiniciar Átomo
          </button>
        </section>

        {/* Atom Visualization and Stability */}
        <section className="lg:col-span-1 flex flex-col items-center justify-start">
          <div className="text-center mb-3 h-12 flex items-center justify-center"  aria-live="polite"> {/* Added height for consistency */}
            <p className={`text-lg font-semibold ${getStabilityColor(stabilityStatus)}`}>
               {stabilityStatus !== "N/D" ? `Estabilidad: ${stabilityStatus}`: "Estabilidad del Átomo"}
            </p>
          </div>
          <AtomVisualizer atomState={atomState} />
        </section>

        {/* Information Panel */}
        <section className="lg:col-span-1">
          <InfoPanel
            protons={atomState.protons}
            neutrons={atomState.neutrons}
            electrons={atomState.electrons}
            element={currentElement}
            elementName={elementNameStr}
            massNumber={massNumber}
            ionState={ionState}
            isotopeState={isotopeState}
          />
        </section>
      </main>
      
      <footer className="mt-12 text-center text-slate-500 text-sm">
        <p>Aprende sobre la estructura atómica añadiendo o quitando partículas.</p>
        <p>Los Protones (P) definen el elemento. Los Neutrones (N) afectan su isótopo y estabilidad. Los Electrones (e⁻) determinan su carga (ión).</p>
      </footer>
    </div>
  );
};

export default App;
