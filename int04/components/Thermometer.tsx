
import React from 'react';
import { TemperatureControlStatus } from '../types';
import { MIN_TEMPERATURE_K, MAX_TEMPERATURE_K } from '../constants';


interface ThermometerProps {
  temperatureK: number; // in Kelvin
  status: TemperatureControlStatus;
}

const FlameIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-8 h-8 text-orange-500 ${className}`}>
    <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.052A9.75 9.75 0 0110.5 12c0-1.802.599-3.444 1.633-4.796a.75.75 0 00-1.148-.965A11.25 11.25 0 009 12c0 3.149 1.28 5.985 3.367 8.028a.75.75 0 001.149-.966A9.752 9.752 0 0110.5 15c0-1.24.359-2.393.972-3.387a.75.75 0 00-1.071-1.052A11.19 11.19 0 009.028 12a11.247 11.247 0 002.223-7.231.75.75 0 00-.633-1.052.75.75 0 00-1.052.633 12.743 12.743 0 011.424 8.332.75.75 0 001.49-.168 11.246 11.246 0 00-.306-9.202.75.75 0 00-.633-.97Z" clipRule="evenodd" />
  </svg>
);

const SnowflakeIcon: React.FC<{ className?: string }> = ({ className }) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-8 h-8 text-blue-400 ${className}`}>
    <path fillRule="evenodd" d="M12.53 2.47a.75.75 0 00-1.06 0L6.22 7.72A.75.75 0 006 8.25H4.5a.75.75 0 000 1.5H6v1.5A.75.75 0 006.75 12h1.5a.75.75 0 00.53-.22L12 8.56l3.22 3.22a.75.75 0 00.53.22h1.5a.75.75 0 00.75-.75V9.75h1.5a.75.75 0 000-1.5H18a.75.75 0 00-.22-.53l-5.25-5.25zM12 11.06l-2.47 2.47a.75.75 0 000 1.06L12 17.06l2.47-2.47a.75.75 0 000-1.06L12 11.06zM6.22 16.28A.75.75 0 006 15.75v-1.5H4.5a.75.75 0 000 1.5H6v1.5a.75.75 0 00.75.75h1.5a.75.75 0 00.53-.22L12 15.44l3.22 3.22a.75.75 0 00.53.22h1.5a.75.75 0 00.75-.75v-1.5h1.5a.75.75 0 000-1.5H18v-1.5a.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.53.22L12.53 21.53a.75.75 0 00-1.06 0l-5.25-5.25z" clipRule="evenodd" />
  </svg>
);


const Thermometer: React.FC<ThermometerProps> = ({ temperatureK, status }) => {
  const temperatureC = temperatureK - 273.15;
  const fillPercentage = Math.max(0, Math.min(100, ((temperatureK - MIN_TEMPERATURE_K) / (MAX_TEMPERATURE_K - MIN_TEMPERATURE_K)) * 100));

  let liquidColor = 'bg-red-500';
  if (temperatureK < 273.15) liquidColor = 'bg-blue-500'; // Below freezing
  if (temperatureK > 373.15) liquidColor = 'bg-orange-600'; // Boiling point of water

  return (
    <div className="w-40 h-auto flex flex-col items-center p-2 bg-slate-700 rounded-lg shadow-md">
      <span className="text-sm font-medium text-slate-300 mb-1">Temperatura</span>
      <div className="flex items-end justify-center h-40 w-12 bg-slate-600 rounded-full relative overflow-hidden border-2 border-slate-500">
        <div
          className={`w-full ${liquidColor} transition-all duration-300 ease-linear`}
          style={{ height: `${fillPercentage}%` }}
        />
        {/* Bulb */}
        <div className={`absolute bottom-0 w-16 h-16 rounded-full ${liquidColor} -mb-8 border-2 border-slate-500`} />
      </div>
      <div className="mt-2 flex items-center justify-center h-8">
        {status === TemperatureControlStatus.HEATING && <FlameIcon />}
        {status === TemperatureControlStatus.COOLING && <SnowflakeIcon />}
      </div>
      <span className="text-lg font-semibold text-sky-400 tabular-nums">
        {temperatureC.toFixed(1)} °C
      </span>
      <span className="text-xs text-slate-400 tabular-nums">
        ({temperatureK.toFixed(1)} K)
      </span>
    </div>
  );
};

export default Thermometer;