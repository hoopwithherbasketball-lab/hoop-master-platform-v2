import React from 'react';

export interface ScoreBarProps {
  score: number;
  maxScore?: number;
  label?: string;
  color?: string;
}

export const ScoreBar: React.FC<ScoreBarProps> = ({
  score,
  maxScore = 100,
  label,
  color = 'bg-blue-500'
}) => {
  const boundedScore = Math.max(0, Math.min(score, maxScore));
  const percentage = (boundedScore / maxScore) * 100;

  return (
    <div className="w-full" role="group" aria-label={label ? `${label} score bar` : 'score bar'}>
      {label && <p className="text-sm font-medium mb-1">{label}</p>}
      <div
        className="w-full bg-white/15 rounded-full h-2"
        role="progressbar"
        aria-valuenow={boundedScore}
        aria-valuemin={0}
        aria-valuemax={maxScore}
        aria-label={label ? `${label}: ${boundedScore} out of ${maxScore}` : `${boundedScore} out of ${maxScore}`}
      >
        <div
          className={`h-2 rounded-full transition-all ${color}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <p className="text-xs text-slate-400 mt-1">{boundedScore} / {maxScore}</p>
    </div>
  );
};
