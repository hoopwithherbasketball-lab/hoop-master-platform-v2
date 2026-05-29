import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Plus, Edit3, Trash2, X, Radio, Tv, Play } from 'lucide-react'

interface MediaChannel {
  id: string; slug: string; name: string; description: string
  channel_type: string; status: string; thumbnail_url: string
  is_public: boolean; branding: Record<string, unknown>
}

const CHANNEL_TYPES = ['live', 'linear', 'vod']
const STATUSES = ['draft', 'active', 'paused', 'archived']

const emptyForm = { slug: '', name: '', description: '', channel_type: 'linear', status: 'draft', thumbnail_url: '', is_public: true }

export default function AdminChannelsPage() {
  const [channels, setChannels] = useState<MediaChannel[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const { data } = await supabase.from('media_channels').select('*').order('name')
      setChannels(data ?? [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const openNew = () => { setEditing(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (c: MediaChannel) => {
    setEditing(c.id)
    setForm({ slug: c.slug, name: c.name, description: c.description, channel_type: c.channel_type, status: c.status, thumbnail_url: c.thumbnail_url, is_public: c.is_public })
    setShowModal(true)
  }

  const save = async () => {
    if (!form.name.trim() || !form.slug.trim()) return
    setSaving(true)
    try {
      if (editing) {
        await supabase.from('media_channels').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editing)
      } else {
        await supabase.from('media_channels').insert(form)
      }
      setShowModal(false)
      load()
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  const del = async () => {
    if (!deleteId) return
    try { await supabase.from('media_channels').delete().eq('id', deleteId); setDeleteId(null); load() }
    catch (e) { console.error(e) }
  }

  const typeIcon = (t: string) => t === 'live' ? <Radio size={14} className="text-red-400" /> : t === 'linear' ? <Tv size={14} className="text-blue-400" /> : <Play size={14} className="text-green-400" />

  return (
    <DashboardLayout variant="admin" title="Media Channels" subtitle="Manage live, linear, and VOD channels"
      action={<button onClick={openNew} className="flex items-center gap-1.5 bg-[#0134BD] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002a80]"><Plus size={16} /> New Channel</button>}
    >
      {loading ? (
        <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="card h-16" />)}</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Channel</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Public</th>
                <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {channels.map(c => (
                <tr key={c.id} className="hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{c.name}</div>
                    <div className="text-xs text-slate-400">/{c.slug}</div>
                  </td>
                  <td className="px-4 py-3"><span className="flex items-center gap-1">{typeIcon(c.channel_type)} {c.channel_type}</span></td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${c.status === 'active' ? 'bg-green-500/20 text-green-400' : c.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-500/20 text-slate-400'}`}>{c.status}</span></td>
                  <td className="px-4 py-3 text-slate-300">{c.is_public ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(c)} className="p-1 text-slate-400 hover:text-white"><Edit3 size={14} /></button>
                    <button onClick={() => setDeleteId(c.id)} className="p-1 text-slate-400 hover:text-red-400"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
              {channels.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No channels yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">{editing ? 'Edit Channel' : 'New Channel'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Name</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Slug</label>
                  <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Type</label>
                  <select value={form.channel_type} onChange={e => setForm(p => ({ ...p, channel_type: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white">
                    {CHANNEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white">
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_public} onChange={e => setForm(p => ({ ...p, is_public: e.target.checked }))} className="rounded" />
                <span className="text-sm text-slate-300">Public</span>
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
            <h3 className="text-lg font-semibold text-white">Delete Channel?</h3>
            <p className="text-sm text-slate-300">This will also delete all schedules and EPG data for this channel.</p>
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
