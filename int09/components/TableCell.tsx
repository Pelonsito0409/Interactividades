
import React from 'react';
import { CompoundProperty, QuizState, FeedbackItem } from '../types';
import Dropdown from './Dropdown';
import CheckIcon from './icons/CheckIcon';
import CrossIcon from './icons/CrossIcon';
import { NOT_APPLICABLE_TEXT } from '../constants';

interface TableCellProps {
  propertyKey: CompoundProperty;
  value: string | null;
  isRevealed: boolean;
  options: string[];
  userAnswer: string;
  quizState: QuizState;
  feedback?: FeedbackItem;
  onAnswerChange: (value: string) => void;
}

const TableCell: React.FC<TableCellProps> = ({
  propertyKey,
  value,
  isRevealed,
  options,
  userAnswer,
  quizState,
  feedback,
  onAnswerChange,
}) => {
  if (value === null) {
    return <td className="p-3 border border-slate-700 text-slate-500 italic text-sm min-w-[200px]">{NOT_APPLICABLE_TEXT}</td>;
  }

  const cellBaseStyle = "p-3 border border-slate-700 min-w-[200px] text-sm";

  if (isRevealed) {
    return <td className={`${cellBaseStyle} bg-sky-800 font-semibold`}>{value}</td>;
  }

  if (quizState === QuizState.SUBMITTED) {
    const isCorrect = feedback?.isCorrect ?? false;
    const bgColor = isCorrect ? 'bg-green-700/30' : 'bg-red-700/30';
    const borderColor = isCorrect ? 'border-green-500' : 'border-red-500';
    
    return (
      <td className={`${cellBaseStyle} ${bgColor} border-2 ${borderColor} relative`}>
        <div className="flex justify-between items-center">
          <span>{userAnswer || <span className="italic text-slate-400">Sin respuesta</span>}</span>
          {isCorrect ? <CheckIcon className="text-green-400" /> : <CrossIcon className="text-red-400" />}
        </div>
        {!isCorrect && feedback?.correctAnswer && (
          <div className="mt-1 text-xs text-green-400">
            Correcto: {feedback.correctAnswer}
          </div>
        )}
      </td>
    );
  }

  // IN_PROGRESS state for input
  return (
    <td className={`${cellBaseStyle} bg-slate-800`}>
      <Dropdown
        options={options}
        selectedValue={userAnswer}
        onChange={onAnswerChange}
        showPlaceholder={true}
      />
    </td>
  );
};

export default TableCell;
