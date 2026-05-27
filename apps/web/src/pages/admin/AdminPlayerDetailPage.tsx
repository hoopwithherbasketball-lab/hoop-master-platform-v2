import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAdminPlayerDetail } from '@hoop-master/features/crm'
import { supabase } from '../../lib/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { ArrowLeft, Mail, School, MapPin, Activity, Award, Calendar, UserCheck, TrendingUp, Edit3, Check, X } from 'lucide-react'

const statusColors: Record<string, string> = { active: 'bg-green-500/20 text-green-400', inactive: 'bg-white/10 text-slate-400', suspended: 'bg-red-500/20 text-red-400' }

export default function AdminPlayerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { detail } = useAdminPlayerDetail(id || '1')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    status: detail.status,
    position: detail.position,
    gradClass: detail.gradClass,
    school: detail.school,
    city: detail.city,
    state: detail.state,
    height: detail.height,
    gpa: detail.gpa,
  })

  const startEdit = () => {
    setForm({
      status: detail.status,
      position: detail.position,
      gradClass: detail.gradClass,
      school: detail.school,
      city: detail.city,
      state: detail.state,
      height: detail.height,
      gpa: detail.gpa,
    })
    setEditing(true)
  }

  const save = async () => {
    if (!id) return
    setSaving(true)
    try {
      await supabase.from('player_profiles').update({
        position: form.position || null,
        class_year: form.gradClass ? parseInt(form.gradClass) : null,
        school_name: form.school || null,
        city: form.city || null,
        state: form.state || null,
        height: form.height || null,
        gpa: form.gpa ? parseFloat(form.gpa) : null,
      }).eq('id', id)
      setEditing(false)
      window.location.reload()
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  const cancel = () => setEditing(false)

  return (
    <DashboardLayout variant="admin" title={detail.name} subtitle={`${detail.position} • Class of ${detail.gradClass}`} action={
      <Link to="/admin/players" className="btn btn-secondary flex items-center gap-2"><ArrowLeft size={16} /> All Players</Link>
    }>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-navy-800 rounded-2xl shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="w-20 h-20 bg-[#0134BD] rounded-full flex items-center justify-center text-3xl font-bold text-white">{detail.name.split(' ').map(n => n[0]).join('')}</div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap">
                <h1 className="text-2xl font-bold text-white">{detail.name}</h1>
                <span className={`px-3 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[detail.status]}`}>{detail.status}</span>
              </div>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-400 justify-center md:justify-start">
                <span className="flex items-center gap-1"><School size={14} /> {detail.school}</span>
                <span className="flex items-center gap-1"><MapPin size={14} /> {detail.city}, {detail.state}</span>
                <span className="flex items-center gap-1"><Mail size={14} /> {detail.email}</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#0134BD]">{detail.connectionCount}</p>
              <p className="text-xs text-slate-400">Connections</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { icon: Award, label: 'Package', value: detail.package, color: 'text-[#C8A24A]' },
            { icon: TrendingUp, label: 'Evaluations', value: detail.evalCount.toString(), color: 'text-blue-600' },
            { icon: Calendar, label: 'Joined', value: detail.joined, color: 'text-green-600' },
            { icon: Activity, label: 'Last Active', value: detail.lastActive, color: 'text-purple-600' },
          ].map(s => (
            <div key={s.label} className="bg-navy-800 rounded-xl shadow-sm p-4 text-center">
              <s.icon size={18} className={`mx-auto mb-1 ${s.color}`} />
              <p className="text-lg font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-navy-800 rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white">Player Info</h3>
              {!editing ? (
                <button onClick={startEdit} className="flex items-center gap-1 text-sm text-[#0134BD] hover:underline"><Edit3 size={14} /> Edit</button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={save} disabled={saving} className="flex items-center gap-1 text-sm bg-[#0134BD] text-white px-3 py-1 rounded-lg hover:bg-[#002a80]"><Check size={14} /> {saving ? 'Saving...' : 'Save'}</button>
                  <button onClick={cancel} className="flex items-center gap-1 text-sm text-slate-400 hover:text-white"><X size={14} /> Cancel</button>
                </div>
              )}
            </div>
            {!editing ? (
              <dl className="space-y-2 text-sm">
                {[
                  ['Height', detail.height],
                  ['GPA', detail.gpa],
                  ['Position', detail.position],
                  ['Class', detail.gradClass],
                  ['School', detail.school],
                  ['City', detail.city],
                  ['State', detail.state],
                  ['Status', detail.status],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between py-1 border-b border-gray-50">
                    <dt className="text-slate-400">{label}</dt>
                    <dd className="font-medium text-white capitalize">{val}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Height</label>
                    <input value={form.height} onChange={e => setForm(p => ({ ...p, height: e.target.value }))} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white text-sm outline-none focus:border-[#0134BD]" /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">GPA</label>
                    <input value={form.gpa} onChange={e => setForm(p => ({ ...p, gpa: e.target.value }))} type="number" step="0.1" className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white text-sm outline-none focus:border-[#0134BD]" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Position</label>
                    <input value={form.position} onChange={e => setForm(p => ({ ...p, position: e.target.value }))} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white text-sm outline-none focus:border-[#0134BD]" /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Class</label>
                    <input value={form.gradClass} onChange={e => setForm(p => ({ ...p, gradClass: e.target.value }))} type="number" className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white text-sm outline-none focus:border-[#0134BD]" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">School</label>
                    <input value={form.school} onChange={e => setForm(p => ({ ...p, school: e.target.value }))} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white text-sm outline-none focus:border-[#0134BD]" /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                    <input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white text-sm outline-none focus:border-[#0134BD]" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">State</label>
                    <input value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white text-sm outline-none focus:border-[#0134BD]" /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                    <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as 'active' | 'inactive' | 'suspended' }))} className="w-full p-2.5 border border-white/20 rounded-lg bg-navy-800 text-white text-sm outline-none focus:border-[#0134BD]">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select></div>
                </div>
              </div>
            )}
          </div>
          <div className="bg-navy-800 rounded-xl shadow-sm p-5">
            <h3 className="font-bold text-white mb-3 flex items-center gap-2"><UserCheck size={16} /> Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 bg-blue-500/10 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-100">View Evaluation History</button>
              <button className="w-full text-left p-3 bg-amber-50 rounded-lg text-sm font-medium text-amber-700 hover:bg-amber-100">Change Package</button>
              <button className="w-full text-left p-3 bg-red-500/10 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/20">Suspend Account</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
