
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';
import { GraphDataPoint, SubstanceDefinition, Phase } from '../types';
import { TEMP_EPSILON } from '../constants';

interface TemperatureGraphProps {
  data: GraphDataPoint[];
  substance: SubstanceDefinition;
}

interface PhaseSegment {
  x1: number;
  x2: number;
  label: string;
  color: string;
}

// Small component to render the line with a circle symbol for the legend
const LegendLineSymbol: React.FC<{ color: string }> = ({ color }) => (
  <svg width="28" height="14" viewBox="0 0 28 14" className="inline-block mr-2" aria-hidden="true">
    <line x1="0" y1="7" x2="10" y2="7" stroke={color} strokeWidth="2" />
    <circle cx="14" cy="7" r="3" stroke={color} strokeWidth="1" fill={color === 'transparent' ? 'none' : color} />
    <line x1="18" y1="7" x2="28" y2="7" stroke={color} strokeWidth="2" />
  </svg>
);

// Custom Legend Content Component
const CustomLegendContent: React.FC<any> = (props) => {
  const { payload } = props; // payload is an array of series info from Recharts

  if (!payload || payload.length === 0) {
    return null; // Don't render if no series data
  }

  return (
    <div className="flex justify-center items-center text-sm w-full" style={{ marginTop: '15px' }}>
      {payload.map((entry: any, index: number) => {
        // entry.value is the 'name' prop from the <Line> component (e.g., "Temperatura")
        // entry.color is the 'stroke' prop from the <Line> component
        const name = entry.value || 'Temperatura'; // Fallback if name is missing
        const color = entry.color || '#60A5FA';   // Fallback color (sky-500)

        return (
          // Container for "Symbol + Temperatura"
          <div key={`legend-item-${index}`} className="flex items-center">
            <LegendLineSymbol color={color} />
            <span style={{ color: color, fontWeight: 500 }}>{name}</span>
          </div>
        );
      })}
      {/* "Tiempo (s)" text, with spacing */}
      <span className="ml-4 text-slate-400" style={{ fontWeight: 500 }}>Tiempo (s)</span>
    </div>
  );
};


const getPhaseChangeSegments = (data: GraphDataPoint[], substance: SubstanceDefinition): PhaseSegment[] => {
  const segments: PhaseSegment[] = [];
  if (data.length < 2) return segments;

  const { meltingPoint, boilingPoint, plasmaPoint } = substance;
  const transitionDefinitions = [
    { temp: meltingPoint, label: Phase.Melting, color: 'rgba(100, 150, 255, 0.15)' },
    { temp: boilingPoint, label: Phase.Boiling, color: 'rgba(255, 180, 100, 0.15)' },
  ];
  if (plasmaPoint) {
    transitionDefinitions.push({ temp: plasmaPoint, label: Phase.Ionizing, color: 'rgba(200, 100, 255, 0.15)' });
  }

  for (const td of transitionDefinitions) {
    let segmentStartTime: number | null = null;
    for (let i = 0; i < data.length; i++) {
      const point = data[i];
      const isAtTransitionTemp = Math.abs(point.temperature - td.temp) < TEMP_EPSILON;

      if (isAtTransitionTemp) {
        if (segmentStartTime === null) {
          segmentStartTime = point.time;
        }
        const nextPoint = data[i+1];
        if (!nextPoint || Math.abs(nextPoint.temperature - td.temp) >= TEMP_EPSILON || nextPoint.time <= point.time ) {
           if(segmentStartTime !== null && point.time > segmentStartTime){
             segments.push({ x1: segmentStartTime, x2: point.time, label: td.label, color: td.color });
           }
           segmentStartTime = null;
        }
      } else {
        if (segmentStartTime !== null) {
           if (data[i-1] && data[i-1].time > segmentStartTime) {
            segments.push({ x1: segmentStartTime, x2: data[i-1].time, label: td.label, color: td.color });
          }
          segmentStartTime = null;
        }
      }
    }
    if (segmentStartTime !== null && data.length > 0) {
        const lastDataPoint = data[data.length-1];
        if (lastDataPoint.time > segmentStartTime) {
             segments.push({ x1: segmentStartTime, x2: lastDataPoint.time, label: td.label, color: td.color });
        }
    }
  }
  return segments;
};


