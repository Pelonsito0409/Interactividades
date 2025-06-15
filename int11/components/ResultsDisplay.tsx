
import React from 'react';
import { BondType, BondExplanation, ElementData } from '../types';
import InfoCard from './InfoCard';
import { BOND_EXPLANATIONS } from '../constants';

interface ResultsDisplayProps {
  bondType: BondType | null;
  element1: ElementData | null; // Changed from element1Name
  element2: ElementData | null; // Changed from element2Name
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ bondType, element1, element2 }) => {
  if (!bondType) {
    return (
      <InfoCard className="mt-6 text-center">
        <p className="text-slate-400">Los resultados de la combinación aparecerán aquí.</p>
      </InfoCard>
    );
  }

  const explanation: BondExplanation | undefined = BOND_EXPLANATIONS[bondType];

  if (!explanation) {
    return (
      <InfoCard title="Error" className="mt-6 border-red-500 border">
        <p>No se encontró explicación para el tipo de enlace: {bondType}</p>
      </InfoCard>
    );
  }

  return (
    <InfoCard title={`Enlace Formado: ${explanation.type}`} className="mt-6 border-t-4 border-sky-500">
      {element1 && element2 && (
        <p className="mb-3 text-lg">
          Entre <span className="font-semibold text-pink-400">{element1.name}</span> y <span className="font-semibold text-pink-400">{element2.name}</span>
        </p>
      )}
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-sky-300">Descripción General:</h4>
          <p>{explanation.generalDescription}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sky-300">Interacción de Electrones:</h4>
          <p>{explanation.electronInteraction}</p>
          {element1 && (
            <p className="text-sm text-slate-400 mt-1">
              Config. Capas ({element1.symbol}): {element1.shells.join(', ')}
            </p>
          )}
          {element2 && (
            <p className="text-sm text-slate-400 mt-1">
              Config. Capas ({element2.symbol}): {element2.shells.join(', ')}
            </p>
          )}
        </div>
        <div>
          <h4 className="font-semibold text-sky-300">Propiedades Típicas del Enlace:</h4>
          <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
            <li><strong>Ejemplo:</strong> {explanation.properties.example || 'N/A'}</li>
            <li><strong>Estado (ambiente):</strong> {explanation.properties.stateAtRoomTemp}</li>
            <li><strong>Punto de Fusión:</strong> {explanation.properties.meltingPoint}</li>
            <li><strong>Conductividad Eléctrica:</strong> {explanation.properties.conductivity}</li>
            <li><strong>Solubilidad:</strong> {explanation.properties.solubility}</li>
          </ul>
        </div>
      </div>
    </InfoCard>
  );
};

export default ResultsDisplay;
