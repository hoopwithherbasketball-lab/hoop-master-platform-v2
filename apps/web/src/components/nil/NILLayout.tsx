import { useState, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  ArrowUpRight,
  Building2,
  ChevronDown,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  ListTodo,
  Mail,
  Sparkles,
  Target,
  Users,
} from 'lucide-react'

const navigation = [
  { to: '/nil', label: 'Overview', icon: LayoutDashboard },
  { to: '/nil/opportunities', label: 'Opportunities', icon: Target },
  { to: '/nil/athletes', label: 'Athletes', icon: Users },
  { to: '/nil/companies', label: 'Brands', icon: Building2 },
  { to: '/nil/proposals', label: 'Proposals', icon: FileText },
  { to: '/nil/outreach', label: 'Outreach', icon: Mail },
  { to: '/nil/tasks', label: 'Tasks', icon: ListTodo },
  { to: '/nil/compliance', label: 'Compliance', icon: ClipboardCheck },
]

interface Props {
  children: ReactNode
  title?: string
  subtitle?: string
  action?: ReactNode
}

export default function NILLayout({
  children,
  title,
  subtitle,
  action,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="min-h-screen bg-[#0c1018] pt-16 text-slate-100 lg:flex">
      <aside className="border-b border-white/10 bg-[#111722] lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between p-5 lg:p-6">
          <Link
            to="/nil"
            className="flex items-center gap-3"
            aria-label="NIL Hub overview"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-royal-500">
              <Sparkles size={20} />
            </span>
            <span>
              <span className="block text-lg font-bold tracking-tight">
                NIL Hub<span className="text-brand-orange">.</span>
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[.18em] text-slate-400">
                Hoop With Her
              </span>
            </span>
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
            aria-label="Toggle NIL navigation"
            aria-expanded={menuOpen}
            aria-controls="nil-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <ChevronDown size={20} className={menuOpen ? 'rotate-180' : ''} />
          </button>
        </div>
        <div
          id="nil-navigation"
          className={`${menuOpen ? 'block' : 'hidden'} px-4 pb-5 lg:flex lg:h-[calc(100%_-_6rem)] lg:flex-col`}
        >
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.2em] text-slate-500">
            Workspace
          </p>
          <nav
            aria-label="NIL workspace"
            className="grid grid-cols-2 gap-1 lg:grid-cols-1"
          >
            {navigation.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/nil'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${isActive ? 'bg-royal-500 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`
                }
              >
                <Icon size={17} />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-8 space-y-3 border-t border-white/10 pt-5 lg:mt-auto">
            <p className="px-3 text-xs leading-relaxed text-slate-400">
              Build athlete visibility.
              <br />
              Create meaningful partnerships.
            </p>
            <Link
              to="/admin"
              className="flex items-center justify-between rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-white/5 hover:text-white"
            >
              Admin dashboard <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </aside>
      <main id="nil-content" className="min-w-0 flex-1">
        <header className="border-b border-white/10 px-5 py-6 sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.2em] text-brand-orange">
                Athlete opportunity workspace
              </p>
              <h1 className="font-sans text-2xl font-bold tracking-tight sm:text-3xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                  {subtitle}
                </p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        </header>
        <div className="mx-auto max-w-7xl space-y-6 p-5 sm:p-8 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  )
}
