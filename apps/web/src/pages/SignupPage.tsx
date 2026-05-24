import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { SignupForm } from '../lib/auth'
import type { UserRole } from '@hoop-master/types'

export default function SignupPage() {
  const [searchParams] = useSearchParams()
  const defaultRole = (searchParams.get('role') as UserRole) || 'player'
  const navigate = useNavigate()

  const handleSuccess = (role: UserRole) => {
    navigate(role === 'coach' ? '/coach' : role === 'admin' ? '/admin' : '/dashboard')
  }

  return (
    <div className="min-h-screen bg-white/5 flex items-center justify-center px-4 pt-16 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-navy-900 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-display font-bold text-lg">GBB</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Create Your Account</h1>
          <p className="text-slate-500 mt-2 text-sm">Join Elite GBB ProCoach</p>
        </div>
        <div className="card">
          <SignupForm onSuccess={handleSuccess} defaultRole={defaultRole} />
          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-royal-500 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
