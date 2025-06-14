
import React, { useState, useEffect, useCallback } from 'react';
import { EXERCISES, shuffleArray } from './constants';
import { ExerciseData, UserAnswers, Option, SlotSolution } from './types';
import ExerciseDisplay from './components/ExerciseDisplay';
import ResultsDisplay from './components/ResultsDisplay';
import OptionSelectorPanel from './components/OptionSelectorPanel';

const App: React.FC = () => {
  const [exerciseList, setExerciseList] = useState<ExerciseData[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);

  useEffect(() => {
    setExerciseList(shuffleArray(EXERCISES));
  }, []);

  const currentExercise = exerciseList[currentExerciseIndex];

  const resetExerciseState = useCallback(() => {
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
    setActiveSlotId(null);
  }, []);

  const loadNextExercise = useCallback(() => {
    setCurrentExerciseIndex((prevIndex) => (prevIndex + 1) % exerciseList.length);
    resetExerciseState();
  }, [exerciseList.length, resetExerciseState]);

  useEffect(() => {
    if (currentExercise) {
        resetExerciseState();
    }
  }, [currentExercise, resetExerciseState]);


  const handleSlotClick = (slotId: string) => {
    if (isSubmitted) return;
    setActiveSlotId(slotId);
  };

  const handleSelectOption = (optionId: string) => {
    if (!activeSlotId) return;
    setUserAnswers(prev => ({ ...prev, [activeSlotId]: optionId }));
    setActiveSlotId(null); 
  };

  const handleSubmit = () => {
    if (!currentExercise) return;
    let correctAnswers = 0;
    currentExercise.steps.forEach(step => {
      if (userAnswers[step.numerator.id] === step.numerator.correctOptionId) {
        correctAnswers++;
      }
      if (userAnswers[step.denominator.id] === step.denominator.correctOptionId) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setIsSubmitted(true);
  };

  const getOptionTextById = (optionId: string | null, slotId: string): string => {
    if (!optionId || !currentExercise) return '[ ]';
    for (const step of currentExercise.steps) {
      const slot = step.numerator.id === slotId ? step.numerator : (step.denominator.id === slotId ? step.denominator : null);
      if (slot) {
        return slot.options.find(opt => opt.id === optionId)?.text || '[ ]';
      }
    }
    return '[ ]';
  };

  const getCorrectOptionTextForSlot = (slotId: string): string | undefined => {
    if (!currentExercise) return undefined;
    for (const step of currentExercise.steps) {
      let slotSolution: SlotSolution | undefined = undefined;
      if (step.numerator.id === slotId) {
        slotSolution = step.numerator;
      } else if (step.denominator.id === slotId) {
        slotSolution = step.denominator;
      }

      if (slotSolution) {
        return slotSolution.options.find(opt => opt.id === slotSolution!.correctOptionId)?.text;
      }
    }
    return undefined;
  };

  const isSlotCorrect = (slotId: string): boolean => {
    if (!isSubmitted || !currentExercise) return false; 
    const userAnswer = userAnswers[slotId];
    if (!userAnswer) return false; // If no answer, it's incorrect

    for (const step of currentExercise.steps) {
      if (step.numerator.id === slotId) {
        return userAnswer === step.numerator.correctOptionId;
      }
      if (step.denominator.id === slotId) {
        return userAnswer === step.denominator.correctOptionId;
      }
    }
    return false; 
  };
  
  const getActiveSlotOptions = (): Option[] => {
    if (!activeSlotId || !currentExercise) return [];
    for (const step of currentExercise.steps) {
        if (step.numerator.id === activeSlotId) return step.numerator.options;
        if (step.denominator.id === activeSlotId) return step.denominator.options;
    }
    return [];
  };

  if (exerciseList.length === 0 || !currentExercise) {
    return <div className="flex items-center justify-center min-h-screen text-2xl text-white">Cargando ejercicios...</div>;
  }

  const totalSlots = currentExercise.steps.length * 2;

  //<!-- <div className="bg-white/25 backdrop-blur-lg shadow-2xl rounded-xl p-6 md:p-10 w-full max-w-4xl"> -->

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 p-4 text-white select-none">
      
      <div className="enmarcado text-white rounded-xl p-8 w-full max-w-4xl rounded-[10px] ">
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 rounded-xl rounded-[10px]">

          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-yellow-300">
            Práctica de Factores de Conversión
            </h1>
          <p className="text-center text-sky-100 mb-6 md:mb-8 text-sm md:text-base">
            El objetivo de esta práctica es ayudarte a dominar la conversión de unidades de velocidad (m/s a km/h y viceversa) utilizando factores de conversión. Completa los espacios en blanco para construir la cadena de conversión correcta.
          </p>
          
          <ExerciseDisplay
            exercise={currentExercise}
            userAnswers={userAnswers}
            onSlotClick={handleSlotClick}
            getOptionText={getOptionTextById}
            getCorrectOptionTextForSlot={getCorrectOptionTextForSlot}
            isSubmitted={isSubmitted}
            isCorrect={isSlotCorrect}
          />

          {activeSlotId && !isSubmitted && (
            <OptionSelectorPanel
              options={getActiveSlotOptions()}
              onSelectOption={handleSelectOption}
              onClose={() => setActiveSlotId(null)}
            />
          )}

          {isSubmitted && (
            <ResultsDisplay score={score} totalQuestions={totalSlots} />
          )}

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out transform hover:scale-105 w-full sm:w-auto text-lg"
                disabled={Object.values(userAnswers).filter(Boolean).length < totalSlots}
                aria-label="Comprobar respuestas del ejercicio actual"
              >
                Comprobar Respuestas
              </button>
            ) : (
              <button
                onClick={loadNextExercise}
                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out transform hover:scale-105 w-full sm:w-auto text-lg"
                aria-label="Cargar siguiente ejercicio"
              >
                Siguiente Ejercicio
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
