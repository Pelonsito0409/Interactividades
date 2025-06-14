
import React from 'react';
import { MixtureChallengeItem, ToolItem, SeparationMethod } from './types';

// SVG Icons (simple representations) - These remain as they are used in Challenge 1
export const FilterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12" {...props}>
    <path d="M12 3L4 9V11H20V9L12 3ZM6 13V20C6 20.5523 6.44772 21 7 21H17C17.5523 21 18 20.5523 18 20V13H6Z" />
  </svg>
);

export const DecanterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12" {...props}>
    <path d="M5 3C4.44772 3 4 3.44772 4 4V10C4 10.3916 4.22686 10.7248 4.56948 10.8906L11 14.436V20C11 20.5523 11.4477 21 12 21C12.5523 21 13 20.5523 13 20V14.436L19.4305 10.8906C19.7731 10.7248 20 10.3916 20 10V4C20 3.44772 19.5523 3 19 3H5Z" />
  </svg>
);

export const CentrifugeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12" {...props}>
    <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM11 6H13V11L16.5 12.5L15.5 14.2L11 12.5V6Z" transform="rotate(45 12 12)" />
  </svg>
);

// Updated Magnet Icon (Bar Magnet)
export const MagnetIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12" {...props}>
    <path d="M4 7C4 5.89543 4.89543 5 6 5H18C19.1046 5 20 5.89543 20 7V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V7Z" />
    <rect x="4" y="7" width="5" height="10" fill="#EF4444" /> {/* Red pole */}
    <rect x="15" y="7" width="5" height="10" fill="#3B82F6" /> {/* Blue pole - using Tailwind colors */}
  </svg>
);

// Updated Distillation Icon
export const AlembicIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12" {...props}>
    {/* Flask body */}
    <path d="M12 2C8.68629 2 6 4.68629 6 8V15C6 17.3857 7.40388 19.4077 9.5 20.3478V21.5C9.5 21.7761 9.72386 22 10 22H14C14.2761 22 14.5 21.7761 14.5 21.5V20.3478C16.5961 19.4077 18 17.3857 18 15V8C18 4.68629 15.3137 2 12 2ZM12 4C14.2091 4 16 5.79086 16 8V14H8V8C8 5.79086 9.79086 4 12 4Z"/>
    {/* Condenser arm */}
    <path d="M16 8H20C20.5523 8 21 8.44772 21 9V12C21 12.5523 20.5523 13 20 13H18"/>
    {/* Drop */}
    <circle cx="19.5" cy="15.5" r="1.5" fill="skyblue"/>
  </svg>
);

export const CrystalDishIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12" {...props}>
    <path d="M3 7C3 5.34315 4.34315 4 6 4H18C19.6569 4 21 5.34315 21 7V8H3V7ZM3 10H21V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V10Z" />
  </svg>
);

