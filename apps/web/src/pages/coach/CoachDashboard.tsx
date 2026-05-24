import DashboardLayout from '../../components/layout/DashboardLayout'
import { Link } from 'react-router-dom'
import { Search, Star, Calendar, ArrowRight, FileText, TrendingUp, Users } from 'lucide-react'

const pipelineStats = [
  { label: 'Prospects', value: '24', change: '+3 this week', color: 'text-blue-600' },
  { label: 'Evaluations', value: '12', change: '4 pending review', color: 'text-[#FB6C1D]' },
  { label: 'Active Interviews', value: '3', change: '2 scheduled', color: 'text-green-600' },
  { label: 'Shortlist', value: '5', change: '2 contacted', color: 'text-[#C8A24A]' },
]

export default function CoachDashboard() {
  return (
    <DashboardLayout variant="coach" title="Coach Dashboard" subtitle="Search and track elite girls basketball prospects.">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {pipelineStats.map(s => (
            <div key={s.label} className="bg-navy-800 rounded-xl shadow-sm p-4">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.change}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <Link to="/coach/search" className="bg-navy-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-all flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-[#121B47] rounded-xl flex items-center justify-center text-[#FB6C1D]"><Search size={22} /></div>
            <h3 className="font-bold text-white">Search Players</h3>
            <p className="text-sm text-slate-400">Filter by class, position, GPA, state, and more.</p>
          </Link>
          <Link to="/coach/shortlist" className="bg-navy-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-all flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-[#121B47] rounded-xl flex items-center justify-center text-[#C8A24A]"><Star size={22} /></div>
            <h3 className="font-bold text-white">My Shortlist</h3>
            <p className="text-sm text-slate-400">View and manage your saved prospects with pipeline tracking.</p>
          </Link>
          <Link to="/coach/events" className="bg-navy-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-all flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-[#121B47] rounded-xl flex items-center justify-center text-green-500"><Calendar size={22} /></div>
            <h3 className="font-bold text-white">Events</h3>
            <p className="text-sm text-slate-400">Upcoming exposure events and evaluation windows.</p>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-[#121B47] to-[#0134BD] text-white p-6 rounded-xl">
          <h3 className="text-lg font-bold mb-2">Recruiting Pipeline</h3>
          <p className="text-blue-200 text-sm mb-4">Track prospects through the evaluation funnel: Saved → Contacted → Evaluation → Interview → Offer → Committed</p>
          <div className="flex items-center gap-2 text-sm">
            {['Saved', 'Contacted', 'Eval', 'Interview', 'Offer'].map((stage, i) => (
              <span key={stage} className="flex items-center gap-1">
                <span className="px-2 py-0.5 bg-white/20 rounded text-xs">{stage}</span>
                {i < 4 && <ArrowRight size={12} className="text-blue-300" />}
              </span>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
