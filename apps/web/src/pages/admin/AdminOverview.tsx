import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Users, ShoppingBag, ClipboardList, TrendingUp, Radio, FileVideo, CalendarClock, BarChart } from 'lucide-react'

export default function AdminOverview() {
  const [stats, setStats] = useState({ leads: 0, orders: 0, audits: 0, players: 0, channels: 0, assets: 0, schedules: 0, analytics: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const [l, o, a, p, ch, as, sc, an] = await Promise.all([
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('service_orders').select('*', { count: 'exact', head: true }),
        supabase.from('audit_submissions').select('*', { count: 'exact', head: true }),
        supabase.from('player_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('media_channels').select('*', { count: 'exact', head: true }),
        supabase.from('media_assets').select('*', { count: 'exact', head: true }),
        supabase.from('channel_schedules').select('*', { count: 'exact', head: true }),
        supabase.from('analytics_events').select('*', { count: 'exact', head: true }),
      ])
      setStats({
        leads: l.count ?? 0, orders: o.count ?? 0, audits: a.count ?? 0, players: p.count ?? 0,
        channels: ch.count ?? 0, assets: as.count ?? 0, schedules: sc.count ?? 0, analytics: an.count ?? 0,
      })
    } catch (e) { console.error('AdminOverview load error:', e) }
    setLoading(false)
  }

  const cards = [
    { icon: <Users size={22} />, label: 'Total Leads', value: stats.leads, color: 'text-royal-500' },
    { icon: <ShoppingBag size={22} />, label: 'Service Orders', value: stats.orders, color: 'text-brand-orange' },
    { icon: <ClipboardList size={22} />, label: 'Audit Submissions', value: stats.audits, color: 'text-success-500' },
    { icon: <TrendingUp size={22} />, label: 'Total Players', value: stats.players, color: 'text-brand-gold' },
  ]

  const mediaCards = [
    { icon: <Radio size={22} />, label: 'Channels', value: stats.channels, color: 'text-blue-400', to: '/admin/channels' },
    { icon: <FileVideo size={22} />, label: 'Media Assets', value: stats.assets, color: 'text-green-400', to: '/admin/assets' },
    { icon: <CalendarClock size={22} />, label: 'Schedules', value: stats.schedules, color: 'text-purple-400', to: '/admin/schedules' },
    { icon: <BarChart size={22} />, label: 'Analytics Events', value: stats.analytics, color: 'text-yellow-400', to: '/admin/analytics' },
  ]

  return (
    <DashboardLayout variant="admin" title="Admin Overview" subtitle="Elite GBB ProCoach operations dashboard">
      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 animate-pulse">{[...Array(4)].map((_, i) => <div key={i} className="card h-28" />)}</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 animate-pulse">{[...Array(4)].map((_, i) => <div key={i} className="card h-28" />)}</div>
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Operations</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {cards.map(s => (<div key={s.label} className="stat-card"><span className={s.color}>{s.icon}</span><p className="font-display text-3xl font-bold text-white mt-2">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Media Platform</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {mediaCards.map(s => (
                <Link key={s.label} to={s.to} className="stat-card hover:bg-white/5 transition-colors">
                  <span className={s.color}>{s.icon}</span>
                  <p className="font-display text-3xl font-bold text-white mt-2">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
