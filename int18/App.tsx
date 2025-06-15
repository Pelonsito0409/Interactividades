
import React, { useState, useCallback, useEffect } from 'react';
import { AppView, EnergyType, Scenario, TransformationExample, QuizQuestion, SelectedEnergyTypes, EnergyDefinition } from './types';
import { ENERGY_DEFINITIONS, SCENARIOS, TRANSFORMATION_EXAMPLES, QUIZ_QUESTIONS, getEnergyDefinition } from './constants';

// --- Reusable Components ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
  const baseStyle = 'px-4 py-2 rounded-lg font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900';
  const variants = {
    primary: 'bg-sky-500 hover:bg-sky-600 text-white focus:ring-sky-400',
    secondary: 'bg-slate-600 hover:bg-slate-700 text-slate-100 focus:ring-slate-500',
    ghost: 'bg-transparent hover:bg-slate-700 text-sky-400 hover:text-sky-300 focus:ring-sky-500',
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <div className={`bg-slate-800 shadow-xl rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg relative">
        <h2 className="text-2xl font-bold text-sky-400 mb-4">{title}</h2>
        {children}
        <Button onClick={onClose} className="absolute top-4 right-4" variant="ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </Card>
    </div>
  );
};

// --- Section Components ---

const Introduction: React.FC<{ onComplete: () => void }> = ({ onComplete }) => (
  <Card className="max-w-3xl mx-auto text-center">
    <h1 className="text-4xl font-bold text-sky-400 mb-6">¡Bienvenido al Explorador de Energía!</h1>
    <p className="text-xl text-slate-300 mb-4">
      La energía está en todas partes y es fundamental para todo lo que sucede a nuestro alrededor.
      Pero, ¿qué es exactamente la energía?
    </p>
    <p className="text-2xl font-semibold bg-slate-700 p-4 rounded-lg text-yellow-300 mb-6">
      La energía es la capacidad de un sistema para producir cambios o realizar trabajo.
    </p>
    <p className="text-lg text-slate-300 mb-4">
      Existen muchas formas diferentes de energía, y una de las cosas más fascinantes es cómo puede transformarse de una forma a otra.
      En esta simulación, explorarás estas formas, sus transformaciones y el importante principio de conservación de la energía.
    </p>
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {ENERGY_DEFINITIONS.map(def => (
        <div key={def.type} className={`p-4 rounded-lg shadow-md ${def.color} text-white`}>
          <div className="flex items-center mb-2">
            {React.cloneElement(def.icon as React.ReactElement<{ className?: string }>, { className: "w-8 h-8 mr-3 text-white"})}
            <h3 className="text-lg font-semibold">{def.name}</h3>
          </div>
          <p className="text-sm opacity-90">{def.description.substring(0,60)}...</p>
        </div>
      ))}
    </div>
    <Button onClick={onComplete} className="mt-8 text-lg px-8 py-3">
      ¡Comenzar a Explorar!
    </Button>
  </Card>
);

interface ScenarioExplorerProps {
  onComplete: () => void;
}
const ScenarioExplorer: React.FC<ScenarioExplorerProps> = ({ onComplete }) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedTypes, setSelectedTypes] = useState<SelectedEnergyTypes>({});
  const [showFeedback, setShowFeedback] = useState(false);

  const currentScenario = SCENARIOS[currentScenarioIndex];

  const handleTypeToggle = (type: EnergyType) => {
    setSelectedTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSubmit = () => {
    setShowFeedback(true);
  };

  const handleNextScenario = () => {
    setShowFeedback(false);
    setSelectedTypes({});
    if (currentScenarioIndex < SCENARIOS.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const getFeedback = () => {
    if (!showFeedback) return null;
    const correctSelections = currentScenario.presentEnergyTypes.every(type => selectedTypes[type]) &&
                              Object.keys(selectedTypes).filter(k => selectedTypes[k as EnergyType]).length === currentScenario.presentEnergyTypes.length;
    return (
      <Card className={`mt-4 border-2 ${correctSelections ? 'border-green-500' : 'border-red-500'}`}>
        <h3 className={`text-xl font-semibold ${correctSelections ? 'text-green-400' : 'text-red-400'}`}>
          {correctSelections ? '¡Correcto!' : 'Revisemos...'}
        </h3>
        <p className="text-slate-300 mt-2"><strong>Explicación:</strong> {currentScenario.explanation}</p>
        <p className="text-slate-300 mt-2"><strong>Tipos de energía presentes correctamente:</strong></p>
        <ul className="list-disc list-inside ml-4">
          {currentScenario.presentEnergyTypes.map(type => (
            <li key={type} className="text-slate-300">{getEnergyDefinition(type)?.name}</li>
          ))}
        </ul>
        <Button onClick={handleNextScenario} className="mt-4">
          {currentScenarioIndex < SCENARIOS.length - 1 ? 'Siguiente Escenario' : 'Continuar'}
        </Button>
      </Card>
    );
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-sky-400 mb-2">Explorador de Escenarios</h2>
      <p className="text-slate-400 mb-6">Observa la situación e identifica los tipos de energía presentes.</p>
      
      <div className="bg-slate-700 p-6 rounded-lg">
        <h3 className="text-2xl font-semibold text-yellow-300 mb-2">{currentScenario.title}</h3>
        <img src={currentScenario.imageUrl} alt={currentScenario.title} className="w-full h-64 object-cover rounded-md mb-4 shadow-lg"/>
        <p className="text-slate-300 mb-4">{currentScenario.description}</p>

        <h4 className="text-lg font-semibold text-slate-100 mb-2">¿Qué tipos de energía están presentes?</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {ENERGY_DEFINITIONS.map(def => (
            <label key={def.type} className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${selectedTypes[def.type] ? `${def.color} text-white scale-105 shadow-lg` : 'bg-slate-600 hover:bg-slate-500 text-slate-200'}`}>
              <input 
                type="checkbox" 
                checked={!!selectedTypes[def.type]}
                onChange={() => handleTypeToggle(def.type)}
                className="hidden" 
              />
              {React.cloneElement(def.icon as React.ReactElement<{ className?: string }>, { className: "w-5 h-5 mr-2"})}
              {def.name}
            </label>
          ))}
        </div>
        {!showFeedback && <Button onClick={handleSubmit} className="mt-4">Comprobar</Button>}
      </div>
      {getFeedback()}
    </Card>
  );
};


