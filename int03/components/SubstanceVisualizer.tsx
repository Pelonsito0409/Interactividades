
import React, { useEffect, useState } from 'react';
import { Phase, SubstanceFractions } from '../types';

interface SubstanceVisualizerProps {
  phase: Phase;
  fractions: SubstanceFractions;
  substanceName: string;
}

// Helper for capitalized display, as enum values are now sentence case
const getCapitalizedPhaseName = (phase: Phase): string => {
    switch(phase) {
        case Phase.Solid: return "SÓLIDO";
        case Phase.Liquid: return "LÍQUIDO";
        case Phase.Gas: return "GASEOSO";
        case Phase.Melting: return "FUNDIENDO"; // Or "FUSIÓN" if preferred for state
        case Phase.Boiling: return "HIRVIENDO"; // Or "EBULLICIÓN"
        case Phase.Ionizing: return "IONIZANDO"; // Or "IONIZACIÓN"
        case Phase.Plasma: return "PLASMA";
        default:
            // This exhaustive check ensures that if a new member is added to the Phase enum
            // and not handled above, TypeScript will error here, prompting an update.
            const _exhaustiveCheck: never = phase;
            console.error(`Unhandled phase in getCapitalizedPhaseName: ${_exhaustiveCheck}`);
            return "FASE DESCONOCIDA";
    }
}


