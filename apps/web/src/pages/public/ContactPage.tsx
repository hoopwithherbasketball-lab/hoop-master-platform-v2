import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { PageShell, PageSection, CTABanner } from '@hoop-master/ui'
import { CircleCheck as CheckCircle, Loader as Loader2 } from 'lucide-react'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !message) return
    setFormState('submitting')
    setErrorMsg('')

    const nameParts = name.trim().split(/\s+/)
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ') || null

    const { error } = await supabase.from('leads').insert({
      first_name: firstName,
      last_name: lastName,
      email,
      interest: message,
      source: 'contact_form',
      lead_type: 'inquiry',
      status: 'new',
    })

    if (error) {
      setErrorMsg('Something went wrong. Please try again.')
      setFormState('error')
      return
    }

    setFormState('success')
  }

  if (formState === 'success') {
    return (
      <PageShell title="Contact Elite GBB" description="Connect with our team for recruiting, NIL, and development planning." badge="Contact">
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
          <p className="text-slate-400 mb-8">Thanks for reaching out. Our team will get back to you within 24 hours.</p>
          <Link to="/" className="bg-[#0134BD] hover:bg-[#002a80] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Back to Home
          </Link>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell title="Contact Elite GBB" description="Connect with our team for recruiting, NIL, and development planning." badge="Contact">
      <PageSection className="max-w-2xl mx-auto" title="Get in Touch">
        <div className="bg-navy-800 p-8 rounded-lg shadow-md border border-white/10">
          <p className="text-slate-400 mb-8 leading-relaxed">
            Have questions about services, workshops, or player development strategy? Our team is ready to provide tailored guidance.
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input
                data-testid="contact-name-input"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full p-2 border border-white/20 rounded-md bg-transparent text-white placeholder-slate-600 focus:outline-none focus:ring-[#0134BD] focus:border-[#0134BD]"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                data-testid="contact-email-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full p-2 border border-white/20 rounded-md bg-transparent text-white placeholder-slate-600 focus:outline-none focus:ring-[#0134BD] focus:border-[#0134BD]"
                placeholder="Your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
              <textarea
                data-testid="contact-message-input"
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                className="w-full p-2 border border-white/20 rounded-md bg-transparent text-white placeholder-slate-600 focus:outline-none focus:ring-[#0134BD] focus:border-[#0134BD] resize-none"
                placeholder="How can we help?"
              />
            </div>
            {formState === 'error' && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {errorMsg}
              </div>
            )}
            <button
              data-testid="contact-send-message-button"
              type="submit"
              disabled={!name || !email || !message || formState === 'submitting'}
              className="flex items-center gap-2 bg-[#0134BD] hover:bg-[#002a80] disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-6 rounded-md font-semibold transition-colors"
            >
              {formState === 'submitting' ? (
                <><Loader2 size={16} className="animate-spin" /> Sending...</>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>
      </PageSection>

      <CTABanner
        title="Need Help Selecting the Right Path?"
        description="Review service packages and workshops designed for athletes targeting competitive recruiting outcomes."
        actions={[
          { label: 'View our services', href: '/services', testId: 'contact-view-services-link' },
          { label: 'View workshops', href: '/workshops', variant: 'secondary', testId: 'contact-view-workshops-link' },
        ]}
        LinkComponent={Link}
      />
    </PageShell>
  )
}
