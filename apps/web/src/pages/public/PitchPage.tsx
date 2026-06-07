import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader2, CheckCircle2, TrendingUp, Users, Tv } from 'lucide-react'

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3001'

interface Proposal {
  id: string
  status: string
  crm_partners: { business_name: string; contact_name: string }
  package_details: {
    items: Array<{ id: string; slot_name: string; price: number }>
    baseTotal: number
    finalPrice: number
  }
}

export default function PitchPage() {
  const { id } = useParams<{ id: string }>()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [accepting, setAccepting] = useState(false)

  useEffect(() => {
    async function fetchProposal() {
      try {
        const res = await fetch(`${API_URL}/api/proposals/${id}`)
        if (!res.ok) throw new Error('Proposal not found or expired')
        const data = await res.json()
        setProposal(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProposal()
  }, [id])

  const acceptProposal = async () => {
    setAccepting(true)
    try {
      const res = await fetch(`${API_URL}/api/proposals/${id}/accept`, { method: 'PATCH' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to accept')
      
      toast.success('Contract Approved!')
      setProposal(prev => prev ? { ...prev, status: 'Accepted' } : null)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setAccepting(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-[#000000] flex items-center justify-center"><Loader2 className="animate-spin text-[#fb6c1d]" size={48} /></div>
  if (error || !proposal) return <div className="min-h-screen bg-[#000000] flex items-center justify-center text-white text-xl">{error}</div>

  const isAccepted = proposal.status === 'Accepted'

  return (
    <div className="min-h-screen bg-[#000000] text-slate-200 pb-32">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-[#000000] pt-24 pb-16 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#fb6c1d]/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-[#fb6c1d] font-bold tracking-wider uppercase mb-4">Official Partnership Proposal</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">A Custom Partnership Proposal for {proposal.crm_partners.business_name}</h1>
          <p className="text-xl text-slate-400">Join HOOP WITH HER and empower the next generation of elite female athletes.</p>
        </div>
      </div>

      {/* Platform Reach */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Platform Reach & Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center hover:border-slate-700 transition-colors">
            <Users className="mx-auto text-[#fb6c1d] mb-4" size={32} />
            <h3 className="text-xl font-bold text-white mb-2">150+ Elite Athletes</h3>
            <p className="text-slate-400 text-sm">Directly supporting 8th-12th grade female basketball prospects in your community.</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center hover:border-slate-700 transition-colors">
            <Tv className="mx-auto text-[#fb6c1d] mb-4" size={32} />
            <h3 className="text-xl font-bold text-white mb-2">5,000+ Roku Views</h3>
            <p className="text-slate-400 text-sm">Monthly viewership across our bespoke OTT broadcast network.</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center hover:border-slate-700 transition-colors">
            <TrendingUp className="mx-auto text-[#fb6c1d] mb-4" size={32} />
            <h3 className="text-xl font-bold text-white mb-2">High Local Traffic</h3>
            <p className="text-slate-400 text-sm">Prime brand visibility at Fayetteville Showcase Events and camps.</p>
          </div>
        </div>
      </div>

      {/* Package Pricing */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-2xl font-bold text-white">Proposed Investment Package</h2>
          </div>
          
          <div className="p-6 space-y-4">
            {proposal.package_details.items.map(item => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-slate-800/50">
                <span className="text-slate-300">{item.slot_name}</span>
                <span className="text-white font-mono">${item.price.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="p-6 bg-slate-950 flex justify-between items-center">
            <span className="text-lg text-slate-400">Total Investment</span>
            <span className="text-3xl font-bold text-[#fb6c1d]">${proposal.package_details.finalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 p-4 z-50">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-white font-medium">{proposal.crm_partners.contact_name}, are you ready to partner?</p>
            <p className="text-sm text-slate-400">By clicking accept, you agree to proceed with the proposed inventory.</p>
          </div>
          
          {isAccepted ? (
            <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-6 py-3 rounded-full font-bold">
              <CheckCircle2 size={20} /> Contract Approved - Our team will be in touch shortly.
            </div>
          ) : (
            <button 
              onClick={acceptProposal}
              disabled={accepting}
              className="bg-[#fb6c1d] hover:bg-[#e05b14] disabled:opacity-50 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(251,108,29,0.3)] hover:shadow-[0_0_30px_rgba(251,108,29,0.5)]"
            >
              {accepting ? <Loader2 className="animate-spin" size={20} /> : 'Accept Proposal'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
