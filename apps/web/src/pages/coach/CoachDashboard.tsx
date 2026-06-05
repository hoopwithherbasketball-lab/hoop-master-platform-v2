import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { Search, Star, Calendar, ArrowRight, Users, FileText, TrendingUp } from 'lucide-react'

interface PipelineStats {
  prospects: number
  shortlisted: number
  evaluations: number
  events: number
}

export default function CoachDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<PipelineStats>({ prospects: 0, shortlisted: 0, evaluations: 0, events: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function load() {
      const [prospectsRes, shortlistRes, evalsRes, eventsRes] = await Promise.all([
        supabase.from('player_profiles').select('id', { count: 'exact', head: true }).eq('is_public', true),
        supabase.from('coach_saved_players').select('id', { count: 'exact', head: true }).eq('coach_user_id', user!.id),
        supabase.from('audit_results').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      ])
      setStats({
        prospects: prospectsRes.count ?? 0,
        shortlisted: shortlistRes.count ?? 0,
        evaluations: evalsRes.count ?? 0,
        events: eventsRes.count ?? 0,
      })
      setLoading(false)
    }
    load()
  }, [user])

  const statCards = [
    { label: 'Public Prospects', value: stats.prospects, icon: <Users size={18} />, color: 'text-blue-400' },
    { label: 'My Shortlist', value: stats.shortlisted, icon: <Star size={18} />, color: 'text-yellow-400' },
    { label: 'Evaluations', value: stats.evaluations, icon: <FileText size={18} />, color: 'text-orange-400' },
    { label: 'Active Events', value: stats.events, icon: <Calendar size={18} />, color: 'text-green-400' },
  ]

  return (
    <DashboardLayout variant="coach" title="Coach Dashboard" subtitle="Search and track elite girls basketball prospects.">
      <div className="max-w-5xl mx-auto space-y-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-navy-800 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map(s => (
              <div key={s.label} className="bg-navy-800 rounded-xl p-4 border border-white/5">
                <span className={s.color}>{s.icon}</span>
                <p className="text-2xl font-bold text-white mt-2">{s.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-5">
          <Link to="/coach/search" className="bg-navy-800 rounded-xl p-6 border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all flex flex-col items-center text-center gap-3 group">
            <div className="w-12 h-12 bg-[#121B47] rounded-xl flex items-center justify-center text-[#FB6C1D]"><Search size={22} /></div>
            <h3 className="font-bold text-white">Search Players</h3>
            <p className="text-sm text-slate-400">Filter by class, position, GPA, state, and more.</p>
            <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors mt-auto" />
          </Link>
          <Link to="/coach/shortlist" className="bg-navy-800 rounded-xl p-6 border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all flex flex-col items-center text-center gap-3 group">
            <div className="w-12 h-12 bg-[#121B47] rounded-xl flex items-center justify-center text-[#C8A24A]"><Star size={22} /></div>
            <h3 className="font-bold text-white">My Shortlist</h3>
            <p className="text-sm text-slate-400">View and manage saved prospects with pipeline tracking.</p>
            <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors mt-auto" />
          </Link>
          <Link to="/coach/events" className="bg-navy-800 rounded-xl p-6 border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all flex flex-col items-center text-center gap-3 group">
            <div className="w-12 h-12 bg-[#121B47] rounded-xl flex items-center justify-center text-green-500"><Calendar size={22} /></div>
            <h3 className="font-bold text-white">Events</h3>
            <p className="text-sm text-slate-400">Upcoming exposure events and evaluation windows.</p>
            <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors mt-auto" />
          </Link>
        </div>

        <div className="bg-gradient-to-r from-[#121B47] to-[#0134BD] text-white p-6 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} />
            <h3 className="text-lg font-bold">Recruiting Pipeline</h3>
          </div>
          <p className="text-blue-200 text-sm mb-4">Track prospects through the evaluation funnel: Saved → Contacted → Evaluation → Interview → Offer → Committed</p>
          <div className="flex items-center gap-2 text-sm flex-wrap">
            {['Saved', 'Contacted', 'Eval', 'Interview', 'Offer', 'Committed'].map((stage, i) => (
              <span key={stage} className="flex items-center gap-1">
                <span className="px-2 py-0.5 bg-white/20 rounded text-xs">{stage}</span>
                {i < 5 && <ArrowRight size={12} className="text-blue-300" />}
              </span>
            ))}
          </div>
          <Link to="/coach/shortlist" className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
            View Pipeline <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
