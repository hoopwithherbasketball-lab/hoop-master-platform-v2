import { useState } from 'react'
import { useNILOpportunities } from '@hoop-master/features/nil'
import { supabase } from '../../lib/supabase'
import { Plus, Edit3, Trash2, X } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'

const STATUSES = ['matched', 'review', 'negotiation', 'active', 'completed', 'cancelled']

export default function OpportunityList() {
  const { opportunities, loading } = useNILOpportunities()
  const [modal, setModal] = useState<{ type: 'create' | 'edit'; opportunity?: any } | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [athlete_name, setAthleteName] = useState('')
  const [brand, setBrand] = useState('')
  const [valueCents, setValueCents] = useState('')
  const [status, setStatus] = useState('matched')

  const openCreate = () => { setAthleteName(''); setBrand(''); setValueCents(''); setStatus('matched'); setModal({ type: 'create' }) }
  const openEdit = (o: any) => { setAthleteName(o.athlete_name); setBrand(o.brand); setValueCents(''); setStatus(o.status); setModal({ type: 'edit', opportunity: o }) }

  const handleSave = async () => {
    const payload = { athlete_name, brand, value_cents: Math.round(parseFloat(valueCents) * 100) || 0, status }
    if (modal?.type === 'create') {
      await supabase.from('nil_opportunities').insert(payload)
    } else if (modal?.type === 'edit' && modal.opportunity) {
      await supabase.from('nil_opportunities').update(payload).eq('id', modal.opportunity.id)
    }
    setModal(null)
    window.location.reload()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('nil_opportunities').delete().eq('id', id)
    setDeleteId(null)
    window.location.reload()
  }

  return (
    <DashboardLayout variant="admin" title="Opportunities" subtitle="Track active NIL partner opportunities." action={<button onClick={openCreate} className="flex items-center gap-1.5 bg-[#0134BD] text-white px-3 py-1.5 rounded-lg text-sm font-semibold"><Plus size={16} /> New Opportunity</button>}>
      {loading ? (
        <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="card h-14" />)}</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left uppercase text-slate-500 text-xs">Athlete</th>
                <th className="px-4 py-3 text-left uppercase text-slate-500 text-xs">Brand</th>
                <th className="px-4 py-3 text-left uppercase text-slate-500 text-xs">Value</th>
                <th className="px-4 py-3 text-left uppercase text-slate-500 text-xs">Status</th>
                <th className="px-4 py-3 text-right uppercase text-slate-500 text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {opportunities.map(o => (
                <tr key={o.id} className="hover:bg-white/5">
                  <td className="px-4 py-4 text-gray-200">{o.athlete_name}</td>
                  <td className="px-4 py-4 text-slate-400">{o.brand}</td>
                  <td className="px-4 py-4 text-slate-400">{o.value}</td>
                  <td className="px-4 py-4"><span className="capitalize text-slate-400">{o.status}</span></td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(o)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded"><Edit3 size={15} /></button>
                      <button onClick={() => setDeleteId(o.id)} className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {opportunities.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-400">No opportunities yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setModal(null)}>
          <div className="bg-navy-800 border border-white/10 rounded-xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">{modal.type === 'create' ? 'New Opportunity' : 'Edit Opportunity'}</h2>
              <button onClick={() => setModal(null)} className="p-1 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Athlete Name</label>
                <input value={athlete_name} onChange={e => setAthleteName(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Brand</label>
                <input value={brand} onChange={e => setBrand(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Value ($)</label>
                <input type="number" step="0.01" min="0" value={valueCents} onChange={e => setValueCents(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD]" />
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
            <h2 className="text-lg font-bold text-white mb-2">Delete Opportunity</h2>
            <p className="text-sm text-slate-400 mb-5">Are you sure you want to delete this opportunity? This action cannot be undone.</p>
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
