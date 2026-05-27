import { useState } from 'react'
import { useNILCompliance } from '@hoop-master/features/nil'
import { supabase } from '../../lib/supabase'
import { Edit3, Trash2, X } from 'lucide-react'
import { StatusBadge } from '@hoop-master/ui'
import DashboardLayout from '../../components/layout/DashboardLayout'

const STATUSES = ['pending', 'approved', 'error']

export default function ComplianceQueue() {
  const { items, loading } = useNILCompliance()
  const [editItem, setEditItem] = useState<any | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [athlete_name, setAthleteName] = useState('')
  const [opportunity_name, setOpportunityName] = useState('')
  const [itemsStr, setItemsStr] = useState('')
  const [status, setStatus] = useState('pending')

  const openEdit = (item: any) => {
    setAthleteName(item.athlete)
    setOpportunityName(item.opportunity)
    setItemsStr(item.items.join(', '))
    setStatus(item.status)
    setEditItem(item)
  }

  const handleSave = async () => {
    if (!editItem) return
    await supabase.from('nil_compliance_items').update({
      athlete_name, opportunity_name, items: itemsStr.split(',').map(s => s.trim()).filter(Boolean), status,
    }).eq('id', editItem.id)
    setEditItem(null)
    window.location.reload()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('nil_compliance_items').delete().eq('id', id)
    setDeleteId(null)
    window.location.reload()
  }

  return (
    <DashboardLayout variant="admin" title="Compliance & Review" subtitle="Review athlete disclosures and sponsorship contracts.">
      {loading ? (
        <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="card h-14" />)}</div>
      ) : (
        <div className="bg-navy-800 border border-white/10 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-white/5 border-b border-white/10 text-xs font-bold text-slate-500 uppercase tracking-wider"><th className="px-4 py-3">Athlete</th><th className="px-4 py-3">Opportunity</th><th className="px-4 py-3">Items</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-white/10">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 font-bold text-white text-sm">{item.athlete}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{item.opportunity}</td>
                  <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{item.items.map(p => (<span key={p} className="text-[10px] font-bold bg-white/10 text-slate-400 px-1.5 py-0.5 rounded uppercase">{p}</span>))}</div></td>
                  <td className="px-4 py-3"><StatusBadge status={item.status as 'pending'|'error'}/></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(item)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded"><Edit3 size={15} /></button>
                      <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-400">No compliance items.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setEditItem(null)}>
          <div className="bg-navy-800 border border-white/10 rounded-xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Edit Compliance Item</h2>
              <button onClick={() => setEditItem(null)} className="p-1 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Athlete Name</label>
                <input value={athlete_name} onChange={e => setAthleteName(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Opportunity Name</label>
                <input value={opportunity_name} onChange={e => setOpportunityName(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Items (comma-separated)</label>
                <input value={itemsStr} onChange={e => setItemsStr(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-navy-800 text-white outline-none focus:border-[#0134BD]">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditItem(null)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold bg-[#0134BD] text-white rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setDeleteId(null)}>
          <div className="bg-navy-800 border border-white/10 rounded-xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-2">Delete Compliance Item</h2>
            <p className="text-sm text-slate-400 mb-5">Are you sure you want to delete this compliance item? This action cannot be undone.</p>
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
