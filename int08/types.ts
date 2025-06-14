
export interface AtomState {
  protons: number;
  neutrons: number;
  electrons: number;
}

export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: number; // Standard atomic weight
  electronConfigurationShells: string; // e.g., "2, 8, 1" for neutral atom
  fullElectronConfiguration: string; // e.g., "1s² 2s² 2p⁶ 3s¹" for neutral atom
}

export interface VisualElectronShell {
  shellIndex: number;
  electronCount: number;
  radius: number;
  capacity: number;
}
    