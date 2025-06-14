
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Phase, SubstanceState, GraphDataPoint, SubstanceDefinition, SubstanceFractions } from './types';
import {
  HEAT_STEP as BASE_HEAT_STEP, SIMULATION_INTERVAL_MS, SUBSTANCES, TEMP_EPSILON
} from './constants';
import Thermometer from './components/Thermometer';
import SubstanceVisualizer from './components/SubstanceVisualizer';
import Controls from './components/Controls';
import TemperatureGraph from './components/TemperatureGraph';

type HeatingMode = 'none' | 'add' | 'remove';

// Calculates the total energy content of a substance at a given target temperature,
// relative to its state as a solid at referenceInitialSolidTemp.
const calculateEnergyForTemperature = (
  targetTemp: number,
  substance: SubstanceDefinition
): number => {
  let cumulativeEnergy = 0;
  let currentPhaseTemp = substance.referenceInitialSolidTemp;

  // --- Solid Phase ---
  const solidPhaseUpperTemp = Math.min(targetTemp, substance.meltingPoint);
  if (currentPhaseTemp < solidPhaseUpperTemp) {
    cumulativeEnergy += (solidPhaseUpperTemp - currentPhaseTemp) * substance.mass * substance.specificHeatSolid;
  }
  currentPhaseTemp = solidPhaseUpperTemp;
  if (targetTemp <= substance.meltingPoint && targetTemp <= substance.referenceInitialSolidTemp + (targetTemp - substance.referenceInitialSolidTemp)) {
     // If targetTemp is within solid phase below or at melting point, and also accounts for negative start temps
    if (targetTemp < substance.referenceInitialSolidTemp) { // Target is colder than reference
        return (targetTemp - substance.referenceInitialSolidTemp) * substance.mass * substance.specificHeatSolid;
    }
    return cumulativeEnergy;
  }


  // --- Melting Phase ---
  cumulativeEnergy += substance.latentHeatFusion * substance.mass;
  currentPhaseTemp = substance.meltingPoint;

  // --- Liquid Phase ---
  const liquidPhaseUpperTemp = Math.min(targetTemp, substance.boilingPoint);
  if (currentPhaseTemp < liquidPhaseUpperTemp) {
    cumulativeEnergy += (liquidPhaseUpperTemp - currentPhaseTemp) * substance.mass * substance.specificHeatLiquid;
  }
  currentPhaseTemp = liquidPhaseUpperTemp;
  if (targetTemp <= substance.boilingPoint) return cumulativeEnergy;
  
  // --- Boiling Phase ---
  cumulativeEnergy += substance.latentHeatVaporization * substance.mass;
  currentPhaseTemp = substance.boilingPoint;

  // --- Gas Phase ---
  const gasPhaseUpperTempTarget = substance.plasmaPoint ? Math.min(targetTemp, substance.plasmaPoint) : targetTemp;
  if (currentPhaseTemp < gasPhaseUpperTempTarget) {
    cumulativeEnergy += (gasPhaseUpperTempTarget - currentPhaseTemp) * substance.mass * substance.specificHeatGas;
  }
  currentPhaseTemp = gasPhaseUpperTempTarget;
  if (!substance.plasmaPoint || targetTemp <= substance.plasmaPoint) return cumulativeEnergy;

  // --- Ionizing Phase (if applicable) ---
  if (substance.plasmaPoint && substance.latentHeatIonization && substance.specificHeatPlasma) {
    cumulativeEnergy += substance.latentHeatIonization * substance.mass;
    currentPhaseTemp = substance.plasmaPoint;

    // --- Plasma Phase ---
    if (currentPhaseTemp < targetTemp) {
        cumulativeEnergy += (targetTemp - currentPhaseTemp) * substance.mass * substance.specificHeatPlasma;
    }
    return cumulativeEnergy;
  }
  
  return cumulativeEnergy;
};


