
import { AtomState, ElementData, VisualElectronShell } from '../types';
import { ELEMENTS_DATA, MAX_PROTONS_DEFINED } from '../constants/elements';

export const getElementByProtons = (protons: number): ElementData | undefined => {
  if (protons <= 0 || protons > MAX_PROTONS_DEFINED) {
    return undefined;
  }
  return ELEMENTS_DATA.find(el => el.atomicNumber === protons);
};

export const getMassNumber = (protons: number, neutrons: number): number => {
  return protons + neutrons;
};

export const getIonState = (protons: number, electrons: number): string => {
  if (protons === 0 && electrons === 0) return "N/D";
  if (protons === 0 && electrons > 0) return `Nube de Electrones (${electrons}e⁻)`;
  
  const charge = protons - electrons;
  if (charge === 0) return "Átomo Neutro";
  if (charge > 0) return `Catión (+${charge})`;
  return `Anión (${charge})`;
};

export const getIsotopeState = (protons: number, neutrons: number, element: ElementData | undefined): string => {
  if (!element || protons === 0) return "N/D";

  const commonNeutrons = Math.round(element.atomicMass) - element.atomicNumber;
  
  if (element.atomicNumber === 1 && commonNeutrons < 0) { 
     if (neutrons === 0) return `Forma común (Protio ¹H)`;
     if (neutrons === 1) return `Isótopo (Deuterio ²H)`;
     if (neutrons === 2) return `Isótopo (Tritio ³H)`;
     return `Isótopo de ${element.name}`;
  }

  if (neutrons === commonNeutrons) {
    return `Forma común de ${element.name}`;
  }
  return `Isótopo de ${element.name}`;
};

export const calculateVisualElectronShells = (electrons: number): VisualElectronShell[] => {
  const shells: VisualElectronShell[] = [];
  let remainingElectrons = electrons;
  
  const visualShellCapacities = [2, 8, 18, 32, 50, 50]; // Added one more visual layer for larger atoms
  const baseRadius = 45; 
  const radiusIncrement = 35; 

  for (let i = 0; i < visualShellCapacities.length && remainingElectrons > 0; i++) {
    const capacity = visualShellCapacities[i];
    const electronsInShell = Math.min(remainingElectrons, capacity);
    shells.push({
      shellIndex: i + 1,
      electronCount: electronsInShell,
      radius: baseRadius + i * radiusIncrement,
      capacity: capacity
    });
    remainingElectrons -= electronsInShell;
  }
  
  if (remainingElectrons > 0 && shells.length > 0) { // Add any overflow to the last shell if it exists
     shells[shells.length-1].electronCount += remainingElectrons;
  } else if (remainingElectrons > 0 && shells.length === 0 && electrons > 0) { // Extremely rare case: many electrons, no shells somehow (e.g. if visualShellCapacities was empty)
     shells.push({
       shellIndex: 1,
       electronCount: remainingElectrons,
       radius: baseRadius,
       capacity: remainingElectrons
     });
  }
  return shells;
};

export const getElementName = (protons: number, element: ElementData | undefined): string => {
    if (protons === 0) return "Vacío";
    if (element) return element.name;
    if (protons > 0 && protons <= MAX_PROTONS_DEFINED) return `Elemento Z=${protons}`; 
    if (protons > MAX_PROTONS_DEFINED) return `Más allá del Elemento ${MAX_PROTONS_DEFINED} (Z=${protons})`;
    return "Estado Inválido";
};

export const getAtomStability = (protons: number, neutrons: number, element: ElementData | undefined): string => {
  if (protons === 0) return "N/D";
  if (!element) return "Desconocido (Define Elemento)";

  // Specific known cases
  if (protons === 1) { // Hydrogen
    if (neutrons === 0) return "Estable (Protio)";
    if (neutrons === 1) return "Estable (Deuterio)";
    if (neutrons === 2) return "Inestable (Tritio, Radiactivo)";
    return "Isótopo Inestable";
  }
  if (protons === 2) { // Helium
    if (neutrons === 1) return "Estable (Helio-3)";
    if (neutrons === 2) return "Estable (Helio-4)";
    return "Isótopo Inestable";
  }
  if (protons === 6 && neutrons === 8) return "Inestable (Carbono-14, Radiactivo)"; // Carbon-14
  if (protons === 19 && neutrons === 21) return "Radiactivo (Potasio-40, Larga vida)";


  if (element.atomicNumber === 43) return "Inestable (Tecnecio, Todos los Isótopos Radiactivos)";

  const commonNeutrons = Math.round(element.atomicMass) - element.atomicNumber;

  if (neutrons === commonNeutrons) return `Probablemente Estable (Isótopo común de ${element.symbol})`;
  
  // General stability range (simplified "belt of stability" idea)
  let stabilityRange = 1; // Default for very light elements
  if (protons > 8 && protons <= 20) stabilityRange = 2; // e.g. Calcium
  else if (protons > 20 && protons <= 50) stabilityRange = 3 + Math.floor((protons - 20)/10); // Wider range for heavier elements
  

  if (Math.abs(neutrons - commonNeutrons) <= stabilityRange) {
    // Check for neutron-deficient or neutron-rich within the wider band
    if (neutrons < commonNeutrons -1 ) return "Probablemente Estable (Deficiente en Neutrones)"; // -1 to avoid overlap with commonNeutrons +/-1
    if (neutrons > commonNeutrons +1 ) return "Probablemente Estable (Rico en Neutrones)";
    return "Probablemente Estable";
  }
  
  if (neutrons < commonNeutrons - stabilityRange) return "Probablemente Inestable (Muy Pocos Neutrones)";
  if (neutrons > commonNeutrons + stabilityRange) return "Probablemente Inestable (Demasiados Neutrones)";
  
  return "Probablemente Inestable"; // General fallback
};