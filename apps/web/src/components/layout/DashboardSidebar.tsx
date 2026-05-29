import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, User, Star, Calendar, ShoppingBag, BookOpen, Users, ClipboardList, ChartBar as BarChart3, Settings, LogOut, Target, GraduationCap, Building2, ShieldCheck, Mail, CheckSquare, MessageSquare, Radio, Tv, CalendarClock, Megaphone, FileVideo, BarChart, Globe } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import { useNavigate } from 'react-router-dom'

interface NavItem {
  label: string
  to: string
  icon: React.ReactNode
}

const playerNav: NavItem[] = [
  { label: 'Overview', to: '/dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'My Profile', to: '/dashboard/profile', icon: <User size={16} /> },
  { label: 'Profile Optimizer', to: '/dashboard/profile/optimizer', icon: <Target size={16} /> },
  { label: 'Readiness Score', to: '/dashboard/readiness', icon: <Star size={16} /> },
  { label: 'Events', to: '/dashboard/events', icon: <Calendar size={16} /> },
  { label: 'Services', to: '/dashboard/services', icon: <ShoppingBag size={16} /> },
  { label: 'Resources', to: '/dashboard/resources', icon: <BookOpen size={16} /> },
  { label: 'Parent Center', to: '/dashboard/parent', icon: <GraduationCap size={16} /> },
]

const coachNav: NavItem[] = [
  { label: 'Dashboard', to: '/coach', icon: <LayoutDashboard size={16} /> },
  { label: 'Search Players', to: '/coach/search', icon: <Users size={16} /> },
  { label: 'My Shortlist', to: '/coach/shortlist', icon: <Star size={16} /> },
  { label: 'Events', to: '/coach/events', icon: <Calendar size={16} /> },
]

const nilNav: NavItem[] = [
  { label: 'NIL Overview', to: '/nil', icon: <LayoutDashboard size={16} /> },
  { label: 'Companies', to: '/nil/companies', icon: <Building2 size={16} /> },
  { label: 'Opportunities', to: '/nil/opportunities', icon: <Target size={16} /> },
  { label: 'Athlete Profiles', to: '/nil/athletes', icon: <User size={16} /> },
  { label: 'Outreach Inbox', to: '/nil/outreach', icon: <Mail size={16} /> },
  { label: 'Compliance', to: '/nil/compliance', icon: <ShieldCheck size={16} /> },
  { label: 'Tasks', to: '/nil/tasks', icon: <CheckSquare size={16} /> },
]

const adminNav: NavItem[] = [
  { label: 'Overview', to: '/admin', icon: <LayoutDashboard size={16} /> },
  { label: 'Leads', to: '/admin/leads', icon: <Users size={16} /> },
  { label: 'Orders', to: '/admin/orders', icon: <ShoppingBag size={16} /> },
  { label: 'Audits', to: '/admin/audits', icon: <ClipboardList size={16} /> },
  { label: 'Players', to: '/admin/players', icon: <User size={16} /> },
  { label: 'Reports', to: '/admin/reports', icon: <BarChart3 size={16} /> },
  { label: 'Training Content', to: '/admin/training', icon: <BookOpen size={16} /> },
  { label: 'Intake Submissions', to: '/admin/intake', icon: <User size={16} /> },
  { label: 'Community Feed', to: '/admin/feed', icon: <MessageSquare size={16} /> },
]

const mediaNav: NavItem[] = [
  { label: 'Channels', to: '/admin/channels', icon: <Radio size={16} /> },
  { label: 'Assets', to: '/admin/assets', icon: <FileVideo size={16} /> },
  { label: 'Schedules', to: '/admin/schedules', icon: <CalendarClock size={16} /> },
  { label: 'Ad Slots', to: '/admin/ad-slots', icon: <Megaphone size={16} /> },
  { label: 'Analytics', to: '/admin/analytics', icon: <BarChart size={16} /> },
  { label: 'Tenants', to: '/admin/tenants', icon: <Globe size={16} /> },
]

interface Props {
  variant: 'player' | 'coach' | 'admin'
}

export default function DashboardSidebar({ variant }: Props) {
  const location = useLocation()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const navItems = variant === 'admin' ? adminNav : variant === 'coach' ? coachNav : playerNav

  async function handleSignOut() { await signOut(); navigate('/') }
  function isActive(to: string) {
    if (to === '/dashboard' || to === '/coach' || to === '/admin') return location.pathname === to
    return location.pathname.startsWith(to)
  }

  return (
    <aside className="w-64 bg-navy-800 border-r border-white/10 h-screen sticky top-16 flex flex-col overflow-y-auto">
      <div className="p-4 flex-1">
        <div className="mb-6 px-4 py-3 bg-white/5 rounded-xl">
          <p className="text-xs text-slate-500 font-medium">Signed in as</p>
          <p className="text-sm font-semibold text-gray-200 truncate mt-0.5">{user?.email}</p>
          <span className="badge badge-navy mt-1.5 capitalize">{variant}</span>
        </div>
        <nav className="space-y-0.5">
          {variant === 'admin' && (<div className="mt-8 mb-2 px-4"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Media Platform</p></div>)}
          {variant === 'admin' && mediaNav.map(item => (<Link key={item.to} to={item.to} className={isActive(item.to) ? 'sidebar-link-active' : 'sidebar-link-inactive'}>{item.icon}<span>{item.label}</span></Link>))}
          {variant === 'admin' && (<div className="mt-8 mb-2 px-4"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">NIL and Sponsorship</p></div>)}
          {variant === 'admin' && nilNav.map(item => (<Link key={item.to} to={item.to} className={isActive(item.to) ? 'sidebar-link-active' : 'sidebar-link-inactive'}>{item.icon}<span>{item.label}</span></Link>))}
          {variant === 'admin' && (<div className="mt-8 mb-2 px-4"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operations</p></div>)}
          {navItems.map(item => (<Link key={item.to} to={item.to} className={isActive(item.to) ? 'sidebar-link-active' : 'sidebar-link-inactive'}>{item.icon}<span>{item.label}</span></Link>))}
        </nav>
      </div>
      <div className="p-4 border-t border-white/10">
        <button onClick={handleSignOut} className="sidebar-link-inactive w-full text-red-400 hover:bg-red-500/20 hover:text-red-300"><LogOut size={16} /><span>Sign Out</span></button>
      </div>
    </aside>
  )
}
