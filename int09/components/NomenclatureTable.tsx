
import React from 'react';
import { QuizEntry, CompoundProperty, QuizState, FeedbackItem } from '../types';
import { COLUMN_HEADERS, ORDERED_COLUMN_KEYS } from '../constants';
import TableRow from './TableRow';

interface NomenclatureTableProps {
  quizEntries: QuizEntry[];
  quizState: QuizState;
  onAnswerChange: (rowIndex: number, propertyKey: CompoundProperty, value: string) => void;
  feedback?: Record<string, Record<string, FeedbackItem>>; // Outer key: compound.id, Inner key: propertyKey
}

const NomenclatureTable: React.FC<NomenclatureTableProps> = ({ quizEntries, quizState, onAnswerChange, feedback }) => {
  if (!quizEntries.length) {
    return <p className="text-center text-slate-400 mt-8">Cargando ejercicio...</p>;
  }

  return (
    <div className="overflow-x-auto shadow-2xl rounded-lg">
      <table className="min-w-full table-fixed border-collapse border border-slate-700 bg-slate-800">
        <thead className="bg-slate-900 sticky top-0 z-10">
          <tr>
            {ORDERED_COLUMN_KEYS.map((key) => (
              <th key={key} className="p-4 border border-slate-700 text-left text-sm font-semibold text-sky-400 min-w-[200px] whitespace-nowrap">
                {COLUMN_HEADERS[key]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {quizEntries.map((entry, rowIndex) => (
            <TableRow
              key={entry.compound.id}
              quizEntry={entry}
              quizState={quizState}
              onAnswerChange={(propertyKey, value) => onAnswerChange(rowIndex, propertyKey, value)}
              feedback={feedback ? feedback[entry.compound.id] : undefined}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NomenclatureTable;
