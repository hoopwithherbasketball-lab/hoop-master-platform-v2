import { useState } from 'react'
import { useNILAthletes } from '@hoop-master/features/nil'
import { supabase } from '../../lib/supabase'
import { Edit3, Trash2, X } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'

const TIERS = ['bronze', 'silver', 'gold', 'platinum']

export default function AthleteNILProfileList() {
  const { athletes, loading } = useNILAthletes()
  const [editAthlete, setEditAthlete] = useState<any | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [display_name, setDisplayName] = useState('')
  const [position, setPosition] = useState('')
  const [class_year, setClassYear] = useState('')
  const [followers, setFollowers] = useState('')
  const [readiness_score, setReadinessScore] = useState('')
  const [tier, setTier] = useState('bronze')

  const openEdit = (a: any) => {
    setDisplayName(a.name)
    setPosition(a.position)
    setClassYear(a.classYear?.toString() ?? '')
    setFollowers(a.followers)
    setReadinessScore(a.readiness.toString())
    setTier(a.tier)
    setEditAthlete(a)
  }

  const handleSave = async () => {
    if (!editAthlete) return
    await supabase.from('nil_athlete_profiles').update({
      display_name, position, class_year: parseInt(class_year) || null, followers, readiness_score: parseInt(readiness_score) || 0, tier,
    }).eq('id', editAthlete.id)
    setEditAthlete(null)
    window.location.reload()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('nil_athlete_profiles').delete().eq('id', id)
    setDeleteId(null)
    window.location.reload()
  }

  return (
    <DashboardLayout variant="admin" title="Athlete NIL Profiles" subtitle="Athletes opted into NIL matchmaking.">
      {loading ? (
        <div className="animate-pulse grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="card h-48" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {athletes.map(a => (
            <div key={a.id} className="bg-navy-800 border border-white/10 rounded-lg p-5 hover:border-royal-300 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-navy-900 flex items-center justify-center text-white font-bold text-sm">{a.name[0]}</div>
                <div className="flex-1"><p className="font-bold text-white text-sm">{a.name}</p><p className="text-[11px] text-slate-400">{a.position} | Class of {a.classYear}</p></div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(a)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded"><Edit3 size={14} /></button>
                  <button onClick={() => setDeleteId(a.id)} className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div className="bg-white/5 rounded p-1.5"><p className="text-[10px] text-slate-400">Followers</p><p className="text-xs font-bold text-white">{a.followers}</p></div>
                <div className="bg-white/5 rounded p-1.5"><p className="text-[10px] text-slate-400">Readiness</p><p className="text-xs font-bold text-white">{a.readiness}%</p></div>
                <div className="bg-white/5 rounded p-1.5"><p className="text-[10px] text-slate-400">Tier</p><p className="text-xs font-bold text-white">{a.tier}</p></div>
              </div>
              <button className="w-full text-xs font-bold text-royal-600 bg-royal-50 py-1.5 rounded hover:bg-royal-100 transition-colors">View Full Profile</button>
            </div>
          ))}
          {athletes.length === 0 && <p className="col-span-3 text-center text-slate-400 py-12">No athletes opted into NIL yet.</p>}
        </div>
      )}

      {editAthlete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setEditAthlete(null)}>
          <div className="bg-navy-800 border border-white/10 rounded-xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Edit Athlete Profile</h2>
              <button onClick={() => setEditAthlete(null)} className="p-1 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Display Name</label>
                <input value={display_name} onChange={e => setDisplayName(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Position</label>
                <input value={position} onChange={e => setPosition(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Class Year</label>
                <input type="number" value={class_year} onChange={e => setClassYear(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Followers</label>
                <input value={followers} onChange={e => setFollowers(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Readiness Score</label>
                <input type="number" min="0" max="100" value={readiness_score} onChange={e => setReadinessScore(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Tier</label>
                <select value={tier} onChange={e => setTier(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-navy-800 text-white outline-none focus:border-[#0134BD]">
                  {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditAthlete(null)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold bg-[#0134BD] text-white rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setDeleteId(null)}>
          <div className="bg-navy-800 border border-white/10 rounded-xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-2">Delete Athlete Profile</h2>
            <p className="text-sm text-slate-400 mb-5">Are you sure you want to delete this athlete profile? This action cannot be undone.</p>
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
