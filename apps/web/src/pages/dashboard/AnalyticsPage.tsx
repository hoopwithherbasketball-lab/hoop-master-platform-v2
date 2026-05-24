import { usePlayerAnalytics } from '@hoop-master/features/crm'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { TrendingUp } from 'lucide-react'

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  return <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden"><div className={`h-3 rounded-full ${color}`} style={{ width: `${(value / max) * 100}%` }} /></div>
}

const COLORS = ['bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-purple-500']

export default function AnalyticsPage() {
  const { analytics } = usePlayerAnalytics()

  const maxPPG = Math.max(...analytics.stats.ppg, 20)
  const maxAPG = Math.max(...analytics.stats.apg, 6)
  const maxRPG = Math.max(...analytics.stats.rpg, 10)
  const maxFGP = Math.max(...analytics.stats.fgp, 50)

  const series = [
    { label: 'PPG', data: analytics.stats.ppg, max: maxPPG, color: 'bg-blue-500' },
    { label: 'APG', data: analytics.stats.apg, max: maxAPG, color: 'bg-green-500' },
    { label: 'RPG', data: analytics.stats.rpg, max: maxRPG, color: 'bg-amber-500' },
    { label: 'FG%', data: analytics.stats.fgp, max: maxFGP, color: 'bg-purple-500' },
  ]

  return (
    <DashboardLayout variant="player" title="Analytics" subtitle="Track your performance trends across the season.">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          {series.map((s, idx) => (
            <div key={s.label} className="bg-navy-800 rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className={COLORS[idx].replace('bg-', 'text-')} />
                  <h3 className="font-bold text-white">{s.label}</h3>
                </div>
                <span className="text-2xl font-bold text-white">{s.data[s.data.length - 1]}</span>
              </div>
              <div className="space-y-3">
                {s.data.map((val, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-8 text-right">{analytics.months[i]}</span>
                    <div className="flex-1">
                      <MiniBar value={val} max={s.max} color={s.color} />
                    </div>
                    <span className="text-xs font-medium text-slate-400 w-10 text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-navy-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-white mb-4">Season-over-Season Trends</h2>
          <div className="space-y-4">
            {['2023-24', '2024-25', '2025-26'].map(season => {
              const seasonData = analytics.trends.filter(t => t.season === season)
              return (
                <div key={season} className="p-4 bg-white/5 rounded-lg">
                  <p className="font-semibold text-white mb-2">{season}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {seasonData.map(t => (
                      <div key={t.label} className="text-center">
                        <p className="text-lg font-bold text-[#0134BD]">{t.value}</p>
                        <p className="text-xs text-slate-400">{t.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
