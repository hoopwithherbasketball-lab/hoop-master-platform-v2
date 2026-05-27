import DashboardLayout from '../../components/layout/DashboardLayout'
import { BookOpen, Film, BarChart3, Target, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

const resources = [
  { icon: BookOpen, title: 'Recruiting Guide', desc: 'Step-by-step guide to the college recruiting process', link: '/recruiting-readiness' },
  { icon: Film, title: 'Film Index', desc: 'Upload and organize your game film and highlights', link: '/dashboard/film-index' },
  { icon: BarChart3, title: 'Analytics', desc: 'Track your performance stats and season trends', link: '/dashboard/analytics' },
  { icon: Target, title: 'NIL Guide', desc: 'Learn about NIL opportunities and brand building', link: '/nil-readiness' },
]

export default function ResourcesPage() {
  return (
    <DashboardLayout variant="player" title="Resources" subtitle="Available resources and learning materials">
      <div className="grid gap-4 md:grid-cols-2">
        {resources.map(r => (
          <Link key={r.title} to={r.link} className="card p-5 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-royal-500/10 rounded-xl flex items-center justify-center"><r.icon size={22} className="text-royal-400" /></div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">{r.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{r.desc}</p>
              </div>
              <ExternalLink size={16} className="text-slate-400" />
            </div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  )
}
