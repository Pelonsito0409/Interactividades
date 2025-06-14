
import React from 'react';
import { Substance, ZoneType } from '../types';

interface SubstanceCardProps {
  substance: Substance;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, item: Substance) => void;
  isBeingDragged: boolean;
}

const SubstanceCard: React.FC<SubstanceCardProps> = ({ substance, onDragStart, isBeingDragged }) => {
  let borderColor = 'border-slate-400';
  let feedbackIcon = null;

  if (substance.currentZone !== ZoneType.UNCLASSIFIED) {
    if (substance.isCorrect === true) {
      borderColor = 'border-green-500';
      feedbackIcon = <span className="text-green-500 text-lg" aria-label="Correcto">✓</span>;
    } else if (substance.isCorrect === false) {
      borderColor = 'border-red-500';
      feedbackIcon = <span className="text-red-500 text-lg" aria-label="Incorrecto">✗</span>;
    }
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, substance)}
      className={`p-2 rounded-md shadow-md cursor-grab active:cursor-grabbing transition-all duration-150 ease-in-out transform hover:scale-105 flex items-center justify-between min-w-[140px]
                  ${isBeingDragged ? 'opacity-50 scale-95' : 'opacity-100'}
                  ${substance.currentZone === ZoneType.UNCLASSIFIED ? 'bg-sky-100 text-sky-800' : 'bg-white text-slate-800'}
                  border-2 ${borderColor}`}
    >
      <div>
        <p className="font-semibold text-xs">{substance.name}</p>
        {substance.formula && <p className="text-xs text-slate-600">{substance.formula}</p>}
      </div>
      {feedbackIcon && <div className="ml-2">{feedbackIcon}</div>}
    </div>
  );
};

export default SubstanceCard;
