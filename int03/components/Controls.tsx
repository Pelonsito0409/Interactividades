
import React from 'react';
import { Flame, Snowflake, RefreshCw, StopCircle } from 'lucide-react';
import { TEMP_EPSILON } from '../constants';


type HeatingMode = 'none' | 'add' | 'remove';

interface ControlsProps {
  currentHeatingMode: HeatingMode;
  onSetHeatingMode: (mode: HeatingMode) => void;
  onReset: () => void;
  currentTemperature: number;
  minSimTemp: number;
  maxSimTemp: number;
}

const Controls: React.FC<ControlsProps> = ({ currentHeatingMode, onSetHeatingMode, onReset, currentTemperature, minSimTemp, maxSimTemp }) => {
  const baseButtonClass = "w-full flex items-center justify-center px-6 py-3 text-white font-semibold rounded-lg shadow-md transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-opacity-75";
  
  const atMaxTemp = Math.abs(currentTemperature - maxSimTemp) < TEMP_EPSILON;
  const atMinTemp = Math.abs(currentTemperature - minSimTemp) < TEMP_EPSILON;

  const addHeatDisabled = currentHeatingMode === 'add' || atMaxTemp;
  const removeHeatDisabled = currentHeatingMode === 'remove' || atMinTemp;


  const addHeatClass = currentHeatingMode === 'add' 
    ? "bg-red-800 ring-2 ring-red-400" 
    : addHeatDisabled ? "bg-red-700 opacity-60 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-400";
  
  const removeHeatClass = currentHeatingMode === 'remove'
    ? "bg-blue-800 ring-2 ring-blue-400"
    : removeHeatDisabled ? "bg-blue-700 opacity-60 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400";

  return (
    <div className="space-y-4 w-full max-w-xs">
      <button
        onClick={() => onSetHeatingMode('add')}
        className={`${baseButtonClass} ${addHeatClass}`}
        disabled={addHeatDisabled}
        aria-pressed={currentHeatingMode === 'add'}
        aria-label="Comenzar a añadir calor continuamente"
      >
        <Flame size={20} aria-hidden="true" />
        <span className="ml-2">Añadir Calor</span>
      </button>
      <button
        onClick={() => onSetHeatingMode('remove')}
        className={`${baseButtonClass} ${removeHeatClass}`}
        disabled={removeHeatDisabled}
        aria-pressed={currentHeatingMode === 'remove'}
        aria-label="Comenzar a quitar calor continuamente"
      >
        <Snowflake size={20} aria-hidden="true" />
        <span className="ml-2">Quitar Calor</span>
      </button>
      <button
        onClick={() => onSetHeatingMode('none')}
        className={`${baseButtonClass} bg-yellow-500 hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 ${currentHeatingMode === 'none' ? 'opacity-70 cursor-not-allowed' : ''}`}
        disabled={currentHeatingMode === 'none'}
        aria-label="Detener cambio de temperatura"
      >
        <StopCircle size={20} aria-hidden="true" />
        <span className="ml-2">Detener Cambio</span>
      </button>
      <button
        onClick={onReset}
        className={`${baseButtonClass} bg-gray-500 hover:bg-gray-600 focus:ring-2 focus:ring-gray-400`}
        aria-label="Reiniciar simulación"
      >
        <RefreshCw size={20} aria-hidden="true" />
        <span className="ml-2">Reiniciar Simulación</span>
      </button>
    </div>
  );
};

export default Controls;