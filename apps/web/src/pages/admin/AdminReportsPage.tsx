import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { TrendingUp, Users, ShoppingBag, Calendar, Radio, Shield, MessageSquare, BarChart3 } from 'lucide-react'

interface ReportStats {
  totalLeads: number
  leadsByStatus: Record<string, number>
  totalOrders: number
  ordersByStatus: Record<string, number>
  totalPlayers: number
  publicPlayers: number
  totalEvents: number
  eventRegistrations: number
  totalChannels: number
  totalAssets: number
  communityPosts: number
  pendingMemberships: number
  openReports: number
  intakeSubmissions: number
  intakeByStatus: Record<string, number>
  recentLeads: { name: string; email: string; status: string; created_at: string }[]
}

const EMPTY: ReportStats = {
  totalLeads: 0, leadsByStatus: {}, totalOrders: 0, ordersByStatus: {},
  totalPlayers: 0, publicPlayers: 0, totalEvents: 0, eventRegistrations: 0,
  totalChannels: 0, totalAssets: 0, communityPosts: 0, pendingMemberships: 0,
  openReports: 0, intakeSubmissions: 0, intakeByStatus: {}, recentLeads: [],
}

function pct(n: number, total: number) {
  if (!total) return 0
  return Math.round((n / total) * 100)
}

