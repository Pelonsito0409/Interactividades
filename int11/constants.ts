import { ElementData, BondType, BondExplanation } from './types';

export const ELEMENTS_DATA: ElementData[] = [
  // Period 1
  { atomicNumber: 1, symbol: 'H', name: 'Hidrógeno', group: 1, period: 1, shells: [1], valenceElectrons: 1, elementType: 'nonmetal', color: 'bg-pink-400', textColor: 'text-black' },
  { atomicNumber: 2, symbol: 'He', name: 'Helio', group: 18, period: 1, shells: [2], valenceElectrons: 2, elementType: 'nonmetal', color: 'bg-indigo-300', textColor: 'text-black' }, // Noble gas
  // Period 2
  { atomicNumber: 3, symbol: 'Li', name: 'Litio', group: 1, period: 2, shells: [2, 1], valenceElectrons: 1, elementType: 'metal', color: 'bg-orange-500' },
  { atomicNumber: 4, symbol: 'Be', name: 'Berilio', group: 2, period: 2, shells: [2, 2], valenceElectrons: 2, elementType: 'metal', color: 'bg-orange-400' },
  { atomicNumber: 5, symbol: 'B', name: 'Boro', group: 13, period: 2, shells: [2, 3], valenceElectrons: 3, elementType: 'metalloid', color: 'bg-lime-400', textColor: 'text-black' },
  { atomicNumber: 6, symbol: 'C', name: 'Carbono', group: 14, period: 2, shells: [2, 4], valenceElectrons: 4, elementType: 'nonmetal', color: 'bg-gray-500' },
  { atomicNumber: 7, symbol: 'N', name: 'Nitrógeno', group: 15, period: 2, shells: [2, 5], valenceElectrons: 5, elementType: 'nonmetal', color: 'bg-blue-400', textColor: 'text-black' },
  { atomicNumber: 8, symbol: 'O', name: 'Oxígeno', group: 16, period: 2, shells: [2, 6], valenceElectrons: 6, elementType: 'nonmetal', color: 'bg-red-500' },
  { atomicNumber: 9, symbol: 'F', name: 'Flúor', group: 17, period: 2, shells: [2, 7], valenceElectrons: 7, elementType: 'nonmetal', color: 'bg-green-400', textColor: 'text-black' },
  { atomicNumber: 10, symbol: 'Ne', name: 'Neón', group: 18, period: 2, shells: [2, 8], valenceElectrons: 8, elementType: 'nonmetal', color: 'bg-indigo-400' }, // Noble gas
  // Period 3
  { atomicNumber: 11, symbol: 'Na', name: 'Sodio', group: 1, period: 3, shells: [2, 8, 1], valenceElectrons: 1, elementType: 'metal', color: 'bg-yellow-500', textColor: 'text-black' },
  { atomicNumber: 12, symbol: 'Mg', name: 'Magnesio', group: 2, period: 3, shells: [2, 8, 2], valenceElectrons: 2, elementType: 'metal', color: 'bg-yellow-400', textColor: 'text-black' },
  { atomicNumber: 13, symbol: 'Al', name: 'Aluminio', group: 13, period: 3, shells: [2, 8, 3], valenceElectrons: 3, elementType: 'metal', color: 'bg-slate-400' },
  { atomicNumber: 14, symbol: 'Si', name: 'Silicio', group: 14, period: 3, shells: [2, 8, 4], valenceElectrons: 4, elementType: 'metalloid', color: 'bg-purple-400' },
  { atomicNumber: 15, symbol: 'P', name: 'Fósforo', group: 15, period: 3, shells: [2, 8, 5], valenceElectrons: 5, elementType: 'nonmetal', color: 'bg-orange-300', textColor: 'text-black' },
  { atomicNumber: 16, symbol: 'S', name: 'Azufre', group: 16, period: 3, shells: [2, 8, 6], valenceElectrons: 6, elementType: 'nonmetal', color: 'bg-yellow-300', textColor: 'text-black' },
  { atomicNumber: 17, symbol: 'Cl', name: 'Cloro', group: 17, period: 3, shells: [2, 8, 7], valenceElectrons: 7, elementType: 'nonmetal', color: 'bg-teal-400', textColor: 'text-black' },
  { atomicNumber: 18, symbol: 'Ar', name: 'Argón', group: 18, period: 3, shells: [2, 8, 8], valenceElectrons: 8, elementType: 'nonmetal', color: 'bg-indigo-500' }, // Noble gas
  // Period 4
  { atomicNumber: 19, symbol: 'K', name: 'Potasio', group: 1, period: 4, shells: [2, 8, 8, 1], valenceElectrons: 1, elementType: 'metal', color: 'bg-red-400' },
  { atomicNumber: 20, symbol: 'Ca', name: 'Calcio', group: 2, period: 4, shells: [2, 8, 8, 2], valenceElectrons: 2, elementType: 'metal', color: 'bg-green-500' },
  { atomicNumber: 21, symbol: 'Sc', name: 'Escandio', group: 3, period: 4, shells: [2, 8, 9, 2], valenceElectrons: 2, elementType: 'metal', color: 'bg-cyan-500' },
  { atomicNumber: 22, symbol: 'Ti', name: 'Titanio', group: 4, period: 4, shells: [2, 8, 10, 2], valenceElectrons: 2, elementType: 'metal', color: 'bg-slate-500' },
  { atomicNumber: 23, symbol: 'V', name: 'Vanadio', group: 5, period: 4, shells: [2, 8, 11, 2], valenceElectrons: 2, elementType: 'metal', color: 'bg-neutral-500' },
  { atomicNumber: 24, symbol: 'Cr', name: 'Cromo', group: 6, period: 4, shells: [2, 8, 13, 1], valenceElectrons: 1, elementType: 'metal', color: 'bg-stone-500' },
  { atomicNumber: 25, symbol: 'Mn', name: 'Manganeso', group: 7, period: 4, shells: [2, 8, 13, 2], valenceElectrons: 2, elementType: 'metal', color: 'bg-rose-500' },
  { atomicNumber: 26, symbol: 'Fe', name: 'Hierro', group: 8, period: 4, shells: [2, 8, 14, 2], valenceElectrons: 2, elementType: 'metal', color: 'bg-zinc-600' },
  { atomicNumber: 27, symbol: 'Co', name: 'Cobalto', group: 9, period: 4, shells: [2, 8, 15, 2], valenceElectrons: 2, elementType: 'metal', color: 'bg-sky-700' },
  { atomicNumber: 28, symbol: 'Ni', name: 'Níquel', group: 10, period: 4, shells: [2, 8, 16, 2], valenceElectrons: 2, elementType: 'metal', color: 'bg-teal-600' },
  { atomicNumber: 29, symbol: 'Cu', name: 'Cobre', group: 11, period: 4, shells: [2, 8, 18, 1], valenceElectrons: 1, elementType: 'metal', color: 'bg-orange-600' },
  { atomicNumber: 30, symbol: 'Zn', name: 'Zinc', group: 12, period: 4, shells: [2, 8, 18, 2], valenceElectrons: 2, elementType: 'metal', color: 'bg-gray-300', textColor: 'text-black' },
  { atomicNumber: 31, symbol: 'Ga', name: 'Galio', group: 13, period: 4, shells: [2, 8, 18, 3], valenceElectrons: 3, elementType: 'metal', color: 'bg-purple-600' },
  { atomicNumber: 32, symbol: 'Ge', name: 'Germanio', group: 14, period: 4, shells: [2, 8, 18, 4], valenceElectrons: 4, elementType: 'metalloid', color: 'bg-purple-500'},
  { atomicNumber: 33, symbol: 'As', name: 'Arsénico', group: 15, period: 4, shells: [2, 8, 18, 5], valenceElectrons: 5, elementType: 'metalloid', color: 'bg-gray-400', textColor: 'text-black'},
  { atomicNumber: 34, symbol: 'Se', name: 'Selenio', group: 16, period: 4, shells: [2, 8, 18, 6], valenceElectrons: 6, elementType: 'nonmetal', color: 'bg-blue-300', textColor: 'text-black'},
  { atomicNumber: 35, symbol: 'Br', name: 'Bromo', group: 17, period: 4, shells: [2, 8, 18, 7], valenceElectrons: 7, elementType: 'nonmetal', color: 'bg-red-600'},
  { atomicNumber: 36, symbol: 'Kr', name: 'Kriptón', group: 18, period: 4, shells: [2, 8, 18, 8], valenceElectrons: 8, elementType: 'nonmetal', color: 'bg-indigo-600'}, // Noble gas
];

