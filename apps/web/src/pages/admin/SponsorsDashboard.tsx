import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Plus, X, Building, Mail, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

type CRMStatus = 'Lead' | 'Pitched' | 'Negotiating' | 'Closed Won' | 'Lost'

interface Partner {
  id: string
  business_name: string
  contact_name: string
  contact_email: string
  status: CRMStatus
}

const STATUS_COLUMNS: CRMStatus[] = ['Lead', 'Pitched', 'Negotiating', 'Closed Won', 'Lost']

export default function SponsorsDashboard() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ business_name: '', contact_name: '', contact_email: '', status: 'Lead' as CRMStatus })

  useEffect(() => { load() }, [])

  const load = async () => {
    const { data } = await supabase.from('crm_partners').select('*').order('created_at', { ascending: false })
    if (data) setPartners(data)
  }

  const savePartner = async () => {
    if (!form.business_name) {
      toast.error('Business Name is required')
      return
    }
    const { error } = await supabase.from('crm_partners').insert(form)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Partner added to pipeline')
      setShowModal(false)
      setForm({ business_name: '', contact_name: '', contact_email: '', status: 'Lead' })
      load()
    }
  }

  const updateStatus = async (id: string, newStatus: CRMStatus) => {
    // Optimistic UI update
    setPartners(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p))
    const { error } = await supabase.from('crm_partners').update({ status: newStatus }).eq('id', id)
    if (error) {
      toast.error('Failed to update status')
      load() // Revert
    }
  }

  return (
    <DashboardLayout 
      variant="admin" 
      title="Sponsorship Pipeline" 
      subtitle="Manage brand inventory and media monetization"
      action={
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#fb6c1d] hover:bg-[#e05b14] text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus size={18} /> New Partner
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STATUS_COLUMNS.map(status => (
          <div key={status} className="bg-slate-800/50 rounded-xl p-4 min-w-[280px] border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-300">{status}</h2>
              <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full">
                {partners.filter(p => p.status === status).length}
              </span>
            </div>
            
            <div className="space-y-3 min-h-[300px]">
              <AnimatePresence>
                {partners.filter(p => p.status === status).map(partner => (
                  <motion.div
                    key={partner.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-slate-800 border border-slate-700 p-4 rounded-lg shadow-sm hover:border-slate-600 cursor-pointer"
                  >
                    <h3 className="text-white font-medium mb-2">{partner.business_name}</h3>
                    <div className="text-xs text-slate-400 space-y-1">
                      <div className="flex items-center gap-1"><User size={12}/> {partner.contact_name || 'No Contact'}</div>
                      <div className="flex items-center gap-1"><Mail size={12}/> {partner.contact_email || 'No Email'}</div>
                    </div>

                    <div className="mt-3 flex gap-1 flex-wrap">
                      {STATUS_COLUMNS.filter(s => s !== status).map(targetStatus => (
                        <button 
                          key={targetStatus}
                          onClick={(e) => { e.stopPropagation(); updateStatus(partner.id, targetStatus) }}
                          className="text-[10px] bg-slate-700/50 hover:bg-[#fb6c1d]/20 hover:text-[#fb6c1d] text-slate-400 px-2 py-1 rounded transition-colors"
                        >
                          Move to {targetStatus}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* New Partner Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md p-6 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                <h3 className="text-lg font-semibold text-white">Add New Partner</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Business Name</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-2.5 text-slate-500" size={16} />
                    <input 
                      type="text" 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-[#fb6c1d]"
                      value={form.business_name}
                      onChange={e => setForm({...form, business_name: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Contact Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 text-slate-500" size={16} />
                    <input 
                      type="text" 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-[#fb6c1d]"
                      value={form.contact_name}
                      onChange={e => setForm({...form, contact_name: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Contact Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 text-slate-500" size={16} />
                    <input 
                      type="email" 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-[#fb6c1d]"
                      value={form.contact_email}
                      onChange={e => setForm({...form, contact_email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                <button onClick={savePartner} className="bg-[#fb6c1d] hover:bg-[#e05b14] text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Save Partner
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
