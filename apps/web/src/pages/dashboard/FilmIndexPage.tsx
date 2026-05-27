import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Film, Plus, ExternalLink, Tag, Trash2, Link, Loader2 } from 'lucide-react'

interface FilmEntry { id: string; title: string; url: string; tags: string[]; season: string; created_at: string }

const TAGS = ['highlights', 'full-game', 'tournament', 'showcase', 'skill-work', 'interview']

export default function FilmIndexPage() {
  const { user } = useAuth()
  const [films, setFilms] = useState<FilmEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filterTag, setFilterTag] = useState('')
  const [profileId, setProfileId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newFilm, setNewFilm] = useState({ title: '', url: '', tags: [] as string[] })

  useEffect(() => {
    if (!user) return
    supabase.from('player_profiles').select('id').eq('user_id', user.id).maybeSingle().then(({ data }) => {
      if (data) setProfileId(data.id)
    })
  }, [user])

  const load = useCallback(() => {
    if (!profileId) return
    supabase.from('film_entries').select('*').eq('player_profile_id', profileId).order('created_at', { ascending: false }).then(({ data }) => {
      setFilms(data ?? [])
      setLoading(false)
    })
  }, [profileId])

  useEffect(() => { load() }, [load])

  const addFilm = async () => {
    if (!profileId || !newFilm.title || !newFilm.url) return
    await supabase.from('film_entries').insert({ player_profile_id: profileId, title: newFilm.title, url: newFilm.url, tags: newFilm.tags })
    setNewFilm({ title: '', url: '', tags: [] })
    setShowAdd(false)
    load()
  }

  const deleteFilm = async (id: string) => {
    await supabase.from('film_entries').delete().eq('id', id)
    load()
  }

  const toggleTag = (tag: string) => {
    setNewFilm(p => ({ ...p, tags: p.tags.includes(tag) ? p.tags.filter(t => t !== tag) : [...p.tags, tag] }))
  }

  const filtered = filterTag ? films.filter(f => f.tags.includes(filterTag)) : films

  return (
    <DashboardLayout variant="player" title="Film Index" subtitle="Organize and showcase your game film and highlights."
      action={<button onClick={() => setShowAdd(true)} className="btn btn-primary flex items-center gap-2"><Plus size={16} /> Add Film</button>}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilterTag('')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!filterTag ? 'bg-[#0134BD] text-white' : 'bg-white/10 text-slate-400 hover:bg-white/15'}`}>All</button>
          {TAGS.map(t => (
            <button key={t} onClick={() => setFilterTag(t)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filterTag === t ? 'bg-[#0134BD] text-white' : 'bg-white/10 text-slate-400 hover:bg-white/15'}`}>{t.replace('-', ' ')}</button>
          ))}
        </div>

        {showAdd && (
          <div className="card p-5 space-y-3">
            <input value={newFilm.title} onChange={e => setNewFilm(p => ({ ...p, title: e.target.value }))} placeholder="Film title" className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white text-sm outline-none focus:border-[#0134BD]" />
            <input value={newFilm.url} onChange={e => setNewFilm(p => ({ ...p, url: e.target.value }))} placeholder="https://youtube.com/..." className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white text-sm outline-none focus:border-[#0134BD]" />
            <div className="flex flex-wrap gap-1.5">{TAGS.map(t => (
              <button key={t} type="button" onClick={() => toggleTag(t)} className={`px-3 py-1 rounded-full text-xs font-medium ${newFilm.tags.includes(t) ? 'bg-[#0134BD] text-white' : 'bg-white/10 text-slate-400'}`}>{t.replace('-', ' ')}</button>
            ))}</div>
            <div className="flex gap-2">
              <button onClick={addFilm} className="px-4 py-2 bg-[#0134BD] text-white rounded-lg text-sm font-medium hover:bg-[#002a80]">Save</button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-slate-400" /></div>
        ) : (
          <div className="grid gap-4">
            {filtered.map(f => (
              <div key={f.id} className="bg-navy-800 rounded-xl shadow-sm p-5 flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center flex-shrink-0"><Film size={22} className="text-red-500" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div><h3 className="font-semibold text-white">{f.title}</h3><p className="text-xs text-gray-400 mt-0.5">{new Date(f.created_at).toLocaleDateString()} • {f.season}</p></div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a href={f.url.startsWith('http') ? f.url : `https://${f.url}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/15"><ExternalLink size={14} className="text-slate-400" /></a>
                      <button onClick={() => deleteFilm(f.id)} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-500/20"><Trash2 size={14} className="text-gray-400" /></button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">{f.tags.map(t => (
                    <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 text-blue-600 rounded-full text-xs font-medium"><Tag size={10} /> {t.replace('-', ' ')}</span>
                  ))}</div>
                </div>
              </div>
            ))}
            {!loading && films.length === 0 && (
              <div className="card p-12 text-center text-slate-400"><Film size={40} className="mx-auto mb-3 text-slate-500" /><p>No film entries yet. Add your first film to showcase your game.</p></div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