export const MAX_PERIOD = 4; // Stays as 4, as we've completed elements within this period range
export const MAX_GROUP = 18; // Standard groups for layout

export const BOND_EXPLANATIONS: Record<BondType, BondExplanation> = {
  [BondType.IONIC]: {
    type: BondType.IONIC,
    generalDescription: "Un enlace iónico se forma típicamente entre un metal y un no metal. Los metales tienden a perder electrones para formar iones positivos (cationes), mientras que los no metales tienden a ganar electrones para formar iones negativos (aniones).",
    electronInteraction: "Transferencia de electrones: El átomo metálico transfiere uno o más electrones de valencia al átomo no metálico. La atracción electrostática entre los iones de carga opuesta resultante mantiene unido el compuesto.",
    properties: {
      description: "Los compuestos iónicos forman estructuras cristalinas rígidas.",
      stateAtRoomTemp: "Sólido",
      meltingPoint: "Alto",
      conductivity: "Conduce electricidad cuando está fundido o disuelto en agua; no conduce en estado sólido.",
      solubility: "Generalmente soluble en disolventes polares como el agua.",
      example: "NaCl (Sal de mesa), KBr (Bromuro de potasio)"
    }
  },
  [BondType.COVALENT]: {
    type: BondType.COVALENT,
    generalDescription: "Un enlace covalente se forma típicamente entre dos átomos no metálicos. Estos átomos tienen electronegatividades similares y tienden a compartir electrones en lugar de transferirlos completamente.",
    electronInteraction: "Compartición de pares de electrones: Los átomos comparten uno o más pares de electrones de valencia. Cada átomo 'cuenta' los electrones compartidos como parte de su propia capa de valencia, ayudando a alcanzar una configuración electrónica estable (generalmente un octeto).",
    properties: {
      description: "Los compuestos covalentes forman moléculas discretas o estructuras de red covalente.",
      stateAtRoomTemp: "Puede ser sólido, líquido o gas.",
      meltingPoint: "Generalmente bajo a moderado (para moléculas); muy alto (para redes covalentes).",
      conductivity: "Generalmente no conduce electricidad.",
      solubility: "Variable; 'semejante disuelve a semejante' (polares en polares, apolares en apolares).",
      example: "H₂O (Agua), CH₄ (Metano), CO₂ (Dióxido de carbono)"
    }
  },
  [BondType.METALLIC]: {
    type: BondType.METALLIC,
    generalDescription: "Un enlace metálico se forma entre átomos de metales. Los átomos metálicos tienen pocos electrones de valencia y baja electronegatividad, lo que les permite deslocalizar estos electrones.",
    electronInteraction: "Mar de electrones: Los electrones de valencia se deslocalizan de sus átomos individuales y forman un 'mar' de electrones que se mueve libremente a través de una red de cationes metálicos. Esta movilidad electrónica es responsable de muchas propiedades metálicas.",
    properties: {
      description: "Los metales forman estructuras cristalinas donde los electrones de valencia están deslocalizados.",
      stateAtRoomTemp: "Sólido (excepto el mercurio).",
      meltingPoint: "Variable, generalmente de moderado a alto.",
      conductivity: "Excelente conductor de electricidad y calor en estado sólido y líquido.",
      solubility: "Generalmente insoluble en la mayoría de los disolventes (pueden reaccionar o formar aleaciones).",
      example: "Fe (Hierro), Cu (Cobre), Al (Aluminio)"
    }
  }
};