export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number; // Base velocity x at reference temperature
  vy: number; // Base velocity y at reference temperature
  radius: number;
  color: string;
}

export interface Substance {
  id: string;
  name: string;
  particleColor: string; // Hex color string
  molarMass?: number; // kg/mol, optional, not used in current physics model but good for extension
}

export enum TemperatureControlStatus {
  NEUTRAL = 'NEUTRAL',
  HEATING = 'HEATING',
  COOLING = 'COOLING',
}

export type VariableKey = 'temperatureK' | 'volumeL' | 'moles' | 'pressureAtm';