export const MIXTURES_DATA: MixtureChallengeItem[] = [
  {
    id: "agua_sal", name: "Agua con Sal", representation: "💧🧂 Agua con Sal Disuelta", components: ["Agua", "Sal"], correctMethod: SeparationMethod.Cristalizacion, description: "Una solución homogénea de sal en agua.", processExplanation: "Has usado Cristalización. Al evaporar el agua, la sal (soluto) queda como cristales sólidos ya que su punto de ebullición es mucho mayor que el del agua (disolvente). Esto no cambia la naturaleza química de la sal ni del agua.", imageUrl: "https://static.ideal.es/www/multimedia/201806/05/media/cortadas/agua-sal-klCI-U502135893100zPD-624x385@Ideal.jpg",
    incorrectMethodExplanations: {
      [SeparationMethod.Filtracion]: "La sal está disuelta en el agua. Sus partículas son demasiado pequeñas y pasarán a través del filtro.",
      [SeparationMethod.Decantacion]: "Es una mezcla homogénea (solución), no forma capas separadas que puedan decantarse.",
      [SeparationMethod.SeparacionMagnetica]: "Ni la sal ni el agua son atraídas por un imán.",
      [SeparationMethod.Destilacion]: "Aunque separaría el agua, la cristalización es más directa para obtener la sal sólida.",
      [SeparationMethod.Centrifugacion]: "La sal está disuelta; no hay partículas suspendidas de diferente densidad para sedimentar fácilmente.",
    }
  },
  {
    id: "aceite_agua", name: "Aceite y Agua", representation: "💧🛢️ Aceite flotando sobre Agua", components: ["Aceite", "Agua"], correctMethod: SeparationMethod.Decantacion, description: "Una mezcla heterogénea de dos líquidos inmiscibles.", processExplanation: "Has usado Decantación. Como el aceite es menos densso que el agua y no se mezclan, forman capas separadas. El líquido menos denso (aceite) se puede verter cuidadosamente o separar con un embudo de decantación.", imageUrl: "https://d17umfmk0e27oh.cloudfront.net/articulos/articulos-556810.jpg",
    incorrectMethodExplanations: {
      [SeparationMethod.Filtracion]: "Ambos son líquidos y pasarían a través de un filtro estándar.",
      [SeparationMethod.Cristalizacion]: "No hay un sólido disuelto para cristalizar aquí.",
      [SeparationMethod.SeparacionMagnetica]: "Ni el aceite ni el agua son magnéticos.",
      [SeparationMethod.Destilacion]: "Si bien sus puntos de ebullición son diferentes, la decantación es mucho más simple para líquidos inmiscibles.",
      [SeparationMethod.Centrifugacion]: "La decantación simple suele ser suficiente; la centrifugación es más para emulsiones o separaciones difíciles.",
    }
  },
  {
    id: "arena_agua", name: "Arena y Agua", representation: "💧🏝️ Arena sedimentada en Agua", components: ["Arena", "Agua"], correctMethod: SeparationMethod.Filtracion, description: "Una mezcla heterogénea de un sólido insoluble en un líquido.", processExplanation: "Has usado Filtración. Las partículas de arena son más grandes que las moléculas de agua y los poros del filtro. El agua pasa a través del filtro, mientras que la arena queda retenida.", imageUrl: "https://media.istockphoto.com/id/1282757637/es/vector/mezcla-heterog%C3%A9nea-de-agua-y-arena-ejemplo-de-experiencia-en-la-escuela-de-ciencias.jpg?s=612x612&w=0&k=20&c=UheWKY_ocGwrVJpB_MDAHQ7l0Q-fkZvM3kdHX9X_RBw=",
    incorrectMethodExplanations: {
      [SeparationMethod.Decantacion]: "Se podría decantar parte del agua, pero la filtración es más completa para separar toda la arena.",
      [SeparationMethod.Cristalizacion]: "La arena no está disuelta; la cristalización es para sólidos disueltos.",
      [SeparationMethod.SeparacionMagnetica]: "La arena común (dióxido de silicio) no es magnética.",
      [SeparationMethod.Destilacion]: "Separaría el agua pura, pero la filtración es más directa y eficiente para separar el sólido insoluble.",
      [SeparationMethod.Centrifugacion]: "Acelera la sedimentación, pero la filtración es un método de separación más directo aquí.",
    }
  },
  {
    id: "hierro_arena", name: "Limaduras de Hierro y Arena", representation: "🧲🏝️ Polvo de Hierro y Arena", components: ["Limaduras de Hierro", "Arena"], correctMethod: SeparationMethod.SeparacionMagnetica, description: "Una mezcla heterogénea de un sólido magnético (hierro) y un sólido no magnético (arena).", processExplanation: "Has usado Separación Magnética. El hierro es un material ferromagnético y es atraído por el imán, mientras que la arena no lo es. Esto permite separarlos físicamente.", imageUrl: "https://quimicafacil.net/wp-content/uploads/2020/06/Separacion-hierro-azufre.jpg",
    incorrectMethodExplanations: {
      [SeparationMethod.Filtracion]: "Para una mezcla seca como esta, la separación magnética es más directa. La filtración requeriría suspender la mezcla en un líquido que no disuelva ninguno de los componentes.",
      [SeparationMethod.Decantacion]: "La decantación no es adecuada para separar dos sólidos secos. Si estuvieran en un líquido, el magnetismo sigue siendo el método preferido para el hierro.",
      [SeparationMethod.Cristalizacion]: "La cristalización se usa para separar un sólido disuelto de un líquido. Ni el hierro ni la arena están disueltos.",
      [SeparationMethod.Destilacion]: "La destilación se usa para separar líquidos con diferentes puntos de ebullición, o un líquido de un sólido no volátil. No es aplicable aquí.",
      [SeparationMethod.Centrifugacion]: "Aunque podría usarse para separar sólidos de diferentes densidades si estuvieran en un líquido, la separación magnética es mucho más eficiente y específica para el hierro en esta mezcla seca."
    }
  },
  {
    id: "tinta_agua", name: "Tinta y Agua", representation: "💧✒️ Tinta disuelta en Agua", components: ["Pigmentos de Tinta", "Agua"], correctMethod: SeparationMethod.Destilacion, description: "Una solución donde los pigmentos de la tinta están disueltos o finamente dispersos en agua.", processExplanation: "Has usado Destilación. El agua tiene un punto de ebullición más bajo que los pigmentos de la tinta. Al calentar, el agua se evapora primero, luego se condensa y se recolecta, separándola de los componentes de la tinta.", imageUrl: "https://www.zschimmer-schwarz.es/app/uploads/2020/06/tintas-ceramicas-base-agua.jpg",
    incorrectMethodExplanations: {
      [SeparationMethod.Filtracion]: "Muchos pigmentos de tinta son muy finos o están disueltos y pasarían el filtro.",
      [SeparationMethod.Decantacion]: "Generalmente es una mezcla homogénea o una suspensión coloidal estable, no forma capas.",
      [SeparationMethod.Cristalizacion]: "Evaporar el agua dejaría los sólidos, pero la destilación recupera el agua pura y es el método enfocado aquí.",
      [SeparationMethod.SeparacionMagnetica]: "Los componentes típicos de la tinta no son magnéticos.",
      [SeparationMethod.Centrifugacion]: "Podría separar algunos pigmentos en suspensión, pero no los disueltos. La destilación es más completa para obtener agua pura.",
    }
  },
  {
    id: "agua_alcohol",
    name: "Agua y Alcohol",
    representation: "💧🧪 Agua y Alcohol (Etanol)",
    components: ["Agua", "Alcohol (Etanol)"],
    correctMethod: SeparationMethod.Destilacion,
    description: "Una mezcla homogénea de agua y alcohol (etanol), dos líquidos miscibles.",
    processExplanation: "Has usado Destilación. El alcohol (etanol) tiene un punto de ebullición más bajo (aprox. 78°C) que el agua (100°C). Al calentar la mezcla, el alcohol se evapora primero, luego se condensa y se recolecta, separándolo del agua.",
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjSlJ-5fl9m69bUAwnBpn59X7e5s38ReJ8mH74TLDWcdTzI6GERsjdMTZxpC7gdSgFfCP2RhuVYtZh678apD42dXb_k-AY0tmp8Ejhqt1oeTbmEHiPRKr4sdhhHpn8nOGIayX-TdsSzLO8/s1600/exp6.png",
    incorrectMethodExplanations: {
      [SeparationMethod.Filtracion]: "Tanto el agua como el alcohol son líquidos y pasarían completamente a través del filtro.",
      [SeparationMethod.Decantacion]: "El agua y el alcohol son miscibles; no forman capas separadas que puedan decantarse.",
      [SeparationMethod.SeparacionMagnetica]: "Ni el agua ni el alcohol son atraídos por un imán.",
      [SeparationMethod.Cristalizacion]: "No hay un sólido disuelto para cristalizar aquí; ambos son líquidos.",
      [SeparationMethod.Centrifugacion]: "La centrifugación es ineficaz para separar dos líquidos miscibles como el agua y el alcohol. La destilación es el método apropiado basado en la diferencia de puntos de ebullición.",
    }
  },
];

