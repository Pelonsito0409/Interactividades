
import React from 'react';
import { EnergyType, EnergyDefinition, Scenario, TransformationExample, QuizQuestion } from './types';

// SVG Icons for Energy Types
const KineticIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4 12l6-6v4h8v4h-8v4l-6-6zm16 0l-3-3v2h-4v2h4v2l3-3z"/></svg>
);
const PotentialIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L6 8h3v9h6V8h3L12 2zm-2 16v3h4v-3H10z"/></svg>
);
const ElectricalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M7 2v11h3v9l7-12h-4l4-8H7z"/></svg>
);
const ThermalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 0c-3.076 3.076-3.076 8.064 0 11.14C15.076 8.064 15.076 3.076 12 0zm0 4c-1.185 1.185-1.185 3.104 0 4.288C13.185 7.104 13.185 5.185 12 4zm5.657 7.071c-1.552.613-3.104 1.226-4.243 1.768-1.424.693-2.848 1.386-3.535 2.121-.708.707-1.401 2.131-2.122 3.535C7.071 20.046 5.607 24 5.607 24c4.896 0 8.064-3.076 11.14-6.152.694-1.424 1.387-2.848 2.122-3.535.707-.708 2.131-1.401 3.535-2.122.542-1.139 1.155-2.691 1.768-4.243C24.393 7.071 20.929.001 12 .001S-.001 7.071.001 12c.001 3.197 2.015 5.922 4.243 7.071zM10 18c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm4 0c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"/></svg>
);
const ChemicalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V5zM7 12h2v2H7v-2zm8 0h2v2h-2v-2z"/></svg>
);
const NuclearIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-4.5-8.5c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm5 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm-2.5 4c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"/></svg>
);
const RadiantIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 4c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 14c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6zm1-7h-2V6h2v5zm0 1v5h-2v-5h2zM6.343 7.757l1.414-1.414 3.536 3.536-1.414 1.414-3.536-3.536zm10.099 8.785l1.414-1.414 3.536 3.536-1.414 1.414-3.536-3.536zm-8.685.001l-1.414-1.414-3.536 3.535 1.414 1.414 3.536-3.535zm10.099-8.784l-1.414-1.414-3.536 3.536 1.414 1.414 3.536-3.536z"/></svg>
);


export const ENERGY_DEFINITIONS: EnergyDefinition[] = [
  { type: EnergyType.MECHANICAL_KINETIC, name: 'Energía Cinética', description: 'La energía del movimiento. Cuanto más rápido se mueve un objeto o más masa tiene, más energía cinética posee.', icon: <KineticIcon className="w-6 h-6 inline-block mr-2" />, color: 'bg-sky-500' },
  { type: EnergyType.MECHANICAL_POTENTIAL, name: 'Energía Potencial', description: 'Energía almacenada debido a la posición o configuración de un objeto. Por ejemplo, un objeto en altura tiene energía potencial gravitatoria.', icon: <PotentialIcon className="w-6 h-6 inline-block mr-2" />, color: 'bg-green-500' },
  { type: EnergyType.ELECTRICAL, name: 'Energía Eléctrica', description: 'La energía asociada con el flujo de carga eléctrica (electrones). Es la que usamos para alimentar la mayoría de nuestros dispositivos.', icon: <ElectricalIcon className="w-6 h-6 inline-block mr-2" />, color: 'bg-yellow-400' },
  { type: EnergyType.THERMAL, name: 'Energía Térmica', description: 'La energía asociada con la temperatura de un objeto, relacionada con el movimiento aleatorio de sus átomos y moléculas. Comúnmente conocida como calor.', icon: <ThermalIcon className="w-6 h-6 inline-block mr-2" />, color: 'bg-red-500' },
  { type: EnergyType.CHEMICAL, name: 'Energía Química', description: 'Energía almacenada en los enlaces químicos entre átomos y moléculas. Se libera durante las reacciones químicas, como en la combustión o en las baterías.', icon: <ChemicalIcon className="w-6 h-6 inline-block mr-2" />, color: 'bg-purple-500' },
  { type: EnergyType.NUCLEAR, name: 'Energía Nuclear', description: 'Energía almacenada en el núcleo de los átomos. Se puede liberar mediante reacciones nucleares como la fisión (división de núcleos) o la fusión (unión de núcleos).', icon: <NuclearIcon className="w-6 h-6 inline-block mr-2" />, color: 'bg-indigo-500' },
  { type: EnergyType.RADIANT, name: 'Energía Radiante', description: 'Energía que viaja en forma de ondas electromagnéticas, como la luz visible, los rayos X, las ondas de radio o el sonido (que viaja como ondas mecánicas).', icon: <RadiantIcon className="w-6 h-6 inline-block mr-2" />, color: 'bg-pink-500' },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 'car-rolling-down-hill',
    title: 'Coche Rodando por una Colina',
    description: 'Un coche, inicialmente en reposo en la cima de una colina, comienza a rodar cuesta abajo por efecto de la gravedad. Considera las transformaciones de energía desde que empieza a moverse hasta que, idealmente, se detiene al final de la pendiente.',
    imageUrl: 'https://picsum.photos/seed/carhill/600/300',
    presentEnergyTypes: [EnergyType.MECHANICAL_POTENTIAL, EnergyType.MECHANICAL_KINETIC, EnergyType.THERMAL],
    explanation: 'Al inicio, en la cima y en reposo, el coche posee energía potencial gravitatoria máxima (relativa al pie de la colina) y energía cinética nula. A medida que desciende, la energía potencial se transforma en energía cinética (movimiento). Durante este proceso, la fricción con el aire y las ruedas, y los frenos si se usan para detenerse al final, convierten parte de la energía mecánica en energía térmica. Si el coche se detiene al pie de la colina, su energía cinética final es cero, y la energía potencial inicial se habrá transformado principalmente en energía térmica.'
  },
  {
    id: 'oven-pizza',
    title: 'Horno Calentando una Pizza',
    description: 'Un horno eléctrico se enciende para cocinar una pizza.',
    imageUrl: 'https://picsum.photos/seed/ovenpizza/600/300',
    presentEnergyTypes: [EnergyType.ELECTRICAL, EnergyType.THERMAL, EnergyType.RADIANT],
    explanation: 'El horno utiliza energía eléctrica, que se transforma en energía térmica en las resistencias. Esta energía térmica se transfiere a la pizza por conducción, convección y también por radiación (infrarroja).'
  },
  {
    id: 'singer',
    title: 'Cantante Actuando',
    description: 'Una persona canta en un escenario.',
    imageUrl: 'https://picsum.photos/seed/singerstage/600/300',
    presentEnergyTypes: [EnergyType.CHEMICAL, EnergyType.MECHANICAL_KINETIC, EnergyType.RADIANT],
    explanation: 'La cantante utiliza energía química almacenada en su cuerpo. Esta se convierte en energía cinética (movimiento de las cuerdas vocales, diafragma) que produce ondas sonoras, una forma de energía radiante (o mecánica transmitida por un medio).'
  },
  {
    id: 'nuclear-plant',
    title: 'Central Nuclear',
    description: 'Una central nuclear generando electricidad.',
    imageUrl: 'https://picsum.photos/seed/nuclearplant/600/300',
    presentEnergyTypes: [EnergyType.NUCLEAR, EnergyType.THERMAL, EnergyType.MECHANICAL_KINETIC, EnergyType.ELECTRICAL],
    explanation: 'En una central nuclear, la energía nuclear se libera como energía térmica (calor) mediante la fisión. Este calor hierve agua, generando vapor que mueve turbinas (energía cinética). Las turbinas accionan generadores que producen energía eléctrica.'
  },
];

