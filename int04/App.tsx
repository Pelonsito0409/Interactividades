import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Particle, TemperatureControlStatus } from './types';
import {
  R_GAS_CONSTANT, INITIAL_TEMPERATURE_K, MIN_TEMPERATURE_K, MAX_TEMPERATURE_K, TEMPERATURE_STEP_K,
  INITIAL_VOLUME_L, MIN_VOLUME_L, MAX_VOLUME_L,
  INITIAL_MOLES, PARTICLES_PER_MOLE, PARTICLE_RADIUS, PARTICLE_BASE_SPEED,
  REFERENCE_TEMPERATURE_FOR_VELOCITY, CONTAINER_MAX_DIM_PX, CONTAINER_MIN_DIM_PX,
  SUBSTANCES_LIST, DEFAULT_SUBSTANCE_ID,
} from './constants';
import GasContainer from './components/GasContainer';
import PressureGauge from './components/PressureGauge';
import Thermometer from './components/Thermometer';
import ControlsPanel from './components/ControlsPanel';
import FullscreenButton from './components/FullscreenButton'; // Importar el nuevo componente

const App: React.FC = () => {
  const [temperatureK, setTemperatureK] = useState<number>(INITIAL_TEMPERATURE_K);
  const [volumeL, setVolumeL] = useState<number>(INITIAL_VOLUME_L);
  const [moles, setMoles] = useState<number>(INITIAL_MOLES);
  const [pressureAtm, setPressureAtm] = useState<number>(0);
  
  const [particles, setParticles] = useState<Particle[]>([]);
  const [selectedSubstanceId, setSelectedSubstanceId] = useState<string>(DEFAULT_SUBSTANCE_ID);
  const [temperatureControl, setTemperatureControl] = useState<TemperatureControlStatus>(TemperatureControlStatus.NEUTRAL);

  const [manuallyLocked, setManuallyLocked] = useState<{temp: boolean, vol: boolean, pressure: boolean}>({temp: false, vol: false, pressure: false});
  const [observationMessage, setObservationMessage] = useState<string | null>(null);

  const selectedSubstance = SUBSTANCES_LIST.find(s => s.id === selectedSubstanceId) || SUBSTANCES_LIST[0];

  const temperatureRef = useRef(temperatureK);
  const containerWidthRef = useRef(0);
  const containerHeightRef = useRef(0);
  const particleBaseSpeedRef = useRef(PARTICLE_BASE_SPEED);

  useEffect(() => { temperatureRef.current = temperatureK; }, [temperatureK]);

  const calculateContainerDimensions = useCallback((currentVolumeL: number) => {
    const volumeRatio = (currentVolumeL - MIN_VOLUME_L) / (MAX_VOLUME_L - MIN_VOLUME_L);
    const scaledDim = CONTAINER_MIN_DIM_PX + (CONTAINER_MAX_DIM_PX - CONTAINER_MIN_DIM_PX) * Math.sqrt(Math.max(0, volumeRatio));
    return { width: scaledDim, height: scaledDim };
  }, []);

  useEffect(() => {
    const { width, height } = calculateContainerDimensions(volumeL);
    containerWidthRef.current = width;
    containerHeightRef.current = height;
  }, [volumeL, calculateContainerDimensions]);

  const createParticle = useCallback((id: number, cWidth: number, cHeight: number, color: string): Particle => {
    const angle = Math.random() * 2 * Math.PI;
    const vx = Math.cos(angle) * particleBaseSpeedRef.current;
    const vy = Math.sin(angle) * particleBaseSpeedRef.current;
    return {
      id, x: PARTICLE_RADIUS + Math.random() * (cWidth - 2 * PARTICLE_RADIUS),
      y: PARTICLE_RADIUS + Math.random() * (cHeight - 2 * PARTICLE_RADIUS),
      vx, vy, radius: PARTICLE_RADIUS, color,
    };
  }, []);

  useEffect(() => {
    const targetParticleCount = Math.round(moles * PARTICLES_PER_MOLE);
    const cWidth = containerWidthRef.current;
    const cHeight = containerHeightRef.current;
    setParticles(prevParticles => {
      let newParticles = [...prevParticles];
      const currentCount = newParticles.length;
      if (targetParticleCount > currentCount) {
        for (let i = 0; i < targetParticleCount - currentCount; i++) {
          newParticles.push(createParticle(Date.now() + i, cWidth, cHeight, selectedSubstance.particleColor));
        }
      } else if (targetParticleCount < currentCount) {
        newParticles = newParticles.slice(0, targetParticleCount);
      }
      return newParticles.map(p => ({
        ...p, color: selectedSubstance.particleColor,
        x: Math.max(p.radius, Math.min(p.x, cWidth - p.radius)),
        y: Math.max(p.radius, Math.min(p.y, cHeight - p.radius)),
      }));
    });
  }, [moles, selectedSubstance, createParticle]);

  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      setParticles(prevParticles => {
        const currentTempK = temperatureRef.current;
        const cWidth = containerWidthRef.current;
        const cHeight = containerHeightRef.current;
        const tempFactor = Math.sqrt(Math.max(0.01, currentTempK) / REFERENCE_TEMPERATURE_FOR_VELOCITY);
        return prevParticles.map(p => {
          let newX = p.x + p.vx * tempFactor;
          let newY = p.y + p.vy * tempFactor;
          let newVx = p.vx; let newVy = p.vy;
          if (newX - p.radius < 0) { newX = p.radius; newVx = -newVx; }
          if (newX + p.radius > cWidth) { newX = cWidth - p.radius; newVx = -newVx; }
          if (newY - p.radius < 0) { newY = p.radius; newVy = -newVy; }
          if (newY + p.radius > cHeight) { newY = cHeight - p.radius; newVy = -newVy; }
          return { ...p, x: newX, y: newY, vx: newVx, vy: newVy };
        });
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    if (volumeL > 0) {
      const P = (moles * R_GAS_CONSTANT * temperatureK) / volumeL;
      setPressureAtm(P);
    }
  }, [moles, temperatureK, volumeL]);

  useEffect(() => {
    if (temperatureControl === TemperatureControlStatus.NEUTRAL || manuallyLocked.temp) {
      return;
    }
    const intervalId = setInterval(() => {
      setTemperatureK(prevT => {
        let newT = prevT;
        if (temperatureControl === TemperatureControlStatus.HEATING) newT += TEMPERATURE_STEP_K;
        else if (temperatureControl === TemperatureControlStatus.COOLING) newT -= TEMPERATURE_STEP_K;
        return Math.max(MIN_TEMPERATURE_K, Math.min(MAX_TEMPERATURE_K, newT));
      });
    }, 200);
    return () => clearInterval(intervalId);
  }, [temperatureControl, manuallyLocked.temp]);

  useEffect(() => {
    if (manuallyLocked.temp) {
      setObservationMessage("Estás utilizando la Ley de Boyle porque es la que tiene T=cte.");
    } else if (manuallyLocked.vol) {
      setObservationMessage("Estás utilizando la Ley de Gay-Lussac porque es la que tiene V=cte.");
    } else if (manuallyLocked.pressure) {
      setObservationMessage("Estás utilizando la Ley de Charles porque es la que tiene P=cte.");
    } else {
      setObservationMessage(null);
    }
  }, [manuallyLocked]);

  const handleToggleLock = (variable: 'temp' | 'vol' | 'pressure') => {
    setManuallyLocked(prev => {
      const currentlyAttemptingToLockValue = !prev[variable];
      let newLocks = { temp: false, vol: false, pressure: false }; // Reset all
      if (currentlyAttemptingToLockValue) { // If trying to activate this lock
        newLocks[variable] = true; // Activate it
      }
      // If trying to deactivate (currentlyAttemptingToLockValue is false), newLocks remains all false, effectively deactivating.
      return newLocks;
    });
  };
  
  const { width: currentContainerWidth, height: currentContainerHeight } = calculateContainerDimensions(volumeL);

  const isAnyLockActive = manuallyLocked.temp || manuallyLocked.vol || manuallyLocked.pressure;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 space-y-6 bg-gradient-to-br from-slate-800 to-slate-900 no-select">
      <FullscreenButton /> {/* Añadir el botón de pantalla completa */}
      <header className="text-center mt-4">
        <h1 className="text-4xl font-bold text-sky-400">Simulación Interactiva de las Leyes de los Gases</h1>
        <p className="text-slate-300 mt-2 text-lg">Ajusta los parámetros para ver cómo se comportan los gases.</p>
        <p className="text-slate-400 mt-1">Observa el comportamiento de las partículas y las relaciones bajo condiciones cambiantes. Bloquea una variable (T, V, o P) para explorar relaciones específicas.</p>
      </header>
      
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-7xl"> {/* Reduced gap from gap-6 to gap-4 */}
        <div className="lg:w-1/3">
           <ControlsPanel
            selectedSubstanceId={selectedSubstanceId}
            onSubstanceChange={setSelectedSubstanceId}
            
            temperatureK={temperatureK}
            temperatureControlStatus={temperatureControl}
            onTemperatureControlChange={setTemperatureControl}
            isTemperatureLocked={manuallyLocked.temp}
            onToggleTemperatureLock={() => handleToggleLock('temp')}
            
            volumeL={volumeL}
            onVolumeChange={(v) => {
                if (!manuallyLocked.vol) {
                    setVolumeL(v);
                }
            }}
            isVolumeLocked={manuallyLocked.vol}
            onToggleVolumeLock={() => handleToggleLock('vol')}

            moles={moles}
            onMolesChange={(m) => setMoles(m)} // Moles control always enabled

            isAnyOtherLockActiveForControls={isAnyLockActive} // Used to disable other lock toggles
            observationMessage={observationMessage}
          />
        </div>

        <div className="lg:w-2/3 flex flex-col items-center space-y-6">
          <GasContainer
            particles={particles}
            containerWidth={currentContainerWidth}
            containerHeight={currentContainerHeight}
          />
          <div className="flex flex-wrap justify-center items-start gap-4 w-full">
            <PressureGauge 
              pressure={pressureAtm}
              isPressureLocked={manuallyLocked.pressure}
              onTogglePressureLock={() => handleToggleLock('pressure')}
              isAnyOtherLockActive={manuallyLocked.temp || manuallyLocked.vol}
            />
            <Thermometer temperatureK={temperatureK} status={temperatureControl} />
          </div>
        </div>
      </div>
      <footer className="text-center text-slate-500 text-sm mt-auto pb-4">
        <p>&copy; 2024 Simulación de Física. Explora las leyes de los gases.</p>
      </footer>
    </div>
  );
};

export default App;