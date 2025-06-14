
import React from 'react';
import { PRESSURE_GAUGE_MAX_ATM } from '../constants';

interface PressureGaugeProps {
  pressure: number; // in atm
  isPressureLocked: boolean;
  onTogglePressureLock: () => void;
  isAnyOtherLockActive: boolean; // True if Temp or Vol lock is active
}

// Re-define LockToggle here or import if it's made a shared component
const LockToggle: React.FC<{isLocked: boolean, onToggle: () => void, disabled?: boolean, variableName: string, className?: string}> = 
  ({isLocked, onToggle, disabled = false, variableName, className=""}) => (
  <button 
    onClick={onToggle} 
    disabled={disabled}
    aria-pressed={isLocked}
    aria-label={`Bloquear ${variableName}`}
    className={`p-1 rounded-md transition-colors ${disabled ? 'text-slate-600 cursor-not-allowed' : isLocked ? 'bg-sky-600 text-white hover:bg-sky-500' : 'bg-slate-500 text-slate-300 hover:bg-slate-400'} ${className}`}
  >
    {isLocked ? 
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg> :
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5a3 3 0 10-6 0V9H4v2h12V9h-2V5.5A4.5 4.5 0 0010 1z" /></svg>
    }
  </button>
);


const PressureGauge: React.FC<PressureGaugeProps> = ({ pressure, isPressureLocked, onTogglePressureLock, isAnyOtherLockActive }) => {
  const clampedPressure = Math.min(Math.max(pressure, 0), PRESSURE_GAUGE_MAX_ATM);
  const normalizedPressure = clampedPressure / PRESSURE_GAUGE_MAX_ATM;

  const svgWidth = 144; 
  const gaugeRadius = 50;
  const topPaddingInSVG = 12; 
  const bottomPaddingInSVG = 7; 
  
  const gaugeCenterY = gaugeRadius + topPaddingInSVG; 
  const svgHeight = topPaddingInSVG + gaugeRadius + bottomPaddingInSVG;

  const needleAngleDegrees = (normalizedPressure * 180) - 180;
  const cx = svgWidth / 2;

  const majorTickValues = Array.from({ length: 11 }, (_, i) => (i / 10) * PRESSURE_GAUGE_MAX_ATM);
  const labeledTickIndices = [0, 2, 4, 6, 8, 10]; 

  const fontSize = 7;
  const textGapFromArc = 4; 
  const textLabelRadius = gaugeRadius + textGapFromArc + (fontSize / 2); 

  const majorTickOuterR = gaugeRadius + 3; 
  const majorTickInnerR = gaugeRadius - 3; 
  const minorTickOuterR = gaugeRadius + 1.5; 
  const minorTickInnerR = gaugeRadius - 1.5; 

  // Message for Charles' Law if pressure is locked
  // This message is now handled globally by App.tsx and passed to ControlsPanel
  // However, we might want to display it near the pressure gauge if P is locked.
  // For now, let ControlsPanel handle the display based on observationMessage prop from App.

  return (
    <div className="w-48 h-auto flex flex-col items-center p-2 bg-slate-700 rounded-lg shadow-md">
      <div className="w-full flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-slate-300">Presión</span>
        <LockToggle
          isLocked={isPressureLocked}
          onToggle={onTogglePressureLock}
          disabled={!isPressureLocked && isAnyOtherLockActive}
          variableName="Presión"
        />
      </div>
      <div className="relative w-full flex-grow flex items-center justify-center min-h-[80px]"> 
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto max-h-[80px]">
          <path
            d={`M ${cx - gaugeRadius} ${gaugeCenterY} A ${gaugeRadius} ${gaugeRadius} 0 0 1 ${cx + gaugeRadius} ${gaugeCenterY}`}
            fill="none"
            stroke="#4A5568" 
            strokeWidth="10" 
          />

          {majorTickValues.map((value, index) => {
            const normValue = value / PRESSURE_GAUGE_MAX_ATM;
            const angleMath = Math.PI - (normValue * Math.PI); 
            
            const cosAngle = Math.cos(angleMath);
            const sinAngle = Math.sin(angleMath); 

            const x1Major = cx + majorTickInnerR * cosAngle;
            const y1Major = gaugeCenterY - majorTickInnerR * sinAngle; 
            const x2Major = cx + majorTickOuterR * cosAngle;
            const y2Major = gaugeCenterY - majorTickOuterR * sinAngle;
            
            const minorTicksElements: JSX.Element[] = [];
            if (index < majorTickValues.length - 1) {
              const nextMajorValue = majorTickValues[index+1];
              const step = (nextMajorValue - value) / 4; 
              for (let i = 1; i < 4; ++i) {
                const minorValue = value + i * step;
                const minorNormValue = minorValue / PRESSURE_GAUGE_MAX_ATM;
                const minorAngleMath = Math.PI - (minorNormValue * Math.PI);
                const minorCosAngle = Math.cos(minorAngleMath);
                const minorSinAngle = Math.sin(minorAngleMath);

                const x1Minor = cx + minorTickInnerR * minorCosAngle;
                const y1Minor = gaugeCenterY - minorTickInnerR * minorSinAngle;
                const x2Minor = cx + minorTickOuterR * minorCosAngle;
                const y2Minor = gaugeCenterY - minorTickOuterR * minorSinAngle;
                minorTicksElements.push(
                   <line
                    key={`minor-${index}-${i}`}
                    x1={x1Minor} y1={y1Minor} x2={x2Minor} y2={y2Minor}
                    stroke="#94A3B8" 
                    strokeWidth="1"
                  />
                );
              }
            }
            
            const labelX = cx + textLabelRadius * cosAngle;
            const labelY = gaugeCenterY - textLabelRadius * sinAngle;
            
            return (
              <React.Fragment key={`major-${index}`}>
                <line
                  x1={x1Major} y1={y1Major} x2={x2Major} y2={y2Major}
                  stroke="#CBD5E0" 
                  strokeWidth="1.5"
                />
                {labeledTickIndices.includes(index) && (
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle" 
                    dominantBaseline="middle"
                    fontSize={`${fontSize}px`}
                    fill="#E2E8F0" 
                  >
                    {Math.round(value)}
                  </text>
                )}
                {minorTicksElements}
              </React.Fragment>
            );
          })}

          <g transform={`translate(${cx}, ${gaugeCenterY}) rotate(${needleAngleDegrees})`}>
            <rect x="-10" y="-1.5" width="12" height="3" fill="#F87171" rx="1" /> 
            <polygon points={`2,-2 ${gaugeRadius-6},0 2,2`} fill="#F87171" /> 
            <circle cx="0" cy="0" r="4" fill="#F87171" stroke="#DC2626" strokeWidth="1.5"/>
          </g>
        </svg>
      </div>
      <span className="text-lg font-semibold text-sky-400 tabular-nums mt-1">
        {pressure.toFixed(2)} atm
      </span>
       {/* The observation message is displayed in ControlsPanel */}
    </div>
  );
};

export default PressureGauge;
