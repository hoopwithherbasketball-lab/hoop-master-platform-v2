import { useState } from 'react'
import { useAdminLeads } from '@hoop-master/features/crm'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { Search, Mail, Plus, Edit3, Trash2, X, Check, AlertTriangle } from 'lucide-react'

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  qualified: 'bg-purple-100 text-purple-700',
  booked: 'bg-indigo-500/20 text-indigo-400',
  won: 'bg-green-500/20 text-green-400',
  nurture: 'bg-teal-500/20 text-teal-400',
  lost: 'bg-red-500/20 text-red-400',
}

export default function AdminLeadsPage() {
  const { leads, allLeads, statusFilter, setStatusFilter, searchQuery, setSearchQuery, statuses } = useAdminLeads()
  const [showModal, setShowModal] = useState(false)
  const [editingLead, setEditingLead] = useState<typeof leads[0] | null>(null)
  const [deleteLead, setDeleteLead] = useState<typeof leads[0] | null>(null)
  const [form, setForm] = useState({ name: '', email: '', interest: '', source: '', status: 'new' })
  const [saving, setSaving] = useState(false)

  const openAdd = () => {
    setEditingLead(null)
    setForm({ name: '', email: '', interest: '', source: '', status: 'new' })
    setShowModal(true)
  }

  const openEdit = (lead: typeof leads[0]) => {
    setEditingLead(lead)
    setForm({ name: lead.name, email: lead.email || '', interest: lead.interest || '', source: lead.source || '', status: lead.status })
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const nameParts = form.name.trim().split(/\s+/)
    const payload = {
      first_name: nameParts[0] || null,
      last_name: nameParts.slice(1).join(' ') || null,
      email: form.email || null,
      interest: form.interest || null,
      source: form.source || null,
      status: form.status,
    }
    if (editingLead) {
      await supabase.from('leads').update(payload).eq('id', editingLead.id)
    } else {
      await supabase.from('leads').insert(payload)
    }
    setSaving(false)
    setShowModal(false)
    window.location.reload()
  }

  const handleDelete = async () => {
    if (!deleteLead) return
    await supabase.from('leads').delete().eq('id', deleteLead.id)
    setDeleteLead(null)
    window.location.reload()
  }

  return (
    <DashboardLayout
      variant="admin"
      title="Leads"
      subtitle="Manage incoming athlete and partner inquiries."
      action={
        <button onClick={openAdd} className="flex items-center gap-1.5 bg-[#0134BD] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> New Lead
        </button>
      }
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-navy-800 border border-white/10 rounded-lg px-3 py-2">
            <Search size={16} className="text-gray-400" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search leads..." className="flex-1 outline-none text-sm bg-transparent" />
          </div>
          <div className="flex gap-1 bg-navy-800 rounded-lg border border-white/10 p-1">
            <button onClick={() => setStatusFilter('')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${!statusFilter ? 'bg-[#121B47] text-white' : 'text-slate-400 hover:text-gray-300'}`}>All ({allLeads.length})</button>
            {statuses.map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${statusFilter === s ? 'bg-[#121B47] text-white' : 'text-slate-400 hover:text-gray-300'}`}>{s} ({allLeads.filter(l => l.status === s).length})</button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {leads.map(l => (
            <div key={l.id} className="bg-navy-800 rounded-xl shadow-sm p-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-[#0134BD] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{l.name[0]}</div>
                <div className="min-w-0">
                  <p className="font-semibold text-white">{l.name}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1"><Mail size={10} /> {l.email}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{l.interest} • Source: {l.source} • {l.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => openEdit(l)} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-amber-100"><Edit3 size={14} className="text-slate-400" /></button>
                <button onClick={() => setDeleteLead(l)} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-100"><Trash2 size={14} className="text-red-400" /></button>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[l.status] || 'bg-slate-500/20 text-slate-400'}`}>{l.status}</span>
              </div>
            </div>
          ))}
          {leads.length === 0 && <p className="text-center text-gray-400 py-12">No leads match your filters.</p>}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowModal(false)}>
          <div className="bg-navy-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">{editingLead ? 'Edit Lead' : 'New Lead'}</h3>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400 hover:text-white" /></button>
            </div>
            <div className="space-y-3">
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD]" />
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD]" />
              <input value={form.interest} onChange={e => setForm({ ...form, interest: e.target.value })} placeholder="Interest" className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD]" />
              <input value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} placeholder="Source" className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD]" />
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full p-2.5 border border-white/20 rounded-lg bg-navy-800 text-white outline-none focus:border-[#0134BD]">
                {statuses.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 bg-[#0134BD] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : <><Check size={16} /> {editingLead ? 'Update' : 'Create'}</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setDeleteLead(null)}>
          <div className="bg-navy-800 rounded-xl p-6 w-full max-w-sm mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} className="text-red-400" />
              <h3 className="text-lg font-bold text-white">Delete Lead</h3>
            </div>
            <p className="text-sm text-gray-400 mb-5">Are you sure you want to delete <strong className="text-white">{deleteLead.name}</strong>? This cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteLead(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
              <button onClick={handleDelete} className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"><Trash2 size={16} /> Delete</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
