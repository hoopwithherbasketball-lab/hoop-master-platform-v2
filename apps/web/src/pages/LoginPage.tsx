import { Link, useNavigate } from 'react-router-dom'
import { LoginForm } from '../lib/auth'

export default function LoginPage() {
  const navigate = useNavigate()

  const handleSuccess = () => {
    setTimeout(() => {
      navigate('/dashboard')
    }, 300)
  }

  return (
    <div className="min-h-screen bg-white/5 flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-navy-900 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-display font-bold text-lg">GBB</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Sign In</h1>
          <p className="text-slate-500 mt-2 text-sm">Welcome back to Elite GBB ProCoach</p>
        </div>
        <div className="card">
          <LoginForm onSuccess={handleSuccess} />
          <p className="text-center text-sm text-slate-500 mt-5">
            Don't have an account?{' '}
            <Link to="/signup" className="text-royal-500 font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
