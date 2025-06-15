
import React from 'react';
import { ElementData, ElectronShell } from '../types';

export type AtomAnimationState = 'idle' | 'transfer-from' | 'transfer-to' | 'ion-positive' | 'ion-negative' | 'sharing' | 'delocalized' | null;

interface AtomViewProps {
  element: ElementData | null;
  animationState?: AtomAnimationState;
  electronToTransferIndex?: number; // Index of the valence electron to be "transferred"
}

const AtomView: React.FC<AtomViewProps> = ({ element, animationState, electronToTransferIndex }) => {
  if (!element) return null;

  const baseRadius = 15; // Nucleus radius
  const shellIncrement = 15;
  const electronRadius = 3;
  const maxDisplayedElectronsPerShell = 8; // For visual clarity, not strict rule

  const electronShells: ElectronShell[] = element.shells.map((electronCount, index) => ({
    radius: baseRadius + shellIncrement * (index + 1),
    electronCount: electronCount,
  }));

  const getElectronPosition = (shell: ElectronShell, electronIndex: number, totalElectronsInShell: number) => {
    const displayCount = Math.min(totalElectronsInShell, maxDisplayedElectronsPerShell);
    const angle = (2 * Math.PI * electronIndex) / displayCount;
    return {
      cx: shell.radius * Math.cos(angle),
      cy: shell.radius * Math.sin(angle),
    };
  };
  
  const valenceShellIndex = element.shells.length - 1;

  return (
    <div className="flex flex-col items-center p-4 min-w-[200px] min-h-[200px] relative">
      <svg viewBox="-60 -60 120 120" width="150" height="150" className="drop-shadow-lg">
        {/* Shells */}
        {electronShells.map((shell, shellIndex) => (
          <circle
            key={`shell-${shellIndex}`}
            cx="0"
            cy="0"
            r={shell.radius}
            fill="none"
            stroke={animationState === 'delocalized' ? 'rgba(100, 116, 139, 0.3)' : "rgba(100, 116, 139, 0.5)"}
            strokeWidth="1"
          />
        ))}
        
        {/* Nucleus */}
        <circle cx="0" cy="0" r={baseRadius} className={`${element.color} opacity-80`} />
        <text x="0" y="0" dy="0.35em" textAnchor="middle" fontSize="10" 
          className={`font-bold ${element.textColor || (element.color.includes('yellow') || element.color.includes('pink') || element.color.includes('green-400') || element.color.includes('blue-400') || element.color.includes('teal-400') ? 'text-black' : 'text-white')}`}
        >
          {element.symbol}
        </text>

        {/* Ion charge display */}
        {(animationState === 'ion-positive' || animationState === 'ion-negative') && (
          <text 
            x={baseRadius * 0.9} 
            y={-baseRadius * 0.9}
            fontSize="12"
            fontWeight="bold"
            className={animationState === 'ion-positive' ? "fill-red-500" : "fill-blue-500"}
            textAnchor="middle"
            stroke="rgba(0,0,0,0.7)"
            strokeWidth="0.4px"
          >
            {animationState === 'ion-positive' ? '+' : '-'}
          </text>
        )}

        {/* Electrons */}
        {electronShells.map((shell, shellIndex) => 
          Array.from({ length: shell.electronCount }).map((_, electronIdx) => {
            // If this electron is being transferred FROM this atom, don't render it.
            // This logic might become less relevant if 'transfer-from' state is not set by App.tsx
            if (animationState === 'transfer-from' && 
                shellIndex === valenceShellIndex && 
                typeof electronToTransferIndex === 'number' &&
                electronIdx === electronToTransferIndex) {
              return null; 
            }

            const { cx, cy } = getElectronPosition(shell, electronIdx, shell.electronCount);
            let electronFill = "fill-sky-400"; 
            let electronClass = "electron";

            if (shellIndex === valenceShellIndex) {
              electronFill = "fill-pink-500"; 
              if (animationState === 'sharing' || (animationState === 'delocalized' && element.elementType === 'metal')) {
                electronClass += " animate-pulse";
              }
            }

            if (animationState === 'delocalized' && shellIndex === valenceShellIndex && element.elementType === 'metal') {
              electronClass += " opacity-60";
              electronFill = "fill-sky-300"; // Different color for delocalized e-
            }
            
            return (
              <circle
                key={`shell-${shellIndex}-electron-${electronIdx}`}
                cx={cx}
                cy={cy}
                r={electronRadius}
                className={`${electronFill} ${electronClass}`}
              />
            );
          })
        )}
      </svg>
      <div className="mt-2 text-center">
        <p className="text-lg font-semibold">{element.name}</p>
        <p className="text-sm text-slate-400">Electrones de Valencia: {element.valenceElectrons}</p>
        {/* Config. Capas display removed from here */}
      </div>
    </div>
  );
};

export default AtomView;
