import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Plus, Edit3, Trash2, X, Check, Calendar, AlertTriangle } from 'lucide-react'

interface ScheduleRow {
  id: string; channel_id: string; asset_id: string; scheduled_start: string; scheduled_end: string
  position: number; repeat_rule: string; is_active: boolean
  media_assets?: { title: string; duration_seconds: number; thumbnail_url: string }
  media_channels?: { name: string; slug: string }
}

interface Channel { id: string; name: string; slug: string }
interface Asset { id: string; title: string; duration_seconds: number; status: string }

const REPEAT_RULES = ['none', 'daily', 'weekly']
const REPEAT_LABELS: Record<string, string> = { none: 'Once', daily: 'Daily', weekly: 'Weekly' }

const emptyForm = { channel_id: '', asset_id: '', scheduled_start: '', scheduled_end: '', position: 0, repeat_rule: 'none' }

export default function AdminSchedulePage() {
  const [schedules, setSchedules] = useState<ScheduleRow[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [filterChannel, setFilterChannel] = useState('')

  const load = useCallback(async () => {
    try {
      const [schedRes, chRes, asRes] = await Promise.all([
        supabase.from('channel_schedules').select('*, media_assets(title, duration_seconds, thumbnail_url), media_channels(name, slug)').order('scheduled_start', { ascending: false }),
        supabase.from('media_channels').select('id, name, slug').order('name'),
        supabase.from('media_assets').select('id, title, duration_seconds, status').eq('status', 'ready').order('title'),
      ])
      setSchedules(schedRes.data ?? [])
      setChannels(chRes.data ?? [])
      setAssets(asRes.data ?? [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const openNew = () => { setEditing(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (s: ScheduleRow) => {
    setEditing(s.id)
    setForm({ channel_id: s.channel_id, asset_id: s.asset_id, scheduled_start: s.scheduled_start.slice(0, 16), scheduled_end: s.scheduled_end.slice(0, 16), position: s.position, repeat_rule: s.repeat_rule })
    setShowModal(true)
  }

  const save = async () => {
    if (!form.channel_id || !form.asset_id || !form.scheduled_start || !form.scheduled_end) return
    setSaving(true)
    try {
      const payload = {
        channel_id: form.channel_id,
        asset_id: form.asset_id,
        scheduled_start: new Date(form.scheduled_start).toISOString(),
        scheduled_end: new Date(form.scheduled_end).toISOString(),
        position: form.position,
        repeat_rule: form.repeat_rule,
      }
      if (editing) {
        await supabase.from('channel_schedules').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editing)
      } else {
        await supabase.from('channel_schedules').insert(payload)
      }
      setShowModal(false)
      load()
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  const del = async () => {
    if (!deleteId) return
    try { await supabase.from('channel_schedules').delete().eq('id', deleteId); setDeleteId(null); load() }
    catch (e) { console.error(e) }
  }

  const filtered = filterChannel ? schedules.filter(s => s.channel_id === filterChannel) : schedules
  const fmtDate = (d: string) => new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <DashboardLayout variant="admin" title="Channel Schedules" subtitle="Manage program schedules for live and linear channels"
      action={<button onClick={openNew} className="flex items-center gap-1.5 bg-[#0134BD] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002a80]"><Plus size={16} /> New Schedule</button>}
    >
      <div className="mb-4 flex items-center gap-3">
        <Calendar size={16} className="text-slate-400" />
        <select value={filterChannel} onChange={e => setFilterChannel(e.target.value)} className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white">
          <option value="">All Channels</option>
          {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <span className="text-xs text-slate-400">{filtered.length} schedule{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="card h-16" />)}</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Channel</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Asset</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Start</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">End</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Repeat</th>
                <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-white">{(s as any).media_channels?.name || s.channel_id}</td>
                  <td className="px-4 py-3">
                    <div className="text-white">{(s as any).media_assets?.title || s.asset_id}</div>
                    <div className="text-xs text-slate-400">{(s as any).media_assets?.duration_seconds ? `${Math.floor((s as any).media_assets.duration_seconds / 60)}m` : ''}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-300 text-xs">{fmtDate(s.scheduled_start)}</td>
                  <td className="px-4 py-3 text-slate-300 text-xs">{fmtDate(s.scheduled_end)}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-xs bg-slate-600 text-slate-300">{REPEAT_LABELS[s.repeat_rule] || s.repeat_rule}</span></td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(s)} className="p-1 text-slate-400 hover:text-white"><Edit3 size={14} /></button>
                    <button onClick={() => setDeleteId(s.id)} className="p-1 text-slate-400 hover:text-red-400"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No schedules yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">{editing ? 'Edit Schedule' : 'New Schedule'}</h3>
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
              <div>
                <label className="block text-xs text-slate-400 mb-1">Asset</label>
                <select value={form.asset_id} onChange={e => setForm(p => ({ ...p, asset_id: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white">
                  <option value="">Select asset...</option>
                  {assets.map(a => <option key={a.id} value={a.id}>{a.title} ({Math.floor(a.duration_seconds / 60)}m)</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Start</label>
                  <input type="datetime-local" value={form.scheduled_start} onChange={e => setForm(p => ({ ...p, scheduled_start: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">End</label>
                  <input type="datetime-local" value={form.scheduled_end} onChange={e => setForm(p => ({ ...p, scheduled_end: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Position</label>
                  <input type="number" value={form.position} onChange={e => setForm(p => ({ ...p, position: parseInt(e.target.value) || 0 }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Repeat</label>
                  <select value={form.repeat_rule} onChange={e => setForm(p => ({ ...p, repeat_rule: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white">
                    {REPEAT_RULES.map(r => <option key={r} value={r}>{REPEAT_LABELS[r]}</option>)}
                  </select>
                </div>
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
            <h3 className="text-lg font-semibold text-white">Delete Schedule?</h3>
            <p className="text-sm text-slate-400">This will remove this time slot from the channel.</p>
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
