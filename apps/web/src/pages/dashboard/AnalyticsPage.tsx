import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { TrendingUp, Loader2 } from 'lucide-react'

const COLORS = ['bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-purple-500']

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  return <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden"><div className={`h-3 rounded-full ${color}`} style={{ width: `${(value / max) * 100}%` }} /></div>
}

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [data, setData] = useState<{ ppg: number[]; apg: number[]; rpg: number[]; fgp: number[]; months: string[] } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase.from('player_profiles').select('id').eq('user_id', user.id).maybeSingle().then(({ data: profile }) => {
      if (!profile) { setLoading(false); return }
      supabase.from('player_game_stats').select('ppg, apg, rpg, fg_pct, month_label').eq('player_profile_id', profile.id).order('created_at', { ascending: true }).then(({ data: stats }) => {
        if (stats && stats.length > 0) {
          setData({
            ppg: stats.map(r => r.ppg ?? 0), apg: stats.map(r => r.apg ?? 0),
            rpg: stats.map(r => r.rpg ?? 0), fgp: stats.map(r => r.fg_pct ?? 0),
            months: stats.map(r => r.month_label || ''),
          })
        }
        setLoading(false)
      })
    })
  }, [user])

  if (loading) return <DashboardLayout variant="player" title="Analytics" subtitle="Loading..."><div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-slate-400" /></div></DashboardLayout>

  if (!data) {
    return (
      <DashboardLayout variant="player" title="Analytics" subtitle="Track your performance trends across the season.">
        <div className="card p-12 text-center text-slate-400">
          <TrendingUp size={40} className="mx-auto mb-3 text-slate-500" />
          <p className="text-lg font-medium text-white mb-1">No game stats yet</p>
          <p className="text-sm">Stats will appear here once your coach or admin uploads game data.</p>
          <Link to="/elitegbb" className="inline-block mt-4 text-royal-400 hover:underline text-sm">Complete your profile</Link>
        </div>
      </DashboardLayout>
    )
  }

  const maxPPG = Math.max(...data.ppg, 20)
  const maxAPG = Math.max(...data.apg, 6)
  const maxRPG = Math.max(...data.rpg, 10)
  const maxFGP = Math.max(...data.fgp, 50)

  const series = [
    { label: 'PPG', data: data.ppg, max: maxPPG, color: 'bg-blue-500' },
    { label: 'APG', data: data.apg, max: maxAPG, color: 'bg-green-500' },
    { label: 'RPG', data: data.rpg, max: maxRPG, color: 'bg-amber-500' },
    { label: 'FG%', data: data.fgp, max: maxFGP, color: 'bg-purple-500' },
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
                    <span className="text-xs text-gray-400 w-8 text-right">{data.months[i]}</span>
                    <div className="flex-1"><MiniBar value={val} max={s.max} color={s.color} /></div>
                    <span className="text-xs font-medium text-slate-400 w-10 text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
