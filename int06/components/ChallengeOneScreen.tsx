
import React, { useState, useCallback, useEffect } from 'react';
import { MixtureChallengeItem, ToolItem, SeparationMethod, AppResults } from '../types';
import AnimatedSeparation from './AnimatedSeparation';

interface ChallengeOneScreenProps {
  mixtures: MixtureChallengeItem[];
  tools: ToolItem[];
  onCompleteItem: (mixtureId: string, methodUsed: SeparationMethod, isCorrect: boolean) => void;
  onAdvance: () => void;
  results: AppResults['challenge1'];
  onRestartSimulation: () => void;
}

const DraggableTool: React.FC<{ tool: ToolItem; onDragStart: (e: React.DragEvent<HTMLDivElement>, toolId: SeparationMethod) => void }> = ({ tool, onDragStart }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, tool.id)}
      className="m-2 p-3 bg-sky-600 rounded-lg shadow-md cursor-grab active:cursor-grabbing flex flex-col items-center hover:bg-sky-500 transition-colors"
      aria-label={`Herramienta: ${tool.name}`}
    >
      {tool.icon}
      <span className="text-xs mt-1 text-center">{tool.name}</span>
    </div>
  );
};

const MixtureDropZone: React.FC<{ mixture: MixtureChallengeItem; onDrop: (e: React.DragEvent<HTMLDivElement>, mixtureId: string) => void; onDragOver: (e: React.DragEvent<HTMLDivElement>) => void; isCompleted: boolean; isAttemptedIncorrectly: boolean }> = ({ mixture, onDrop, onDragOver, isCompleted, isAttemptedIncorrectly }) => {
  let borderColor = 'border-slate-500 hover:border-sky-400';
  if (isCompleted) {
    borderColor = 'border-green-500';
  } else if (isAttemptedIncorrectly) {
    borderColor = 'border-red-500';
  }

  return (
    <div
      onDrop={(e) => onDrop(e, mixture.id)}
      onDragOver={onDragOver}
      className={`p-6 border-2 border-dashed rounded-lg text-center ${borderColor} bg-slate-800 transition-all h-auto min-h-[16rem] flex flex-col justify-center items-center`}
      aria-label={`Zona para soltar sobre la mezcla: ${mixture.name}`}
    >
      <h3 className="text-xl font-semibold mb-2 text-amber-300">{mixture.name}</h3>
      {mixture.imageUrl && <img src={mixture.imageUrl} alt={mixture.name} className="w-48 h-32 object-cover rounded-md mx-auto mb-2 opacity-80" />}
      <p className="text-sm text-slate-400 mb-2">{mixture.description}</p>
      {isCompleted ? <p className="text-green-400 font-bold">¡Separada!</p> : <p className="text-sm text-slate-500">Arrastra la herramienta aquí</p>}
    </div>
  );
};

