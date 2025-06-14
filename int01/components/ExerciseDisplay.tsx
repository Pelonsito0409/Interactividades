import React from 'react';
import { ExerciseData, UserAnswers, UnitSymbol } from '../types';
import FractionSlot from './FractionSlot';

interface ExerciseDisplayProps {
  exercise: ExerciseData;
  userAnswers: UserAnswers;
  onSlotClick: (slotId: string) => void;
  getOptionText: (optionId: string | null, slotId: string) => string;
  getCorrectOptionTextForSlot: (slotId: string) => string | undefined;
  isSubmitted: boolean;
  isCorrect: (slotId: string) => boolean;
}

const TimesIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-sky-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const EqualsIcon: React.FC = () => (
 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-sky-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
</svg>
);

// Spacer height calculation:
// Label: h-8 (2rem) + mb-1 (0.25rem) = 2.25rem (Tailwind h-9)
// MD Label: md:h-10 (2.5rem) + md:mb-2 (0.5rem) = 3rem (Tailwind md:h-12)
const labelSpacerClass = "h-9 md:h-12";

const ExerciseDisplay: React.FC<ExerciseDisplayProps> = ({
  exercise,
  userAnswers,
  onSlotClick,
  getOptionText,
  getCorrectOptionTextForSlot,
  isSubmitted,
  isCorrect,
}) => {
  const getStepLabel = (stepIndex: number): string => {
    if (exercise.initialUnit === UnitSymbol.MetersPerSecond) { // m/s to km/h
      return stepIndex === 0 ? "Convertir metros a kilómetros" : "Convertir segundos a horas";
    } else { // km/h to m/s
      return stepIndex === 0 ? "Convertir kilómetros a metros" : "Convertir horas a segundos";
    }
  };

  // Width calculation for the container of (label parts) or (icon + fraction parts).
  // This width ensures the label container and the icon+fraction container align correctly
  // when centered by their parent flex-col items-center.
  // Small: Icon w-6 (24px) + margin ml-1 (4px for fraction block) + FractionSlot min-w-[90px] (90px) = 118px.
  // MD: Icon md:w-8 (32px) + margin md:ml-2 (8px for fraction block) + FractionSlot md:min-w-[130px] (130px) = 170px.
  const stepContentSharedWidthClass = "w-[118px] md:w-[170px]";

  return (
    <div className="my-6 md:my-8">
      <div className="flex flex-wrap items-center justify-center text-xl sm:text-2xl md:text-3xl font-medium">
        
        {/* Initial Value - Wrapped to include spacer for alignment */}
        <div className="flex flex-col items-center mx-1 md:mx-2">
          <div className={labelSpacerClass} aria-hidden="true"></div> {/* Spacer */}
          <div className="p-2 md:p-3 bg-white/20 rounded-lg shadow">
            {exercise.initialValue} {exercise.initialUnit}
          </div>
        </div>

        {/* Steps (Factors of Conversion) */}
        {exercise.steps.map((step, stepIndex) => (
          <div key={step.id} className="flex flex-col items-center mx-1 md:mx-2"> {/* Container for label + (operator + fracción) */}
            {/* New Label Structure */}
            <div className={`flex items-center mb-1 md:mb-2 h-8 md:h-10 ${stepContentSharedWidthClass}`}>
              <span className="w-6 md:w-8 flex-shrink-0" aria-hidden="true"></span> {/* Icon width spacer */}
              <span className="w-1 md:w-2 flex-shrink-0" aria-hidden="true"></span> {/* Margin spacer (ml-1 is w-1, ml-2 is w-2) */}
              <span className="flex-grow text-center text-xs md:text-sm text-sky-200"> {/* Label text */}
                {getStepLabel(stepIndex)}
              </span>
            </div>
            
            <div className="flex items-center"> {/* Alinea Operador (TimesIcon) con Fracción (Num/Línea/Den) */}
              <TimesIcon />
              <div className="flex flex-col items-center ml-1 md:ml-2"> {/* Fracción Actual (Num/Línea/Den) */}
                <FractionSlot
                  slotId={step.numerator.id}
                  valueText={getOptionText(userAnswers[step.numerator.id] || null, step.numerator.id)}
                  correctAnswerText={isSubmitted && !isCorrect(step.numerator.id) ? getCorrectOptionTextForSlot(step.numerator.id) : undefined}
                  onClick={() => onSlotClick(step.numerator.id)}
                  isSubmitted={isSubmitted}
                  isCorrect={isCorrect(step.numerator.id)}
                  disabled={isSubmitted}
                />
                <div className="h-1 w-20 md:w-28 bg-sky-200 my-1 md:my-2"></div> {/* Fraction line */}
                <FractionSlot
                  slotId={step.denominator.id}
                  valueText={getOptionText(userAnswers[step.denominator.id] || null, step.denominator.id)}
                  correctAnswerText={isSubmitted && !isCorrect(step.denominator.id) ? getCorrectOptionTextForSlot(step.denominator.id) : undefined}
                  onClick={() => onSlotClick(step.denominator.id)}
                  isSubmitted={isSubmitted}
                  isCorrect={isCorrect(step.denominator.id)}
                  disabled={isSubmitted}
                />
              </div>
            </div>
          </div>
        ))}
        
        {/* Equals Icon and Result - Wrapped to include spacer for alignment */}
         <div className="flex flex-col items-center mx-1 md:mx-2">
          <div className={labelSpacerClass} aria-hidden="true"></div> {/* Spacer */}
          <div className="flex items-center">
            <EqualsIcon />
            <div className="p-2 md:p-3 text-yellow-300 font-bold ml-1 md:ml-2">
              {isSubmitted ? `${exercise.correctResultValue} ${exercise.targetUnit}` : `? ${exercise.targetUnit}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDisplay;