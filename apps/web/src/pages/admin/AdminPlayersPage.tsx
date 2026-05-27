import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlayerProfiles } from '@hoop-master/features/crm'
import type { Database } from '@hoop-master/types'
import { supabase } from '../../lib/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Plus, Edit3, Trash2, X, Check, AlertTriangle } from 'lucide-react'

type PlayerProfile = Database['public']['Tables']['player_profiles']['Row']

const emptyForm = { first_name: '', last_name: '', class_year: '', position: '', gpa: '', school_name: '', city: '', state: '', height: '', jersey_number: '' }
const newPlayerForm = { first_name: '', last_name: '', class_year: '', position: '', school_name: '', city: '', state: '' }

export default function AdminPlayersPage() {
  const { profiles: players, loading } = usePlayerProfiles()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const openNew = () => {
    setEditing(null)
    setForm({ first_name: '', last_name: '', class_year: '', position: '', gpa: '', school_name: '', city: '', state: '', height: '', jersey_number: '' })
    setShowModal(true)
  }

  const openEdit = (p: PlayerProfile) => {
    setEditing(p.id)
    setForm({
      first_name: p.first_name ?? '',
      last_name: p.last_name ?? '',
      class_year: p.class_year != null ? String(p.class_year) : '',
      position: p.position ?? '',
      gpa: p.gpa != null ? String(p.gpa) : '',
      school_name: p.school_name ?? '',
      city: p.city ?? '',
      state: p.state ?? '',
      height: p.height ?? '',
      jersey_number: p.jersey_number != null ? String(p.jersey_number) : '',
    })
    setShowModal(true)
  }

  const save = async () => {
    if (!form.first_name.trim() || !form.last_name.trim()) return
    setSaving(true)
    try {
      if (editing) {
        await supabase.from('player_profiles').update({
          first_name: form.first_name,
          last_name: form.last_name,
          class_year: form.class_year ? parseInt(form.class_year) : null,
          position: form.position || null,
          gpa: form.gpa ? parseFloat(form.gpa) : null,
          school_name: form.school_name || null,
          city: form.city || null,
          state: form.state || null,
          height: form.height || null,
          jersey_number: form.jersey_number ? parseInt(form.jersey_number) : null,
        }).eq('id', editing)
      } else {
        await supabase.from('player_profiles').insert({
          first_name: form.first_name,
          last_name: form.last_name,
          class_year: form.class_year ? parseInt(form.class_year) : null,
          position: form.position || null,
          school_name: form.school_name || null,
          city: form.city || null,
          state: form.state || null,
        })
      }
      setShowModal(false)
      window.location.reload()
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  const del = async () => {
    if (!deleteId) return
    try {
      await supabase.from('player_profiles').delete().eq('id', deleteId)
      setDeleteId(null)
      window.location.reload()
    } catch (e) { console.error(e) }
  }

  const isNew = editing === null

  return (
    <DashboardLayout variant="admin" title="Players" subtitle="All registered player profiles"
      action={<button onClick={openNew} className="flex items-center gap-1.5 bg-[#0134BD] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002a80]"><Plus size={16} /> New Player</button>}
    >
      {loading ? (<div className="animate-pulse space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="card h-14" />)}</div>) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Class</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Position</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">GPA</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {players.map((p: PlayerProfile) => (
                <tr key={p.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 font-medium text-gray-200">
                    <Link to={`/admin/players/${p.id}`} className="hover:text-white">{p.first_name} {p.last_name}</Link>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{p.class_year ?? '-'}</td>
                  <td className="px-4 py-3 text-slate-500">{p.position ?? '-'}</td>
                  <td className="px-4 py-3 text-slate-500">{p.gpa ?? '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded"><Edit3 size={14} /></button>
                      <button onClick={() => setDeleteId(p.id)} className="p-1.5 text-red-400 hover:bg-red-500/20 rounded"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {players.length === 0 && <div className="text-center py-14"><p className="font-display text-xl font-bold text-slate-300">No players yet</p></div>}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowModal(false)}>
          <div className="bg-navy-800 rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">{isNew ? 'New Player' : 'Edit Player'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <InputField label="First Name" value={form.first_name} onChange={v => setForm(p => ({ ...p, first_name: v }))} required />
                <InputField label="Last Name" value={form.last_name} onChange={v => setForm(p => ({ ...p, last_name: v }))} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Class Year" value={form.class_year} onChange={v => setForm(p => ({ ...p, class_year: v }))} type="number" />
                <InputField label="Position" value={form.position} onChange={v => setForm(p => ({ ...p, position: v }))} />
              </div>
              {!isNew && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <InputField label="GPA" value={form.gpa} onChange={v => setForm(p => ({ ...p, gpa: v }))} type="number" step="0.1" />
                    <InputField label="Height" value={form.height} onChange={v => setForm(p => ({ ...p, height: v }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <InputField label="School" value={form.school_name} onChange={v => setForm(p => ({ ...p, school_name: v }))} />
                    <InputField label="Jersey #" value={form.jersey_number} onChange={v => setForm(p => ({ ...p, jersey_number: v }))} type="number" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <InputField label="City" value={form.city} onChange={v => setForm(p => ({ ...p, city: v }))} />
                    <InputField label="State" value={form.state} onChange={v => setForm(p => ({ ...p, state: v }))} />
                  </div>
                </>
              )}
              {isNew && (
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="School" value={form.school_name} onChange={v => setForm(p => ({ ...p, school_name: v }))} />
                  <InputField label="City" value={form.city} onChange={v => setForm(p => ({ ...p, city: v }))} />
                </div>
              )}
              {isNew && (
                <InputField label="State" value={form.state} onChange={v => setForm(p => ({ ...p, state: v }))} />
              )}
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-white/10">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
              <button onClick={save} disabled={saving || !form.first_name.trim() || !form.last_name.trim()} className="flex items-center gap-1.5 bg-[#0134BD] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002a80] disabled:opacity-50"><Check size={14} /> {saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setDeleteId(null)}>
          <div className="bg-navy-800 rounded-xl shadow-xl w-full max-w-sm mx-4 p-6 text-center" onClick={e => e.stopPropagation()}>
            <AlertTriangle size={32} className="mx-auto mb-3 text-red-400" />
            <h3 className="text-lg font-bold text-white mb-1">Delete Player?</h3>
            <p className="text-sm text-slate-400 mb-5">This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
              <button onClick={del} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

function InputField({ label, value, onChange, type = 'text', required, step }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; step?: string }) {
  return (
    <div><label className="block text-sm font-medium text-gray-300 mb-1">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} step={step} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white text-sm outline-none focus:border-[#0134BD]" /></div>
  )
}
