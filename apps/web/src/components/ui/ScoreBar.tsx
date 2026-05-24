interface Props { label: string; score: number; max?: number }
function getBarColor(pct: number) { if (pct >= 75) return 'bg-success-500'; if (pct >= 50) return 'bg-yellow-400'; if (pct >= 25) return 'bg-brand-orange'; return 'bg-error-500' }
export default function ScoreBar({ label, score, max = 100 }: Props) {
  const pct = Math.round((score / max) * 100)
  return (<div><div className="flex justify-between items-center mb-1.5"><span className="text-sm text-slate-400">{label}</span><span className="text-sm font-semibold text-gray-200">{score}/{max}</span></div><div className="progress-bar"><div className={`progress-fill ${getBarColor(pct)}`} style={{ width: `${pct}%` }} /></div></div>)
}
