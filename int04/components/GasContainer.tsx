
import React from 'react';
import { Particle } from '../types';

interface GasContainerProps {
  particles: Particle[];
  containerWidth: number; // in px
  containerHeight: number; // in px
}

const GasContainer: React.FC<GasContainerProps> = ({ particles, containerWidth, containerHeight }) => {
  return (
    <div
      className="bg-slate-900 border-4 border-sky-500 shadow-2xl relative overflow-hidden rounded-md"
      style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${containerWidth} ${containerHeight}`}>
        {/* Optional: Add a grid or background pattern if desired */}
        {/* <rect width="100%" height="100%" fill="url(#grid)" /> */}
        {particles.map(p => (
          <circle
            key={p.id}
            cx={p.x}
            cy={p.y}
            r={p.radius}
            fill={p.color}
            opacity="0.8"
          />
        ))}
      </svg>
    </div>
  );
};

export default GasContainer;
