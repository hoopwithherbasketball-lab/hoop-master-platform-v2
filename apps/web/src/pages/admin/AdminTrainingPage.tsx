import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Plus, Edit3, Trash2, X, Check, AlertTriangle } from 'lucide-react'

interface TrainingVideo {
  id: string; title: string; description: string; category: string; level: string
  duration_minutes: number; lesson_count: number; thumbnail_url: string; video_url: string
}

const CATEGORIES = ['skill', 'strength', 'film', 'recruiting', 'ball_handling', 'shooting', 'defense', 'conditioning', 'recruiting_ed']
const LEVELS = ['beginner', 'intermediate', 'advanced']
const CATEGORY_LABELS: Record<string, string> = {
  skill: 'Skill Development', strength: 'Strength & Conditioning', film: 'Film Study',
  recruiting: 'Recruiting Prep', ball_handling: 'Ball Handling', shooting: 'Shooting',
  defense: 'Defense', conditioning: 'Conditioning', recruiting_ed: 'Recruiting Ed'
}
const LEVEL_LABELS: Record<string, string> = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }

const emptyForm = { title: '', description: '', category: 'skill', level: 'beginner', duration_minutes: 0, lesson_count: 1, thumbnail_url: '', video_url: '' }

export default function AdminTrainingPage() {
  const [videos, setVideos] = useState<TrainingVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const load = useCallback(async () => {
    try {
      const { data } = await supabase.from('training_videos').select('*').order('created_at', { ascending: false })
      setVideos(data ?? [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const openNew = () => { setEditing(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (v: TrainingVideo) => { setEditing(v.id); setForm({ ...v }); setShowModal(true) }

  const uploadFile = async (file: File, field: 'thumbnail_url' | 'video_url') => {
    setUploading(true)
    try {
      const bucket = field === 'thumbnail_url' ? 'training-thumbnails' : 'training-videos'
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from(bucket).upload(path, file)
      if (error) { console.error('upload error:', error); return }
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
      setForm(prev => ({ ...prev, [field]: urlData.publicUrl }))
    } catch (e) { console.error('uploadFile:', e) }
    setUploading(false)
  }

  const save = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      if (editing) {
        await supabase.from('training_videos').update(form).eq('id', editing)
      } else {
        await supabase.from('training_videos').insert(form)
      }
      setShowModal(false)
      load()
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  const del = async () => {
    if (!deleteId) return
    try { await supabase.from('training_videos').delete().eq('id', deleteId); setDeleteId(null); load() }
    catch (e) { console.error(e) }
  }

  return (
    <DashboardLayout variant="admin" title="Training Content" subtitle="Manage training videos, drills, and skill tracks"
      action={<button onClick={openNew} className="flex items-center gap-1.5 bg-[#0134BD] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002a80]"><Plus size={16} /> New Video</button>}
    >
      {loading ? (
        <div className="animate-pulse space-y-3">{[1,2,3,4].map(i => <div key={i} className="card h-16" />)}</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Level</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Duration</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Lessons</th>
                <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {videos.map(v => (
                <tr key={v.id} className="hover:bg-white/5">
                  <td className="px-4 py-3"><p className="font-medium text-white">{v.title}</p><p className="text-xs text-slate-400 truncate max-w-xs">{v.description}</p></td>
                  <td className="px-4 py-3 text-slate-400">{CATEGORY_LABELS[v.category] || v.category}</td>
                  <td className="px-4 py-3"><span className="capitalize text-slate-400">{LEVEL_LABELS[v.level] || v.level}</span></td>
                  <td className="px-4 py-3 text-slate-400">{v.duration_minutes} min</td>
                  <td className="px-4 py-3 text-slate-400">{v.lesson_count}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(v)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded"><Edit3 size={14} /></button>
                      <button onClick={() => setDeleteId(v.id)} className="p-1.5 text-red-400 hover:bg-red-500/20 rounded"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {videos.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">No training videos yet. Click "New Video" to create one.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowModal(false)}>
          <div className="bg-navy-800 rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">{editing ? 'Edit Video' : 'New Training Video'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <InputField label="Title" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} required />
              <div><label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white text-sm outline-none focus:border-[#0134BD]" /></div>
              <div className="grid grid-cols-2 gap-3">
                <SelectField label="Category" value={form.category} onChange={v => setForm(p => ({ ...p, category: v }))} options={CATEGORIES} labels={CATEGORY_LABELS} />
                <SelectField label="Level" value={form.level} onChange={v => setForm(p => ({ ...p, level: v }))} options={LEVELS} labels={LEVEL_LABELS} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Duration (minutes)" type="number" value={String(form.duration_minutes)} onChange={v => setForm(p => ({ ...p, duration_minutes: parseInt(v) || 0 }))} />
                <InputField label="Lesson Count" type="number" value={String(form.lesson_count)} onChange={v => setForm(p => ({ ...p, lesson_count: parseInt(v) || 1 }))} />
              </div>
              <div><label className="block text-sm font-medium text-gray-300 mb-1">Thumbnail</label>
                <div className="flex gap-2 items-center">
                  <input value={form.thumbnail_url} onChange={e => setForm(p => ({ ...p, thumbnail_url: e.target.value }))} placeholder="https://..." className="flex-1 p-2.5 border border-white/20 rounded-lg bg-transparent text-white text-sm outline-none focus:border-[#0134BD]" />
                  <label className="cursor-pointer px-3 py-2 bg-white/10 rounded-lg text-xs text-slate-300 hover:bg-white/20">{uploading ? '...' : 'Upload'}<input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f, 'thumbnail_url') }} /></label>
                </div>
              </div>
              <div><label className="block text-sm font-medium text-gray-300 mb-1">Video URL</label>
                <div className="flex gap-2 items-center">
                  <input value={form.video_url} onChange={e => setForm(p => ({ ...p, video_url: e.target.value }))} placeholder="https://..." className="flex-1 p-2.5 border border-white/20 rounded-lg bg-transparent text-white text-sm outline-none focus:border-[#0134BD]" />
                  <label className="cursor-pointer px-3 py-2 bg-white/10 rounded-lg text-xs text-slate-300 hover:bg-white/20">{uploading ? '...' : 'Upload'}<input type="file" accept="video/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f, 'video_url') }} /></label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-white/10">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
              <button onClick={save} disabled={saving || !form.title.trim()} className="flex items-center gap-1.5 bg-[#0134BD] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002a80] disabled:opacity-50"><Check size={14} /> {saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setDeleteId(null)}>
          <div className="bg-navy-800 rounded-xl shadow-xl w-full max-w-sm mx-4 p-6 text-center" onClick={e => e.stopPropagation()}>
            <AlertTriangle size={32} className="mx-auto mb-3 text-red-400" />
            <h3 className="text-lg font-bold text-white mb-1">Delete Video?</h3>
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

function InputField({ label, value, onChange, type = 'text', required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div><label className="block text-sm font-medium text-gray-300 mb-1">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white text-sm outline-none focus:border-[#0134BD]" /></div>
  )
}

function SelectField({ label, value, onChange, options, labels }: { label: string; value: string; onChange: (v: string) => void; options: string[]; labels: Record<string, string> }) {
  return (
    <div><label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-navy-800 text-white text-sm outline-none focus:border-[#0134BD]">
        {options.map(o => <option key={o} value={o}>{labels[o] || o}</option>)}
      </select></div>
  )
}
