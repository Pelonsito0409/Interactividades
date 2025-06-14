
import React, { useState, useCallback, useMemo } from 'react';
import { Substance, SubstanceType, ZoneType } from './types';
import { INITIAL_SUBSTANCES } from './constants';
import DropArea from './components/DropArea';

const App: React.FC = () => {
  const initialSubstancesWithState = useMemo(() => 
    INITIAL_SUBSTANCES.map(s => ({ ...s, currentZone: ZoneType.UNCLASSIFIED, isCorrect: undefined })),
    []
  );

  const [substances, setSubstances] = useState<Substance[]>(initialSubstancesWithState);
  const [draggedItem, setDraggedItem] = useState<Substance | null>(null);
  const [draggingOverZone, setDraggingOverZone] = useState<ZoneType | null>(null);

  const handleDragStart = useCallback((event: React.DragEvent<HTMLDivElement>, item: Substance) => {
    setDraggedItem(item);
    event.dataTransfer.effectAllowed = 'move';
     // Setting data is useful for inter-app drag/drop, but not strictly needed here if state handles it
    event.dataTransfer.setData('text/plain', item.id);
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>, zoneType: ZoneType) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    if (draggingOverZone !== zoneType) {
      setDraggingOverZone(zoneType);
    }
  }, [draggingOverZone]);

  const handleDragLeaveZone = useCallback(() => {
    setDraggingOverZone(null);
  }, []);

  const handleDrop = useCallback((targetZone: ZoneType) => {
    if (!draggedItem) return;

    setSubstances(prevSubstances =>
      prevSubstances.map(sub => {
        if (sub.id === draggedItem.id) {
          let correctness: boolean | undefined = undefined;
          if (targetZone === ZoneType.SIMPLE) {
            correctness = sub.type === SubstanceType.SIMPLE;
          } else if (targetZone === ZoneType.COMPOUND) {
            correctness = sub.type === SubstanceType.COMPOUND;
          }
          // If moving back to unclassified, or from one classified zone to another
          return { ...sub, currentZone: targetZone, isCorrect: correctness };
        }
        return sub;
      })
    );
    setDraggedItem(null);
    setDraggingOverZone(null);
  }, [draggedItem]);

  const handleReset = useCallback(() => {
    setSubstances(initialSubstancesWithState);
    setDraggedItem(null);
    setDraggingOverZone(null);
  }, [initialSubstancesWithState]);

  const unclassified = useMemo(() => substances.filter(s => s.currentZone === ZoneType.UNCLASSIFIED), [substances]);
  const simple = useMemo(() => substances.filter(s => s.currentZone === ZoneType.SIMPLE), [substances]);
  const compound = useMemo(() => substances.filter(s => s.currentZone === ZoneType.COMPOUND), [substances]);
  
  const allCorrect = useMemo(() => {
    if (unclassified.length > 0) return false; // Not all classified yet
    return substances.every(s => s.currentZone === ZoneType.UNCLASSIFIED || s.isCorrect === true);
  }, [substances, unclassified.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-indigo-700 to-purple-800 text-white p-4 sm:p-6 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-5xl text-center mb-6 md:mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-2">Clasificador de Sustancias</h1>
        <p className="text-base sm:text-lg text-sky-200">
          Arrastra cada sustancia a su categoría correcta: Simple o Compuesta.
        </p>
      </header>

      <main className="w-full max-w-5xl flex flex-col gap-6 md:gap-8">
        <div 
          onDragLeave={handleDragLeaveZone} 
          className="w-full"
        >
          <DropArea
            title="Sustancias para Clasificar"
            zoneType={ZoneType.UNCLASSIFIED}
            substances={unclassified}
            onDropItem={handleDrop}
            onDragOverItem={(e) => handleDragOver(e, ZoneType.UNCLASSIFIED)}
            onDragStartCard={handleDragStart}
            isDragOver={draggingOverZone === ZoneType.UNCLASSIFIED}
            draggedItemId={draggedItem?.id || null}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full" onDragLeave={handleDragLeaveZone}>
          <DropArea
            title="Sustancias Simples"
            zoneType={ZoneType.SIMPLE}
            substances={simple}
            onDropItem={handleDrop}
            onDragOverItem={(e) => handleDragOver(e, ZoneType.SIMPLE)}
            onDragStartCard={handleDragStart}
            isDragOver={draggingOverZone === ZoneType.SIMPLE}
            draggedItemId={draggedItem?.id || null}
          />
          <DropArea
            title="Sustancias Compuestas"
            zoneType={ZoneType.COMPOUND}
            substances={compound}
            onDropItem={handleDrop}
            onDragOverItem={(e) => handleDragOver(e, ZoneType.COMPOUND)}
            onDragStartCard={handleDragStart}
            isDragOver={draggingOverZone === ZoneType.COMPOUND}
            draggedItemId={draggedItem?.id || null}
          />
        </div>
         {unclassified.length === 0 && (
          <div className="mt-6 text-center w-full">
            {allCorrect ? (
              <p className="text-2xl font-semibold text-green-300 bg-green-700/50 p-4 rounded-lg">¡Felicidades! Todas las sustancias están clasificadas correctamente.</p>
            ) : (
              <p className="text-xl text-yellow-300 bg-yellow-700/50 p-4 rounded-lg">Casi listo... Revisa las sustancias marcadas en rojo.</p>
            )}
          </div>
        )}
        <div className="mt-6 md:mt-8 text-center w-full">
          <button
            onClick={handleReset}
            className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-8 rounded-lg shadow-xl transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-opacity-75"
          >
            Reiniciar Juego
          </button>
        </div>
      </main>
      <footer className="mt-auto pt-8 text-center text-sky-300 text-sm">
        <p>&copy; {new Date().getFullYear()} Experimento de Química Interactivo</p>
      </footer>
    </div>
  );
};

export default App;
    