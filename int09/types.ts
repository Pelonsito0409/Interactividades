export enum CompoundProperty {
  FORMULA = 'formula',
  SYSTEMATIC_PREFIXES = 'nameSystematicPrefixes',
  STOCK_ROMAN = 'nameStockRoman',
  EWENS_BASSETT = 'nameEwensBassett', // Replaces 'nameChargeArabic' for clarity, e.g., Cloruro de sodio(1+)
  TRADITIONAL = 'nameTraditional',
}

export interface CompoundNomenclature {
  id: string;
  type: string; // e.g., "Óxido", "Hidrácido"
  [CompoundProperty.FORMULA]: string;
  [CompoundProperty.SYSTEMATIC_PREFIXES]: string | null;
  [CompoundProperty.STOCK_ROMAN]: string | null;
  [CompoundProperty.EWENS_BASSETT]: string | null; // e.g. Óxido de hierro(2+), Cloruro de sodio(1+)
  [CompoundProperty.TRADITIONAL]: string | null;
}

export interface QuizEntry {
  compound: CompoundNomenclature;
  revealedPropertyKey: CompoundProperty;
  userAnswers: Record<string, string>; // Using string keys from CompoundProperty
  options: Record<string, string[]>; // Using string keys from CompoundProperty
}

export enum QuizState {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  FINISHED_ATTEMPT = 'FINISHED_ATTEMPT',
}

export interface FeedbackItem {
  isCorrect: boolean;
  correctAnswer: string | null;
}