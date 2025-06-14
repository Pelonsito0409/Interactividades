
import React, { useState, useCallback, useEffect } from 'react';
import { GameStage, AppResults, MixtureChallengeItem, SeparationMethod, ChallengeResult } from './types';
import { MIXTURES_DATA, TOOLS_DATA, INITIAL_MIXTURES_DISPLAY, CONTROL_SUBSTANCES } from './constants';
import ChallengeOneScreen from './components/ChallengeOneScreen';
// ChallengeTwoScreen and ChallengeThreeScreen imports removed
import SummaryScreen from './components/SummaryScreen';
// Modal import removed as it's no longer used for challenge feedback
import FullscreenButton from './components/FullscreenButton'; // Added import

// Helper to initialize results
const getInitialResults = (): AppResults => {
    const challenge1Results: AppResults['challenge1'] = {};
    MIXTURES_DATA.forEach(m => {
        challenge1Results[m.id] = { attempted: false, correct: false, hadPriorFailure: false };
    });

    return {
        challenge1: challenge1Results,
    };
};


const App: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<GameStage>(GameStage.Intro);
  const [results, setResults] = useState<AppResults>(() => {
    const savedProgress = localStorage.getItem('chemLabProgress');
    try {
        if (savedProgress) {
            const parsed = JSON.parse(savedProgress);
            if (parsed && parsed.challenge1) {
                const newResultsState: AppResults = { challenge1: {} };
                let allItemsPresent = true;
                MIXTURES_DATA.forEach(m => {
                    const savedItemResult = parsed.challenge1[m.id];
                    if (savedItemResult) {
                        newResultsState.challenge1[m.id] = {
                            attempted: savedItemResult.attempted || false,
                            correct: savedItemResult.correct || false,
                            methodUsed: savedItemResult.methodUsed,
                            hadPriorFailure: savedItemResult.hadPriorFailure || false, // Initialize if missing
                        };
                    } else {
                        newResultsState.challenge1[m.id] = { attempted: false, correct: false, hadPriorFailure: false };
                        allItemsPresent = false; 
                    }
                });
                
                if (!allItemsPresent || Object.keys(newResultsState.challenge1).length !== MIXTURES_DATA.length) {
                    console.warn("Saved progress was incomplete or malformed for Challenge 1, re-initializing Challenge 1 results.");
                    const initialChallenge1Results = getInitialResults().challenge1;
                    MIXTURES_DATA.forEach(m => { // Ensure all mixtures are present, merging valid with initial if malformed
                        newResultsState.challenge1[m.id] = newResultsState.challenge1[m.id] || initialChallenge1Results[m.id];
                    });
                }
                return newResultsState;
            }
        }
    } catch (e) {
        console.error("Failed to parse saved progress, re-initializing.", e);
    }
    return getInitialResults();
  });
  
  useEffect(() => {
    localStorage.setItem('chemLabProgress', JSON.stringify(results));
  }, [results]);

  const startNewSimulationSession = () => {
    localStorage.removeItem('chemLabProgress');
    setResults(getInitialResults());
  };

  const handleStartChallenge = (challenge: GameStage) => {
    if (currentStage === GameStage.Intro) {
      startNewSimulationSession(); // Reset progress if starting from Intro
    }
    setCurrentStage(challenge);
  };

  const completeChallenge1Item = useCallback((mixtureId: string, methodUsed: SeparationMethod, isCorrect: boolean) => {
    setResults(prev => {
      const prevItemResult = prev.challenge1[mixtureId] || { attempted: false, correct: false, hadPriorFailure: false };
      return {
        ...prev,
        challenge1: {
          ...prev.challenge1,
          [mixtureId]: {
            attempted: true,
            correct: isCorrect,
            methodUsed,
            hadPriorFailure: prevItemResult.hadPriorFailure || !isCorrect,
          }
        }
      };
    });
  }, []);


  const advanceStage = () => {
    if (currentStage === GameStage.Intro) setCurrentStage(GameStage.Challenge1);
    else if (currentStage === GameStage.Challenge1) setCurrentStage(GameStage.Summary);
  };
  
  const resetProgressAndGoToIntro = () => {
    startNewSimulationSession();
    setCurrentStage(GameStage.Intro);
  }

  const renderCurrentStage = () => {
    switch (currentStage) {
      case GameStage.Intro:
        return (
          <div className="text-center p-8 animate-fadeIn">
            <h1 className="text-5xl font-bold text-sky-400 mb-6">🔬 Estación de Análisis de Sustancias 🔬</h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              ¡Bienvenido/a joven científico/a! En este laboratorio virtual, explorarás el fascinante mundo de las mezclas. Aprenderás a identificar y aplicar métodos físicos de separación.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
                {INITIAL_MIXTURES_DISPLAY.map(item => (
                    <div key={item.name} className="bg-slate-700 p-4 rounded-lg shadow-md text-center">
                        <span className="text-4xl" role="img" aria-label={item.name}>{item.representation}</span>
                        <p className="mt-2 text-sm text-slate-300">{item.name}</p>
                    </div>
                ))}
                 {CONTROL_SUBSTANCES.map(item => ( 
                    <div key={item.name} className="bg-slate-600 p-4 rounded-lg shadow-md text-center">
                        <span className="text-4xl" role="img" aria-label={item.name}>{item.representation}</span>
                        <p className="mt-2 text-sm text-slate-400">{item.name}</p>
                    </div>
                ))}
            </div>
            <button
              onClick={() => handleStartChallenge(GameStage.Challenge1)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-xl shadow-lg transition duration-150 ease-in-out transform hover:scale-105"
            >
              Comenzar Reto
            </button>
          </div>
        );
      case GameStage.Challenge1:
        return <ChallengeOneScreen mixtures={MIXTURES_DATA} tools={TOOLS_DATA} onCompleteItem={completeChallenge1Item} onAdvance={advanceStage} results={results.challenge1} onRestartSimulation={resetProgressAndGoToIntro} />;
      case GameStage.Summary:
        return <SummaryScreen results={results} onRestart={resetProgressAndGoToIntro} />;
      default:
        return <p>Cargando...</p>;
    }
  };

  return (
    <div className="min-h-screen container mx-auto p-4 flex flex-col items-center justify-center">
      <FullscreenButton />
      {renderCurrentStage()}
    </div>
  );
};

export default App;
