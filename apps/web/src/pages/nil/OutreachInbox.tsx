import { useState } from 'react'
import { useNILOutreach } from '@hoop-master/features/nil'
import { supabase } from '../../lib/supabase'
import { Plus, Edit3, Trash2, X } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'

const STATUSES = ['open', 'pending', 'replied', 'closed']

export default function OutreachInbox() {
  const { messages, loading } = useNILOutreach()
  const [modal, setModal] = useState<{ type: 'create' | 'edit'; message?: any } | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [from_entity, setFromEntity] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState('open')

  const openCreate = () => { setFromEntity(''); setSubject(''); setBody(''); setStatus('open'); setModal({ type: 'create' }) }
  const openEdit = (m: any) => { setFromEntity(m.from); setSubject(m.subject); setBody(''); setStatus(m.status); setModal({ type: 'edit', message: m }) }

  const handleSave = async () => {
    const payload: any = { from_entity, subject, status }
    if (body) payload.body = body
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
    <DashboardLayout variant="admin" title="Outreach Inbox" subtitle="Review incoming partner messages and follow up tasks." action={<button onClick={openCreate} className="flex items-center gap-1.5 bg-[#0134BD] text-white px-3 py-1.5 rounded-lg text-sm font-semibold"><Plus size={16} /> New Message</button>}>
      {loading ? (
        <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="card h-16" />)}</div>
      ) : (
        <div className="space-y-4">
          {messages.map(m => (
            <div key={m.id} className="card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{m.from}</p>
                <p className="text-sm text-slate-500">{m.subject}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-slate-500">{m.received}</div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase text-slate-400">{m.status}</span>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(m)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded"><Edit3 size={15} /></button>
                  <button onClick={() => setDeleteId(m.id)} className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded"><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          ))}
          {messages.length === 0 && <p className="text-center text-slate-400 py-12">No outreach messages yet.</p>}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setModal(null)}>
          <div className="bg-navy-800 border border-white/10 rounded-xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">{modal.type === 'create' ? 'New Message' : 'Edit Message'}</h2>
              <button onClick={() => setModal(null)} className="p-1 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">From</label>
                <input value={from_entity} onChange={e => setFromEntity(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Subject</label>
                <input value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Body</label>
                <textarea rows={4} value={body} onChange={e => setBody(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD] resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-navy-800 text-white outline-none focus:border-[#0134BD]">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold bg-[#0134BD] text-white rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setDeleteId(null)}>
          <div className="bg-navy-800 border border-white/10 rounded-xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-2">Delete Message</h2>
            <p className="text-sm text-slate-400 mb-5">Are you sure you want to delete this message? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
