
import React from 'react';

interface ResultsDisplayProps {
  score: number;
  totalQuestions: number;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ score, totalQuestions }) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  let message = "";
  let textColor = "text-yellow-300";

  if (percentage === 100) {
    message = "¡Excelente! ¡Todas las respuestas son correctas!";
    textColor = "text-green-400";
  } else if (percentage >= 75) {
    message = "¡Muy bien! Sigue practicando.";
    textColor = "text-lime-400";
  } else if (percentage >= 50) {
    message = "¡Buen intento! Revisa los errores y vuelve a intentarlo.";
    textColor = "text-amber-400";
  } else {
    message = "Sigue esforzándote. La práctica hace al maestro.";
    textColor = "text-orange-400";
  }


  return (
    <div className="mt-6 md:mt-8 p-4 md:p-6 bg-white/10 rounded-lg text-center shadow-inner">
      <h2 className="text-2xl md:text-3xl font-bold mb-2 text-yellow-300">Resultados</h2>
      <p className={`text-xl md:text-2xl font-semibold ${textColor}`}>
        Tu puntuación: {score} / {totalQuestions} ({percentage}%)
      </p>
      {message && <p className={`mt-2 text-md md:text-lg ${textColor}`}>{message}</p>}
    </div>
  );
};

export default ResultsDisplay;
    