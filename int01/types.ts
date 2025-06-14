
export enum UnitSymbol {
  MetersPerSecond = 'm/s',
  KilometersPerHour = 'km/h',
  Meters = 'm',
  Kilometers = 'km',
  Seconds = 's',
  Hours = 'h',
}

export interface Option {
  id: string; // Unique within its slot's options list
  text: string; // e.g., "1 km", "1000 m"
}

export interface SlotSolution {
  id: string; // Unique identifier for this slot, e.g., "ex1-step0-num"
  correctOptionId: string;
  options: Option[]; // Shuffled list of 4 options
}

export interface ConversionStep {
  id: string; // e.g., "ex1-step0"
  numerator: SlotSolution;
  denominator: SlotSolution;
}

export interface ExerciseData {
  id: string; // e.g., "ex1"
  initialValue: number;
  initialUnit: UnitSymbol.MetersPerSecond | UnitSymbol.KilometersPerHour;
  targetUnit: UnitSymbol.KilometersPerHour | UnitSymbol.MetersPerSecond;
  steps: ConversionStep[];
  // The conceptual final answer if calculation was performed, not directly used for scoring fractions
  correctResultValue: number; 
}

export type UserAnswers = Record<string, string | null>; // SlotSolution.id -> Option.id (selected by user)
