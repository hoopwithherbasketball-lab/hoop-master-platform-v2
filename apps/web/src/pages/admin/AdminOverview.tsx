import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Users, ShoppingBag, ClipboardList, TrendingUp } from 'lucide-react'

export default function AdminOverview() {
  const [stats, setStats] = useState({ leads: 0, orders: 0, audits: 0, players: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const [l, o, a, p] = await Promise.all([
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('service_orders').select('*', { count: 'exact', head: true }),
        supabase.from('audit_submissions').select('*', { count: 'exact', head: true }),
        supabase.from('player_profiles').select('*', { count: 'exact', head: true }),
      ])
      setStats({ leads: l.count ?? 0, orders: o.count ?? 0, audits: a.count ?? 0, players: p.count ?? 0 })
    } catch (e) { console.error('AdminOverview load error:', e) }
    setLoading(false)
  }

  const cards = [
    { icon: <Users size={22} />, label: 'Total Leads', value: stats.leads, color: 'text-royal-500' },
    { icon: <ShoppingBag size={22} />, label: 'Service Orders', value: stats.orders, color: 'text-brand-orange' },
    { icon: <ClipboardList size={22} />, label: 'Audit Submissions', value: stats.audits, color: 'text-success-500' },
    { icon: <TrendingUp size={22} />, label: 'Total Players', value: stats.players, color: 'text-brand-gold' },
  ]

  return (
    <DashboardLayout variant="admin" title="Admin Overview" subtitle="Elite GBB ProCoach operations dashboard">
      {loading ? (<div className="grid grid-cols-2 md:grid-cols-4 gap-5 animate-pulse">{[...Array(4)].map((_, i) => <div key={i} className="card h-28" />)}</div>) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {cards.map(s => (<div key={s.label} className="stat-card"><span className={s.color}>{s.icon}</span><p className="font-display text-3xl font-bold text-white mt-2">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>))}
        </div>
      )}
    </DashboardLayout>
  )
}
