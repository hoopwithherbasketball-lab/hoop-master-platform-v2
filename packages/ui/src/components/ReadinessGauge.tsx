import React from 'react';

export interface ReadinessGaugeProps {
  percentage: number;
  label?: string;
}

export const ReadinessGauge: React.FC<ReadinessGaugeProps> = ({
  percentage,
  label = 'Readiness'
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 rounded-full border-4 border-white/10 flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full border-4 border-blue-500"
          style={{
            background: `conic-gradient(#0134BD 0deg ${percentage * 3.6}deg, transparent ${percentage * 3.6}deg)`
          }}
        />
        <span className="text-lg font-bold">{percentage}%</span>
      </div>
      {label && <p className="mt-2 text-sm text-slate-400">{label}</p>}
    </div>
  );
};
