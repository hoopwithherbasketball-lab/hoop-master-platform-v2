import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Star, Calendar, ShoppingBag, TrendingUp, ArrowRight, User, BookOpen } from 'lucide-react'

interface Stats {
  readinessScore: number | null
  upcomingEvents: number
  serviceOrders: number
  pendingOrders: number
  profileComplete: boolean
  playerName: string
}

export default function DashboardOverview() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({
    readinessScore: null,
    upcomingEvents: 0,
    serviceOrders: 0,
    pendingOrders: 0,
    profileComplete: false,
    playerName: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function load() {
      const [profileRes, eventsRes, ordersRes] = await Promise.all([
        supabase
          .from('player_profiles')
          .select('first_name, last_name, overall_score')
          .eq('user_id', user!.id)
          .maybeSingle(),
        supabase
          .from('event_registrations')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user!.id)
          .eq('status', 'registered'),
        supabase
          .from('service_orders')
          .select('id, status')
          .eq('customer_user_id', user!.id),
      ])

      const profile = profileRes.data
      const orders = ordersRes.data ?? []

      setStats({
        readinessScore: profile?.overall_score ?? null,
        upcomingEvents: eventsRes.count ?? 0,
        serviceOrders: orders.length,
        pendingOrders: orders.filter(o => ['new', 'in_progress', 'awaiting_client_feedback'].includes(o.status)).length,
        profileComplete: !!(profile?.first_name && profile?.last_name),
        playerName: [profile?.first_name, profile?.last_name].filter(Boolean).join(' '),
      })
      setLoading(false)
    }
    load()
  }, [user])

  const cards = [
    {
      icon: <TrendingUp size={20} />,
      label: 'Readiness Score',
      value: stats.readinessScore != null ? `${stats.readinessScore}%` : '—',
      note: stats.readinessScore != null
        ? stats.readinessScore >= 80 ? 'Ahead of peer average' : 'Room to grow — check recommendations'
        : 'Complete your profile to get scored',
      color: 'text-green-400',
      to: '/dashboard/readiness',
    },
    {
      icon: <Star size={20} />,
      label: 'Profile Status',
      value: stats.profileComplete ? 'Active' : 'Incomplete',
      note: stats.profileComplete ? 'Your profile is visible to coaches' : 'Finish setting up your profile',
      color: 'text-yellow-400',
      to: '/dashboard/profile',
    },
    {
      icon: <Calendar size={20} />,
      label: 'Event Registrations',
      value: String(stats.upcomingEvents),
      note: stats.upcomingEvents === 0 ? 'No upcoming registrations' : `${stats.upcomingEvents} registered`,
      color: 'text-blue-400',
      to: '/dashboard/events',
    },
    {
      icon: <ShoppingBag size={20} />,
      label: 'Service Orders',
      value: String(stats.serviceOrders),
      note: stats.pendingOrders > 0 ? `${stats.pendingOrders} active` : stats.serviceOrders > 0 ? 'All orders complete' : 'No orders yet',
      color: 'text-orange-400',
      to: '/dashboard/services',
    },
  ]

  const quickLinks = [
    { label: 'Profile Optimizer', desc: 'Improve your recruiting profile', to: '/dashboard/profile/optimizer', icon: <User size={18} />, color: 'text-blue-400' },
    { label: 'Film Index', desc: 'Upload and manage game film', to: '/dashboard/film-index', icon: <TrendingUp size={18} />, color: 'text-green-400' },
    { label: 'Resources', desc: 'Guides, tools and learning materials', to: '/dashboard/resources', icon: <BookOpen size={18} />, color: 'text-yellow-400' },
    { label: 'ConnectGBB', desc: 'Community and training hub', to: '/connectgbb', icon: <Star size={18} />, color: 'text-purple-400' },
  ]

  return (
    <DashboardLayout
      variant="player"
      title={stats.playerName ? `Welcome back, ${stats.playerName.split(' ')[0]}` : 'Player Dashboard'}
      subtitle="Your hub for recruiting, development, and NIL."
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 animate-pulse">
            {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-navy-800 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map(c => (
              <Link key={c.label} to={c.to} className="card p-5 hover:bg-white/5 transition-colors group">
                <div className="flex items-center justify-between mb-2">
                  <span className={c.color}>{c.icon}</span>
                  <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
                <p className="text-3xl font-bold text-white mt-1">{c.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{c.label}</p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{c.note}</p>
              </Link>
            ))}
          </div>
        )}

        <div>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map(l => (
              <Link key={l.label} to={l.to} className="bg-navy-800 rounded-xl p-4 border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all group">
                <span className={`${l.color} mb-3 block`}>{l.icon}</span>
                <p className="text-sm font-semibold text-white">{l.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{l.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
