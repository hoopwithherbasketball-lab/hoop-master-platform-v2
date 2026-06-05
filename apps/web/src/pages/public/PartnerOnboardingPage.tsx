import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Building2, Users, GraduationCap, ClipboardList, CircleCheck as CheckCircle, ChevronRight } from 'lucide-react'

const ROLES = [
  { value: 'coach', label: 'College / High School Coach', icon: <GraduationCap size={20} /> },
  { value: 'business', label: 'Business / Brand', icon: <Building2 size={20} /> },
  { value: 'club_admin', label: 'Club / AAU Organization', icon: <Users size={20} /> },
  { value: 'staff', label: 'Athletic Staff / Scout', icon: <ClipboardList size={20} /> },
]

export default function PartnerOnboardingPage() {
  const [role, setRole] = useState('')
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', organization: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role) { setError('Please select your role.'); return }
    setSubmitting(true)
    setError('')
    try {
      const { error: err } = await supabase.from('leads').insert({
        lead_type: 'partner',
        first_name: form.first_name || null,
        last_name: form.last_name || null,
        email: form.email || null,
        phone: form.phone || null,
        source: role,
        interest: [form.organization, form.message].filter(Boolean).join(' — ') || null,
        status: 'new',
      })
      if (err) throw err
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Application Received!</h1>
          <p className="text-slate-400 mb-6">Thank you for your interest in partnering with Elite GBB. Our team will be in touch within 1-2 business days.</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">Back to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-900">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <span className="inline-block bg-[#0134BD]/20 text-[#6b9df4] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">Partner Onboarding</span>
          <h1 className="text-3xl font-bold text-white mb-3">Join the Elite GBB Partner Network</h1>
          <p className="text-slate-400 text-base">Connect with top girls basketball athletes, families, and programs. We work with coaches, businesses, clubs, and staff.</p>
        </div>

        <div className="bg-navy-800 rounded-2xl border border-white/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">I am a... <span className="text-red-400">*</span></label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${role === r.value ? 'border-[#0134BD] bg-[#0134BD]/10 text-white' : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white'}`}
                  >
                    <span className={role === r.value ? 'text-[#6b9df4]' : ''}>{r.icon}</span>
                    <span className="text-sm font-medium leading-tight">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">First Name <span className="text-red-400">*</span></label>
                <input required value={form.first_name} onChange={update('first_name')} placeholder="Jane" className="w-full p-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-slate-500 outline-none focus:border-[#0134BD] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Last Name <span className="text-red-400">*</span></label>
                <input required value={form.last_name} onChange={update('last_name')} placeholder="Smith" className="w-full p-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-slate-500 outline-none focus:border-[#0134BD] text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email Address <span className="text-red-400">*</span></label>
              <input required type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" className="w-full p-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-slate-500 outline-none focus:border-[#0134BD] text-sm" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Phone</label>
                <input type="tel" value={form.phone} onChange={update('phone')} placeholder="(555) 000-0000" className="w-full p-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-slate-500 outline-none focus:border-[#0134BD] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Organization / School</label>
                <input value={form.organization} onChange={update('organization')} placeholder="Team or company name" className="w-full p-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-slate-500 outline-none focus:border-[#0134BD] text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">How can we work together?</label>
              <textarea value={form.message} onChange={update('message')} rows={4} placeholder="Tell us about your goals, what you're looking for, or how you'd like to partner with Elite GBB..." className="w-full p-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-slate-500 outline-none focus:border-[#0134BD] text-sm resize-none" />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-[#0134BD] hover:bg-[#002a80] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors">
              {submitting ? 'Submitting...' : 'Submit Partner Application'}
              {!submitting && <ChevronRight size={16} />}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#6b9df4] hover:text-white transition-colors">Sign in here</Link>
        </p>
      </div>
    </div>
  )
}
