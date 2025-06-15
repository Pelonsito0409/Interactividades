
import React from 'react';
import { ElementData } from '../types';
import { MAX_GROUP, MAX_PERIOD } from '../constants';

interface PeriodicTableProps {
  elements: ElementData[];
  onElementSelect: (element: ElementData) => void;
  selectedSymbols: string[];
}

const PeriodicTable: React.FC<PeriodicTableProps> = ({ elements, onElementSelect, selectedSymbols }) => {
  const gridCells = Array(MAX_PERIOD * MAX_GROUP).fill(null);

  elements.forEach(el => {
    const index = (el.period - 1) * MAX_GROUP + (el.group - 1);
    if (index >= 0 && index < gridCells.length) {
      gridCells[index] = el;
    }
  });

  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow-2xl">
      <h2 className="text-2xl font-bold text-sky-400 mb-6 text-center">Tabla Periódica Simplificada</h2>
      <div 
        className="grid gap-1" 
        style={{ gridTemplateColumns: `repeat(${MAX_GROUP}, minmax(0, 1fr))` }}
      >
        {gridCells.map((element, index) => {
          if (element) {
            const isSelected = selectedSymbols.includes(element.symbol);
            return (
              <button
                key={element.symbol}
                onClick={() => onElementSelect(element)}
                className={`p-2 rounded shadow-md text-center transition-all duration-200 ease-in-out transform hover:scale-110
                            ${element.color} 
                            ${element.textColor || (element.color.includes('yellow') || element.color.includes('pink') || element.color.includes('green-400') || element.color.includes('blue-400') || element.color.includes('teal-400') ? 'text-black' : 'text-white')}
                            ${isSelected ? 'ring-4 ring-offset-2 ring-offset-slate-800 ring-pink-500 scale-105' : 'hover:ring-2 hover:ring-sky-300'}
                            focus:outline-none focus:ring-4 focus:ring-sky-400`}
                title={element.name}
              >
                <div className="font-bold text-sm sm:text-lg">{element.symbol}</div>
                <div className="text-xs hidden sm:block">{element.name}</div>
                <div className="text-xs mt-1">{element.atomicNumber}</div>
              </button>
            );
          }
          return <div key={`empty-${index}`} className="p-1 sm:p-2 min-h-[40px] sm:min-h-[60px]"></div>; // Empty cell
        })}
      </div>
    </div>
  );
};

export default PeriodicTable;
    