const TemperatureGraph: React.FC<TemperatureGraphProps> = ({ data, substance }) => {
  const xDomainMax = data.length > 0 ? Math.max(10, ...data.map(p => p.time)) : 10;
  const xDomainMin = 0;

  const yAxisDomain = useMemo(() => {
    const range = substance.maxSimTemp - substance.minSimTemp;
    const buffer = Math.max(5, Math.abs(range * 0.05));
    return [
      Math.floor(substance.minSimTemp - buffer),
      Math.ceil(substance.maxSimTemp + buffer)
    ];
  }, [substance.minSimTemp, substance.maxSimTemp]);

  const phaseChangeSegments = useMemo(() => getPhaseChangeSegments(data, substance), [data, substance]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 25,
          bottom: 40, // Adjusted bottom margin for custom legend
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" /> {/* slate-600 */}
        <XAxis
          dataKey="time"
          type="number"
          // name and unit are not needed as they are in the custom legend
          stroke="#CBD5E0" // slate-300 for axis line
          domain={[xDomainMin, xDomainMax]}
          allowDataOverflow={true}
          // Label removed, handled by CustomLegendContent
          tick={{ fill: '#94A3B8', fontSize: 12 }} // slate-400 for tick text
          axisLine={{ stroke: '#4A5568' }} // slate-600
          tickLine={{ stroke: '#4A5568' }} // slate-600
        />
        <YAxis
          name="Temperatura" // Used by Tooltip
          unit="°C" // Used by Tooltip
          stroke="#CBD5E0" // slate-300 for axis line
          domain={yAxisDomain}
          allowDataOverflow={true}
          label={{ value: 'Temperatura (°C)', angle: -90, position: 'insideLeft', dx: -25, fill: '#94A3B8', fontSize: 14, fontWeight: 500 }} // slate-400
          tickFormatter={(tick) => tick.toFixed(0)}
          tick={{ fill: '#94A3B8', fontSize: 12 }} // slate-400 for tick text
          axisLine={{ stroke: '#4A5568' }} // slate-600
          tickLine={{ stroke: '#4A5568' }} // slate-600
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '0.5rem' }} // bg-slate-800, border-slate-700
          labelStyle={{ color: '#E2E8F0' }} // text-slate-200
          itemStyle={{ color: '#60A5FA' }} // text-sky-500 (will be overridden by formatter's color)
          formatter={(value: any, name: any, itemProps: any) => {
            if (name === 'Temperatura') {
              const numericValue = Number(value);
              // Use the actual color of the line for the tooltip item text
              return [<span style={{ color: itemProps.color || '#60A5FA' }}>{`${numericValue.toFixed(1)} °C`}</span>, String(name)];
            }
            return [String(value), String(name)];
          }}
          labelFormatter={(label: any) => {
            const numericLabel = Number(label);
            return `Tiempo: ${numericLabel.toFixed(1)}s`;
          }}
        />
        <Legend
          verticalAlign="bottom"
          content={<CustomLegendContent />} // Use the custom component
          // wrapperStyle is not needed; CustomLegendContent handles its own layout and margin
        />

        {phaseChangeSegments.map((segment, index) => (
          <ReferenceArea
            key={`segment-${index}`}
            x1={segment.x1}
            x2={segment.x2}
            y1={yAxisDomain[0]}
            y2={yAxisDomain[1]}
            stroke="none"
            fill={segment.color}
            fillOpacity={1}
            label={{
                value: segment.label,
                position: 'insideTop',
                fill: '#A0AEC0', // A lighter slate color for visibility on segments
                fontSize: 10,
                dy: 10,
            }}
          />
        ))}

        <Line
          type="monotone"
          dataKey="temperature"
          stroke="#60A5FA" // sky-500
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6, stroke: '#2563EB', fill: '#DBEAFE' }} // sky-600, sky-100
          name="Temperatura" // This name is passed to the Legend payload
          isAnimationActive={data.length < 100}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TemperatureGraph;