export default function AdminReportsPage() {
  const [stats, setStats] = useState<ReportStats>(EMPTY)
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const [
        leadsRes, ordersRes, playersRes, eventsRes,
        regRes, channelsRes, assetsRes, postsRes,
        membershipsRes, reportsRes, intakeRes, recentLeadsRes,
      ] = await Promise.all([
        supabase.from('leads').select('status'),
        supabase.from('service_orders').select('status'),
        supabase.from('player_profiles').select('is_public'),
        supabase.from('events').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('event_registrations').select('id', { count: 'exact', head: true }).eq('status', 'registered'),
        supabase.from('media_channels').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('media_assets').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('community_posts').select('id', { count: 'exact', head: true }),
        supabase.from('community_memberships').select('status'),
        supabase.from('community_post_reports').select('id', { count: 'exact', head: true }).eq('status', 'open'),
        supabase.from('intake_submissions').select('status'),
        supabase.from('leads').select('first_name, last_name, email, status, created_at').order('created_at', { ascending: false }).limit(5),
      ])

      const leads = leadsRes.data ?? []
      const orders = ordersRes.data ?? []
      const players = playersRes.data ?? []
      const memberships = membershipsRes.data ?? []
      const intake = intakeRes.data ?? []
      const recent = recentLeadsRes.data ?? []

      const leadsByStatus = leads.reduce<Record<string, number>>((acc, l) => { acc[l.status] = (acc[l.status] || 0) + 1; return acc }, {})
      const ordersByStatus = orders.reduce<Record<string, number>>((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc }, {})
      const intakeByStatus = intake.reduce<Record<string, number>>((acc, i) => { acc[i.status] = (acc[i.status] || 0) + 1; return acc }, {})

      setStats({
        totalLeads: leads.length,
        leadsByStatus,
        totalOrders: orders.length,
        ordersByStatus,
        totalPlayers: players.length,
        publicPlayers: players.filter(p => p.is_public).length,
        totalEvents: eventsRes.count ?? 0,
        eventRegistrations: regRes.count ?? 0,
        totalChannels: channelsRes.count ?? 0,
        totalAssets: assetsRes.count ?? 0,
        communityPosts: postsRes.count ?? 0,
        pendingMemberships: memberships.filter(m => m.status === 'pending').length,
        openReports: reportsRes.count ?? 0,
        intakeSubmissions: intake.length,
        intakeByStatus,
        recentLeads: recent.map(r => ({
          name: [r.first_name, r.last_name].filter(Boolean).join(' ') || 'Unknown',
          email: r.email ?? '',
          status: r.status,
          created_at: r.created_at,
        })),
      })
    } catch (e) {
      console.error('AdminReportsPage load error:', e)
    }
    setLoading(false)
  }

  const leadConvRate = pct((stats.leadsByStatus['won'] || 0), stats.totalLeads)
  const profilePublicRate = pct(stats.publicPlayers, stats.totalPlayers)

  const statusColor = (s: string) => {
    const map: Record<string, string> = {
      new: 'bg-blue-500/20 text-blue-400', contacted: 'bg-amber-500/20 text-amber-400',
      qualified: 'bg-purple-500/20 text-purple-400', booked: 'bg-indigo-500/20 text-indigo-400',
      won: 'bg-green-500/20 text-green-400', nurture: 'bg-teal-500/20 text-teal-400',
      lost: 'bg-red-500/20 text-red-400', new_intake: 'bg-blue-500/20 text-blue-400',
      enrolled: 'bg-green-500/20 text-green-400', declined: 'bg-red-500/20 text-red-400',
    }
    return map[s] ?? 'bg-slate-500/20 text-slate-400'
  }

  if (loading) {
    return (
      <DashboardLayout variant="admin" title="Reports" subtitle="Platform-wide analytics and reporting">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 animate-pulse">
          {[...Array(8)].map((_, i) => <div key={i} className="h-28 bg-navy-800 rounded-xl" />)}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout variant="admin" title="Reports" subtitle="Platform-wide analytics and reporting">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { icon: <Users size={20} />, label: 'Total Leads', value: stats.totalLeads, sub: `${leadConvRate}% conversion`, color: 'text-blue-400' },
            { icon: <ShoppingBag size={20} />, label: 'Service Orders', value: stats.totalOrders, sub: `${stats.ordersByStatus['complete'] ?? 0} completed`, color: 'text-orange-400' },
            { icon: <TrendingUp size={20} />, label: 'Player Profiles', value: stats.totalPlayers, sub: `${profilePublicRate}% public`, color: 'text-yellow-400' },
            { icon: <Calendar size={20} />, label: 'Event Registrations', value: stats.eventRegistrations, sub: `across ${stats.totalEvents} events`, color: 'text-green-400' },
          ].map(c => (
            <div key={c.label} className="bg-navy-800 rounded-xl p-5 border border-white/5">
              <span className={c.color}>{c.icon}</span>
              <p className="text-3xl font-bold text-white mt-2">{c.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{c.label}</p>
              <p className="text-xs text-slate-600 mt-0.5">{c.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Lead pipeline */}
          <div className="bg-navy-800 rounded-xl p-5 border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-blue-400" />
              <h3 className="font-semibold text-white">Lead Pipeline</h3>
            </div>
            <div className="space-y-2">
              {['new', 'contacted', 'qualified', 'booked', 'won', 'nurture', 'lost'].map(s => {
                const n = stats.leadsByStatus[s] ?? 0
                const w = pct(n, stats.totalLeads)
                return (
                  <div key={s} className="flex items-center gap-3">
                    <span className="w-20 text-xs text-slate-400 capitalize">{s}</span>
                    <div className="flex-1 bg-white/5 rounded-full h-2">
                      <div className="h-2 rounded-full bg-blue-500 transition-all" style={{ width: `${w}%` }} />
                    </div>
                    <span className="w-6 text-xs text-slate-400 text-right">{n}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Order status */}
          <div className="bg-navy-800 rounded-xl p-5 border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag size={16} className="text-orange-400" />
              <h3 className="font-semibold text-white">Order Status</h3>
            </div>
            <div className="space-y-2">
              {['new', 'awaiting_intake', 'in_review', 'in_progress', 'awaiting_client_feedback', 'complete', 'archived'].map(s => {
                const n = stats.ordersByStatus[s] ?? 0
                const w = pct(n, stats.totalOrders)
                return (
                  <div key={s} className="flex items-center gap-3">
                    <span className="w-36 text-xs text-slate-400 capitalize">{s.replace(/_/g, ' ')}</span>
                    <div className="flex-1 bg-white/5 rounded-full h-2">
                      <div className="h-2 rounded-full bg-orange-500 transition-all" style={{ width: `${w}%` }} />
                    </div>
                    <span className="w-6 text-xs text-slate-400 text-right">{n}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Media platform */}
          <div className="bg-navy-800 rounded-xl p-5 border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <Radio size={16} className="text-purple-400" />
              <h3 className="font-semibold text-white">Media Platform</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Active Channels', value: stats.totalChannels },
                { label: 'Media Assets', value: stats.totalAssets },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-sm text-slate-400">{r.label}</span>
                  <span className="text-sm font-semibold text-white">{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Community health */}
          <div className="bg-navy-800 rounded-xl p-5 border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={16} className="text-teal-400" />
              <h3 className="font-semibold text-white">Community</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Total Posts', value: stats.communityPosts },
                { label: 'Pending Memberships', value: stats.pendingMemberships, alert: stats.pendingMemberships > 0 },
                { label: 'Open Reports', value: stats.openReports, alert: stats.openReports > 0 },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-sm text-slate-400">{r.label}</span>
                  <span className={`text-sm font-semibold ${r.alert ? 'text-amber-400' : 'text-white'}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Intake funnel */}
          <div className="bg-navy-800 rounded-xl p-5 border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={16} className="text-green-400" />
              <h3 className="font-semibold text-white">Intake Funnel</h3>
            </div>
            <div className="space-y-3">
              {['new', 'contacted', 'enrolled', 'declined'].map(s => {
                const n = stats.intakeByStatus[s] ?? 0
                return (
                  <div key={s} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-sm text-slate-400 capitalize">{s}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(s)}`}>{n}</span>
                  </div>
                )
              })}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-500">Total submissions</span>
                <span className="text-xs font-semibold text-slate-300">{stats.intakeSubmissions}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent leads */}
        <div className="bg-navy-800 rounded-xl p-5 border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} className="text-blue-400" />
            <h3 className="font-semibold text-white">Recent Leads</h3>
          </div>
          {stats.recentLeads.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">No leads yet.</p>
          ) : (
            <div className="divide-y divide-white/5">
              {stats.recentLeads.map((l, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{l.name}</p>
                    <p className="text-xs text-slate-500">{l.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-600">{new Date(l.created_at).toLocaleDateString()}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor(l.status)}`}>{l.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  )
}
