
import { Substance, SubstanceType, ZoneType } from './types';

export const INITIAL_SUBSTANCES: Omit<Substance, 'currentZone' | 'isCorrect'>[] = [
  { id: '1', name: 'Agua', formula: 'H₂O', type: SubstanceType.COMPOUND },
  { id: '2', name: 'Oxígeno', formula: 'O₂', type: SubstanceType.SIMPLE },
  { id: '3', name: 'Sal Común (Cloruro de Sodio)', formula: 'NaCl', type: SubstanceType.COMPOUND },
  { id: '4', name: 'Hierro', formula: 'Fe', type: SubstanceType.SIMPLE },
  { id: '5', name: 'Dióxido de Carbono', formula: 'CO₂', type: SubstanceType.COMPOUND },
  { id: '6', name: 'Helio', formula: 'He', type: SubstanceType.SIMPLE },
  { id: '7', name: 'Amoníaco', formula: 'NH₃', type: SubstanceType.COMPOUND },
  { id: '8', name: 'Nitrógeno', formula: 'N₂', type: SubstanceType.SIMPLE },
  { id: '9', name: 'Glucosa', formula: 'C₆H₁₂O₆', type: SubstanceType.COMPOUND },
  { id: '10', name: 'Oro', formula: 'Au', type: SubstanceType.SIMPLE },
  { id: '11', name: 'Ácido Sulfúrico', formula: 'H₂SO₄', type: SubstanceType.COMPOUND },
  { id: '12', name: 'Plata', formula: 'Ag', type: SubstanceType.SIMPLE },
  { id: '13', name: 'Metano', formula: 'CH₄', type: SubstanceType.COMPOUND },
  { id: '14', name: 'Cobre', formula: 'Cu', type: SubstanceType.SIMPLE },
  { id: '15', name: 'Cal Viva (Óxido de Calcio)', formula: 'CaO', type: SubstanceType.COMPOUND },
  { id: '16', name: 'Azufre', formula: 'S', type: SubstanceType.SIMPLE },
];
    