export const TRANSFORMATION_EXAMPLES: TransformationExample[] = [
  {
    id: 'chem-kin',
    title: 'Química a Cinética y Térmica (Correr)',
    from: EnergyType.CHEMICAL,
    to: [EnergyType.MECHANICAL_KINETIC, EnergyType.THERMAL],
    description: 'Al correr, tu cuerpo convierte la energía química de los alimentos en energía cinética (movimiento) y energía térmica (calor corporal).',
    imageUrl: 'https://picsum.photos/seed/runner/400/200'
  },
  {
    id: 'elec-light-heat',
    title: 'Eléctrica a Radiante y Térmica (Bombilla)',
    from: EnergyType.ELECTRICAL,
    to: [EnergyType.RADIANT, EnergyType.THERMAL],
    description: 'Una bombilla incandescente convierte la energía eléctrica en energía radiante (luz) y una cantidad significativa de energía térmica (calor).',
    imageUrl: 'https://picsum.photos/seed/lightbulb/400/200'
  },
  {
    id: 'potential-kinetic',
    title: 'Potencial a Cinética (Caída Libre)',
    from: EnergyType.MECHANICAL_POTENTIAL,
    to: [EnergyType.MECHANICAL_KINETIC, EnergyType.THERMAL],
    description: 'Un objeto que cae convierte su energía potencial gravitatoria en energía cinética. Parte se pierde como calor por la fricción del aire.',
    imageUrl: 'https://picsum.photos/seed/freefall/400/200'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    questionText: '¿Qué tipo de energía posee principalmente un pájaro volando?',
    options: [
      { id: 'a', text: 'Potencial y Química' },
      { id: 'b', text: 'Cinética y Química' },
      { id: 'c', text: 'Solo Térmica' },
      { id: 'd', text: 'Nuclear' }
    ],
    correctOptionId: 'b',
    explanation: 'Un pájaro volando tiene energía cinética por su movimiento y energía química almacenada en su cuerpo para potenciar ese movimiento. También tiene potencial si está a cierta altura.'
  },
  {
    id: 'q2',
    questionText: 'En una fogata, la madera (energía química) se transforma principalmente en:',
    options: [
      { id: 'a', text: 'Energía Eléctrica y Cinética' },
      { id: 'b', text: 'Energía Nuclear y Potencial' },
      { id: 'c', text: 'Energía Térmica y Radiante (luz)' },
      { id: 'd', text: 'Solo Energía Cinética' }
    ],
    correctOptionId: 'c',
    explanation: 'La combustión de la madera libera energía química como calor (térmica) y luz (radiante).'
  },
  {
    id: 'q3',
    questionText: 'El principio de conservación de la energía establece que:',
    options: [
      { id: 'a', text: 'La energía puede crearse pero no destruirse.' },
      { id: 'b', text: 'La energía puede destruirse pero no crearse.' },
      { id: 'c', text: 'La energía no se crea ni se destruye, solo se transforma.' },
      { id: 'd', text: 'Algunos tipos de energía pueden desaparecer por completo.' }
    ],
    correctOptionId: 'c',
    explanation: 'Este es el pilar fundamental: la cantidad total de energía en un sistema aislado permanece constante, aunque cambie de forma.'
  }
];

export const getEnergyDefinition = (type: EnergyType): EnergyDefinition | undefined => {
  return ENERGY_DEFINITIONS.find(def => def.type === type);
};
