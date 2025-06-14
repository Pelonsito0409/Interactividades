
export enum SeparationMethod {
  Filtracion = "Filtración",
  Decantacion = "Decantación",
  Centrifugacion = "Centrifugación",
  SeparacionMagnetica = "Separación Magnética",
  Cristalizacion = "Cristalización",
  Destilacion = "Destilación",
}

export interface MixtureChallengeItem {
  id: string;
  name: string;
  representation: string; // e.g., "Agua con Arena"
  components: string[]; // e.g., ["Agua", "Arena"]
  correctMethod: SeparationMethod;
  imageUrl?: string; // For a visual representation of the mixture
  description: string; // Description of the mixture
  processExplanation: string; // Explanation after successful separation
  incorrectMethodExplanations?: Partial<Record<SeparationMethod, string>>; // Reasons why other methods are wrong
}

export interface ToolItem {
  id: SeparationMethod; // Use SeparationMethod as ID for easy matching
  name:string;
  icon: React.ReactNode;
}

export interface ChallengeResult {
  correct: boolean;
  attempted: boolean;
  methodUsed?: SeparationMethod;
  hadPriorFailure: boolean; // True if there was at least one incorrect attempt on this mixture
}

export interface AppResults {
  challenge1: Record<string, ChallengeResult>;
  // challenge2 and challenge3 results removed
}

export enum GameStage {
  Intro,
  Challenge1,
  // Challenge2, Challenge3 removed
  Summary,
}