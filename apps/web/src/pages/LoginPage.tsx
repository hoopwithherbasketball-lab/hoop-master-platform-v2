import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, hasRole } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setTimeout(() => {
      navigate('/dashboard')
    }, 300)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-navy-900 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-display font-bold text-lg">GBB</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-navy-900">Sign In</h1>
          <p className="text-slate-500 mt-2 text-sm">Welcome back to Elite GBB ProCoach</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (<div className="bg-error-50 text-error-600 text-sm px-4 py-3 rounded-lg border border-red-100">{error}</div>)}
            <div>
              <label className="label">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@email.com" required />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="........" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">{loading ? 'Signing in...' : 'Sign In'}</button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-5">Don't have an account? <Link to="/signup" className="text-royal-500 font-medium hover:underline">Create one</Link></p>
        </div>
      </div>
    </div>
  )
}
