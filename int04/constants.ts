import { Substance } from './types';

export const R_GAS_CONSTANT = 0.0821; // L·atm/(mol·K)

export const INITIAL_TEMPERATURE_K = 298.15; // 25°C
export const MIN_TEMPERATURE_K = 1; // Near absolute zero
export const MAX_TEMPERATURE_K = 1000; // High temperature limit
export const TEMPERATURE_STEP_K = 5; // How much K to change per tick

export const INITIAL_VOLUME_L = 10; // Liters
export const MIN_VOLUME_L = 1;
export const MAX_VOLUME_L = 25;

export const INITIAL_MOLES = 1;
export const MIN_MOLES = 0.1;
export const MAX_MOLES = 5;
export const MOLES_STEP = 0.1;

export const PARTICLES_PER_MOLE = 50; // Visual representation scaling
export const PARTICLE_RADIUS = 4;
export const PARTICLE_BASE_SPEED = 0.5; // Base speed at REFERENCE_TEMPERATURE_FOR_VELOCITY

export const REFERENCE_TEMPERATURE_FOR_VELOCITY = 273.15; // 0°C, velocities are defined relative to this

export const CONTAINER_MAX_DIM_PX = 450; // Max width/height of the visual container in pixels
export const CONTAINER_MIN_DIM_PX = 200; // Min width/height

export const PRESSURE_GAUGE_MAX_ATM = 410; // Max pressure for the gauge display
export const THERMOMETER_MAX_DISPLAY_K = MAX_TEMPERATURE_K;
export const THERMOMETER_MIN_DISPLAY_K = 0;


export const SUBSTANCES_LIST: Substance[] = [
  { id: 'N2', name: 'Nitrógeno', particleColor: '#3B82F6' }, // Blue
  { id: 'O2', name: 'Oxígeno', particleColor: '#EF4444' },   // Red
  { id: 'He', name: 'Helio', particleColor: '#FACC15' },   // Yellow
  { id: 'CO2', name: 'Dióxido de Carbono', particleColor: '#10B981' }, // Green
  { id: 'H2O', name: 'Vapor de Agua', particleColor: '#A78BFA' }, // Purple (vapor)
];

export const DEFAULT_SUBSTANCE_ID = 'N2';
