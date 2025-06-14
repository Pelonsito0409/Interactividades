
export enum SubstanceType {
  SIMPLE = 'SIMPLE',
  COMPOUND = 'COMPOUND',
}

export enum ZoneType {
  UNCLASSIFIED = 'UNCLASSIFIED',
  SIMPLE = 'SIMPLE_ZONE', // Ensure enum values are distinct strings
  COMPOUND = 'COMPOUND_ZONE',
}

export interface Substance {
  id: string;
  name: string;
  formula?: string; // Optional chemical formula
  type: SubstanceType; // The true nature of the substance
  currentZone: ZoneType;
  isCorrect?: boolean; // Set after being dropped: true if currentZone classification matches type
}
    