const ChallengeOneScreen: React.FC<ChallengeOneScreenProps> = ({ mixtures, tools, onCompleteItem, onAdvance, results, onRestartSimulation }) => {
  const [currentMixtureIndex, setCurrentMixtureIndex] = useState(0);
  const [animationStatus, setAnimationStatus] = useState<'idle' | 'processing' | 'completed'>('idle');
  const [currentAnimatedMethod, setCurrentAnimatedMethod] = useState<SeparationMethod | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect' | 'info'; message: string } | null>(null);
  const [showNextButtonDisplayed, setShowNextButtonDisplayed] = useState<boolean>(false);
  const [isProcessingDrop, setIsProcessingDrop] = useState<boolean>(false);
  const [isRetryingCurrentMixture, setIsRetryingCurrentMixture] = useState<boolean>(false);
  
  const activeMixture = mixtures[currentMixtureIndex];
  const currentMixtureResultForDropZone = activeMixture ? results[activeMixture.id] : null;

  useEffect(() => {
    if (isProcessingDrop || !activeMixture) {
        return;
    }

    if (isRetryingCurrentMixture) {
        return; 
    }

    const mixtureResult = results[activeMixture.id];

    if (mixtureResult?.correct) {
        setCurrentAnimatedMethod(mixtureResult.methodUsed || activeMixture.correctMethod);
        setAnimationStatus('completed');
        const successMessage = `${mixtureResult.methodUsed || activeMixture.correctMethod} ha funcionado con éxito para ${activeMixture.components.join(' y ')}. ${activeMixture.processExplanation}`;
        // Use functional update for setFeedback if its new value depends on the old one,
        // or if feedback itself is not a stable dependency. Here, it seems fine.
        if (feedback?.message !== successMessage) {
            setFeedback({ type: 'correct', message: successMessage });
        }
        setShowNextButtonDisplayed(true);
    } else if (mixtureResult?.attempted) { 
        setCurrentAnimatedMethod(mixtureResult.methodUsed || null); 
        setAnimationStatus('completed'); 
        const toolId = mixtureResult.methodUsed;
        if (toolId) {
            const incorrectExplanation = activeMixture.incorrectMethodExplanations?.[toolId] || "Este método no es el adecuado para esta mezcla.";
            const failMessage = `Incorrecto. ${incorrectExplanation}`;
            if (feedback?.message !== failMessage) {
                 setFeedback({ type: 'incorrect', message: failMessage });
            }
        } else {
             // If no method was used (e.g. malformed state), clear feedback
             if (feedback !== null) setFeedback(null); 
        }
        setShowNextButtonDisplayed(true);
    } else { // Mixture is new or reset
        setCurrentAnimatedMethod(null);
        setAnimationStatus('idle');
        if (feedback !== null) setFeedback(null);
        setShowNextButtonDisplayed(false);
    }
  // Simplified dependencies. 'feedback' was causing re-runs if its object identity changed without message change.
  // We only care about activeMixture and its results, or processing/retrying flags.
  }, [activeMixture, results, isProcessingDrop, isRetryingCurrentMixture]);


  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, toolId: SeparationMethod) => {
    e.dataTransfer.setData('toolId', toolId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, mixtureId: string) => {
    e.preventDefault();
    setIsRetryingCurrentMixture(false); 

    if (!activeMixture || activeMixture.id !== mixtureId || isProcessingDrop || (results[activeMixture.id]?.correct && showNextButtonDisplayed)) {
        return; 
    }

    const toolId = e.dataTransfer.getData('toolId') as SeparationMethod;
    if (!toolId) return;

    setIsProcessingDrop(true);
    setCurrentAnimatedMethod(toolId); 
    setAnimationStatus('processing');  
    setFeedback(null); 
    setShowNextButtonDisplayed(false); 

    setTimeout(() => {
      const isCorrect = activeMixture.correctMethod === toolId;
      onCompleteItem(mixtureId, toolId, isCorrect); 

      setAnimationStatus('completed'); 

      if (isCorrect) {
        setFeedback({ type: 'correct', message: `${toolId} ha funcionado con éxito para ${activeMixture.components.join(' y ')}. ${activeMixture.processExplanation}` });
      } else {
        const incorrectExplanation = activeMixture.incorrectMethodExplanations?.[toolId] || "Este método no es el adecuado para esta mezcla.";
        setFeedback({ type: 'incorrect', message: `Incorrecto. ${incorrectExplanation}` });
      }
      setShowNextButtonDisplayed(true); 
      setIsProcessingDrop(false); 
    }, 100); 
  };
  
  const handleNextMixtureOrRetry = () => {
    const wasCorrect = activeMixture && results[activeMixture.id]?.correct;

    setShowNextButtonDisplayed(false);
    setFeedback(null);
    setAnimationStatus('idle');
    setCurrentAnimatedMethod(null);
    
    if (wasCorrect) { 
      setIsRetryingCurrentMixture(false); 
      if (currentMixtureIndex < mixtures.length - 1) {
        setCurrentMixtureIndex(prev => prev + 1); 
      }
    } else { 
      setIsRetryingCurrentMixture(true); 
    }
  };
  
  const allMixturesSeparated = mixtures.every(m => results[m.id]?.correct);
  
  return (
    <div className="w-full max-w-4xl p-6 bg-slate-800 shadow-2xl rounded-xl animate-fadeIn">
      <h2 className="text-3xl font-bold text-sky-400 mb-2 text-center">Reto 1: Elige el Método Correcto</h2>
      <p className="text-xl text-center text-amber-200 mb-6 font-semibold animate-pulse" role="alert">
        👇 Arrastra la herramienta adecuada sobre la mezcla para separarla 👇
      </p>
      
      {activeMixture && !results[activeMixture.id]?.correct && !showNextButtonDisplayed && !isProcessingDrop && animationStatus === 'idle' && (
        <p className="text-center mb-4 text-lg text-slate-300">Separa: <span className="font-semibold text-amber-400">{activeMixture.name}</span></p>
      )}

      {allMixturesSeparated && (
         <p className="text-center mb-4 text-lg text-green-400 font-semibold">¡Todas las mezclas han sido separadas correctamente!</p>
      )}

      <div className="grid md:grid-cols-2 gap-6 items-start mb-6"> {/* Reverted to 2-column layout for mixture/tools */}
        <div> {/* Mixture Area Wrapper */}
         {activeMixture ? (
            (animationStatus === 'idle' && !showNextButtonDisplayed) ? 
             (<MixtureDropZone
                key={activeMixture.id + '-dropzone'} 
                mixture={activeMixture}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                isCompleted={!!currentMixtureResultForDropZone?.correct} 
                isAttemptedIncorrectly={!!(currentMixtureResultForDropZone?.attempted && !currentMixtureResultForDropZone?.correct)}
             />
            ) : (
             <AnimatedSeparation
                key={activeMixture.id + '-animation'}
                method={currentAnimatedMethod}
                status={animationStatus}
                mixtureName={activeMixture.name}
                mixtureImageUrl={activeMixture.imageUrl}
                mixtureDescription={activeMixture.description}
                feedbackMessage={feedback?.message}
                feedbackType={feedback?.type}
                isCorrectAttempt={results[activeMixture.id]?.correct ?? false}
              />
            )
          ) : (
            <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 italic p-4">Cargando mezcla...</div>
          )}
        </div>

        <div className="bg-slate-700 p-4 rounded-lg shadow-inner"> {/* Tools Area */}
          <h3 className="text-lg font-semibold text-slate-300 mb-3 text-center">Herramientas Disponibles</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {tools.map(tool => (
              <DraggableTool key={tool.id} tool={tool} onDragStart={handleDragStart} />
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
        <div className="text-sm text-slate-400 text-center sm:text-left">
            Mezcla {activeMixture ? Math.min(mixtures.findIndex(m => m.id === activeMixture.id) + 1, mixtures.length) : '-'} de {mixtures.length}
        </div>
        
        <div className="flex justify-center"> {/* Restart Button centered in its own flex container */}
             <button
                onClick={onRestartSimulation}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors text-sm"
                title="Reiniciar toda la simulación (se perderá el progreso)"
            >
                Reiniciar Simulación
            </button>
        </div>
                
        <div className="flex justify-center sm:justify-end"> {/* Right side action button */}
          {showNextButtonDisplayed && activeMixture && !allMixturesSeparated && (
              <button
                  onClick={handleNextMixtureOrRetry}
                  className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors"
              >
                  {results[activeMixture.id]?.correct ? "Siguiente Mezcla" : "Reintentar"}
              </button>
          )}

          {allMixturesSeparated && (
            <button
              onClick={onAdvance}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors"
            >
              Ver Resumen
            </button>
          )}
          {/* Placeholder to maintain layout when no button is active in this slot */}
          {!(showNextButtonDisplayed && activeMixture && !allMixturesSeparated) && !allMixturesSeparated && (
            <div className="min-w-[1px] sm:min-w-[130px]"></div> // Adjusted placeholder width
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeOneScreen;
