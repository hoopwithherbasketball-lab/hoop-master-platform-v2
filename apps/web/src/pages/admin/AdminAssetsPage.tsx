import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Plus, Edit3, Trash2, X, FileVideo } from 'lucide-react'

interface MediaAsset {
  id: string; title: string; description: string; duration_seconds: number
  storage_path: string; thumbnail_url: string; status: string
  category: string; tags: string[]; created_at: string
}

const STATUSES = ['draft', 'processing', 'ready', 'failed', 'archived']
const CATEGORIES = ['game_film', 'highlight', 'training', 'interview', 'behind_scenes', 'promotional', 'uncategorized']

const emptyForm = { title: '', description: '', duration_seconds: 0, storage_path: '', thumbnail_url: '', status: 'draft', category: 'uncategorized', tags: [] as string[] }

export default function AdminAssetsPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState('')

  const load = useCallback(async () => {
    try {
      const { data } = await supabase.from('media_assets').select('*').order('created_at', { ascending: false })
      setAssets(data ?? [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const openNew = () => { setEditing(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (a: MediaAsset) => {
    setEditing(a.id)
    setForm({ title: a.title, description: a.description, duration_seconds: a.duration_seconds, storage_path: a.storage_path, thumbnail_url: a.thumbnail_url, status: a.status, category: a.category, tags: a.tags || [] })
    setShowModal(true)
  }

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(p => ({ ...p, tags: [...p.tags, tagInput.trim()] }))
      setTagInput('')
    }
  }

  const save = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      if (editing) {
        await supabase.from('media_assets').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editing)
      } else {
        await supabase.from('media_assets').insert(form)
      }
      setShowModal(false)
      load()
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  const del = async () => {
    if (!deleteId) return
    try { await supabase.from('media_assets').delete().eq('id', deleteId); setDeleteId(null); load() }
    catch (e) { console.error(e) }
  }

  const formatDuration = (s: number) => { const m = Math.floor(s / 60); return `${m}m ${s % 60}s` }

  return (
    <DashboardLayout variant="admin" title="Media Assets" subtitle="Manage VOD content, films, and media files"
      action={<button onClick={openNew} className="flex items-center gap-1.5 bg-[#0134BD] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002a80]"><Plus size={16} /> New Asset</button>}
    >
      {loading ? (
        <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="card h-16" />)}</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Asset</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Duration</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {assets.map(a => (
                <tr key={a.id} className="hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileVideo size={16} className="text-slate-400" />
                      <div>
                        <div className="font-medium text-white">{a.title}</div>
                        <div className="text-xs text-slate-400 truncate max-w-xs">{a.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{a.category}</td>
                  <td className="px-4 py-3 text-slate-300">{formatDuration(a.duration_seconds)}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${a.status === 'ready' ? 'bg-green-500/20 text-green-400' : a.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-500/20 text-slate-400'}`}>{a.status}</span></td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(a)} className="p-1 text-slate-400 hover:text-white"><Edit3 size={14} /></button>
                    <button onClick={() => setDeleteId(a.id)} className="p-1 text-slate-400 hover:text-red-400"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
              {assets.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No assets yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">{editing ? 'Edit Asset' : 'New Asset'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Title</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Duration (seconds)</label>
                  <input type="number" value={form.duration_seconds} onChange={e => setForm(p => ({ ...p, duration_seconds: parseInt(e.target.value) || 0 }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Storage Path (URL)</label>
                <input value={form.storage_path} onChange={e => setForm(p => ({ ...p, storage_path: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Thumbnail URL</label>
                <input value={form.thumbnail_url} onChange={e => setForm(p => ({ ...p, thumbnail_url: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Tags</label>
                <div className="flex gap-2">
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" placeholder="Add tag..." />
                  <button onClick={addTag} className="px-3 bg-slate-600 rounded-lg text-sm text-white hover:bg-slate-500">Add</button>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {form.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 bg-slate-600 rounded text-xs text-white flex items-center gap-1">
                      {t}
                      <button onClick={() => setForm(p => ({ ...p, tags: p.tags.filter(x => x !== t) }))} className="text-slate-400 hover:text-red-400">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-300 hover:text-white">Cancel</button>
              <button onClick={save} disabled={saving} className="px-4 py-2 bg-[#0134BD] text-white rounded-lg text-sm font-medium hover:bg-[#002a80] disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Delete Asset?</h3>
            <p className="text-sm text-slate-300">This will remove the asset from all channel schedules.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-slate-300 hover:text-white">Cancel</button>
              <button onClick={del} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
