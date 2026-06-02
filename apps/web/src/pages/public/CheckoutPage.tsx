import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageShell } from '@hoop-master/ui'

const plans: Record<string, { title: string; description: string; price: string; features: string[] }> = {
  'recruiting-review': {
    title: 'Recruiting Review',
    description: 'Complete recruiting profile review with school recommendations.',
    price: '$299',
    features: ['Profile Analysis', 'School Matching', 'Coach Outreach Guide', 'Follow-up Session'],
  },
  'nil-assessment': {
    title: 'NIL Assessment',
    description: 'Brand and sponsorship readiness review.',
    price: '$249',
    features: ['Brand Evaluation', 'Sponsorship Matching', 'Compliance Review', 'Action Plan'],
  },
  'performance-audit': {
    title: 'Performance Audit',
    description: 'On-court and strength evaluation with a training plan.',
    price: '$199',
    features: ['Skill Assessment', 'Strength Evaluation', 'Training Plan', 'Progress Tracking'],
  },
}

export default function CheckoutPage() {
  const { slug } = useParams()
  const plan = slug ? plans[slug] : null
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  if (!plan) {
    return (
      <PageShell title="Checkout" description="Select a valid service plan." badge="Checkout">
        <div className="text-center py-16">
          <p className="text-slate-400 text-lg mb-4">No plan selected.</p>
          <Link
            to="/services"
            className="bg-[#0134BD] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#002a80] transition-colors"
          >
            View Services
          </Link>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell title={`Checkout — ${plan.title}`} description={`Complete purchase of ${plan.title}`} badge="Checkout">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Order Summary */}
        <div className="bg-navy-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-white mb-4">Order Summary</h2>
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div>
              <h3 className="font-semibold text-white">{plan.title}</h3>
              <p className="text-sm text-slate-400">{plan.description}</p>
            </div>
            <span className="text-2xl font-bold text-[#FB6C1D]">{plan.price}</span>
          </div>
          <div className="space-y-2 mb-4">
            {plan.features.map((feature) => (
              <div key={feature} className="flex items-center text-sm text-slate-400">
                <svg className="w-4 h-4 text-[#0134BD] mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-lg font-semibold text-white">Total</span>
            <span className="text-2xl font-bold text-white">{plan.price}</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-navy-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full p-2 border border-white/20 rounded-md focus:ring-[#0134BD] focus:border-[#0134BD]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-2 border border-white/20 rounded-md focus:ring-[#0134BD] focus:border-[#0134BD]"
              />
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button
          disabled={!name || !email}
          className="w-full bg-[#FB6C1D] hover:bg-[#e55a1a] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors"
        >
          Complete Purchase — {plan.price}
        </button>

        <p className="text-center text-sm text-gray-400">
          Secure checkout. You will be redirected to complete payment.
        </p>
      </div>
    </PageShell>
  )
}
