
import { SubstanceDefinition } from './types';

// Simulation parameters (can be adjusted)
export const HEAT_STEP = 2000; // Joules per interval tick for continuous heating/cooling (base value)
export const SIMULATION_INTERVAL_MS = 200; // Milliseconds between simulation steps
export const TEMP_EPSILON = 0.01; // For comparing floating point temperatures

export const SUBSTANCES: SubstanceDefinition[] = [
  {
    name: 'Agua',
    referenceInitialSolidTemp: -20,
    simStartTemp: -20,
    minSimTemp: -50,
    maxSimTemp: 150,
    meltingPoint: 0,
    boilingPoint: 100,
    mass: 100,
    specificHeatSolid: 2.09,
    specificHeatLiquid: 4.18,
    specificHeatGas: 2.01,
    latentHeatFusion: 334,
    latentHeatVaporization: 2260,
  },
  {
    name: 'Etanol',
    referenceInitialSolidTemp: -130,
    simStartTemp: -130,
    minSimTemp: -150,
    maxSimTemp: 100,
    meltingPoint: -114,
    boilingPoint: 78.37,
    mass: 100,
    specificHeatSolid: 1.2, 
    specificHeatLiquid: 2.44,
    specificHeatGas: 1.88, 
    latentHeatFusion: 109,
    latentHeatVaporization: 841,
  },
  {
    name: 'Oro',
    referenceInitialSolidTemp: 20,
    simStartTemp: 20,
    minSimTemp: 0,
    maxSimTemp: 3000,
    meltingPoint: 1064,
    boilingPoint: 2856,
    mass: 100,
    specificHeatSolid: 0.129,
    specificHeatLiquid: 0.148, 
    specificHeatGas: 0.126, // Using Cv for monatomic gas approx.
    latentHeatFusion: 63.7,
    latentHeatVaporization: 1645,
  },
  {
    name: 'Oxígeno',
    referenceInitialSolidTemp: -230,
    simStartTemp: -230, // Starts as solid
    minSimTemp: -250,
    maxSimTemp: -150,
    meltingPoint: -218.79,
    boilingPoint: -182.95,
    mass: 100,
    specificHeatSolid: 1.57, 
    specificHeatLiquid: 1.67,
    specificHeatGas: 0.658, // Cv for O2
    latentHeatFusion: 13.9,
    latentHeatVaporization: 213,
    heatStepModifier: 0.1, // Reduce heat step for better observability
  },
  {
    name: 'Argón',
    referenceInitialSolidTemp: -200,
    simStartTemp: -200, // Starts as solid
    minSimTemp: -220,
    maxSimTemp: 15000, // High enough for plasma
    meltingPoint: -189.3,
    boilingPoint: -185.8,
    plasmaPoint: 12000, // Approximate ionization temperature
    mass: 100,
    specificHeatSolid: 0.65,
    specificHeatLiquid: 1.06, 
    specificHeatGas: 0.312, // Cv for monatomic Ar = (3/2 R) / MolarMass
    specificHeatPlasma: 0.5, // Approximation for ionized plasma
    latentHeatFusion: 29.6,
    latentHeatVaporization: 163,
    latentHeatIonization: 3000, // Ballpark figure for demo
    heatStepModifier: 0.2, // Reduce heat step for better observability of initial transitions
  },
];