export const TOOLS_DATA: ToolItem[] = [
  { id: SeparationMethod.Filtracion, name: "Filtro de Papel", icon: <FilterIcon /> },
  { id: SeparationMethod.Decantacion, name: "Decantador", icon: <DecanterIcon /> },
  { id: SeparationMethod.Centrifugacion, name: "Centrífuga", icon: <CentrifugeIcon /> },
  { id: SeparationMethod.SeparacionMagnetica, name: "Imán", icon: <MagnetIcon /> },
  { id: SeparationMethod.Destilacion, name: "Destilación", icon: <AlembicIcon /> }, // Name changed
  { id: SeparationMethod.Cristalizacion, name: "Plato de Cristalización", icon: <CrystalDishIcon /> },
];

export const CONTROL_SUBSTANCES: { name: string; representation: string }[] = [
    // Empty as per previous request
];

export const INITIAL_MIXTURES_DISPLAY = [
    { name: "Agua con Sal", representation: "💧🧂" },
    { name: "Aceite y Agua", representation: "💧🛢️" },
    { name: "Arena y Agua", representation: "💧🏝️" },
    { name: "Limaduras de Hierro y Arena", representation: "🧲🏝️" },
    { name: "Tinta y Agua", representation: "💧✒️" },
    { name: "Agua y Alcohol", representation: "💧🧪" },
];
