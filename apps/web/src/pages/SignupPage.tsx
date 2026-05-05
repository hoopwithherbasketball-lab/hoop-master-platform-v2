import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import type { UserRole } from '../types/database'

const roles = [
  { value: 'player' as UserRole, label: 'Player / Athlete', desc: 'Build your recruit-ready profile' },
  { value: 'parent' as UserRole, label: 'Parent / Guardian', desc: 'Manage your athletes recruiting journey' },
  { value: 'coach' as UserRole, label: 'College / HS Coach', desc: 'Discover and track talent' },
  { value: 'club_admin' as UserRole, label: 'Club / Program Admin', desc: 'Manage your roster and workshops' },
]

export default function SignupPage() {
  const [searchParams] = useSearchParams()
  const defaultRole = (searchParams.get('role') as UserRole) || 'player'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>(defaultRole)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setError('')
    setLoading(true)
    const { error } = await signUp(email, password, role)
    if (error) { setError(error.message); setLoading(false); return }
    navigate(role === 'coach' ? '/coach' : role === 'admin' ? '/admin' : '/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 pt-16 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-navy-900 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-display font-bold text-lg">GBB</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-navy-900">Create Your Account</h1>
          <p className="text-slate-500 mt-2 text-sm">Join Elite GBB ProCoach</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (<div className="bg-error-50 text-error-600 text-sm px-4 py-3 rounded-lg border border-red-100">{error}</div>)}
            <div>
              <label className="label">I am a...</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {roles.map(r => (
                  <button key={r.value} type="button" onClick={() => setRole(r.value)} className={`p-3 rounded-xl border-2 text-left transition-all ${role === r.value ? 'border-royal-500 bg-royal-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <p className={`text-sm font-semibold ${role === r.value ? 'text-royal-600' : 'text-slate-800'}`}>{r.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-tight">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <div><label className="label">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@email.com" required /></div>
            <div><label className="label">Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="Min. 6 characters" required /></div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">{loading ? 'Creating account...' : 'Create Account'}</button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-5">Already have an account? <Link to="/login" className="text-royal-500 font-medium hover:underline">Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}
