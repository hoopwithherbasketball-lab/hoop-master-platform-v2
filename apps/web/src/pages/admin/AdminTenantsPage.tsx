import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Plus, Edit3, Trash2, X, Check, AlertTriangle, Globe } from 'lucide-react'

interface Tenant {
  id: string; name: string; slug: string; custom_domain: string | null
  cname_target: string | null; player_branding: Record<string, unknown>
  status: string; max_channels: number; max_storage_gb: number
  created_at: string
}

const STATUSES = ['active', 'suspended', 'archived']
const emptyForm = { name: '', slug: '', custom_domain: '', cname_target: '', status: 'active', max_channels: 5, max_storage_gb: 50, player_branding: {} as Record<string, unknown> }

export default function AdminTenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [brandingForm, setBrandingForm] = useState({ logo_url: '', primary_color: '#0134BD', secondary_color: '#ffffff', accent_color: '#ff6b35', font_family: 'Inter', watermark_url: '' })

  const load = useCallback(async () => {
    try {
      const { data } = await supabase.from('white_label_tenants').select('*').order('name')
      setTenants(data ?? [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const openNew = () => { setEditing(null); setForm(emptyForm); setBrandingForm({ logo_url: '', primary_color: '#0134BD', secondary_color: '#ffffff', accent_color: '#ff6b35', font_family: 'Inter', watermark_url: '' }); setShowModal(true) }
  const openEdit = (t: Tenant) => {
    setEditing(t.id)
    setForm({ name: t.name, slug: t.slug, custom_domain: t.custom_domain || '', cname_target: t.cname_target || '', status: t.status, max_channels: t.max_channels, max_storage_gb: t.max_storage_gb, player_branding: t.player_branding || {} })
    const b = (t.player_branding || {}) as any
    setBrandingForm({ logo_url: b.logo_url || '', primary_color: b.primary_color || '#0134BD', secondary_color: b.secondary_color || '#ffffff', accent_color: b.accent_color || '#ff6b35', font_family: b.font_family || 'Inter', watermark_url: b.watermark_url || '' })
    setShowModal(true)
  }

  const save = async () => {
    if (!form.name.trim() || !form.slug.trim()) return
    setSaving(true)
    try {
      const payload = { ...form, player_branding: brandingForm, custom_domain: form.custom_domain || null, cname_target: form.cname_target || null }
      if (editing) {
        await supabase.from('white_label_tenants').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editing)
      } else {
        await supabase.from('white_label_tenants').insert(payload)
      }
      setShowModal(false)
      load()
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  const del = async () => {
    if (!deleteId) return
    try { await supabase.from('white_label_tenants').delete().eq('id', deleteId); setDeleteId(null); load() }
    catch (e) { console.error(e) }
  }

  return (
    <DashboardLayout variant="admin" title="White-Label Tenants" subtitle="Manage white-label partner sites and branding"
      action={<button onClick={openNew} className="flex items-center gap-1.5 bg-[#0134BD] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002a80]"><Plus size={16} /> New Tenant</button>}
    >
      {loading ? (
        <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="card h-16" />)}</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Tenant</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Domain</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Limits</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {tenants.map(t => (
                <tr key={t.id} className="hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{t.name}</div>
                    <div className="text-xs text-slate-400">/{t.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-300 text-xs">{t.custom_domain || '—'}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{t.max_channels} channels / {t.max_storage_gb}GB</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${t.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>{t.status}</span></td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(t)} className="p-1 text-slate-400 hover:text-white"><Edit3 size={14} /></button>
                    <button onClick={() => setDeleteId(t.id)} className="p-1 text-slate-400 hover:text-red-400"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
              {tenants.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No tenants yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">{editing ? 'Edit Tenant' : 'New Tenant'}</h3>
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Custom Domain</label>
                  <input value={form.custom_domain} onChange={e => setForm(p => ({ ...p, custom_domain: e.target.value }))} placeholder="tv.example.com" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">CNAME Target</label>
                  <input value={form.cname_target} onChange={e => setForm(p => ({ ...p, cname_target: e.target.value }))} placeholder="cname.hoopwithher.com" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white">
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Max Channels</label>
                  <input type="number" value={form.max_channels} onChange={e => setForm(p => ({ ...p, max_channels: parseInt(e.target.value) || 5 }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Max Storage (GB)</label>
                  <input type="number" value={form.max_storage_gb} onChange={e => setForm(p => ({ ...p, max_storage_gb: parseInt(e.target.value) || 50 }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
              </div>

              <div className="border-t border-slate-600 pt-3">
                <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2"><Globe size={14} /> Player Branding</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Logo URL</label>
                    <input value={brandingForm.logo_url} onChange={e => setBrandingForm(p => ({ ...p, logo_url: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Watermark URL</label>
                    <input value={brandingForm.watermark_url} onChange={e => setBrandingForm(p => ({ ...p, watermark_url: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Primary Color</label>
                    <div className="flex gap-2"><input type="color" value={brandingForm.primary_color} onChange={e => setBrandingForm(p => ({ ...p, primary_color: e.target.value }))} className="w-8 h-8 rounded cursor-pointer" /><input value={brandingForm.primary_color} onChange={e => setBrandingForm(p => ({ ...p, primary_color: e.target.value }))} className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" /></div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Accent Color</label>
                    <div className="flex gap-2"><input type="color" value={brandingForm.accent_color} onChange={e => setBrandingForm(p => ({ ...p, accent_color: e.target.value }))} className="w-8 h-8 rounded cursor-pointer" /><input value={brandingForm.accent_color} onChange={e => setBrandingForm(p => ({ ...p, accent_color: e.target.value }))} className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" /></div>
                  </div>
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
            <h3 className="text-lg font-semibold text-white">Delete Tenant?</h3>
            <p className="text-sm text-slate-400">This will remove all channel mappings for this tenant.</p>
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
