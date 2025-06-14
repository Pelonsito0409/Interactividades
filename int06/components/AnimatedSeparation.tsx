import React from 'react';
import { SeparationMethod } from '../types';
import { FilterIcon, DecanterIcon, CentrifugeIcon, MagnetIcon, AlembicIcon, CrystalDishIcon } from '../constants';

interface AnimatedSeparationProps {
  method: SeparationMethod | null;
  status: 'idle' | 'processing' | 'completed';
  mixtureName?: string;
  mixtureImageUrl?: string;
  mixtureDescription?: string;
  feedbackMessage?: string;
  feedbackType?: 'correct' | 'incorrect' | 'info';
  isCorrectAttempt?: boolean;
}

const AnimatedSeparation: React.FC<AnimatedSeparationProps> = ({
  method,
  status,
  mixtureName,
  mixtureImageUrl,
  mixtureDescription,
  feedbackMessage,
  feedbackType,
  isCorrectAttempt,
}) => {
  // If method is null (e.g. initial state for a new mixture before any attempt),
  // this component might not be rendered by ChallengeOneScreen.
  // ChallengeOneScreen's logic will show MixtureDropZone instead.
  // This component is primarily for 'processing' or 'completed' states, or when loading an already 'completed' mixture.
  if (!method) {
    // This case should ideally not be hit if ChallengeOneScreen's logic is correct,
    // as it would render MixtureDropZone if method is null and status is 'idle'.
    // However, as a fallback for unexpected states:
    return <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 italic p-4">Esperando acción...</div>;
  }

  let animationSpecificContent: React.ReactNode;
  const iconBaseClasses = "w-24 h-24 mb-4";
  let iconColorClass = "text-sky-400"; // Default for processing

  if (status === 'completed') {
    iconColorClass = isCorrectAttempt ? "text-green-500" : "text-red-500";
  }

  switch (method) {
    case SeparationMethod.Filtracion:
      animationSpecificContent = (
        <div className="flex flex-col items-center">
          <FilterIcon className={`${iconBaseClasses} ${iconColorClass}`} />
          {status === 'processing' && <p className="animate-pulse">Filtrando...</p>}
          {status === 'processing' && <div className="w-2 h-8 bg-sky-500 animate-drip mt-2"></div>}
        </div>
      );
      break;
    case SeparationMethod.Decantacion:
      animationSpecificContent = (
        <div className="flex flex-col items-center">
          <DecanterIcon className={`${iconBaseClasses} ${iconColorClass}`} />
           {status === 'processing' && <p className="animate-pulse">Decantando...</p>}
           {status === 'processing' && (
            <div className="w-20 h-10 border-2 border-amber-500 rounded flex items-end mt-2">
              <div className="h-1/2 w-full bg-amber-700 opacity-50"></div>
              <div className="h-1/2 w-full bg-sky-700 opacity-50 absolute bottom-0 left-0"></div>
            </div>
           )}
        </div>
      );
      break;
    case SeparationMethod.SeparacionMagnetica:
      animationSpecificContent = (
        <div className="flex flex-col items-center">
          <MagnetIcon className={`${iconBaseClasses} ${iconColorClass}`} />
          {status === 'processing' && <p className="animate-pulse">Atrayendo limaduras...</p>}
          {status === 'processing' && (
            <div className="flex mt-2">
              <span className="text-xl animate-ping delay-100"> partículas </span>
              <span className="text-xl animate-ping delay-300"> metálicas </span>
              <span className="text-xl animate-ping delay-500"> atraídas </span>
            </div>
          )}
        </div>
      );
      break;
    case SeparationMethod.Destilacion:
      animationSpecificContent = (
        <div className="flex flex-col items-center">
          <AlembicIcon className={`${iconBaseClasses} ${iconColorClass}`} />
          {status === 'processing' && <p className="animate-pulse">Destilando...</p>}
          {status === 'processing' && (
            <>
              <div className="text-3xl mt-2">🔥</div>
              <div className="w-2 h-8 bg-slate-400 animate-steam opacity-50"></div>
              <div className="w-2 h-4 bg-sky-300 animate-drip delay-1000"></div>
            </>
          )}
        </div>
      );
      break;
    case SeparationMethod.Cristalizacion:
      animationSpecificContent = (
        <div className="flex flex-col items-center">
          <CrystalDishIcon className={`${iconBaseClasses} ${iconColorClass}`} />
          {status === 'processing' && <p className="animate-pulse">Cristalizando...</p>}
          {status === 'processing' && (
            <>
              <div className="text-3xl mt-2">🔥</div>
              <div className="w-2 h-8 bg-slate-400 animate-steam opacity-50"></div>
            </>
          )}
          {status === 'completed' && isCorrectAttempt && (
            <div className="mt-2 flex space-x-1">
              <div className="w-3 h-3 bg-white" style={{transform: 'scale(1)', opacity: '1'}}></div>
              <div className="w-2 h-2 bg-white" style={{transform: 'scale(1)', opacity: '1'}}></div>
              <div className="w-4 h-4 bg-white" style={{transform: 'scale(1)', opacity: '1'}}></div>
            </div>
          )}
        </div>
      );
      break;
    case SeparationMethod.Centrifugacion:
        animationSpecificContent = (
            <div className="flex flex-col items-center">
                <CentrifugeIcon className={`${iconBaseClasses} ${iconColorClass} ${status === 'processing' ? 'animate-spin' : (status === 'completed' && isCorrectAttempt ? '' : 'animate-spin-slow') }`} />
                {status === 'processing' && <p className="animate-pulse">Centrifugando...</p>}
            </div>
        );
        break;
    default:
      animationSpecificContent = <p>Animación no disponible para este método.</p>;
  }

  return (
    <div className="h-auto min-h-[16rem] bg-slate-800 border border-slate-700 rounded-lg flex flex-col items-center justify-start p-4 text-center transition-all duration-500">
      {mixtureName && <h3 className="text-xl font-semibold mb-1 text-amber-300">{mixtureName}</h3>}
      {mixtureImageUrl && <img src={mixtureImageUrl} alt={mixtureName || 'Mezcla'} className="w-32 h-20 object-cover rounded-md mx-auto mb-2 opacity-90" />}
      {mixtureDescription && <p className="text-xs text-slate-400 mb-3 max-w-xs mx-auto">{mixtureDescription}</p>}
      
      <div className="flex-grow flex flex-col items-center justify-center">
        {animationSpecificContent}
      </div>

      {status === 'completed' && feedbackMessage && (
        <p className={`mt-3 text-sm font-semibold p-2 rounded-md w-full max-w-md ${feedbackType === 'correct' ? 'text-green-300 bg-green-700 bg-opacity-30' : 'text-red-300 bg-red-700 bg-opacity-30'}`}>
          {feedbackMessage}
        </p>
      )}
    </div>
  );
};

export default AnimatedSeparation;
