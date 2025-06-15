
import React, { useState, useCallback, useEffect } from 'react';
import { ElementData, BondType, CompoundProperties } from './types';
import { ELEMENTS_DATA, BOND_EXPLANATIONS } from './constants';
import PeriodicTable from './components/PeriodicTable';
import AtomView, { AtomAnimationState } from './components/AtomView';
// BondingAnimation import removed
import ResultsDisplay from './components/ResultsDisplay';
import Button from './components/Button';
import InfoCard from './components/InfoCard';

const App: React.FC = () => {
  const [selectedElement1, setSelectedElement1] = useState<ElementData | null>(null);
  const [selectedElement2, setSelectedElement2] = useState<ElementData | null>(null);
  const [formedBondType, setFormedBondType] = useState<BondType | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [compoundProperties, setCompoundProperties] = useState<CompoundProperties | null>(null);
  // showAnimation state removed
  const [currentMessage, setCurrentMessage] = useState<string>("Selecciona dos elementos de la tabla periódica.");

  const [el1DisplayState, setEl1DisplayState] = useState<AtomAnimationState>(null);
  const [el2DisplayState, setEl2DisplayState] = useState<AtomAnimationState>(null);


  const handleElementSelect = useCallback((element: ElementData) => {
    setFormedBondType(null);
    setCompoundProperties(null);
    setEl1DisplayState(null);
    setEl2DisplayState(null);

    if (!selectedElement1) {
      setSelectedElement1(element);
      setCurrentMessage(`Elemento 1: ${element.name}. Selecciona el segundo elemento.`);
    } else if (!selectedElement2 && element.atomicNumber !== selectedElement1.atomicNumber) {
      setSelectedElement2(element);
      setCurrentMessage(`Elemento 1: ${selectedElement1.name}, Elemento 2: ${element.name}. ¡Listo para combinar!`);
    } else if (selectedElement1 && element.atomicNumber === selectedElement1.atomicNumber) {
      if (selectedElement2) { 
        setSelectedElement1(element);
        setSelectedElement2(null);
        setCurrentMessage(`Elemento 1: ${element.name}. Selecciona el segundo elemento.`);
      } else { 
        setSelectedElement1(null);
        setCurrentMessage("Selecciona dos elementos de la tabla periódica.");
      }
    } else { 
      setSelectedElement1(element);
      setSelectedElement2(null);
      setCurrentMessage(`Elemento 1: ${element.name}. Selecciona el segundo elemento.`);
    }
  }, [selectedElement1, selectedElement2]);

  const determineBondType = useCallback((el1: ElementData, el2: ElementData): BondType => {
    const type1 = el1.elementType;
    const type2 = el2.elementType;

    const isMetal1 = type1 === 'metal';
    const isNonmetal1 = type1 === 'nonmetal';
    const isMetalloid1 = type1 === 'metalloid';

    const isMetal2 = type2 === 'metal';
    const isNonmetal2 = type2 === 'nonmetal';
    const isMetalloid2 = type2 === 'metalloid';

    if ((isMetal1 && isNonmetal2) || (isNonmetal1 && isMetal2)) {
        return BondType.IONIC;
    }
    if (isNonmetal1 && isNonmetal2) {
        return BondType.COVALENT;
    }
    if (isMetal1 && isMetal2) {
        return BondType.METALLIC;
    }
    if ((isMetalloid1 && isNonmetal2) || (isNonmetal1 && isMetalloid2)) {
        return BondType.COVALENT;
    }
    if ((isMetalloid1 && isMetal2) || (isMetal1 && isMetalloid2)) {
        // Consistent with Metal + Nonmetal forming Ionic, metalloids can act like nonmetals here with active metals
        // Or like metals with active nonmetals. Simplified: Metal + Metalloid -> Ionic, Metalloid + Nonmetal -> Covalent
        return BondType.IONIC; 
    }
    if (isMetalloid1 && isMetalloid2) {
        return BondType.COVALENT;
    }
    
    console.warn(`Unhandled element type combination in determineBondType: ${type1}, ${type2}. Defaulting to COVALENT.`);
    return BondType.COVALENT;
  }, []);

  const handleCombine = useCallback(() => {
    if (selectedElement1 && selectedElement2) {
      const bond = determineBondType(selectedElement1, selectedElement2);
      setFormedBondType(bond);
      setCompoundProperties(BOND_EXPLANATIONS[bond].properties);
      setCurrentMessage(`Enlace ${bond.toLowerCase()} formado entre ${selectedElement1.name} y ${selectedElement2.name}.`);

      if (bond === BondType.IONIC) {
        const el1IsDonor = selectedElement1.elementType === 'metal' || (selectedElement1.elementType === 'metalloid' && selectedElement2.elementType === 'nonmetal');
        const el2IsDonor = selectedElement2.elementType === 'metal' || (selectedElement2.elementType === 'metalloid' && selectedElement1.elementType === 'nonmetal');

        if (el1IsDonor && !el2IsDonor) {
            setEl1DisplayState('ion-positive');
            setEl2DisplayState('ion-negative');
        } else if (el2IsDonor && !el1IsDonor) {
            setEl1DisplayState('ion-negative');
            setEl2DisplayState('ion-positive');
        } else { // Default or complex cases (e.g. two metalloids forming ionic - less common or specific rules apply)
            setEl1DisplayState('idle');
            setEl2DisplayState('idle');
        }
      } else if (bond === BondType.COVALENT) {
        setEl1DisplayState('sharing');
        setEl2DisplayState('sharing');
      } else if (bond === BondType.METALLIC) {
        setEl1DisplayState('delocalized');
        setEl2DisplayState('delocalized');
      }
    }
  }, [selectedElement1, selectedElement2, determineBondType]);

  const handleReset = useCallback(() => {
    setSelectedElement1(null);
    setSelectedElement2(null);
    setFormedBondType(null);
    setCompoundProperties(null);
    setEl1DisplayState(null);
    setEl2DisplayState(null);
    setCurrentMessage("Selecciona dos elementos de la tabla periódica.");
  }, []);
  
   useEffect(() => {
    if (!selectedElement1 && !selectedElement2) {
      setCurrentMessage("Selecciona dos elementos de la tabla periódica.");
    } else if (selectedElement1 && !selectedElement2) {
       setCurrentMessage(`Elemento 1: ${selectedElement1.name}. Selecciona el segundo elemento.`);
    }
  }, [selectedElement1, selectedElement2]);


  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 space-y-8 bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-pink-500 mb-2">
          Laboratorio Virtual de Enlaces Químicos
        </h1>
        <p className="text-slate-400 text-sm md:text-base">
          Explora cómo los átomos se unen para formar el mundo que nos rodea.
        </p>
      </header>

      <main className="w-full max-w-7xl space-y-6">
        <PeriodicTable
          elements={ELEMENTS_DATA}
          onElementSelect={handleElementSelect}
          selectedSymbols={[selectedElement1?.symbol, selectedElement2?.symbol].filter(Boolean) as string[]}
        />

        <InfoCard className="text-center !py-3">
          <p className="text-sky-300 font-medium">{currentMessage}</p>
        </InfoCard>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          <InfoCard title="Átomos Seleccionados" className="min-h-[250px]">
            {(!selectedElement1 && !selectedElement2) && <p className="text-slate-500 text-center py-10">Ningún elemento seleccionado.</p>}
            <div className="flex justify-around items-center">
              {selectedElement1 && <AtomView element={selectedElement1} animationState={el1DisplayState} />}
              {selectedElement2 && <AtomView element={selectedElement2} animationState={el2DisplayState} />}
            </div>
          </InfoCard>

          <div className="space-y-4">
            <Button
              onClick={handleCombine}
              disabled={!selectedElement1 || !selectedElement2 || !!formedBondType}
              className="w-full pulse-animation disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none"
              size="lg"
            >
              ¡Combinar Elementos!
            </Button>
            <Button onClick={handleReset} variant="secondary" className="w-full" size="md">
              Reiniciar Selección
            </Button>
          </div>
        </div>
        
        {/* BondingAnimation and its InfoCard wrapper removed */}

        {formedBondType && ( 
             <ResultsDisplay 
                bondType={formedBondType} 
                element1={selectedElement1} 
                element2={selectedElement2}
             />
        )}
      </main>

      <footer className="text-center text-slate-500 text-sm mt-8">
        <p>&copy; {new Date().getFullYear()} Simulación Educativa de Química. Creado con React y Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;
