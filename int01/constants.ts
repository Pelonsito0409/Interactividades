
import { ExerciseData, UnitSymbol, Option, SlotSolution, ConversionStep } from './types';

// Helper to shuffle array
export function shuffleArray<T,>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const createSlot = (slotId: string, correctText: string, incorrectTexts: string[]): SlotSolution => {
  const correctOption: Option = { id: `${slotId}-correct`, text: correctText };
  const allOptions: Option[] = [
    correctOption,
    ...incorrectTexts.slice(0, 3).map((text, idx) => ({ id: `${slotId}-incorrect-${idx}`, text }))
  ];
  
  if (allOptions.length < 4 && incorrectTexts.length >= 3) {
     // This case should ideally not happen if incorrectTexts has at least 3 items.
     // Fill with placeholders if not enough unique incorrect options are provided.
     while(allOptions.length < 4) {
        allOptions.push({id: `${slotId}-placeholder-${allOptions.length}`, text: `Opción ${allOptions.length + 1}`});
     }
  }


  return {
    id: slotId,
    correctOptionId: correctOption.id,
    options: shuffleArray(allOptions),
  };
};

// Define incorrect options pools to ensure variety and correctness
const generalIncorrectOptions = ["10 m", "100 s", "10 km/h", "500 m", "0.5 h", "2000 s"];

const mToKmSteps = (exerciseId: string): ConversionStep[] => [
  {
    id: `${exerciseId}-step0`,
    numerator: createSlot(`${exerciseId}-step0-num`, "1 km", ["1000 m", "1 m", "10 km", ...generalIncorrectOptions]),
    denominator: createSlot(`${exerciseId}-step0-den`, "1000 m", ["1 km", "100 m", "1000 km", ...generalIncorrectOptions]),
  },
  {
    id: `${exerciseId}-step1`,
    numerator: createSlot(`${exerciseId}-step1-num`, "3600 s", ["1 h", "60 s", "1000 s", ...generalIncorrectOptions]),
    denominator: createSlot(`${exerciseId}-step1-den`, "1 h", ["3600 s", "60 m", "1 s", ...generalIncorrectOptions]),
  }
];

const kmToMSteps = (exerciseId: string): ConversionStep[] => [
  {
    id: `${exerciseId}-step0`,
    numerator: createSlot(`${exerciseId}-step0-num`, "1000 m", ["1 km", "100 m", "3600 m", ...generalIncorrectOptions]),
    denominator: createSlot(`${exerciseId}-step0-den`, "1 km", ["1000 m", "1 h", "100 km", ...generalIncorrectOptions]),
  },
  {
    id: `${exerciseId}-step1`,
    numerator: createSlot(`${exerciseId}-step1-num`, "1 h", ["3600 s", "1 s", "1000 h", ...generalIncorrectOptions]),
    denominator: createSlot(`${exerciseId}-step1-den`, "3600 s", ["1 h", "1 m", "60 s", ...generalIncorrectOptions]),
  }
];

export const EXERCISES: ExerciseData[] = [
  { id: "ex1", initialValue: 10, initialUnit: UnitSymbol.MetersPerSecond, targetUnit: UnitSymbol.KilometersPerHour, steps: mToKmSteps("ex1"), correctResultValue: 36 },
  { id: "ex2", initialValue: 72, initialUnit: UnitSymbol.KilometersPerHour, targetUnit: UnitSymbol.MetersPerSecond, steps: kmToMSteps("ex2"), correctResultValue: 20 },
  { id: "ex3", initialValue: 25, initialUnit: UnitSymbol.MetersPerSecond, targetUnit: UnitSymbol.KilometersPerHour, steps: mToKmSteps("ex3"), correctResultValue: 90 },
  { id: "ex4", initialValue: 18, initialUnit: UnitSymbol.KilometersPerHour, targetUnit: UnitSymbol.MetersPerSecond, steps: kmToMSteps("ex4"), correctResultValue: 5 },
  { id: "ex5", initialValue: 5, initialUnit: UnitSymbol.MetersPerSecond, targetUnit: UnitSymbol.KilometersPerHour, steps: mToKmSteps("ex5"), correctResultValue: 18 },
  { id: "ex6", initialValue: 90, initialUnit: UnitSymbol.KilometersPerHour, targetUnit: UnitSymbol.MetersPerSecond, steps: kmToMSteps("ex6"), correctResultValue: 25 },
  { id: "ex7", initialValue: 15, initialUnit: UnitSymbol.MetersPerSecond, targetUnit: UnitSymbol.KilometersPerHour, steps: mToKmSteps("ex7"), correctResultValue: 54 },
  { id: "ex8", initialValue: 54, initialUnit: UnitSymbol.KilometersPerHour, targetUnit: UnitSymbol.MetersPerSecond, steps: kmToMSteps("ex8"), correctResultValue: 15 },
  { id: "ex9", initialValue: 30, initialUnit: UnitSymbol.MetersPerSecond, targetUnit: UnitSymbol.KilometersPerHour, steps: mToKmSteps("ex9"), correctResultValue: 108 },
  { id: "ex10", initialValue: 3.6, initialUnit: UnitSymbol.KilometersPerHour, targetUnit: UnitSymbol.MetersPerSecond, steps: kmToMSteps("ex10"), correctResultValue: 1 },
];
    