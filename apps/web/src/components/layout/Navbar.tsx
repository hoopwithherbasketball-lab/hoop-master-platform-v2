import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import NotificationBell from '../ui/NotificationBell'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, signOut, hasRole } = useAuth()
  const navigate = useNavigate()

  function getDashboardPath() { if (hasRole('admin')) return '/admin'; if (hasRole('coach')) return '/coach'; return '/dashboard' }
  async function handleSignOut() { await signOut(); navigate('/') }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-900 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center"><span className="text-white font-display font-bold text-sm">GBB</span></div>
            <div><span className="font-display font-bold text-white text-lg leading-none">Elite GBB</span><span className="block text-xs text-slate-400 leading-none">ProCoach</span></div>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <Link to="/browse" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Browse Players</Link>
            <Link to="/services" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Services</Link>
            <Link to="/recruiting-readiness" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Get Recruit-Ready</Link>
            <Link to="/nil-readiness" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">NIL Guide</Link>
            <Link to="/workshops" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Workshops</Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <><NotificationBell />
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 text-white text-sm font-medium hover:text-orange-400 transition-colors">
                  <div className="w-7 h-7 bg-royal-500 rounded-full flex items-center justify-center text-xs font-bold">{user.email?.[0].toUpperCase()}</div>
                  <ChevronDown size={14} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-navy-800 rounded-xl shadow-lg border border-white/10 py-1.5 z-50">
                    <Link to={getDashboardPath()} onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5">Dashboard</Link>
                    <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20">Sign Out</button>
                  </div>
                )}
              </div>
              </>
            ) : (
              <><Link to="/login" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">Sign In</Link><Link to="/signup" className="btn-primary py-2 text-sm">Get Started</Link></>
            )}
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden text-white p-1.5">{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-navy-900 border-t border-white/10 px-4 py-4 space-y-1">
          <Link to="/browse" onClick={() => setOpen(false)} className="block text-slate-300 px-3 py-2 text-sm rounded-lg hover:bg-white/10">Browse Players</Link>
          <Link to="/services" onClick={() => setOpen(false)} className="block text-slate-300 px-3 py-2 text-sm rounded-lg hover:bg-white/10">Services</Link>
          <Link to="/recruiting-readiness" onClick={() => setOpen(false)} className="block text-slate-300 px-3 py-2 text-sm rounded-lg hover:bg-white/10">Get Recruit-Ready</Link>
          {user ? (
            <><Link to={getDashboardPath()} onClick={() => setOpen(false)} className="block text-white px-3 py-2 text-sm font-medium rounded-lg bg-royal-500">Dashboard</Link><button onClick={handleSignOut} className="block w-full text-left text-red-400 px-3 py-2 text-sm rounded-lg hover:bg-white/10">Sign Out</button></>
          ) : (
            <><Link to="/login" onClick={() => setOpen(false)} className="block text-slate-300 px-3 py-2 text-sm rounded-lg hover:bg-white/10">Sign In</Link><Link to="/signup" onClick={() => setOpen(false)} className="block text-center btn-primary py-2 text-sm mt-2">Get Started</Link></>
          )}
        </div>
      )}
    </nav>
  )
}
