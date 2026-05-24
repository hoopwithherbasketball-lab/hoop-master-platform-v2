import { useState } from 'react'
import { useAuth } from '../contexts/AuthContextValue.js'
import type { UserRole } from '@hoop-master/types'

interface SignupFormProps {
  onSuccess?: (role: UserRole) => void
  defaultRole?: UserRole
  className?: string
}

const roles = [
  { value: 'player' as UserRole, label: 'Player / Athlete', desc: 'Build your recruit-ready profile' },
  { value: 'parent' as UserRole, label: 'Parent / Guardian', desc: 'Manage your athletes recruiting journey' },
  { value: 'coach' as UserRole, label: 'College / HS Coach', desc: 'Discover and track talent' },
  { value: 'club_admin' as UserRole, label: 'Club / Program Admin', desc: 'Manage your roster and workshops' },
]

export function SignupForm({ onSuccess, defaultRole = 'player', className = '' }: SignupFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>(defaultRole)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setError('')
    setLoading(true)
    const { error } = await signUp(email, password, role)
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    onSuccess?.(role)
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-5 ${className}`}>
      {error && (
        <div className="bg-red-500/10 text-red-400 text-sm px-4 py-3 rounded-lg border border-red-500/20">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">I am a...</label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {roles.map(r => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                role === r.value
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <p className={`text-sm font-semibold ${
                role === r.value ? 'text-blue-400' : 'text-gray-200'
              }`}>
                {r.label}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 leading-tight">{r.desc}</p>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="input-dark w-full px-3 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="you@email.com"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="input-dark w-full px-3 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Min. 6 characters"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-2 px-4"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  )
}