const calculateState = (totalEnergy: number, substance: SubstanceDefinition): SubstanceState => {
  let temperature = substance.referenceInitialSolidTemp;
  let phase = Phase.Solid;
  let fractions: SubstanceFractions = { solid: 1, liquid: 0, gas: 0, plasma: 0 };
  let remainingEnergy = totalEnergy; 

  const {
    meltingPoint, boilingPoint, plasmaPoint, mass,
    specificHeatSolid, latentHeatFusion, specificHeatLiquid,
    latentHeatVaporization, specificHeatGas, latentHeatIonization, specificHeatPlasma,
    minSimTemp, maxSimTemp, referenceInitialSolidTemp
  } = substance;

  // Handle temperatures below referenceInitialSolidTemp (negative energy relative to reference)
  if (remainingEnergy < 0 && referenceInitialSolidTemp > minSimTemp) {
     temperature = referenceInitialSolidTemp + (specificHeatSolid > 0 ? remainingEnergy / (mass * specificHeatSolid) : 0);
     temperature = Math.max(minSimTemp, temperature); // Clamp at minSimTemp
     phase = Phase.Solid;
     fractions = { solid: 1, liquid: 0, gas: 0, plasma: 0 };
     return { temperature, phase, totalEnergy, fractions };
  }


  // --- Solid Phase ---
  const energyToReachMeltingPointFromRef = (meltingPoint - referenceInitialSolidTemp) * mass * specificHeatSolid;
  if (remainingEnergy <= energyToReachMeltingPointFromRef) {
    temperature = referenceInitialSolidTemp + (specificHeatSolid > 0 ? remainingEnergy / (mass * specificHeatSolid) : 0);
    phase = Phase.Solid;
    fractions = { solid: 1, liquid: 0, gas: 0, plasma: 0 };
    temperature = Math.max(minSimTemp, Math.min(maxSimTemp, temperature));
    return { temperature, phase, totalEnergy, fractions };
  }
  remainingEnergy -= energyToReachMeltingPointFromRef;
  temperature = meltingPoint; 
  phase = Phase.Melting;


  // --- Melting Phase ---
  const energyToMeltFully = latentHeatFusion * mass;
  if (remainingEnergy < energyToMeltFully) {
    const fractionMelted = latentHeatFusion > 0 ? remainingEnergy / energyToMeltFully : 1;
    temperature = meltingPoint; 
    fractions = { solid: 1 - fractionMelted, liquid: fractionMelted, gas: 0, plasma: 0 };
    return { temperature, phase, totalEnergy, fractions };
  }
  remainingEnergy -= energyToMeltFully;
  temperature = meltingPoint; 
  phase = Phase.Liquid;

  // --- Liquid Phase ---
  const energyToReachBoilingPointFromMelting = (boilingPoint - meltingPoint) * mass * specificHeatLiquid;
  if (remainingEnergy <= energyToReachBoilingPointFromMelting) {
    temperature = meltingPoint + (specificHeatLiquid > 0 ? remainingEnergy / (mass * specificHeatLiquid) : 0);
    phase = Phase.Liquid;
    fractions = { solid: 0, liquid: 1, gas: 0, plasma: 0 };
    temperature = Math.max(minSimTemp, Math.min(maxSimTemp, temperature));
    return { temperature, phase, totalEnergy, fractions };
  }
  remainingEnergy -= energyToReachBoilingPointFromMelting;
  temperature = boilingPoint; 
  phase = Phase.Boiling;

  // --- Boiling Phase ---
  const energyToBoilFully = latentHeatVaporization * mass;
  if (remainingEnergy < energyToBoilFully) {
    const fractionBoiled = latentHeatVaporization > 0 ? remainingEnergy / energyToBoilFully : 1;
    temperature = boilingPoint; 
    fractions = { solid: 0, liquid: 1 - fractionBoiled, gas: fractionBoiled, plasma: 0 };
    return { temperature, phase, totalEnergy, fractions };
  }
  remainingEnergy -= energyToBoilFully;
  temperature = boilingPoint; 
  phase = Phase.Gas;

  // --- Gas Phase (up to Plasma or Max Temp) ---
  if (plasmaPoint && latentHeatIonization && specificHeatPlasma) {
    const energyToReachPlasmaPointFromBoiling = (plasmaPoint - boilingPoint) * mass * specificHeatGas;
    if (remainingEnergy <= energyToReachPlasmaPointFromBoiling) {
      temperature = boilingPoint + (specificHeatGas > 0 ? remainingEnergy / (mass * specificHeatGas) : 0);
      phase = Phase.Gas;
      fractions = { solid: 0, liquid: 0, gas: 1, plasma: 0 };
      temperature = Math.max(minSimTemp, Math.min(maxSimTemp, temperature));
      return { temperature, phase, totalEnergy, fractions };
    }
    remainingEnergy -= energyToReachPlasmaPointFromBoiling;
    temperature = plasmaPoint; 
    phase = Phase.Ionizing;

    // --- Ionizing Phase ---
    const energyToIonizeFully = latentHeatIonization * mass;
    if (remainingEnergy < energyToIonizeFully) {
      const fractionIonized = latentHeatIonization > 0 ? remainingEnergy / energyToIonizeFully : 1;
      temperature = plasmaPoint; 
      fractions = { solid: 0, liquid: 0, gas: 1 - fractionIonized, plasma: fractionIonized };
      return { temperature, phase, totalEnergy, fractions };
    }
    remainingEnergy -= energyToIonizeFully;
    temperature = plasmaPoint; 
    phase = Phase.Plasma;

    // --- Plasma Phase ---
    temperature = plasmaPoint + (specificHeatPlasma > 0 ? remainingEnergy / (mass * specificHeatPlasma) : 0);
    phase = Phase.Plasma;
    fractions = { solid: 0, liquid: 0, gas: 0, plasma: 1 };
    temperature = Math.max(minSimTemp, Math.min(maxSimTemp, temperature));
    return { temperature, phase, totalEnergy, fractions };

  } else { // Gas phase, no plasma
    temperature = boilingPoint + (specificHeatGas > 0 ? remainingEnergy / (mass * specificHeatGas) : 0); 
    phase = Phase.Gas;
    fractions = { solid: 0, liquid: 0, gas: 1, plasma: 0 };
    temperature = Math.max(minSimTemp, Math.min(maxSimTemp, temperature));
    return { temperature, phase, totalEnergy, fractions };
  }
};

