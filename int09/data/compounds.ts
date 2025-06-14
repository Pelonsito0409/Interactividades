
import { CompoundNomenclature, CompoundProperty } from '../types';

export const compoundsData: CompoundNomenclature[] = [
  // Óxidos
  {
    id: 'ox-1', type: 'Óxido Metálico',
    [CompoundProperty.FORMULA]: 'Fe₂O₃',
    [CompoundProperty.SYSTEMATIC_PREFIXES]: 'Trióxido de dihierro',
    [CompoundProperty.STOCK_ROMAN]: 'Óxido de hierro(III)',
    [CompoundProperty.EWENS_BASSETT]: 'Óxido de hierro(3+)',
    [CompoundProperty.TRADITIONAL]: 'Óxido férrico',
  },
  {
    id: 'ox-2', type: 'Óxido Metálico',
    [CompoundProperty.FORMULA]: 'CuO',
    [CompoundProperty.SYSTEMATIC_PREFIXES]: 'Monóxido de cobre',
    [CompoundProperty.STOCK_ROMAN]: 'Óxido de cobre(II)',
    [CompoundProperty.EWENS_BASSETT]: 'Óxido de cobre(2+)',
    [CompoundProperty.TRADITIONAL]: 'Óxido cúprico',
  },
  {
    id: 'ox-3', type: 'Óxido No Metálico (Anhídrido)',
    [CompoundProperty.FORMULA]: 'SO₃',
    [CompoundProperty.SYSTEMATIC_PREFIXES]: 'Trióxido de azufre',
    [CompoundProperty.STOCK_ROMAN]: 'Óxido de azufre(VI)',
    [CompoundProperty.EWENS_BASSETT]: 'Óxido de azufre(6+)',
    [CompoundProperty.TRADITIONAL]: 'Anhídrido sulfúrico',
  },
  {
    id: 'ox-4', type: 'Óxido No Metálico (Anhídrido)',
    [CompoundProperty.FORMULA]: 'Cl₂O₅',
    [CompoundProperty.SYSTEMATIC_PREFIXES]: 'Pentaóxido de dicloro',
    [CompoundProperty.STOCK_ROMAN]: 'Óxido de cloro(V)',
    [CompoundProperty.EWENS_BASSETT]: 'Óxido de cloro(5+)',
    [CompoundProperty.TRADITIONAL]: 'Anhídrido clórico',
  },
  // Peróxidos
  {
    id: 'perox-1', type: 'Peróxido',
    [CompoundProperty.FORMULA]: 'H₂O₂',
    [CompoundProperty.SYSTEMATIC_PREFIXES]: 'Peróxido de dihidrógeno', // IUPAC more common 'Peróxido de hidrógeno'
    [CompoundProperty.STOCK_ROMAN]: 'Peróxido de hidrógeno', // No Roman numeral for H
    [CompoundProperty.EWENS_BASSETT]: 'Peróxido de hidrógeno', // No charge typically shown for H in this way
    [CompoundProperty.TRADITIONAL]: 'Agua oxigenada',
  },
  {
    id: 'perox-2', type: 'Peróxido',
    [CompoundProperty.FORMULA]: 'Na₂O₂',
    [CompoundProperty.SYSTEMATIC_PREFIXES]: 'Peróxido de disodio',
    [CompoundProperty.STOCK_ROMAN]: 'Peróxido de sodio',
    [CompoundProperty.EWENS_BASSETT]: 'Peróxido de sodio(1+)', // Referring to Na ion
    [CompoundProperty.TRADITIONAL]: 'Peróxido sódico',
  },
  // Hidruros Metálicos
  {
    id: 'hm-1', type: 'Hidruro Metálico',
    [CompoundProperty.FORMULA]: 'NaH',
    [CompoundProperty.SYSTEMATIC_PREFIXES]: 'Monohidruro de sodio',
    [CompoundProperty.STOCK_ROMAN]: 'Hidruro de sodio',
    [CompoundProperty.EWENS_BASSETT]: 'Hidruro de sodio(1+)',
    [CompoundProperty.TRADITIONAL]: 'Hidruro sódico',
  },
  {
    id: 'hm-2', type: 'Hidruro Metálico',
    [CompoundProperty.FORMULA]: 'CaH₂',
    [CompoundProperty.SYSTEMATIC_PREFIXES]: 'Dihidruro de calcio',
    [CompoundProperty.STOCK_ROMAN]: 'Hidruro de calcio(II)',
    [CompoundProperty.EWENS_BASSETT]: 'Hidruro de calcio(2+)',
    [CompoundProperty.TRADITIONAL]: 'Hidruro cálcico',
  },
  // Hidrácidos (Haluros de Hidrógeno)
  {
    id: 'hidrac-1', type: 'Hidrácido',
    [CompoundProperty.FORMULA]: 'HCl', // Often implies (aq) for acid name
    [CompoundProperty.SYSTEMATIC_PREFIXES]: 'Cloruro de hidrógeno', // As gas or pure substance
    [CompoundProperty.STOCK_ROMAN]: 'Cloruro de hidrógeno', // Stock similar for these
    [CompoundProperty.EWENS_BASSETT]: 'Cloruro de hidrógeno', // Ewens-Bassett may not apply well to covalent molecules in this context
    [CompoundProperty.TRADITIONAL]: 'Ácido clorhídrico', // In aqueous solution
  },
  {
    id: 'hidrac-2', type: 'Hidrácido',
    [CompoundProperty.FORMULA]: 'H₂S', // Often implies (aq) for acid name
    [CompoundProperty.SYSTEMATIC_PREFIXES]: 'Sulfuro de dihidrógeno', // As gas or pure substance
    [CompoundProperty.STOCK_ROMAN]: 'Sulfuro de hidrógeno',
    [CompoundProperty.EWENS_BASSETT]: 'Sulfuro de hidrógeno',
    [CompoundProperty.TRADITIONAL]: 'Ácido sulfhídrico', // In aqueous solution
  },
  // Hidruros Volátiles (No metálicos)
  {
    id: 'hv-1', type: 'Hidruro Volátil',
    [CompoundProperty.FORMULA]: 'NH₃',
    [CompoundProperty.SYSTEMATIC_PREFIXES]: 'Trihidruro de nitrógeno',
    [CompoundProperty.STOCK_ROMAN]: 'Amoniaco', // Common name accepted by IUPAC, Stock not typical
    [CompoundProperty.EWENS_BASSETT]: 'Amoniaco',
    [CompoundProperty.TRADITIONAL]: 'Amoniaco',
  },
  {
    id: 'hv-2', type: 'Hidruro Volátil',
    [CompoundProperty.FORMULA]: 'CH₄',
    [CompoundProperty.SYSTEMATIC_PREFIXES]: 'Tetrahidruro de carbono',
    [CompoundProperty.STOCK_ROMAN]: 'Metano', // Common name accepted by IUPAC
    [CompoundProperty.EWENS_BASSETT]: 'Metano',
    [CompoundProperty.TRADITIONAL]: 'Metano',
  },
  // Sales Binarias
  {
    id: 'sb-1', type: 'Sal Binaria',
    [CompoundProperty.FORMULA]: 'NaCl',
    [CompoundProperty.SYSTEMATIC_PREFIXES]: 'Cloruro de sodio', // Mono- prefix usually omitted
    [CompoundProperty.STOCK_ROMAN]: 'Cloruro de sodio', // Stock number usually omitted for Group 1
    [CompoundProperty.EWENS_BASSETT]: 'Cloruro de sodio(1+)',
    [CompoundProperty.TRADITIONAL]: 'Sal común', // Or Cloruro sódico
  },
  {
    id: 'sb-2', type: 'Sal Binaria',
    [CompoundProperty.FORMULA]: 'FeCl₃',
    [CompoundProperty.SYSTEMATIC_PREFIXES]: 'Tricloruro de hierro',
    [CompoundProperty.STOCK_ROMAN]: 'Cloruro de hierro(III)',
    [CompoundProperty.EWENS_BASSETT]: 'Cloruro de hierro(3+)',
    [CompoundProperty.TRADITIONAL]: 'Cloruro férrico',
  },
  // Hidróxidos
  {
    id: 'hidrox-1', type: 'Hidróxido',
    [CompoundProperty.FORMULA]: 'NaOH',
    [CompoundProperty.SYSTEMATIC_PREFIXES]: 'Hidróxido de sodio',
    [CompoundProperty.STOCK_ROMAN]: 'Hidróxido de sodio',
    [CompoundProperty.EWENS_BASSETT]: 'Hidróxido de sodio(1+)',
    [CompoundProperty.TRADITIONAL]: 'Hidróxido sódico', // Sosa cáustica is common name
  },
  {
    id: 'hidrox-2', type: 'Hidróxido',
    [CompoundProperty.FORMULA]: 'Al(OH)₃',
    [CompoundProperty.SYSTEMATIC_PREFIXES]: 'Trihidróxido de aluminio',
    [CompoundProperty.STOCK_ROMAN]: 'Hidróxido de aluminio(III)',
    [CompoundProperty.EWENS_BASSETT]: 'Hidróxido de aluminio(3+)',
    [CompoundProperty.TRADITIONAL]: 'Hidróxido alumínico',
  },
  // Oxoácidos
  {
    id: 'oxoac-1', type: 'Oxoácido',
    [CompoundProperty.FORMULA]: 'H₂SO₄',
    [CompoundProperty.SYSTEMATIC_PREFIXES]: 'Ácido tetraoxosulfúrico(VI)', // IUPAC hydrogen nomenclature
    [CompoundProperty.STOCK_ROMAN]: 'Ácido sulfúrico', // Traditional name is often used as Stock
    [CompoundProperty.EWENS_BASSETT]: 'Ácido sulfúrico', // Ewens-Bassett less common for acids
    [CompoundProperty.TRADITIONAL]: 'Ácido sulfúrico',
  },
  {
    id: 'oxoac-2', type: 'Oxoácido',
    [CompoundProperty.FORMULA]: 'HNO₃',
    [CompoundProperty.SYSTEMATIC_PREFIXES]: 'Ácido trioxonítrico(V)',
    [CompoundProperty.STOCK_ROMAN]: 'Ácido nítrico',
    [CompoundProperty.EWENS_BASSETT]: 'Ácido nítrico',
    [CompoundProperty.TRADITIONAL]: 'Ácido nítrico',
  },
   {
    id: 'ox-5', type: 'Óxido Metálico',
    [CompoundProperty.FORMULA]: 'PbO₂',
    [CompoundProperty.SYSTEMATIC_PREFIXES]: 'Dióxido de plomo',
    [CompoundProperty.STOCK_ROMAN]: 'Óxido de plomo(IV)',
    [CompoundProperty.EWENS_BASSETT]: 'Óxido de plomo(4+)',
    [CompoundProperty.TRADITIONAL]: 'Óxido plúmbico',
  },
  {
    id: 'sb-3', type: 'Sal Binaria',
    [CompoundProperty.FORMULA]: 'Al₂S₃',
    [CompoundProperty.SYSTEMATIC_PREFIXES]: 'Trisulfuro de dialuminio',
    [CompoundProperty.STOCK_ROMAN]: 'Sulfuro de aluminio(III)',
    [CompoundProperty.EWENS_BASSETT]: 'Sulfuro de aluminio(3+)',
    [CompoundProperty.TRADITIONAL]: 'Sulfuro alumínico',
  }
  // Add more compounds to reach at least 40 if desired for wider variety
];
