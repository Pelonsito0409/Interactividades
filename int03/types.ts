
export enum Phase {
  Solid = 'Sólido',
  Melting = 'Fusión',
  Liquid = 'Líquido',
  Boiling = 'Ebullición',
  Gas = 'Gaseoso',
  Ionizing = 'Ionización', // Gas to Plasma transition
  Plasma = 'Plasma',
}

export interface SubstanceFractions {
  solid: number; // 0 to 1
  liquid: number; // 0 to 1
  gas: number;   // 0 to 1
  plasma: number; // 0 to 1
}

export interface SubstanceState {
  temperature: number;
  phase: Phase;
  totalEnergy: number; // Energy relative to referenceInitialSolidTemp as Solid
  fractions: SubstanceFractions;
}

export interface GraphDataPoint {
  time: number; // seconds
  temperature: number; // °C
}

export interface SubstanceDefinition {
  name: string;
  // Temperature of the solid state where totalEnergy is considered 0 for this substance.
  referenceInitialSolidTemp: number; 
  // Actual temperature the simulation starts/resets to for this substance.
  simStartTemp: number; 
  minSimTemp: number; // Min temperature for simulation bounds
  maxSimTemp: number; // Max temperature for simulation bounds

  meltingPoint: number; // °C
  boilingPoint: number; // °C
  plasmaPoint?: number; // °C, optional

  mass: number; // grams

  specificHeatSolid: number;    // J/g°C
  specificHeatLiquid: number;   // J/g°C
  specificHeatGas: number;      // J/g°C
  specificHeatPlasma?: number; // J/g°C, optional

  latentHeatFusion: number;       // J/g
  latentHeatVaporization: number; // J/g
  latentHeatIonization?: number; // J/g, optional

  heatStepModifier?: number; // Optional multiplier for HEAT_STEP (e.g., 0.1 for 10x slower heating)
}