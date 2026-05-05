import DashboardLayout from '../../components/layout/DashboardLayout'
import { Link } from 'react-router-dom'
import { Search, Star, Calendar, ArrowRight } from 'lucide-react'

export default function CoachDashboard() {
  return (
    <DashboardLayout variant="coach" title="Coach Dashboard" subtitle="Search and track elite girls basketball prospects">
      <div className="grid md:grid-cols-3 gap-5 max-w-4xl">
        <Link to="/coach/search" className="card-hover flex flex-col items-center text-center py-8 gap-3">
          <div className="w-12 h-12 bg-navy-900 rounded-xl flex items-center justify-center text-brand-orange"><Search size={22} /></div>
          <h3 className="font-display text-lg font-bold text-navy-900">Search Players</h3>
          <p className="text-sm text-slate-500">Filter by class, position, GPA, state, and more.</p>
        </Link>
        <Link to="/coach/shortlist" className="card-hover flex flex-col items-center text-center py-8 gap-3">
          <div className="w-12 h-12 bg-navy-900 rounded-xl flex items-center justify-center text-brand-gold"><Star size={22} /></div>
          <h3 className="font-display text-lg font-bold text-navy-900">My Shortlist</h3>
          <p className="text-sm text-slate-500">View and manage your saved prospects.</p>
        </Link>
        <Link to="/coach/events" className="card-hover flex flex-col items-center text-center py-8 gap-3">
          <div className="w-12 h-12 bg-navy-900 rounded-xl flex items-center justify-center text-success-500"><Calendar size={22} /></div>
          <h3 className="font-display text-lg font-bold text-navy-900">Events</h3>
          <p className="text-sm text-slate-500">Upcoming exposure events and evaluation windows.</p>
        </Link>
      </div>
    </DashboardLayout>
  )
}
