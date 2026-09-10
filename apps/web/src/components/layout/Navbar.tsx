import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, LayoutDashboard, Users, ShieldCheck, BookOpen, Tv } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import NotificationBell from '../ui/NotificationBell'

interface ModuleLink { label: string; to: string; icon: React.ReactNode; desc: string }

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, signOut, hasRole, roles } = useAuth()
  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLDivElement>(null)

  async function handleSignOut() { await signOut(); navigate('/') }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function getModules(): ModuleLink[] {
    const modules: ModuleLink[] = []
    if (!user) return modules
    modules.push({ label: 'Player Dashboard', to: '/dashboard', icon: <LayoutDashboard size={14} />, desc: 'Profile, readiness & services' })
    if (hasRole('coach')) modules.push({ label: 'Coach Tools', to: '/coach', icon: <Users size={14} />, desc: 'Search, shortlist & evaluate' })
    if (hasRole('admin')) modules.push({ label: 'Admin Panel', to: '/admin', icon: <ShieldCheck size={14} />, desc: 'Platform operations' })
    if (hasRole('admin')) modules.push({ label: 'NIL Hub', to: '/nil', icon: <BookOpen size={14} />, desc: 'Opportunities & outreach' })
    modules.push({ label: 'EliteGBB', to: '/elitegbb', icon: <Tv size={14} />, desc: 'Community & training' })
    return modules
  }

  const modules = getModules()
  const primaryDashboard = hasRole('admin') ? '/admin' : hasRole('coach') ? '/coach' : '/dashboard'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-900 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center"><span className="text-white font-display font-bold text-sm">GBB</span></div>
            <div><span className="font-display font-bold text-white text-lg leading-none">Elite GBB</span><span className="block text-xs text-slate-400 leading-none">ProCoach</span></div>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <Link to="/watch" className="text-slate-300 hover:text-white px-2.5 py-1.5 text-sm font-medium transition-colors">Watch</Link>
            <Link to="/browse" className="text-slate-300 hover:text-white px-2.5 py-1.5 text-sm font-medium transition-colors">Browse Players</Link>
            <Link to="/services" className="text-slate-300 hover:text-white px-2.5 py-1.5 text-sm font-medium transition-colors">Services</Link>
            {!user && <Link to="/elitegbb" className="text-slate-300 hover:text-white px-2.5 py-1.5 text-sm font-medium transition-colors">Create Profile</Link>}
            <Link to="/recruiting-readiness" className="text-slate-300 hover:text-white px-2.5 py-1.5 text-sm font-medium transition-colors">Get Recruit-Ready</Link>
            {!user && <Link to="/partner-onboarding" className="text-slate-300 hover:text-white px-2.5 py-1.5 text-sm font-medium transition-colors">Partners</Link>}
            {!user && <Link to="/workshops" className="text-slate-300 hover:text-white px-2.5 py-1.5 text-sm font-medium transition-colors">Workshops</Link>}
          </div>
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <NotificationBell />
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 text-white text-sm font-medium hover:text-orange-400 transition-colors"
                  >
                    <div className="w-7 h-7 bg-royal-500 rounded-full flex items-center justify-center text-xs font-bold">
                      {user.email?.[0].toUpperCase()}
                    </div>
                    <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-navy-800 rounded-xl shadow-xl border border-white/10 py-2 z-50">
                      <div className="px-4 py-2 border-b border-white/10 mb-1">
                        <p className="text-xs text-slate-500">Signed in as</p>
                        <p className="text-sm font-medium text-white truncate">{user.email}</p>
                        {roles.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {roles.map(r => (
                              <span key={r} className="text-[10px] uppercase tracking-wide bg-[#0134BD]/20 text-[#6b9df4] px-1.5 py-0.5 rounded">{r}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="px-2">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 px-2 py-1.5">My Modules</p>
                        {modules.map(m => (
                          <Link
                            key={m.to}
                            to={m.to}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-start gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                          >
                            <span className="text-slate-400 group-hover:text-[#0134BD] mt-0.5 transition-colors">{m.icon}</span>
                            <div>
                              <p className="text-sm text-gray-200 font-medium leading-tight">{m.label}</p>
                              <p className="text-xs text-slate-500">{m.desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-white/10 mt-2 pt-2 px-2">
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left flex items-center gap-3 px-2 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-sm"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">Sign In</Link>
                <Link to="/signup" className="btn-primary py-2 text-sm">Get Started</Link>
              </>
            )}
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden text-white p-1.5">{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-navy-900 border-t border-white/10 px-4 py-4 space-y-1">
          <Link to="/watch" onClick={() => setOpen(false)} className="block text-slate-300 px-3 py-2 text-sm rounded-lg hover:bg-white/10">Watch</Link>
          <Link to="/browse" onClick={() => setOpen(false)} className="block text-slate-300 px-3 py-2 text-sm rounded-lg hover:bg-white/10">Browse Players</Link>
          <Link to="/services" onClick={() => setOpen(false)} className="block text-slate-300 px-3 py-2 text-sm rounded-lg hover:bg-white/10">Services</Link>
          <Link to="/recruiting-readiness" onClick={() => setOpen(false)} className="block text-slate-300 px-3 py-2 text-sm rounded-lg hover:bg-white/10">Get Recruit-Ready</Link>
          {user ? (
            <>
              <div className="border-t border-white/10 pt-3 mt-2">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 px-3 mb-2">My Modules</p>
                {modules.map(m => (
                  <Link key={m.to} to={m.to} onClick={() => setOpen(false)} className="flex items-center gap-2 text-gray-300 px-3 py-2 text-sm rounded-lg hover:bg-white/10">
                    <span className="text-slate-400">{m.icon}</span>{m.label}
                  </Link>
                ))}
              </div>
              <button onClick={handleSignOut} className="block w-full text-left text-red-400 px-3 py-2 text-sm rounded-lg hover:bg-white/10 mt-1">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="block text-slate-300 px-3 py-2 text-sm rounded-lg hover:bg-white/10">Sign In</Link>
              <Link to="/signup" onClick={() => setOpen(false)} className="block text-center btn-primary py-2 text-sm mt-2">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
