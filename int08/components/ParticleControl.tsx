
import React from 'react';
import { MAX_PARTICLES_CONTROL } from '../constants/elements';

interface ParticleControlProps {
  name: string;
  count: number;
  colorClass: string;
  onIncrement: () => void;
  onDecrement: () => void;
}

const ParticleControl: React.FC<ParticleControlProps> = ({ name, count, colorClass, onIncrement, onDecrement }) => {
  return (
    <div className={`p-4 rounded-lg shadow-md ${colorClass} bg-opacity-20 border ${colorClass} border-opacity-50`}>
      <h3 className={`text-xl font-semibold mb-2 text-center ${getTextColor(colorClass)}`}>{name}</h3>
      <div className="flex items-center justify-center space-x-3">
        <button
          onClick={onDecrement}
          disabled={count <= 0}
          className={`px-4 py-2 rounded-md font-bold text-slate-900 transition-colors duration-150
                      ${getButtonClasses(colorClass)} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          -
        </button>
        <span className={`text-2xl font-bold w-12 text-center ${getTextColor(colorClass)}`}>{count}</span>
        <button
          onClick={onIncrement}
          disabled={count >= MAX_PARTICLES_CONTROL}
          className={`px-4 py-2 rounded-md font-bold text-slate-900 transition-colors duration-150
                      ${getButtonClasses(colorClass)} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          +
        </button>
      </div>
    </div>
  );
};

// Helper to get appropriate text color based on background
const getTextColor = (colorClass: string): string => {
  if (colorClass.includes("yellow")) return "text-yellow-200";
  if (colorClass.includes("red")) return "text-red-200";
  if (colorClass.includes("blue")) return "text-blue-200";
  if (colorClass.includes("gray")) return "text-gray-200"; // For neutrons
  return "text-slate-100";
};

// Helper to get button background and hover classes
const getButtonClasses = (colorClass: string): string => {
    if (colorClass.includes("yellow")) return "bg-yellow-400 hover:bg-yellow-500";
    if (colorClass.includes("red")) return "bg-red-400 hover:bg-red-500";
    if (colorClass.includes("blue")) return "bg-blue-400 hover:bg-blue-500";
    if (colorClass.includes("gray")) return "bg-gray-400 hover:bg-gray-500";
    return "bg-slate-400 hover:bg-slate-500";
}

export default ParticleControl;
    