import React from 'react';

interface ThermometerProps {
  temperature: number;
  minTemp: number;
  maxTemp: number;
}

const Thermometer: React.FC<ThermometerProps> = ({ temperature, minTemp, maxTemp }) => {
  const range = maxTemp - minTemp;
  // Clamp temperature to be within the thermometer's displayable range for visual percentage
  const clampedVisualTemp = Math.max(minTemp, Math.min(maxTemp, temperature));
  const percentage = range === 0 ? 0 : ((clampedVisualTemp - minTemp) / range) * 100;

  let bgColor = 'bg-sky-500'; // Default blue
  // Color logic based on actual temperature, not just visual range
  if (temperature >= 100) bgColor = 'bg-red-600'; 
  else if (temperature > 3000 && temperature < 13000) bgColor = 'bg-purple-600'; // Hot gas / pre-plasma
  else if (temperature >= 13000) bgColor = 'bg-pink-600'; // Plasma
  else if (temperature > 0 && temperature < 100) bgColor = 'bg-orange-500'; 
  else if (temperature <= 0) bgColor = 'bg-blue-600'; 


  // Determine tick marks based on range
  const numTicks = 5;
  const ticks = Array.from({length: numTicks + 1}, (_, i) => {
    const value = minTemp + (range / numTicks) * i;
    const position = ((value - minTemp) / range) * 100;
    return { value, position };
  });


  return (
    <div className="w-24 h-80 bg-slate-700 rounded-full px-2 pt-8 pb-8 flex flex-col items-center border-2 border-slate-600 shadow-inner relative">
      {/* Tick marks */}
      {ticks.map(tick => (
         <div 
            key={tick.value} 
            className="absolute left-1 flex items-center"
            style={{ 
              bottom: `${tick.position}%`,
              transform: 'translateY(50%)', // Vertically center the tick line/text
            }}
          >
            <span 
              className="text-xs text-slate-400 text-right tabular-nums mr-1" 
              style={{minWidth: '1.75rem'}} // Approx 28px, for numbers like -200 or 10000
            >
              {tick.value.toFixed(0)}
            </span>
            <div className="w-1.5 h-px bg-slate-500"></div> {/* Tick line: 6px wide */}
         </div>
      ))}

      {/* Mercury tube container */}
      <div className="w-full h-full bg-slate-300 rounded-full relative overflow-hidden">
        {/* Mercury fill */}
        <div
          className={`absolute bottom-0 w-full ${bgColor} transition-all duration-200 ease-out`}
          style={{ height: `${percentage}%` }}
          aria-hidden="true"
        ></div>
      </div>
      
      {/* Bulb */}
      <div 
        className={`absolute -bottom-4 w-16 h-16 rounded-full ${bgColor} border-4 border-slate-600 flex items-center justify-center`}
        aria-hidden="true"
      >
      </div>

      {/* Central temperature display */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 pointer-events-none">
        <span className="text-2xl font-bold text-slate-900 drop-shadow-sm">{temperature.toFixed(0)}</span>
        <span className="text-xs text-slate-800">°C</span>
      </div>
    </div>
  );
};

export default Thermometer;