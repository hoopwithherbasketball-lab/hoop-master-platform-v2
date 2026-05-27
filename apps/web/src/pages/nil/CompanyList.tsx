import { useState } from 'react'
import { useNILCompanies } from '@hoop-master/features/nil'
import { supabase } from '../../lib/supabase'
import { Plus, Edit3, Trash2, X } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'

const STAGES = ['prospecting', 'matched', 'outreach', 'negotiation', 'active']

export default function CompanyList() {
  const { companies, loading } = useNILCompanies()
  const [modal, setModal] = useState<{ type: 'create' | 'edit'; company?: any } | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [stage, setStage] = useState('prospecting')

  const openCreate = () => { setName(''); setCategory(''); setStage('prospecting'); setModal({ type: 'create' }) }
  const openEdit = (c: any) => { setName(c.name); setCategory(c.category); setStage(c.stage); setModal({ type: 'edit', company: c }) }

  const handleSave = async () => {
    if (modal?.type === 'create') {
      await supabase.from('nil_companies').insert({ name, category, stage })
    } else if (modal?.type === 'edit' && modal.company) {
      await supabase.from('nil_companies').update({ name, category, stage }).eq('id', modal.company.id)
    }
    setModal(null)
    window.location.reload()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('nil_companies').delete().eq('id', id)
    setDeleteId(null)
    window.location.reload()
  }

  return (
    <DashboardLayout variant="admin" title="NIL Partners" subtitle="Manage company relationships and sponsorship pipelines." action={<button onClick={openCreate} className="flex items-center gap-1.5 bg-[#0134BD] text-white px-3 py-1.5 rounded-lg text-sm font-semibold"><Plus size={16} /> New Company</button>}>
      {loading ? (
        <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="card h-14" />)}</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left uppercase text-slate-500 text-xs">Company</th>
                <th className="px-4 py-3 text-left uppercase text-slate-500 text-xs">Category</th>
                <th className="px-4 py-3 text-left uppercase text-slate-500 text-xs">Stage</th>
                <th className="px-4 py-3 text-right uppercase text-slate-500 text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {companies.map(c => (
                <tr key={c.id} className="hover:bg-white/5">
                  <td className="px-4 py-4 text-gray-200">{c.name}</td>
                  <td className="px-4 py-4 text-slate-400">{c.category}</td>
                  <td className="px-4 py-4"><span className="capitalize text-slate-400">{c.stage}</span></td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(c)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded"><Edit3 size={15} /></button>
                      <button onClick={() => setDeleteId(c.id)} className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {companies.length === 0 && <tr><td colSpan={4} className="px-4 py-12 text-center text-slate-400">No companies yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setModal(null)}>
          <div className="bg-navy-800 border border-white/10 rounded-xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">{modal.type === 'create' ? 'New Company' : 'Edit Company'}</h2>
              <button onClick={() => setModal(null)} className="p-1 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                <input value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Stage</label>
                <select value={stage} onChange={e => setStage(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-navy-800 text-white outline-none focus:border-[#0134BD]">
                  {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
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
            <h2 className="text-lg font-bold text-white mb-2">Delete Company</h2>
            <p className="text-sm text-slate-400 mb-5">Are you sure you want to delete this company? This action cannot be undone.</p>
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
