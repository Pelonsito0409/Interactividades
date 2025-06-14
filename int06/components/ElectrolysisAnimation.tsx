
import React from 'react';

const ElectrolysisAnimation: React.FC = () => {
  return (
    <div className="my-4 p-4 border border-sky-500 rounded-lg bg-slate-700">
      <p className="text-center text-sky-300 mb-2">Simulación de Electrólisis del Agua (H₂O):</p>
      <div className="relative w-48 h-32 mx-auto bg-sky-100 rounded-md p-2 overflow-hidden">
        {/* Water */}
        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-sky-400 opacity-70"></div>

        {/* Electrodes */}
        <div className="absolute bottom-0 left-8 w-4 h-20 bg-slate-500 rounded-t-sm"></div>
        <div className="absolute bottom-0 right-8 w-4 h-20 bg-slate-500 rounded-t-sm"></div>
        <div className="absolute top-2 left-8 w-4 h-2 bg-red-500"></div> {/* Anode (+) */}
        <div className="absolute top-2 right-8 w-4 h-2 bg-slate-800"></div> {/* Cathode (-) */}


        {/* Bubbles - Oxygen (Anode) */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`o2-${i}`}
            className="absolute left-9 w-1 h-1 bg-red-300 rounded-full animate-bubble"
            style={{ animationDelay: `${i * 0.3}s`, bottom: `${Math.random()*20}px` }}
          ></div>
        ))}
        <p className="absolute top-0 left-2 text-xs text-red-600">O₂</p>

        {/* Bubbles - Hydrogen (Cathode) */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`h2-${i}`}
            className="absolute right-9 w-1.5 h-1.5 bg-slate-300 rounded-full animate-bubble"
            style={{ animationDelay: `${i * 0.2}s`, bottom: `${Math.random()*20}px`, animationDuration: '1s' }}
          ></div>
        ))}
         <p className="absolute top-0 right-2 text-xs text-slate-900">H₂</p>
      </div>
      <p className="text-xs text-center mt-2 text-slate-400">
        El agua se descompone en Oxígeno (O₂) en el ánodo (+) e Hidrógeno (H₂) en el cátodo (-).
      </p>
    </div>
  );
};

export default ElectrolysisAnimation;
