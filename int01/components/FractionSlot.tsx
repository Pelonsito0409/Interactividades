
import React from 'react';

interface FractionSlotProps {
  slotId: string;
  valueText: string;
  correctAnswerText?: string;
  onClick: () => void;
  isSubmitted: boolean;
  isCorrect: boolean;
  disabled: boolean;
}

const FractionSlot: React.FC<FractionSlotProps> = ({
  valueText,
  correctAnswerText,
  onClick,
  isSubmitted,
  isCorrect,
  disabled,
}) => {
  let borderColor = 'border-sky-300 hover:border-yellow-400';
  let bgColor = 'bg-white/10 hover:bg-sky-500/30';
  let textColor = 'text-white';
  let title = valueText === '[ ]' ? 'Haz clic para seleccionar un valor' : valueText;

  if (isSubmitted) {
    if (isCorrect) {
      borderColor = 'border-green-500';
      bgColor = 'bg-green-500/30';
      textColor = 'text-green-200';
      title = valueText; // User's answer is correct
    } else { // Incorrect or unanswered
      borderColor = 'border-red-500';
      bgColor = 'bg-red-500/30';
      textColor = 'text-red-200';
      if (correctAnswerText) {
        title = `Tu respuesta: ${valueText}. Correcto: ${correctAnswerText}`;
      } else {
        title = `Tu respuesta: ${valueText}. (Respuesta no disponible)`;
      }
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        border-2 rounded-md 
        p-2 md:p-3 min-w-[90px] md:min-w-[130px] max-w-[150px] md:max-w-[180px]
        text-center transition-all duration-150 ease-in-out
        text-sm md:text-lg
        ${borderColor} ${bgColor} ${textColor}
        ${!disabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}
      `}
      title={title}
      aria-label={title}
    >
      {isSubmitted && !isCorrect && correctAnswerText ? (
        <div className="flex flex-col items-center justify-center">
          <span className={`line-through opacity-70 ${valueText === '[ ]' ? 'italic' : ''}`}>
            {valueText === '[ ]' ? 'No contestado' : valueText}
          </span>
          <span className="block text-xs md:text-sm mt-1 text-green-300">
            Correcto: {correctAnswerText}
          </span>
        </div>
      ) : (
        <span className="truncate block">{valueText}</span>
      )}
    </button>
  );
};

export default FractionSlot;
