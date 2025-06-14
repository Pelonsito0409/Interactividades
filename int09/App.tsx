
import React, { useState, useEffect, useCallback } from 'react';
import { CompoundNomenclature, CompoundProperty, QuizEntry, QuizState, FeedbackItem } from './types';
import { compoundsData } from './data/compounds';
import { ORDERED_COLUMN_KEYS, QUIZ_SIZE, OPTIONS_PER_QUESTION, NOT_APPLICABLE_TEXT } from './constants';
import NomenclatureTable from './components/NomenclatureTable';
import CheckIcon from './components/icons/CheckIcon';
import RefreshIcon from './components/icons/RefreshIcon';
import PlayIcon from './components/icons/PlayIcon';
import FlagIcon from './components/icons/FlagIcon';

// Helper to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const App: React.FC = () => {
  const [quizEntries, setQuizEntries] = useState<QuizEntry[]>([]);
  const [quizState, setQuizState] = useState<QuizState>(QuizState.NOT_STARTED);
  const [score, setScore] = useState<number>(0); // Score for the current exercise
  const [totalQuizzableCells, setTotalQuizzableCells] = useState<number>(0); // Quizzable cells for current exercise
  const [feedback, setFeedback] = useState<Record<string, Record<string, FeedbackItem>>>({});

  // State for overall attempt statistics
  const [overallCorrectAnswers, setOverallCorrectAnswers] = useState<number>(0);
  const [overallAttemptedQuestions, setOverallAttemptedQuestions] = useState<number>(0);

  const generateQuizInternal = useCallback(() => {
    const shuffledCompounds = shuffleArray(compoundsData);
    const selectedCompounds = shuffledCompounds.slice(0, QUIZ_SIZE);
    let currentExerciseQuizzableCells = 0;

    const newQuizEntries = selectedCompounds.map((compound): QuizEntry => {
      const validPropertyKeys = ORDERED_COLUMN_KEYS.filter(key => compound[key] !== null);
      if (validPropertyKeys.length === 0) {
        validPropertyKeys.push(CompoundProperty.FORMULA);
      }
      const revealedPropertyKey = shuffleArray(validPropertyKeys)[0];
      
      const userAnswers: Record<string, string> = {};
      const options: Record<string, string[]> = {};

      ORDERED_COLUMN_KEYS.forEach(key => {
        userAnswers[key] = "";
        if (key !== revealedPropertyKey && compound[key] !== null) {
          currentExerciseQuizzableCells++;
          const correctAnswer = compound[key] as string;
          let distractors = compoundsData
            .map(c => c[key])
            .filter(name => name !== null && name !== correctAnswer && name !== NOT_APPLICABLE_TEXT) as string[];
          
          distractors = shuffleArray(Array.from(new Set(distractors)));
          
          const finalOptions = shuffleArray([
            correctAnswer,
            ...distractors.slice(0, OPTIONS_PER_QUESTION - 1)
          ]);
          
          while(finalOptions.length < OPTIONS_PER_QUESTION && finalOptions.length > 0) {
            const moreDistractors = compoundsData
              .map(c => c[key])
              .filter(name => name !== null && !finalOptions.includes(name as string) && name !== NOT_APPLICABLE_TEXT) as string[];
            if(moreDistractors.length > 0) {
                finalOptions.push(shuffleArray(moreDistractors)[0]);
            } else {
                 finalOptions.push(`Opción Genérica ${finalOptions.length + 1}`);
            }
          }
          if (!finalOptions.includes(correctAnswer) && correctAnswer) {
            if (finalOptions.length >= OPTIONS_PER_QUESTION) finalOptions[0] = correctAnswer;
            else finalOptions.push(correctAnswer);
            shuffleArray(finalOptions);
          }
          options[key] = finalOptions.slice(0, OPTIONS_PER_QUESTION);
        }
      });
      return { compound, revealedPropertyKey, userAnswers, options };
    });
    
    setQuizEntries(newQuizEntries);
    setScore(0); // Reset score for the new exercise
    setTotalQuizzableCells(currentExerciseQuizzableCells); // Set for current exercise
    setFeedback({});
    setQuizState(QuizState.IN_PROGRESS);
  }, []);

  const handleStartNewAttempt = useCallback(() => {
    setOverallCorrectAnswers(0);
    setOverallAttemptedQuestions(0);
    generateQuizInternal();
  }, [generateQuizInternal]);
  
  // Effect to start the first quiz when component mounts if desired, or wait for "Comenzar"
  // For this requirement, we wait for "Comenzar", so no useEffect for initial generation.

  const handleAnswerChange = (rowIndex: number, propertyKey: CompoundProperty, value: string) => {
    setQuizEntries(prevEntries =>
      prevEntries.map((entry, index) =>
        index === rowIndex
          ? { ...entry, userAnswers: { ...entry.userAnswers, [propertyKey]: value } }
          : entry
      )
    );
  };

  const handleSubmitExercise = () => {
    let correctAnswersInExercise = 0;
    const newFeedback: Record<string, Record<string, FeedbackItem>> = {};

    quizEntries.forEach(entry => {
      newFeedback[entry.compound.id] = {};
      ORDERED_COLUMN_KEYS.forEach(key => {
        if (key !== entry.revealedPropertyKey && entry.compound[key] !== null) {
          const correctAnswer = entry.compound[key] as string;
          const userAnswer = entry.userAnswers[key] || "";
          const isCorrect = userAnswer === correctAnswer;
          if (isCorrect) {
            correctAnswersInExercise++;
          }
          newFeedback[entry.compound.id][key] = { isCorrect, correctAnswer };
        }
      });
    });

    setFeedback(newFeedback);
    const calculatedScore = totalQuizzableCells > 0 ? (correctAnswersInExercise / totalQuizzableCells) * 10 : 0;
    setScore(parseFloat(calculatedScore.toFixed(2)));
    
    // Update overall scores
    setOverallCorrectAnswers(prev => prev + correctAnswersInExercise);
    setOverallAttemptedQuestions(prev => prev + totalQuizzableCells);
    
    setQuizState(QuizState.SUBMITTED);
  };

  const handleNextExercise = () => {
    generateQuizInternal(); // This already resets exercise-specific score/feedback and sets state to IN_PROGRESS
  };

  const handleFinishAttempt = () => {
    // If current exercise is IN_PROGRESS and not yet submitted, we could optionally submit it first.
    // For now, just transitions to finished state. User might lose current progress if not submitted.
    // Or, we can simply use the current overall scores.
    if (quizState === QuizState.IN_PROGRESS && quizEntries.length > 0) {
        // Optionally, auto-submit or warn user.
        // For simplicity, we assume if they click "Terminar Intento", they are done with the current non-submitted exercise too.
        // We need to add the current totalQuizzableCells to overallAttemptedQuestions if it wasn't submitted.
        // However, overallCorrectAnswers would not be updated for this unsubmitted exercise.
        // A fairer approach: if IN_PROGRESS, sum up its totalQuizzableCells to overallAttemptedQuestions
        // This implies they "attempted" them but got 0 for them if not submitted.
        setOverallAttemptedQuestions(prev => prev + totalQuizzableCells - quizEntries.reduce((acc, entry) => {
             return acc + ORDERED_COLUMN_KEYS.filter(key => key !== entry.revealedPropertyKey && entry.compound[key] !== null && feedback[entry.compound.id]?.[key] !== undefined).length;
        },0));
    }
    setQuizState(QuizState.FINISHED_ATTEMPT);
  };
  

  const renderContent = () => {
    switch (quizState) {
      case QuizState.NOT_STARTED:
        return (
          <div className="text-center flex flex-col items-center justify-center h-[calc(100vh-250px)]"> {/* Adjust height as needed */}
            <h1 className="text-5xl md:text-6xl font-bold text-sky-400 mb-6">Bienvenido a la Simulación de Formulación Química</h1>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl">
              Prepárate para poner a prueba tus conocimientos sobre nomenclatura y formulación química.
              Haz clic en "Comenzar" para iniciar un nuevo intento.
            </p>
            <button
              onClick={handleStartNewAttempt}
              className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-10 rounded-lg shadow-xl transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75 text-xl"
            >
              <PlayIcon className="w-6 h-6" />
              Comenzar
            </button>
          </div>
        );
      case QuizState.IN_PROGRESS:
      case QuizState.SUBMITTED:
        return (
          <>
            {quizEntries.length > 0 ? (
              <NomenclatureTable
                quizEntries={quizEntries}
                quizState={quizState}
                onAnswerChange={handleAnswerChange}
                feedback={feedback}
              />
            ) : (
              <p className="text-center text-slate-400 py-10">Cargando compuestos...</p>
            )}

            {quizState === QuizState.SUBMITTED && (
              <div className="mt-8 p-6 bg-slate-900/70 rounded-lg text-center shadow-md backdrop-blur-sm">
                <h2 className="text-2xl font-semibold text-sky-400 mb-2">Resultados del Ejercicio Actual</h2>
                <p className="text-3xl font-bold text-emerald-400 mb-4">Puntuación: {score} / 10</p>
                <p className="text-slate-300">Has acertado {Math.round((score/10) * totalQuizzableCells)} de {totalQuizzableCells} en este ejercicio.</p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {quizState === QuizState.IN_PROGRESS && (
                <button
                  onClick={handleSubmitExercise}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75"
                >
                  <CheckIcon />
                  Comprobar Respuestas
                </button>
              )}
              {quizState === QuizState.SUBMITTED && (
                <button
                  onClick={handleNextExercise}
                  className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
                >
                  <RefreshIcon />
                  Siguiente Ejercicio
                </button>
              )}
              <button
                onClick={handleFinishAttempt}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
              >
                <FlagIcon className="w-5 h-5" />
                Terminar Intento
              </button>
            </div>
          </>
        );
      case QuizState.FINISHED_ATTEMPT:
        return (
          <div className="text-center flex flex-col items-center justify-center h-[calc(100vh-250px)]">
            <h2 className="text-4xl font-bold text-sky-400 mb-4">Intento Finalizado</h2>
            <div className="p-8 bg-slate-900/70 rounded-lg shadow-xl backdrop-blur-sm">
                <p className="text-2xl text-slate-200 mb-2">Resultados Globales:</p>
                <p className="text-5xl font-extrabold text-emerald-400 mb-1">
                    {overallCorrectAnswers} <span className="text-3xl text-emerald-300">aciertos</span>
                </p>
                <p className="text-xl text-slate-400 mb-6">
                    de {overallAttemptedQuestions} preguntas totales.
                </p>
                {overallAttemptedQuestions > 0 && (
                     <p className="text-2xl text-slate-200 mb-8">
                        Porcentaje de acierto: {((overallCorrectAnswers / overallAttemptedQuestions) * 100).toFixed(1)}%
                     </p>
                )}
                 <button
                    onClick={handleStartNewAttempt}
                    className="flex items-center gap-3 mx-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-10 rounded-lg shadow-xl transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75 text-xl"
                    >
                    <PlayIcon className="w-6 h-6" />
                    Nuevo Intento
                </button>
            </div>
          </div>
        );
      default:
        return <p>Estado desconocido.</p>;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col items-center antialiased">
      <header className={`w-full max-w-7xl mb-8 text-center ${quizState === QuizState.NOT_STARTED || quizState === QuizState.FINISHED_ATTEMPT ? 'hidden' : ''}`}>
        <h1 className="text-4xl md:text-5xl font-bold text-sky-400 mb-2">Simulación de Formulación Química</h1>
        <p className="text-lg text-slate-300">Pon a prueba tus conocimientos de nomenclatura química.</p>
      </header>

      {/* This new 'enmarcado' div will have the animated border styles applied to it via CSS */}
      <div className="enmarcado w-full max-w-7xl">
        {/* This inner div is the main content block, with its own background and rounded corners */}
        <div className="bg-slate-800/80 shadow-xl rounded-xl">
          <main className="p-6 md:p-8 bg-slate-800">
            {renderContent()}
          </main>
        </div>
      </div>
      
      {/* Footer removed */}
    </div>
  );
};

export default App;
