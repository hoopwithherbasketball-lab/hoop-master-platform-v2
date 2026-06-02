import React from 'react';

export interface ReadinessGaugeProps {
  percentage: number;
  label?: string;
}

export const ReadinessGauge: React.FC<ReadinessGaugeProps> = ({
  percentage,
  label = 'Readiness'
}) => {
  const normalized = Math.round(Math.min(Math.max(percentage, 0), 100));

  return (
    <div className="flex flex-col items-center" role="group" aria-label={`${label} gauge`}>
      <div
        className="relative w-24 h-24 rounded-full border-4 border-white/10 flex items-center justify-center"
        role="progressbar"
        aria-valuenow={normalized}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${normalized}%`}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(#0134BD 0deg ${normalized * 3.6}deg, transparent ${normalized * 3.6}deg)`,
          }}
        />
        <span className="relative text-lg font-bold">{normalized}%</span>
      </div>
      {label && <p className="mt-2 text-sm text-slate-400">{label}</p>}
    </div>
  );
};
