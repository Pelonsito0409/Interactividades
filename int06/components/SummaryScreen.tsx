
import React from 'react';
import { AppResults } from '../types';
import { MIXTURES_DATA } from '../constants';

interface SummaryScreenProps {
  results: AppResults;
  onRestart: () => void;
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({ results, onRestart }) => {
  let correctAnswersEventually = 0;
  let mixturesWithFailures = 0;
  const failedMixtureNames: string[] = [];
  const totalQuestions = MIXTURES_DATA.length;
  
  if (results.challenge1 && typeof results.challenge1 === 'object') {
    MIXTURES_DATA.forEach(mixture => {
        const result = results.challenge1[mixture.id];
        if (result) {
            if (result.correct) {
                correctAnswersEventually++;
            }
            if (result.hadPriorFailure) {
                mixturesWithFailures++;
                failedMixtureNames.push(mixture.name);
            }
        }
    });
  }
  
  const successfulAttemptsWithoutPriorFailure = totalQuestions - mixturesWithFailures;
  const scorePercentage = totalQuestions > 0 ? Math.round((successfulAttemptsWithoutPriorFailure / totalQuestions) * 100) : 0;

  return (
    <div className="w-full max-w-3xl p-6 bg-slate-800 shadow-2xl rounded-xl animate-fadeIn">
      <h2 className="text-4xl font-bold text-sky-400 mb-8 text-center">Resumen de la Simulación</h2>

      <div className="mb-6 p-4 bg-slate-700 rounded-lg">
        <h3 className="text-2xl font-semibold text-amber-300 mb-3">Puntuación Final (Reto 1)</h3>
        <p className="text-4xl font-bold text-center text-green-400">{scorePercentage}%</p>
        <p className="text-center text-slate-300">
          ({successfulAttemptsWithoutPriorFailure} de {totalQuestions} mezclas resueltas sin fallos previos)
        </p>
         {/* Optionally, you can still show total correct answers if different:
         <p className="text-center text-xs text-slate-400 mt-1">
          (Total resueltas correctamente al final: {correctAnswersEventually})
        </p> 
        */}
      </div>

      <div className="mb-6 p-4 bg-slate-700 rounded-lg">
        <h3 className="text-xl font-semibold text-amber-300 mb-2">Detalle de Errores:</h3>
        {mixturesWithFailures > 0 ? (
          <div>
            <p className="text-slate-300 mb-2">
              Tuviste algún fallo previo en <strong className="text-red-400">{mixturesWithFailures}</strong> de {totalQuestions} mezclas:
            </p>
            <ul className="list-disc list-inside text-red-300 pl-4 space-y-1">
              {failedMixtureNames.map(name => <li key={name}>{name}</li>)}
            </ul>
          </div>
        ) : (
          <p className="text-green-300">¡Excelente! Resolviste todas las mezclas sin cometer errores previos.</p>
        )}
      </div>
      
      <div className="mt-8 p-4 bg-sky-900 rounded-lg text-center">
        <h3 className="text-xl font-semibold text-sky-300 mb-2">Concepto Clave:</h3>
        <p className="text-slate-200">
          <strong className="text-sky-400">Mezclas:</strong> Se pueden separar por métodos físicos (como los que usaste).
        </p>
        <p className="text-slate-200 mt-1">
          Estos métodos aprovechan diferencias en las propiedades físicas de los componentes (tamaño, densidad, magnetismo, punto de ebullición) y <strong className="text-sky-400">no cambian la naturaleza química</strong> de las sustancias separadas.
        </p>
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={onRestart}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition duration-150 ease-in-out transform hover:scale-105"
        >
          Reiniciar Simulación
        </button>
      </div>
    </div>
  );
};

export default SummaryScreen;