interface TransformationVisualizerProps {
  onComplete: () => void;
}
const TransformationVisualizer: React.FC<TransformationVisualizerProps> = ({ onComplete }) => {
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const currentExample = TRANSFORMATION_EXAMPLES[currentExampleIndex];

  const handleNextExample = () => {
    if (currentExampleIndex < TRANSFORMATION_EXAMPLES.length - 1) {
      setCurrentExampleIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };
  
  const fromDef = getEnergyDefinition(currentExample.from);
  const toDefs = currentExample.to.map(t => getEnergyDefinition(t)).filter(Boolean) as EnergyDefinition[];

  return (
    <Card className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-sky-400 mb-6">Visualizador de Transformaciones</h2>
      <Card className="bg-slate-700">
        <h3 className="text-2xl font-semibold text-yellow-300 mb-4">{currentExample.title}</h3>
        {currentExample.imageUrl && <img src={currentExample.imageUrl} alt={currentExample.title} className="w-full h-48 object-cover rounded-md mb-4 shadow-lg"/>}
        
        <div className="flex flex-col sm:flex-row items-center justify-around my-6 space-y-4 sm:space-y-0 sm:space-x-4">
          {fromDef && (
            <div className={`flex flex-col items-center p-4 rounded-lg ${fromDef.color} text-white shadow-lg`}>
               {React.cloneElement(fromDef.icon as React.ReactElement<{ className?: string }>, { className: "w-10 h-10 mb-2"})}
              <span className="font-semibold">{fromDef.name}</span>
            </div>
          )}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-sky-400 transform sm:rotate-0 rotate-90">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>
          <div className="flex space-x-2">
            {toDefs.map(toDef => (
               <div key={toDef.type} className={`flex flex-col items-center p-4 rounded-lg ${toDef.color} text-white shadow-lg`}>
                {React.cloneElement(toDef.icon as React.ReactElement<{ className?: string }>, { className: "w-10 h-10 mb-2"})}
                <span className="font-semibold">{toDef.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <p className="text-slate-300 text-lg mb-6">{currentExample.description}</p>
        <Button onClick={handleNextExample}>
          {currentExampleIndex < TRANSFORMATION_EXAMPLES.length - 1 ? 'Siguiente Ejemplo' : 'Continuar'}
        </Button>
      </Card>
    </Card>
  );
};


interface ConservationDemoProps {
  onComplete: () => void;
}
const ConservationDemo: React.FC<ConservationDemoProps> = ({ onComplete }) => {
  const [potential, setPotential] = useState(100);
  const [kinetic, setKinetic] = useState(0);
  const [thermal, setThermal] = useState(0); // For showing some loss to heat eventually
  const totalEnergy = 100; // Assuming a closed system with this total

  // Simulate a pendulum swing or a bouncing ball
  useEffect(() => {
    let interval: number | undefined; 
    let direction = -1; // -1 for potential to kinetic, 1 for kinetic to potential
    let step = 5; // Energy transformed per tick
    
    interval = window.setInterval(() => { 
      setPotential(p => {
        let newP = p + (step * direction);
        if (newP > totalEnergy) { newP = totalEnergy; direction *= -1; }
        if (newP < 0) { newP = 0; direction *= -1; }

        let currentThermalValue = 0;
        setThermal(t => {
            currentThermalValue = t;
            if (p !== newP && newP < totalEnergy) { 
                 return Math.min(totalEnergy - newP - kinetic, t + 0.1); // Ensure thermal doesn't exceed available
            }
            return t;
        });
        
        setKinetic(k => {
             // Ensure kinetic doesn't make total exceed totalEnergy
            return Math.max(0, Math.min(totalEnergy - newP - currentThermalValue, totalEnergy - newP));
        });
        return newP;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [kinetic]); // Added kinetic to dependency array to ensure thermal calculation is up-to-date with kinetic state.


  const EnergyBar: React.FC<{ value: number; maxValue: number; color: string; label: string }> = ({ value, maxValue, color, label }) => (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        <span className="text-sm font-medium text-slate-300">{value.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-slate-600 rounded-full h-6">
        <div 
          className={`${color} h-6 rounded-full energy-bar-fill`} 
          style={{ width: `${Math.max(0, (value / maxValue) * 100)}%` }} 
        ></div>
      </div>
    </div>
  );
  
  const potentialDef = getEnergyDefinition(EnergyType.MECHANICAL_POTENTIAL);
  const kineticDef = getEnergyDefinition(EnergyType.MECHANICAL_KINETIC);
  const thermalDef = getEnergyDefinition(EnergyType.THERMAL);

  const currentDisplayedTotal = Math.max(0, Math.min(totalEnergy, potential + kinetic + thermal));


  return (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-sky-400 mb-4">Principio de Conservación de la Energía</h2>
      <p className="text-slate-300 mb-6">
        La energía no se crea ni se destruye, solo se transforma de una forma a otra. En un sistema cerrado, la cantidad total de energía permanece constante.
        Aquí simulamos un péndulo o una pelota que rebota, donde la energía potencial se convierte en cinética y viceversa. Con el tiempo, algo de energía se convierte en térmica debido a la fricción.
      </p>
      <div className="bg-slate-700 p-6 rounded-lg">
        {potentialDef && <EnergyBar value={potential} maxValue={totalEnergy} color={potentialDef.color} label={potentialDef.name} />}
        {kineticDef && <EnergyBar value={kinetic} maxValue={totalEnergy} color={kineticDef.color} label={kineticDef.name} />}
        {thermalDef && <EnergyBar value={thermal} maxValue={totalEnergy} color={thermalDef.color} label={thermalDef.name} />}

        <div className="mt-4 pt-4 border-t border-slate-600">
           <EnergyBar value={currentDisplayedTotal} maxValue={totalEnergy} color="bg-purple-500" label="Energía Total" />
           <p className="text-sm text-slate-400 text-center mt-2">Observa cómo la energía total (aproximadamente) se mantiene constante.</p>
        </div>
      </div>
      <Button onClick={onComplete} className="mt-8 w-full">
        Finalizar Demostración y Continuar
      </Button>
    </Card>
  );
};


interface QuizProps {
  onComplete: (score: number, total: number) => void;
}
const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleOptionSelect = (optionId: string) => {
    if (showFeedback) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOptionId) return;
    if (selectedOptionId === currentQuestion.correctOptionId) {
      setScore(s => s + 1);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedOptionId(null);
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // This case should ideally be handled by the button text changing to "Ver Resultados"
      // and handleFinalSubmit being called if it's the last question.
      // However, if logic somehow reaches here on last question after feedback:
      onComplete(score, QUIZ_QUESTIONS.length);
    }
  };
  
   const handleFinalSubmitOrNext = () => {
    if (!showFeedback) { // Corresponds to "Enviar Respuesta"
        if (!selectedOptionId) return;
        let currentScore = score;
        if (selectedOptionId === currentQuestion.correctOptionId) {
            currentScore = score + 1;
            setScore(currentScore);
        }
        setShowFeedback(true);
        if (currentQuestionIndex === QUIZ_QUESTIONS.length - 1) {
            // If it's the last question and we just submitted, onComplete will be called by "Ver Resultados" click
        }
    } else { // Corresponds to "Siguiente Pregunta" or "Ver Resultados"
        if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
            setShowFeedback(false);
            setSelectedOptionId(null);
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            onComplete(score, QUIZ_QUESTIONS.length);
        }
    }
  };


  return (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-sky-400 mb-1">Prueba Interactiva</h2>
      <p className="text-slate-400 mb-6">Pregunta {currentQuestionIndex + 1} de {QUIZ_QUESTIONS.length}</p>
      
      <div className="bg-slate-700 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-slate-100 mb-4">{currentQuestion.questionText}</h3>
        <div className="space-y-3">
          {currentQuestion.options.map(option => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              disabled={showFeedback}
              className={`w-full text-left p-3 rounded-md transition-all duration-150 border-2
                ${showFeedback ? 
                  (option.id === currentQuestion.correctOptionId ? 'bg-green-600 border-green-500 text-white' : 
                   (option.id === selectedOptionId ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-600 border-slate-500 text-slate-300')
                  ) 
                  : 
                  (selectedOptionId === option.id ? 'bg-sky-600 border-sky-500 text-white scale-105' : 'bg-slate-600 hover:bg-slate-500 border-slate-500 text-slate-200')
                }`}
            >
              {option.text}
            </button>
          ))}
        </div>
        
        {showFeedback && (
          <div className={`mt-4 p-3 rounded-md ${selectedOptionId === currentQuestion.correctOptionId ? 'bg-green-700' : 'bg-red-700'}`}>
            <p className="font-semibold text-white">
              {selectedOptionId === currentQuestion.correctOptionId ? '¡Correcto!' : 'Incorrecto.'}
            </p>
            <p className="text-slate-200 text-sm mt-1">{currentQuestion.explanation}</p>
          </div>
        )}

        <Button 
            onClick={handleFinalSubmitOrNext}
            disabled={!selectedOptionId && !showFeedback} 
            className="mt-6 w-full"
        >
          {showFeedback 
            ? (currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados') 
            : 'Enviar Respuesta'}
        </Button>
      </div>
    </Card>
  );
};


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.INTRODUCTION);
  const [quizScore, setQuizScore] = useState<{ score: number; total: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const navigateTo = useCallback((view: AppView) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false); 
    window.scrollTo(0, 0); 
  }, []);

  const handleQuizComplete = (scoreValue: number, totalValue: number) => {
    setQuizScore({ score: scoreValue, total: totalValue });
    setIsModalOpen(true);
  };
  

  const NavItem: React.FC<{ view: AppView; label: string; isMobile?: boolean }> = ({ view, label, isMobile }) => (
    <button
      onClick={() => navigateTo(view)}
      className={`transition-colors text-left w-full ${isMobile ? 'block px-3 py-3 text-base' : 'px-3 py-2 rounded-md text-sm font-medium'}
        ${currentView === view ? (isMobile ? 'bg-sky-700 text-white' : 'bg-sky-600 text-white shadow-md') : (isMobile ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white')}`}
    >
      {label}
    </button>
  );
  
  const renderView = () => {
    switch (currentView) {
      case AppView.INTRODUCTION:
        return <Introduction onComplete={() => navigateTo(AppView.SCENARIO_EXPLORER)} />;
      case AppView.SCENARIO_EXPLORER:
        return <ScenarioExplorer onComplete={() => navigateTo(AppView.TRANSFORMATION_VISUALIZER)} />;
      case AppView.TRANSFORMATION_VISUALIZER:
        return <TransformationVisualizer onComplete={() => navigateTo(AppView.CONSERVATION_DEMO)} />;
      case AppView.CONSERVATION_DEMO:
        return <ConservationDemo onComplete={() => navigateTo(AppView.QUIZ)} />;
      case AppView.QUIZ:
        return <Quiz onComplete={handleQuizComplete} />;
      default:
        return <Introduction onComplete={() => navigateTo(AppView.SCENARIO_EXPLORER)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <nav className="bg-slate-800 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl text-sky-400">Explorador de Energía</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-2">
                <NavItem view={AppView.INTRODUCTION} label="Introducción" />
                <NavItem view={AppView.SCENARIO_EXPLORER} label="Escenarios" />
                <NavItem view={AppView.TRANSFORMATION_VISUALIZER} label="Transformaciones" />
                <NavItem view={AppView.CONSERVATION_DEMO} label="Conservación" />
                <NavItem view={AppView.QUIZ} label="Prueba" />
              </div>
            </div>
             <div className="md:hidden">
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                    className="text-slate-300 hover:text-white p-2"
                    aria-label="Abrir menú de navegación"
                    aria-expanded={isMobileMenuOpen}
                >
                    {isMobileMenuOpen ? (
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    )}
                </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
            <div className="md:hidden absolute top-16 inset-x-0 bg-slate-800 border-t border-slate-700 shadow-lg z-30">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <NavItem view={AppView.INTRODUCTION} label="Introducción" isMobile />
                    <NavItem view={AppView.SCENARIO_EXPLORER} label="Escenarios" isMobile />
                    <NavItem view={AppView.TRANSFORMATION_VISUALIZER} label="Transformaciones" isMobile />
                    <NavItem view={AppView.CONSERVATION_DEMO} label="Conservación" isMobile />
                    <NavItem view={AppView.QUIZ} label="Prueba" isMobile />
                </div>
            </div>
        )}
      </nav>

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="enmarcado">
         {renderView()}
        </div>
      </main>

      <footer className="bg-slate-800 text-center py-4 mt-auto">
        <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} Explorador Interactivo de Energía. Inspirado en la curiosidad científica.</p>
      </footer>
      
      <Modal 
        isOpen={isModalOpen && !!quizScore} 
        onClose={() => {
          setIsModalOpen(false); 
          navigateTo(AppView.INTRODUCTION); 
          setQuizScore(null); 
        }}
        title="¡Prueba Completada!"
      >
        {quizScore && (
          <>
            <p className="text-lg text-slate-200 mb-4">
              Has obtenido <span className="font-bold text-sky-400">{quizScore.score}</span> de <span className="font-bold text-sky-400">{quizScore.total}</span> respuestas correctas.
            </p>
            <p className="text-slate-300 mb-6">
              {quizScore.score === quizScore.total ? "¡Excelente trabajo! Has dominado los conceptos." : 
               quizScore.score >= quizScore.total / 2 ? "¡Buen trabajo! Sigue explorando para afianzar tus conocimientos." :
               "Sigue aprendiendo. ¡La energía es un tema fascinante!"}
            </p>
            <Button 
              onClick={() => { 
                setIsModalOpen(false); 
                navigateTo(AppView.INTRODUCTION); 
                setQuizScore(null); 
              }} 
              className="w-full"
            >
              Volver al Inicio
            </Button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default App;