const SubstanceVisualizer: React.FC<SubstanceVisualizerProps> = ({ phase, fractions, substanceName }) => {
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const [particles, setParticles] = useState<{ id: number; x: string; y: string; size: string; duration: string; delay: string; color: string }[]>([]);

  useEffect(() => { 
    if (phase === Phase.Boiling) {
      const interval = setInterval(() => {
        setBubbles(prevBubbles => {
          const newBubble = {
            id: Date.now() + Math.random(),
            x: Math.random() * 80 + 10, 
            y: 90 + Math.random() * 10, 
            size: Math.random() * 8 + 4, 
          };
          return [...prevBubbles.filter(b => b.y > -10), newBubble].slice(-30);
        });
      }, 200);
      return () => clearInterval(interval);
    } else {
      setBubbles([]);
    }
  }, [phase]);

  useEffect(() => { 
    if (phase === Phase.Boiling) {
      const animationFrame = requestAnimationFrame(() => {
        setBubbles(prevBubbles =>
          prevBubbles.map(b => ({ ...b, y: b.y - (1 + Math.random() * 2) })).filter(b => b.y > -10)
        );
      });
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [bubbles, phase]);

  useEffect(() => { 
    if (phase === Phase.Gas || phase === Phase.Ionizing || phase === Phase.Plasma) {
      const generateParticles = (count: number, colorRange: string[]) => {
        return Array.from({ length: count }, (_, i) => ({
          id: Date.now() + Math.random() + i,
          x: `${Math.random() * 100}%`,
          y: `${Math.random() * 100}%`,
          size: `${Math.random() * (phase === Phase.Plasma ? 8 : 5) + 3}px`,
          duration: `${Math.random() * 3 + 2}s`,
          delay: `${Math.random() * 2}s`,
          color: colorRange[Math.floor(Math.random() * colorRange.length)],
        }));
      };

      if (phase === Phase.Gas) setParticles(generateParticles(20, ['rgba(200,200,200,0.2)', 'rgba(220,220,220,0.3)']));
      if (phase === Phase.Ionizing) setParticles(generateParticles(35, ['rgba(180,180,255,0.4)', 'rgba(220,200,255,0.5)', 'rgba(255,210,255,0.6)']));
      if (phase === Phase.Plasma) setParticles(generateParticles(50, ['rgba(255,100,255,0.7)', 'rgba(255,0,255,0.6)', 'rgba(200,0,200,0.5)', 'rgba(255,150,255,0.8)']));

    } else {
      setParticles([]);
    }
  }, [phase]);


  const iceHeight = `${fractions.solid * 100}%`;
  const waterHeight = `${fractions.liquid * 100}%`;
  // const gasContainerHeight = `${(fractions.gas + fractions.plasma) * 100}%`; 

  let visualContent;
  let baseSolidColor = 'bg-blue-300';
  let baseLiquidColor = 'bg-sky-500';
  let baseGasColor = 'bg-slate-500 opacity-30';
  
  if (substanceName === 'Etanol') {
    baseSolidColor = 'bg-purple-300'; baseLiquidColor = 'bg-indigo-500';
  } else if (substanceName === 'Oro') {
    baseSolidColor = 'bg-yellow-200'; baseLiquidColor = 'bg-yellow-400'; baseGasColor = 'bg-yellow-600 opacity-30';
  } else if (substanceName === 'Oxígeno') {
    baseSolidColor = 'bg-cyan-200'; baseLiquidColor = 'bg-teal-400';
  } else if (substanceName === 'Argón') { 
    baseSolidColor = 'bg-gray-300'; baseLiquidColor = 'bg-gray-400'; baseGasColor = 'bg-violet-500 opacity-20';
  }

  const capitalizedPhase = getCapitalizedPhaseName(phase);

  const particleDivs = (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full animate-drift-particle"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
  
  switch (phase) {
    case Phase.Solid:
      visualContent = (
        <div className={`w-full h-full ${baseSolidColor} rounded-b-md flex items-center justify-center relative`}>
          <div className={`absolute inset-0 bg-gradient-to-br from-${baseSolidColor.split('-')[1]}-200 to-${baseSolidColor.split('-')[1]}-400 opacity-70`}></div>
          <span className={`text-4xl font-bold text-${baseSolidColor.split('-')[1]}-700 opacity-80 z-10`}>{capitalizedPhase}</span>
        </div>
      );
      break;
    case Phase.Melting:
      visualContent = (
        <>
          {fractions.solid > 0 && (
            <div
              className={`w-full ${baseSolidColor} transition-all duration-500 ease-in-out flex items-end justify-center relative`}
              style={{ height: iceHeight }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-${baseSolidColor.split('-')[1]}-200 to-${baseSolidColor.split('-')[1]}-400 opacity-70`}></div>
              <span className={`text-2xl font-semibold text-${baseSolidColor.split('-')[1]}-700 opacity-60 p-2 z-10`}>{getCapitalizedPhaseName(Phase.Solid)}</span>
            </div>
          )}
          {fractions.liquid > 0 && (
            <div
              className={`w-full ${baseLiquidColor} transition-all duration-500 ease-in-out flex items-end justify-center`}
              style={{ height: waterHeight }}
            >
              <span className={`text-2xl font-semibold text-${baseLiquidColor.split('-')[1]}-100 opacity-80 p-2`}>{getCapitalizedPhaseName(Phase.Liquid)}</span>
            </div>
          )}
        </>
      );
      break;
    case Phase.Liquid:
      visualContent = (
        <div className={`w-full h-full ${baseLiquidColor} rounded-b-md flex items-center justify-center relative`}>
           <div className={`absolute inset-0 bg-gradient-to-br from-${baseLiquidColor.split('-')[1]}-400 to-${baseLiquidColor.split('-')[1]}-600 opacity-80`}></div>
           <span className={`text-4xl font-bold text-${baseLiquidColor.split('-')[1]}-100 opacity-90 z-10`}>{capitalizedPhase}</span>
        </div>
      );
      break;
    case Phase.Boiling:
      visualContent = (
        <>
          {fractions.liquid > 0 && (
            <div
              className={`w-full ${baseLiquidColor} transition-all duration-500 ease-in-out relative flex items-end justify-center`}
              style={{ height: `${fractions.liquid * 100}%` }} 
            >
               <span className={`text-2xl font-semibold text-${baseLiquidColor.split('-')[1]}-100 opacity-80 p-2`}>{getCapitalizedPhaseName(Phase.Liquid)}</span>
              <div className="absolute inset-0 overflow-hidden">
                {bubbles.map(bubble => (
                  <div
                    key={bubble.id}
                    className={`absolute ${baseLiquidColor.replace('500','200').replace('600','200')} rounded-full opacity-60`}
                    style={{
                      left: `${bubble.x}%`, bottom: `${100 - bubble.y}%`,
                      width: `${bubble.size}px`, height: `${bubble.size}px`,
                      transition: 'bottom 0.5s linear',
                    }}
                  />
                ))}
              </div>
            </div>
          )}
           {fractions.gas > 0 && ( 
             <div 
                className={`w-full ${baseGasColor} flex items-center justify-center relative`}
                style={{ height: `${fractions.gas * 100}%` }}
              >
                {particleDivs}
                <span className="text-xl font-semibold text-slate-100 z-10">{getCapitalizedPhaseName(Phase.Gas)}</span>
             </div>
           )}
        </>
      );
      break;
    case Phase.Gas:
      visualContent = (
        <div className={`w-full h-full ${baseGasColor} rounded-b-md flex items-center justify-center relative`}>
          <div className={`absolute inset-0 bg-gradient-to-br from-slate-400 to-slate-600 opacity-50`}></div>
          {particleDivs}
          <span className="text-4xl font-bold text-slate-100 opacity-90 z-10">{capitalizedPhase}</span>
        </div>
      );
      break;
    case Phase.Ionizing:
      visualContent = (
         <div className="w-full h-full bg-purple-900 rounded-b-md flex flex-col justify-end items-center relative overflow-hidden">
            {fractions.gas > 0 && (
                <div className={`w-full ${baseGasColor} flex items-center justify-center relative`} style={{ height: `${fractions.gas * 100}%` }}>
                    {particleDivs} 
                     <span className="text-xl font-semibold text-slate-100 z-10 opacity-50">{getCapitalizedPhaseName(Phase.Gas)}</span>
                </div>
            )}
            {fractions.plasma > 0 && (
                <div className="w-full bg-pink-500 opacity-50 flex items-center justify-center relative" style={{ height: `${fractions.plasma * 100}%` }}>
                    
                    <div className="absolute inset-0 overflow-hidden"> 
                        {particles.slice(0, particles.length / 2).map(p => ( 
                          <div key={`ion-${p.id}`} className="absolute rounded-full animate-drift-particle" style={{ left: p.x, top: p.y, width: `calc(${p.size} * 1.2)`, height: `calc(${p.size} * 1.2)`, background: 'rgba(255,255,255,0.3)', animationDuration: `calc(${p.duration} / 2)`, animationDelay: p.delay, filter: 'blur(1px)' }} />
                        ))}
                    </div>
                    <span className="text-2xl font-bold text-pink-100 z-10 animate-pulse">{capitalizedPhase}</span>
                </div>
            )}
        </div>
      );
      break;
    case Phase.Plasma:
        visualContent = (
            <div className="w-full h-full bg-purple-900 rounded-b-md flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial from-pink-500 via-purple-600 to-indigo-800 opacity-80 animate-pulse-bg"></div>
                {particleDivs} 
                <span className="text-5xl font-black text-white z-10" style={{ textShadow: '0 0 10px #fff, 0 0 20px #ff00ff, 0 0 30px #ff00ff' }}>{capitalizedPhase}</span>
            </div>
        );
        break;
    default:
      visualContent = <div className="text-slate-400">Estado Desconocido</div>;
  }

  return (
    <div className="w-4/5 max-w-xs h-64 border-4 border-slate-600 rounded-lg bg-slate-800 shadow-lg overflow-hidden flex flex-col justify-end relative">
      {visualContent}
      <div className="absolute top-2 left-2 bg-slate-900 bg-opacity-70 text-white text-xs px-2 py-1 rounded z-20">
        {phase} ({substanceName})
      </div>
      <style>{`
        @keyframes drift-particle {
            0% { transform: translate(0, 0) scale(0.8) rotate(0deg); opacity: 0.3; }
            50% { transform: translate(${Math.random()*20-10}px, ${Math.random()*20-10}px) scale(1.2) rotate(${Math.random()*90-45}deg); opacity: 0.7; }
            100% { transform: translate(${Math.random()*10-5}px, ${Math.random()*10-5}px) scale(0.8) rotate(0deg); opacity: 0.3; }
        }
        @keyframes pulse-bg {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 0.9; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default SubstanceVisualizer;
