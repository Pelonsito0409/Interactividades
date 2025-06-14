
import React from 'react';
import { Option } from '../types';

interface OptionSelectorPanelProps {
  options: Option[];
  onSelectOption: (optionId: string) => void;
  onClose: () => void;
}

const OptionSelectorPanel: React.FC<OptionSelectorPanelProps> = ({ options, onSelectOption, onClose }) => {
  if (!options.length) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20 p-4" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="option-selector-title"
    >
      <div 
        className="bg-white text-gray-800 p-4 md:p-6 rounded-lg shadow-xl w-full max-w-sm max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside panel
      >
        <div className="flex justify-between items-center mb-4">
          <h3 id="option-selector-title" className="text-xl font-semibold text-sky-700">Elige una opción:</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-3xl leading-none font-bold"
            aria-label="Cerrar panel de opciones"
          >&times;</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map(option => (
            <button
              key={option.id}
              onClick={() => onSelectOption(option.id)}
              className="p-3 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-md shadow-sm hover:shadow-md transition-all duration-150 ease-in-out text-left text-sm md:text-base"
              aria-label={`Seleccionar ${option.text}`}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OptionSelectorPanel;
