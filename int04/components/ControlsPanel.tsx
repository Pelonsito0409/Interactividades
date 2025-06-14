
import React from 'react';
import { Substance, TemperatureControlStatus } from '../types';
import { SUBSTANCES_LIST, MIN_VOLUME_L, MAX_VOLUME_L, MIN_MOLES, MAX_MOLES, MOLES_STEP } from '../constants';

interface ControlsPanelProps {
  selectedSubstanceId: string;
  onSubstanceChange: (substanceId: string) => void;
  
  temperatureK: number;
  temperatureControlStatus: TemperatureControlStatus;
  onTemperatureControlChange: (status: TemperatureControlStatus) => void;
  isTemperatureLocked: boolean;
  onToggleTemperatureLock: () => void;
  
  volumeL: number;
  onVolumeChange: (volume: number) => void;
  isVolumeLocked: boolean;
  onToggleVolumeLock: () => void;

  moles: number;
  onMolesChange: (moles: number) => void;
  
  isAnyOtherLockActiveForControls: boolean; // True if any lock (T, V, or P) is active
  observationMessage: string | null;
}

const ControlButton: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string, active?: boolean, disabled?: boolean }> = 
  ({ onClick, children, className = '', active = false, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-md font-semibold transition-colors duration-150 ease-in-out
                ${disabled ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 
                  active ? 'bg-sky-500 text-white ring-2 ring-sky-300' : 'bg-slate-600 hover:bg-slate-500 text-slate-200'}
                ${className}`}
  >
    {children}
  </button>
);

const Label: React.FC<{ htmlFor?: string; children: React.ReactNode; className?:string }> = ({htmlFor, children, className}) => (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-slate-300 mb-1 ${className}`}>{children}</label>
);

const LockToggle: React.FC<{isLocked: boolean, onToggle: () => void, disabled?: boolean, variableName: string}> = 
  ({isLocked, onToggle, disabled = false, variableName}) => (
  <button 
    onClick={onToggle} 
    disabled={disabled}
    aria-pressed={isLocked}
    aria-label={`Bloquear ${variableName}`}
    className={`p-1 rounded-md transition-colors ${disabled ? 'text-slate-600 cursor-not-allowed' : isLocked ? 'bg-sky-600 text-white hover:bg-sky-500' : 'bg-slate-500 text-slate-300 hover:bg-slate-400'}`}
  >
    {isLocked ? 
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg> :
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5a3 3 0 10-6 0V9H4v2h12V9h-2V5.5A4.5 4.5 0 0010 1z" /></svg>
    }
  </button>
);


const ControlsPanel: React.FC<ControlsPanelProps> = ({
  selectedSubstanceId,
  onSubstanceChange,
  temperatureK,
  temperatureControlStatus,
  onTemperatureControlChange,
  isTemperatureLocked,
  onToggleTemperatureLock,
  volumeL,
  onVolumeChange,
  isVolumeLocked,
  onToggleVolumeLock,
  moles,
  onMolesChange,
  isAnyOtherLockActiveForControls,
  observationMessage,
}) => {
  
  return (
    <div className="p-4 space-y-6 bg-slate-800 rounded-lg shadow-xl w-full md:w-auto">
      {/* Substance Selection */}
      <div>
        <Label htmlFor="substance-select">Sustancia</Label>
        <select
          id="substance-select"
          value={selectedSubstanceId}
          onChange={(e) => onSubstanceChange(e.target.value)}
          className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-md text-slate-100 focus:ring-sky-500 focus:border-sky-500"
        >
          {SUBSTANCES_LIST.map(substance => (
            <option key={substance.id} value={substance.id}>
              {substance.name}
            </option>
          ))}
        </select>
      </div>

      {/* Temperature Control */}
      <div>
        <div className="flex justify-between items-center mb-1">
            <Label>Control de Temperatura</Label>
            <LockToggle 
                isLocked={isTemperatureLocked}
                onToggle={onToggleTemperatureLock} 
                disabled={!isTemperatureLocked && isAnyOtherLockActiveForControls}
                variableName="Temperatura"
            />
        </div>
        <div className="flex space-x-2">
          <ControlButton 
            onClick={() => onTemperatureControlChange(TemperatureControlStatus.COOLING)}
            active={temperatureControlStatus === TemperatureControlStatus.COOLING}
            disabled={isTemperatureLocked}
            className="flex-1"
          >
            Enfriar
          </ControlButton>
          <ControlButton 
            onClick={() => onTemperatureControlChange(TemperatureControlStatus.NEUTRAL)}
            active={temperatureControlStatus === TemperatureControlStatus.NEUTRAL}
            disabled={isTemperatureLocked}
            className="flex-1"
          >
            Detener
          </ControlButton>
          <ControlButton 
            onClick={() => onTemperatureControlChange(TemperatureControlStatus.HEATING)}
            active={temperatureControlStatus === TemperatureControlStatus.HEATING}
            disabled={isTemperatureLocked}
            className="flex-1"
          >
            Calentar
          </ControlButton>
        </div>
        {/* Updated condition to display observationMessage whenever it exists */}
        {observationMessage && (
          <p className="text-xs text-sky-300 italic mt-1.5 px-1">{observationMessage}</p>
        )}
      </div>

      {/* Volume Control */}
      <div>
        <div className="flex justify-between items-center mb-1">
            <Label htmlFor="volume-slider">Volumen: {volumeL.toFixed(1)} L</Label>
            <LockToggle 
                isLocked={isVolumeLocked} 
                onToggle={onToggleVolumeLock} 
                disabled={!isVolumeLocked && isAnyOtherLockActiveForControls}
                variableName="Volumen"
            />
        </div>
        <input
          type="range"
          id="volume-slider"
          min={MIN_VOLUME_L}
          max={MAX_VOLUME_L}
          step="0.1" 
          value={volumeL}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          disabled={isVolumeLocked}
          className={`w-full h-2 bg-slate-700 rounded-lg appearance-none 
                      ${isVolumeLocked ? 'opacity-50 cursor-not-allowed accent-slate-600' : 'cursor-pointer accent-sky-500'}`}
        />
      </div>

      {/* Moles Control - Lock Removed, always enabled */}
      <div>
        <div className="flex justify-between items-center mb-1">
            <Label>Cantidad de Sustancia: {moles.toFixed(2)} mol</Label>
            {/* Lock toggle removed for moles */}
        </div>
        <div className="flex space-x-2">
          <ControlButton 
            onClick={() => onMolesChange(Math.max(MIN_MOLES, parseFloat((moles - MOLES_STEP).toFixed(2))))}
            // disabled prop removed, moles control is always active
            className="flex-1"
            >
            - Menos
          </ControlButton>
          <ControlButton 
            onClick={() => onMolesChange(Math.min(MAX_MOLES, parseFloat((moles + MOLES_STEP).toFixed(2))))}
            // disabled prop removed, moles control is always active
            className="flex-1"
            >
            + Más
          </ControlButton>
        </div>
      </div>
    </div>
  );
};

export default ControlsPanel;
