import React from 'react';
import { Substance, ZoneType } from '../types';
import SubstanceCard from './SubstanceCard';

interface DropAreaProps {
  title: string;
  zoneType: ZoneType;
  substances: Substance[];
  onDropItem: (zoneType: ZoneType) => void;
  onDragOverItem: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragStartCard: (event: React.DragEvent<HTMLDivElement>, item: Substance) => void;
  isDragOver: boolean;
  draggedItemId: string | null;
}

const DropArea: React.FC<DropAreaProps> = ({ 
  title, 
  zoneType, 
  substances, 
  onDropItem, 
  onDragOverItem, 
  onDragStartCard,
  isDragOver,
  draggedItemId
}) => {
  const baseClasses = "p-4 md:p-6 rounded-xl shadow-2xl flex-1 flex flex-col min-h-[250px] md:min-h-[300px] transition-all duration-200 ease-in-out";
  const unclassifiedSpecificClasses = zoneType === ZoneType.UNCLASSIFIED ? 
    "bg-slate-700/50 backdrop-blur-sm border-2 border-slate-600" : 
    "bg-slate-800/60 backdrop-blur-md border-2";
  
  const dragOverClasses = isDragOver ? 
    (zoneType === ZoneType.UNCLASSIFIED ? "border-sky-400 ring-2 ring-sky-400" : "border-indigo-400 ring-2 ring-indigo-400") : 
    (zoneType === ZoneType.UNCLASSIFIED ? "border-slate-600" : "border-slate-700");

  const substanceListContainerClasses = () => {
    let classes = "gap-2 overflow-y-auto pr-1 ";
    if (zoneType === ZoneType.UNCLASSIFIED) {
      classes += "flex flex-row flex-wrap justify-center";
    } else {
      // For SIMPLE and COMPOUND zones, use a 2-column grid
      classes += "grid grid-cols-2 items-start"; // items-start to align cards to the top of their cell
    }
    return classes;
  };

  return (
    <div
      onDrop={() => onDropItem(zoneType)}
      onDragOver={onDragOverItem}
      className={`${baseClasses} ${unclassifiedSpecificClasses} ${dragOverClasses}`}
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center text-white tracking-tight">{title}</h2>
      {substances.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-slate-400 italic text-center">
            {zoneType === ZoneType.UNCLASSIFIED ? "Todas las sustancias clasificadas." : `Arrastra aquí las sustancias ${title.toLowerCase().includes('simples') ? 'simples' : 'compuestas'}.`}
          </p>
        </div>
      ) : (
        <div className={substanceListContainerClasses()}>
          {substances.map((sub) => (
            <SubstanceCard 
              key={sub.id} 
              substance={sub} 
              onDragStart={onDragStartCard}
              isBeingDragged={draggedItemId === sub.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DropArea;