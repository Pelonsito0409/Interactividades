
import { CompoundProperty } from './types';

export const COLUMN_HEADERS: Record<CompoundProperty, string> = {
  [CompoundProperty.FORMULA]: 'Compuesto (Fórmula)',
  [CompoundProperty.SYSTEMATIC_PREFIXES]: 'N. Sistemática (Prefijos)',
  [CompoundProperty.STOCK_ROMAN]: 'N. Stock (Nº Ox. Romano)',
  [CompoundProperty.EWENS_BASSETT]: 'N. Ewens-Bassett (Carga)', // Updated header
  [CompoundProperty.TRADITIONAL]: 'N. Tradicional',
};

export const ORDERED_COLUMN_KEYS: CompoundProperty[] = [
  CompoundProperty.FORMULA,
  CompoundProperty.SYSTEMATIC_PREFIXES,
  CompoundProperty.STOCK_ROMAN,
  CompoundProperty.EWENS_BASSETT,
  CompoundProperty.TRADITIONAL,
];

export const QUIZ_SIZE = 5;
export const OPTIONS_PER_QUESTION = 4;

// Gemini API Model Names (example, not directly used in this app's core logic but good for structure)
export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash-preview-04-17';
export const GEMINI_IMAGE_MODEL = 'imagen-3.0-generate-002';

export const NOT_APPLICABLE_TEXT = "N/A";
