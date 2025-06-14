
import React from 'react';
import { ElementData } from '../types';

interface InfoPanelProps {
  protons: number;
  neutrons: number;
  electrons: number;
  element: ElementData | undefined;
  elementName: string;
  massNumber: number;
  ionState: string;
  isotopeState: string;
}

const InfoLine: React.FC<{ label: string; value: React.ReactNode; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className={`py-2 px-3 flex justify-between items-center ${highlight ? 'bg-sky-700 bg-opacity-30 rounded' : ''}`}>
    <span className="text-slate-400 text-sm">{label}:</span>
    <span className={`text-slate-100 font-medium text-right ${highlight ? 'text-sky-300 text-lg' : 'text-md'}`}>{value}</span>
  </div>
);

const InfoPanel: React.FC<InfoPanelProps> = ({
  protons,
  neutrons,
  electrons,
  element,
  elementName,
  massNumber,
  ionState,
  isotopeState,
}) => {
  return (
    <div className="bg-slate-800 p-5 rounded-lg shadow-xl space-y-2">
      <div className="text-center mb-4">
        {element ? (
          <>
            <h2 className="text-5xl font-bold text-sky-400">{element.symbol}</h2>
            <p className="text-2xl text-slate-200">{element.name}</p>
          </>
        ) : (
          <>
            <h2 className="text-5xl font-bold text-slate-500">?</h2>
            <p className="text-2xl text-slate-400">{elementName}</p>
          </>
        )}
      </div>
      
      <InfoLine label="Número Atómico (Z)" value={protons > 0 ? protons : "N/D"} highlight={protons > 0} />
      <InfoLine label="Neutrones (N)" value={neutrons} />
      <InfoLine label="Electrones (e⁻)" value={electrons} />
      <InfoLine label="Número Másico (A)" value={protons > 0 || neutrons > 0 ? massNumber : "N/D"} highlight={protons > 0} />
      
      <div className="pt-2">
        <InfoLine label="Estado" value={ionState} highlight />
        <InfoLine label="Forma" value={isotopeState} highlight={isotopeState !== "N/D"} />
      </div>

      {element && (
        <div className="pt-3 mt-2 border-t border-slate-700">
          <h4 className="text-sm text-slate-400 mb-1">Configuración de {element.name} Neutro:</h4>
          <p className="text-xs text-amber-300 font-mono break-words">{element.fullElectronConfiguration}</p>
          <p className="text-xs text-amber-200 font-mono mt-1">Capas: {element.electronConfigurationShells}</p>
        </div>
      )}
      {protons === 0 && electrons > 0 && (
        <div className="pt-3 mt-2 border-t border-slate-700">
            <p className="text-sm text-slate-300">Esto es una colección de electrones libres, no un átomo típico.</p>
        </div>
      )}
       {protons === 0 && neutrons > 0 && electrons === 0 && (
        <div className="pt-3 mt-2 border-t border-slate-700">
            <p className="text-sm text-slate-300">Esto es una colección de neutrones. A veces llamado Neutronio en la ficción.</p>
        </div>
      )}
    </div>
  );
};

export default InfoPanel;