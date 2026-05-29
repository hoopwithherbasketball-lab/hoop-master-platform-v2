import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Plus, Edit3, Trash2, X, Check, AlertTriangle, Megaphone } from 'lucide-react'

interface AdSlotRow {
  id: string; channel_id: string; position: string; duration_seconds: number
  ad_tag_url: string; scte35_cue: string | null; is_active: boolean
  media_channels?: { name: string; slug: string }
}

interface Channel { id: string; name: string; slug: string }

const POSITIONS = ['pre', 'mid', 'post']
const POSITION_LABELS: Record<string, string> = { pre: 'Pre-Roll', mid: 'Mid-Roll', post: 'Post-Roll' }

const emptyForm = { channel_id: '', position: 'pre', duration_seconds: 30, ad_tag_url: '', scte35_cue: '' }

export default function AdminAdSlotsPage() {
  const [slots, setSlots] = useState<AdSlotRow[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [filterChannel, setFilterChannel] = useState('')

  const load = useCallback(async () => {
    try {
      const [slotRes, chRes] = await Promise.all([
        supabase.from('ad_slots').select('*, media_channels(name, slug)').order('created_at', { ascending: false }),
        supabase.from('media_channels').select('id, name, slug').order('name'),
      ])
      setSlots(slotRes.data ?? [])
      setChannels(chRes.data ?? [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const openNew = () => { setEditing(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (s: AdSlotRow) => {
    setEditing(s.id)
    setForm({ channel_id: s.channel_id, position: s.position, duration_seconds: s.duration_seconds, ad_tag_url: s.ad_tag_url, scte35_cue: s.scte35_cue || '' })
    setShowModal(true)
  }

  const save = async () => {
    if (!form.channel_id || !form.ad_tag_url) return
    setSaving(true)
    try {
      const payload = { channel_id: form.channel_id, position: form.position, duration_seconds: form.duration_seconds, ad_tag_url: form.ad_tag_url, scte35_cue: form.scte35_cue || null }
      if (editing) {
        await supabase.from('ad_slots').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editing)
      } else {
        await supabase.from('ad_slots').insert(payload)
      }
      setShowModal(false)
      load()
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  const del = async () => {
    if (!deleteId) return
    try { await supabase.from('ad_slots').delete().eq('id', deleteId); setDeleteId(null); load() }
    catch (e) { console.error(e) }
  }

  const filtered = filterChannel ? slots.filter(s => s.channel_id === filterChannel) : slots

  return (
    <DashboardLayout variant="admin" title="Ad Slots" subtitle="Manage VAST/VMAP ad placements for channels"
      action={<button onClick={openNew} className="flex items-center gap-1.5 bg-[#0134BD] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002a80]"><Plus size={16} /> New Ad Slot</button>}
    >
      <div className="mb-4 flex items-center gap-3">
        <Megaphone size={16} className="text-slate-400" />
        <select value={filterChannel} onChange={e => setFilterChannel(e.target.value)} className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white">
          <option value="">All Channels</option>
          {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <span className="text-xs text-slate-400">{filtered.length} ad slot{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="card h-16" />)}</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Channel</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Position</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Duration</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Ad Tag</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Active</th>
                <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-white">{(s as any).media_channels?.name || s.channel_id}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs ${s.position === 'pre' ? 'bg-blue-500/20 text-blue-400' : s.position === 'mid' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-purple-500/20 text-purple-400'}`}>{POSITION_LABELS[s.position]}</span></td>
                  <td className="px-4 py-3 text-slate-300">{s.duration_seconds}s</td>
                  <td className="px-4 py-3 text-xs text-slate-400 max-w-[200px] truncate">{s.ad_tag_url}</td>
                  <td className="px-4 py-3"><span className={`w-2 h-2 inline-block rounded-full ${s.is_active ? 'bg-green-400' : 'bg-slate-500'}`}></span></td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(s)} className="p-1 text-slate-400 hover:text-white"><Edit3 size={14} /></button>
                    <button onClick={() => setDeleteId(s.id)} className="p-1 text-slate-400 hover:text-red-400"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No ad slots yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">{editing ? 'Edit Ad Slot' : 'New Ad Slot'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Channel</label>
                <select value={form.channel_id} onChange={e => setForm(p => ({ ...p, channel_id: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white">
                  <option value="">Select channel...</option>
                  {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Position</label>
                  <select value={form.position} onChange={e => setForm(p => ({ ...p, position: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white">
                    {POSITIONS.map(p => <option key={p} value={p}>{POSITION_LABELS[p]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Duration (seconds)</label>
                  <input type="number" value={form.duration_seconds} onChange={e => setForm(p => ({ ...p, duration_seconds: parseInt(e.target.value) || 30 }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">VAST/VMAP Ad Tag URL</label>
                <input value={form.ad_tag_url} onChange={e => setForm(p => ({ ...p, ad_tag_url: e.target.value }))} placeholder="https://..." className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">SCTE-35 Cue (optional)</label>
                <input value={form.scte35_cue} onChange={e => setForm(p => ({ ...p, scte35_cue: e.target.value }))} placeholder="0x..." className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-300 hover:text-white">Cancel</button>
              <button onClick={save} disabled={saving} className="flex items-center gap-1 px-4 py-2 bg-[#0134BD] text-white rounded-lg text-sm font-medium hover:bg-[#002a80] disabled:opacity-50"><Check size={14} /> {saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl w-full max-w-sm p-6 space-y-4 text-center">
            <AlertTriangle size={32} className="mx-auto text-red-400" />
            <h3 className="text-lg font-semibold text-white">Delete Ad Slot?</h3>
            <p className="text-sm text-slate-400">This ad placement will be removed from the channel.</p>
            <div className="flex justify-center gap-2">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-slate-300 hover:text-white">Cancel</button>
              <button onClick={del} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
