interface Props { score: number; size?: 'sm' | 'md' | 'lg'; showLabel?: boolean }
function getColor(s: number) { if (s >= 75) return 'text-success-500'; if (s >= 50) return 'text-yellow-500'; if (s >= 25) return 'text-brand-orange'; return 'text-error-500' }
function getBand(s: number) { if (s >= 75) return 'Recruit-Ready'; if (s >= 50) return 'On Track'; if (s >= 25) return 'Needs Work'; return 'Getting Started' }
function getBgColor(s: number) { if (s >= 75) return '#10b981'; if (s >= 50) return '#f59e0b'; if (s >= 25) return '#FB6C1D'; return '#ef4444' }
export default function ReadinessGauge({ score, size = 'md', showLabel = true }: Props) {
  const radius = size === 'lg' ? 52 : size === 'md' ? 42 : 28
  const stroke = size === 'lg' ? 8 : size === 'md' ? 7 : 5
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (score / 100) * circumference
  const svgSize = (radius + stroke + 4) * 2
  const textSize = size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-3xl' : 'text-xl'
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg width={svgSize} height={svgSize} className="-rotate-90">
          <circle cx={svgSize/2} cy={svgSize/2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
          <circle cx={svgSize/2} cy={svgSize/2} r={radius} fill="none" stroke={getBgColor(score)} strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center"><span className={`font-display font-bold ${textSize} ${getColor(score)}`}>{score}</span></div>
      </div>
      {showLabel && <div className="text-center"><p className={`text-xs font-semibold ${getColor(score)}`}>{getBand(score)}</p></div>}
    </div>
  )
}