const App: React.FC = () => {
  const [selectedSubstanceIndex, setSelectedSubstanceIndex] = useState<number>(0);
  const currentSubstanceDef = useMemo(() => SUBSTANCES[selectedSubstanceIndex], [selectedSubstanceIndex]);
  
  const initialEnergy = useMemo(() => 
    calculateEnergyForTemperature(currentSubstanceDef.simStartTemp, currentSubstanceDef),
    [currentSubstanceDef]
  );

  const [currentSubstanceState, setCurrentSubstanceState] = useState<SubstanceState>(() => calculateState(initialEnergy, currentSubstanceDef));
  const [graphData, setGraphData] = useState<GraphDataPoint[]>([{ time: 0, temperature: currentSubstanceDef.simStartTemp }]);
  const [heatingMode, setHeatingMode] = useState<HeatingMode>('none');
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const intervalIdRef = useRef<number | null>(null);

  const { minEnergyInSim, maxEnergyInSim } = useMemo(() => {
    return {
      minEnergyInSim: calculateEnergyForTemperature(currentSubstanceDef.minSimTemp, currentSubstanceDef),
      maxEnergyInSim: calculateEnergyForTemperature(currentSubstanceDef.maxSimTemp, currentSubstanceDef)
    };
  }, [currentSubstanceDef]);

  useEffect(() => {
    // Reset simulation when substance changes
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    intervalIdRef.current = null;
    setHeatingMode('none');
    setElapsedTime(0);
    const newInitialEnergy = calculateEnergyForTemperature(currentSubstanceDef.simStartTemp, currentSubstanceDef);
    setCurrentSubstanceState(calculateState(newInitialEnergy, currentSubstanceDef));
    setGraphData([{ time: 0, temperature: currentSubstanceDef.simStartTemp }]);
  }, [currentSubstanceDef]); 

  useEffect(() => {
    if (heatingMode === 'none') {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
      return;
    }

    if (intervalIdRef.current) clearInterval(intervalIdRef.current);

    intervalIdRef.current = window.setInterval(() => {
      const currentTickElapsedTime = elapsedTime + SIMULATION_INTERVAL_MS / 1000;
      setElapsedTime(currentTickElapsedTime);

      setCurrentSubstanceState(prevSubstanceState => {
        let heatIncrement = BASE_HEAT_STEP * (currentSubstanceDef.heatStepModifier || 1);
        const heatDecrement = BASE_HEAT_STEP * (currentSubstanceDef.heatStepModifier || 1); // Standard decrement

        if (currentSubstanceDef.name === 'Argón' && 
            prevSubstanceState.phase === Phase.Gas && 
            heatingMode === 'add') {
            heatIncrement = 5000; // 5 kJ as requested for Argon gas heating
        }
        
        let newEnergy = prevSubstanceState.totalEnergy;
        if (heatingMode === 'add') {
          newEnergy += heatIncrement;
        } else if (heatingMode === 'remove') {
          newEnergy -= heatDecrement;
        }
        
        const clampedEnergy = Math.max(minEnergyInSim, Math.min(newEnergy, maxEnergyInSim));
        const newState = calculateState(clampedEnergy, currentSubstanceDef);
        
        setGraphData(prevData => {
          const lastPoint = prevData[prevData.length -1];
          const newTime = currentTickElapsedTime; 
          
          if (prevData.length < 2 || 
              Math.abs(lastPoint.temperature - newState.temperature) > TEMP_EPSILON ||
              newTime > lastPoint.time 
             ) {
             return [...prevData, { time: newTime, temperature: newState.temperature }];
          }
          return prevData; 
        });

        // Auto-stop if min/max simulation temperature is reached
        if (
          (heatingMode === 'add' && Math.abs(newState.temperature - currentSubstanceDef.maxSimTemp) < TEMP_EPSILON) ||
          (heatingMode === 'remove' && Math.abs(newState.temperature - currentSubstanceDef.minSimTemp) < TEMP_EPSILON)
        ) {
          setHeatingMode('none'); 
        }
        
        return newState;
      });
    }, SIMULATION_INTERVAL_MS);

    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, [heatingMode, currentSubstanceDef, minEnergyInSim, maxEnergyInSim, elapsedTime]); 


  const handleSetHeatingMode = useCallback((mode: HeatingMode) => {
    // Prevent starting if already at a limit
    if (mode === 'add' && Math.abs(currentSubstanceState.temperature - currentSubstanceDef.maxSimTemp) < TEMP_EPSILON) {
        return;
    }
    if (mode === 'remove' && Math.abs(currentSubstanceState.temperature - currentSubstanceDef.minSimTemp) < TEMP_EPSILON) {
        return;
    }
    setHeatingMode(mode);
  }, [currentSubstanceState.temperature, currentSubstanceDef.maxSimTemp, currentSubstanceDef.minSimTemp]);

  const handleReset = useCallback(() => {
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    intervalIdRef.current = null;
    setHeatingMode('none');
    setElapsedTime(0);
    const newInitialEnergy = calculateEnergyForTemperature(currentSubstanceDef.simStartTemp, currentSubstanceDef);
    setCurrentSubstanceState(calculateState(newInitialEnergy, currentSubstanceDef));
    setGraphData([{ time: 0, temperature: currentSubstanceDef.simStartTemp }]);
  }, [currentSubstanceDef]);
  
  const handleSubstanceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubstanceIndex(parseInt(event.target.value, 10));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-sky-900 text-slate-100">
      <header className="w-full max-w-5xl text-center mb-6">
        <h1 className="text-4xl font-bold text-sky-400">Simulación Interactiva de Estados de la Materia</h1>
        <p className="text-lg text-slate-300 mt-2">Selecciona una sustancia y observa sus transiciones de fase. ¡Nota las mesetas durante los cambios de fase!</p>
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="md:col-span-1 flex flex-col items-center space-y-4 p-6 bg-slate-800 rounded-xl shadow-2xl">
          <div className="w-full max-w-xs">
            <label htmlFor="substance-select" className="block text-sm font-medium text-sky-300 mb-1">Elegir Sustancia:</label>
            <select 
              id="substance-select"
              value={selectedSubstanceIndex}
              onChange={handleSubstanceChange}
              className="w-full p-2.5 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500"
              aria-label="Seleccionar sustancia para la simulación"
            >
              {SUBSTANCES.map((sub, index) => (
                <option key={sub.name} value={index}>{sub.name}</option>
              ))}
            </select>
          </div>
          <div className="text-xs p-3 bg-slate-700 rounded-lg w-full max-w-xs text-slate-300">
            <h3 className="font-semibold text-sky-400 mb-1">Propiedades de {currentSubstanceDef.name}:</h3>
            <p>Punto de Fusión: {currentSubstanceDef.meltingPoint}°C</p>
            <p>Punto de Ebullición: {currentSubstanceDef.boilingPoint}°C</p>
            {currentSubstanceDef.plasmaPoint && <p>Punto de Plasma: {currentSubstanceDef.plasmaPoint}°C</p>}
          </div>
          <Controls 
            currentHeatingMode={heatingMode}
            onSetHeatingMode={handleSetHeatingMode} 
            onReset={handleReset} 
            currentTemperature={currentSubstanceState.temperature}
            minSimTemp={currentSubstanceDef.minSimTemp}
            maxSimTemp={currentSubstanceDef.maxSimTemp}
          />
          <Thermometer temperature={currentSubstanceState.temperature} minTemp={currentSubstanceDef.minSimTemp} maxTemp={currentSubstanceDef.maxSimTemp} />
          <div className="text-center p-4 bg-slate-700 rounded-lg w-full max-w-xs">
            <p className="text-xl font-semibold text-sky-300">{currentSubstanceState.phase} ({currentSubstanceDef.name})</p>
            <p className="text-sm text-slate-400">Temperatura: {currentSubstanceState.temperature.toFixed(1)} °C</p>
            <p className="text-sm text-slate-400">Energía Total: {(currentSubstanceState.totalEnergy / 1000).toFixed(2)} kJ</p>
            <p className="text-sm text-slate-400">Tiempo: {elapsedTime.toFixed(1)} s</p>
          </div>
        </section>

        <section className="md:col-span-2 flex flex-col space-y-6">
          <div className="h-80 p-6 bg-slate-800 rounded-xl shadow-2xl flex items-center justify-center">
            <SubstanceVisualizer phase={currentSubstanceState.phase} fractions={currentSubstanceState.fractions} substanceName={currentSubstanceDef.name} />
          </div>
          <div className="h-96 p-6 bg-slate-800 rounded-xl shadow-2xl">
            <TemperatureGraph data={graphData} substance={currentSubstanceDef} />
          </div>
        </section>
      </main>

      <footer className="w-full max-w-5xl text-center mt-8 text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Simulación de Estados de la Materia. Para fines educativos.</p>
      </footer>
    </div>
  );
};

export default App;
