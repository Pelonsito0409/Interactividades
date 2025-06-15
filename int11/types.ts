
export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
  group: number;
  period: number;
  shells: number[]; // e.g., [2, 8, 1] for Sodium
  valenceElectrons: number;
  elementType: 'metal' | 'nonmetal' | 'metalloid'; // Simplified for bonding
  color: string; // Tailwind bg color class
  textColor?: string; // Tailwind text color class, defaults to white/black based on bg
}

export enum BondType {
  IONIC = 'Iónico',
  COVALENT = 'Covalente',
  METALLIC = 'Metálico',
}

export interface CompoundProperties {
  description: string;
  stateAtRoomTemp: string;
  meltingPoint: string;
  conductivity: string;
  solubility: string;
  example?: string;
}

export interface BondExplanation {
  type: BondType;
  generalDescription: string;
  electronInteraction: string;
  properties: CompoundProperties;
}

export interface ElectronShell {
  radius: number;
  electronCount: number;
}
    