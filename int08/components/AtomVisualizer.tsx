
import React from 'react';
import { AtomState, VisualElectronShell } from '../types';
import { calculateVisualElectronShells } from '../utils/atomUtils';

interface AtomVisualizerProps {
  atomState: AtomState;
}

const NUCLEUS_RADIUS_BASE = 20; // Base radius for nucleus visualization when empty or small
const NUCLEUS_RADIUS_MAX_ADDITION = 25; // Max addition to nucleus radius based on nucleons
const PARTICLE_RADIUS = 5; // Radius of proton/neutron circles
const ELECTRON_RADIUS = 3.5; // Radius of electron circles
const VISUALIZATION_PADDING = 20; // Padding around the atom in the SVG viewBox

const AtomVisualizer: React.FC<AtomVisualizerProps> = ({ atomState }) => {
  const { protons, neutrons, electrons } = atomState;
  const visualShells = calculateVisualElectronShells(electrons);

  const totalNucleons = protons + neutrons;
  // Adjust nucleus radius based on number of nucleons to prevent excessive overlap
  // Cap the growth to keep it reasonable.
  const dynamicNucleusRadius = NUCLEUS_RADIUS_BASE + Math.min(NUCLEUS_RADIUS_MAX_ADDITION, Math.floor(Math.sqrt(totalNucleons)) * 1.8);

  // Simple packing algorithm for nucleons (protons and neutrons)
  const placeNucleons = (count: number, isProton: boolean, existingParticles: {x:number, y:number}[]) => {
    const particles = [];
    let attempts = 0; // To prevent infinite loops in dense scenarios

    if (count === 0) return [];

    for (let i = 0; i < count && particles.length < 50 && attempts < count * 5; i++) { // Limit to 50 visible of each, and limit attempts
        let placed = false;
        let placementAttempts = 0;
        while(!placed && placementAttempts < 20) {
            const angle = Math.random() * 2 * Math.PI;
            // Place particles within ~80% of dynamicNucleusRadius to leave some edge space
            const radiusMagnitude = Math.random() * (dynamicNucleusRadius - PARTICLE_RADIUS) * 0.85; 
            const x = radiusMagnitude * Math.cos(angle);
            const y = radiusMagnitude * Math.sin(angle);

            let collision = false;
            // Check collision with other nucleons already placed (protons vs neutrons, and self-type)
            const allNucleons = [...existingParticles, ...particles];
            for (const p of allNucleons) {
                const distSq = (x - p.x)**2 + (y - p.y)**2;
                if (distSq < (PARTICLE_RADIUS * 2)**2 * 0.9) { // Slightly less than 2*radius for tighter packing
                    collision = true;
                    break;
                }
            }

            if (!collision) {
                particles.push({ x, y });
                placed = true;
            }
            placementAttempts++;
        }
        if (!placed) attempts++; // Could not place this particle after several tries
    }
    return particles;
  };

  const protonPositions = placeNucleons(protons, true, []);
  const neutronPositions = placeNucleons(neutrons, false, protonPositions);
  
  let maxExtent = dynamicNucleusRadius + ELECTRON_RADIUS; // Default if no shells
  if (visualShells.length > 0) {
    const lastShell = visualShells[visualShells.length - 1];
    maxExtent = lastShell.radius + dynamicNucleusRadius + ELECTRON_RADIUS;
  }
  maxExtent += VISUALIZATION_PADDING;
  // Ensure a minimum extent if atom is very small or empty
  maxExtent = Math.max(maxExtent, NUCLEUS_RADIUS_BASE + VISUALIZATION_PADDING + 10);


  const viewBoxValue = `-${maxExtent} -${maxExtent} ${maxExtent * 2} ${maxExtent * 2}`;

  return (
    <div className="w-full aspect-square bg-slate-800 rounded-xl shadow-2xl p-2 flex items-center justify-center overflow-hidden">
      <svg viewBox={viewBoxValue} className="w-full h-full" aria-label={`Visualización del átomo con ${protons} protones, ${neutrons} neutrones y ${electrons} electrones.`}>
        {/* Electron Shells and Electrons */}
        {visualShells.map((shell) => (
          <g key={`shell-${shell.shellIndex}`} role="list" aria-label={`Capa electrónica ${shell.shellIndex} con ${shell.electronCount} electrones`}>
            <circle
              cx="0"
              cy="0"
              r={shell.radius + dynamicNucleusRadius}
              fill="none"
              stroke="rgba(100, 116, 139, 0.4)" // slate-500 with opacity
              strokeWidth="1"
              strokeDasharray="3 2"
              aria-hidden="true"
            />
            {Array.from({ length: shell.electronCount }).map((_, i) => {
              const angle = (i / Math.max(1,shell.electronCount)) * 2 * Math.PI + (shell.shellIndex % 2 === 0 ? Math.PI / Math.max(1,shell.electronCount) : 0) ; // Stagger electrons on different shells
              const x = (shell.radius + dynamicNucleusRadius) * Math.cos(angle);
              const y = (shell.radius + dynamicNucleusRadius) * Math.sin(angle);
              return (
                <circle
                  key={`electron-${shell.shellIndex}-${i}`}
                  role="listitem"
                  aria-label={`Electrón ${i+1} en la capa ${shell.shellIndex}`}
                  cx={x}
                  cy={y}
                  r={ELECTRON_RADIUS}
                  fill="rgb(250, 204, 21)" // yellow-400
                />
              );
            })}
          </g>
        ))}

        {/* Nucleus visual boundary */}
        <circle cx="0" cy="0" r={dynamicNucleusRadius} fill="rgba(71, 85, 105, 0.3)" aria-hidden="true" />
        
        {/* Neutrons */}
        <g role="list" aria-label={`${neutronPositions.length} neutrones en el núcleo`}>
        {neutronPositions.map((pos, i) => (
          <circle
            key={`neutron-${i}`}
            role="listitem"
            aria-label={`Neutrón ${i+1}`}
            cx={pos.x}
            cy={pos.y}
            r={PARTICLE_RADIUS}
            fill="rgb(100, 116, 139)" // slate-500
            stroke="rgb(51, 65, 85)" // slate-700
            strokeWidth="0.5"
          />
        ))}
        </g>

        {/* Protons */}
         <g role="list" aria-label={`${protonPositions.length} protones en el núcleo`}>
        {protonPositions.map((pos, i) => (
          <circle
            key={`proton-${i}`}
            role="listitem"
            aria-label={`Protón ${i+1}`}
            cx={pos.x}
            cy={pos.y}
            r={PARTICLE_RADIUS}
            fill="rgb(239, 68, 68)" // red-500
            stroke="rgb(153, 27, 27)" // red-800
            strokeWidth="0.5"
          />
        ))}
        </g>
        
        {/* Show counts if too many particles for clear individual visualization or if some were not placed */}
        {(protons > protonPositions.length || neutrons > neutronPositions.length || protons > 25 || neutrons > 25) && (protons > 0 || neutrons > 0) && (
            <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fontSize={Math.min(12, dynamicNucleusRadius * 0.3)} fill="white" className="font-sans pointer-events-none" aria-live="polite">
                {protons > 0 && <tspan fill="rgba(248, 113, 113, 0.9)">P:{protons}</tspan>}
                {neutrons > 0 && <tspan fill="rgba(156, 163, 175, 0.9)" dx={protons > 0 ? dynamicNucleusRadius * 0.15 : 0}>N:{neutrons}</tspan>}
            </text>
        )}
      </svg>
    </div>
  );
};

export default AtomVisualizer;