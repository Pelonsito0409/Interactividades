
import React from 'react';

interface ParticleAnimationProps {
  status: 'dissolving' | 'dissolved' | 'undissolved';
  soluteName?: string;
  solventName?: string;
}

const ParticleAnimation: React.FC<ParticleAnimationProps> = ({ status, soluteName = "soluto", solventName = "disolvente" }) => {
  return (
    <div className="my-4 p-4 border border-teal-500 rounded-lg bg-slate-700 min-h-[150px]">
      <p className="text-center text-teal-300 mb-2">Interacción de Partículas:</p>
      <div className="relative w-full h-24 mx-auto overflow-hidden">
        {/* Solvent particles (e.g., water) */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`solvent-${i}`}
            className="absolute w-3 h-3 bg-sky-400 rounded-full opacity-70 animate-pulse"
            style={{
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 90}%`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          ></div>
        ))}

        {/* Solute particles */}
        {status === 'undissolved' && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 bg-amber-500 rounded-md p-1 flex flex-wrap justify-around items-center">
            {[...Array(4)].map((_, i) => (
              <div key={`undissolved-solute-${i}`} className="w-2 h-2 bg-amber-200 rounded-sm"></div>
            ))}
          </div>
        )}

        {(status === 'dissolving' || status === 'dissolved') &&
          [...Array(5)].map((_, i) => (
            <div
              key={`solute-${i}`}
              className={`absolute w-2 h-2 bg-amber-300 rounded-full ${status === 'dissolving' ? 'animate-bounce' : 'animate-pulse'}`}
              style={{
                top: `${status === 'dissolved' ? Math.random() * 80 : 60 + Math.random() * 20}%`,
                left: `${status === 'dissolved' ? Math.random() * 90 : 40 + Math.random() * 20}%`,
                animationDuration: `${1.5 + Math.random()}s`,
                transition: 'all 1s ease-in-out',
                transform: status === 'dissolved' ? 'scale(1.2)' : 'scale(1)',
              }}
            ></div>
          ))}
      </div>
      {status === 'dissolving' && <p className="text-xs text-center mt-2 text-slate-400">Las partículas de {solventName} rodean e interactúan con las partículas de {soluteName}, separándolas.</p>}
      {status === 'dissolved' && <p className="text-xs text-center mt-2 text-green-400">¡El {soluteName} está disuelto! Las partículas están distribuidas uniformemente en el {solventName}.</p>}
      {status === 'undissolved' && <p className="text-xs text-center mt-2 text-slate-400">El {soluteName} aún no se ha disuelto en el {solventName}.</p>}
    </div>
  );
};

export default ParticleAnimation;
