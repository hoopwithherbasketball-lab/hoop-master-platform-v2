import { useState } from 'react'
import { useNILOutreach, useNILCompanies } from '@hoop-master/features/nil'
import { supabase } from '../../lib/supabase'
import { Plus, Edit3, Trash2, X, Eye } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'

const STATUSES = ['draft', 'sent', 'replied', 'ignored']

export default function OutreachInbox() {
  const { messages, loading } = useNILOutreach()
  const { companies } = useNILCompanies()
  
  const [modal, setModal] = useState<{ type: 'create' | 'edit'; message?: any } | null>(null)
  const [viewModal, setViewModal] = useState<any | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  
  const [companyId, setCompanyId] = useState('')
  const [subject, setSubject] = useState('')
  const [bodyText, setBodyText] = useState('')
  const [status, setStatus] = useState('draft')

  const openCreate = () => {
    setCompanyId(companies[0]?.id || '')
    setSubject('')
    setBodyText('')
    setStatus('draft')
    setModal({ type: 'create' })
  }

  const openEdit = (m: any) => {
    // Find matching company name to id
    const company = companies.find(c => c.name === m.from)
    setCompanyId(company?.id || '')
    setSubject(m.subject || '')
    setBodyText(m.body || '')
    setStatus(m.status || 'draft')
    setModal({ type: 'edit', message: m })
  }

  const handleSave = async () => {
    const payload: any = {
      company_id: companyId || null,
      subject,
      notes: bodyText, // Maps to email body/notes in database
      status,
      sent_at: status === 'sent' ? new Date().toISOString() : null,
    }

    if (modal?.type === 'create') {
      await supabase.from('nil_outreach').insert(payload)
    } else if (modal?.type === 'edit' && modal.message) {
      await supabase.from('nil_outreach').update(payload).eq('id', modal.message.id)
    }
    setModal(null)
    window.location.reload()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('nil_outreach').delete().eq('id', id)
    setDeleteId(null)
    window.location.reload()
  }

  return (
    <DashboardLayout variant="admin" title="Outreach Log" subtitle="Log and track outreach communications with targeted brands." action={<button onClick={openCreate} className="flex items-center gap-1.5 bg-[#0134BD] hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"><Plus size={16} /> Log Outreach</button>}>
      {loading ? (
        <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="bg-navy-800 border border-white/10 h-16 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-4">
          {messages.map(m => (
            <div key={m.id} className="bg-navy-800 border border-white/10 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{m.from}</p>
                <p className="text-sm text-slate-400 mt-0.5">{m.subject}</p>
                {m.body && <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-mono">{m.body}</p>}
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-xs text-slate-500">{m.received}</div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                  m.status === 'replied' ? 'bg-green-500/20 text-green-400' :
                  m.status === 'sent' ? 'bg-amber-500/20 text-amber-400' :
                  m.status === 'ignored' ? 'bg-red-500/20 text-red-400' : 'bg-slate-500/20 text-slate-400'
                }`}>{m.status}</span>
                <div className="flex gap-1.5">
                  <button onClick={() => setViewModal(m)} className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors" title="View Message"><Eye size={15} /></button>
                  <button onClick={() => openEdit(m)} className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors" title="Edit Message"><Edit3 size={15} /></button>
                  <button onClick={() => setDeleteId(m.id)} className="p-2 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-colors" title="Delete Message"><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          ))}
          {messages.length === 0 && <p className="text-center text-slate-400 py-12 italic border border-white/10 border-dashed rounded-xl">No outreach logs recorded yet.</p>}
        </div>
      )}

      {/* Save Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setModal(null)}>
          <div className="bg-navy-800 border border-white/10 rounded-xl p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">{modal.type === 'create' ? 'Log Brand Outreach' : 'Edit Outreach Log'}</h2>
              <button onClick={() => setModal(null)} className="p-1 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Target Brand *</label>
                <select
                  value={companyId}
                  onChange={e => setCompanyId(e.target.value)}
                  className="w-full p-2.5 border border-white/20 rounded-lg bg-navy-800 text-white outline-none focus:border-[#0134BD]"
                >
                  <option value="">Select Brand...</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Subject</label>
                <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Sponsorship Proposal Follow-up" className="w-full p-2.5 border border-white/20 rounded-lg bg-white/5 text-white outline-none focus:border-[#0134BD]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email Body / Pitch Content</label>
                <textarea rows={6} value={bodyText} onChange={e => setBodyText(e.target.value)} placeholder="Enter the content of the outreach pitch or message..." className="w-full p-2.5 border border-white/20 rounded-lg bg-white/5 text-white outline-none focus:border-[#0134BD] resize-none text-xs font-mono" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Outreach Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-navy-800 text-white outline-none focus:border-[#0134BD] capitalize">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 border-t border-white/10 pt-4">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2 text-sm font-semibold bg-[#0134BD] hover:bg-blue-700 text-white rounded-lg transition-colors">Save Outreach Log</button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setViewModal(null)}>
          <div className="bg-navy-800 border border-white/10 rounded-xl p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <div>
                <h2 className="text-lg font-bold text-white">{viewModal.from}</h2>
                <p className="text-xs text-slate-400">Logged outreach conversation</p>
              </div>
              <button onClick={() => setViewModal(null)} className="p-1 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="block text-xs text-slate-500">Subject</span>
                <span className="text-sm font-semibold text-white">{viewModal.subject || '(No Subject)'}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-500 mb-1">Pitch / Body</span>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 max-h-60 overflow-y-auto font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {viewModal.body || '(No content recorded)'}
                </div>
              </div>
              <div className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-lg text-xs">
                <div><span className="text-slate-500">Sent:</span> <span className="text-slate-300 font-semibold">{viewModal.received}</span></div>
                <div><span className="text-slate-500">Status:</span> <span className="text-slate-300 font-semibold uppercase">{viewModal.status}</span></div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button onClick={() => setViewModal(null)} className="px-5 py-2 text-sm font-semibold bg-[#0134BD] hover:bg-blue-700 text-white rounded-lg transition-colors">Close View</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setDeleteId(null)}>
          <div className="bg-navy-800 border border-white/10 rounded-xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-2">Delete Outreach Log</h2>
            <p className="text-sm text-slate-400 mb-5">Are you sure you want to delete this outreach message log? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">Delete Log</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
