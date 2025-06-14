
import React from 'react';
import { CompoundProperty, QuizEntry, QuizState, FeedbackItem } from '../types';
import { ORDERED_COLUMN_KEYS, NOT_APPLICABLE_TEXT } from '../constants';
import TableCell from './TableCell';

interface TableRowProps {
  quizEntry: QuizEntry;
  quizState: QuizState;
  onAnswerChange: (propertyKey: CompoundProperty, value: string) => void;
  feedback?: Record<string, FeedbackItem>;
}

const TableRow: React.FC<TableRowProps> = ({ quizEntry, quizState, onAnswerChange, feedback }) => {
  const { compound, revealedPropertyKey, userAnswers, options } = quizEntry;

  return (
    <tr className="hover:bg-slate-700/50 transition-colors">
      {ORDERED_COLUMN_KEYS.map((key) => {
        const value = compound[key];
        const isRevealed = key === revealedPropertyKey;
        
        // Ensure options exist for the key, even if empty array
        const cellOptions = options && options[key] ? options[key] : [];
        // Ensure userAnswer exists for the key, even if empty string
        const cellUserAnswer = userAnswers && userAnswers[key] ? userAnswers[key] : "";
        // Ensure feedback exists for the key
        const cellFeedback = feedback && feedback[key] ? feedback[key] : undefined;

        return (
          <TableCell
            key={key}
            propertyKey={key}
            value={value}
            isRevealed={isRevealed}
            options={cellOptions}
            userAnswer={cellUserAnswer}
            quizState={quizState}
            feedback={cellFeedback}
            onAnswerChange={(newValue) => onAnswerChange(key, newValue)}
          />
        );
      })}
    </tr>
  );
};

export default TableRow;
