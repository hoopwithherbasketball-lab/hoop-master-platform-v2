import { Link } from 'react-router-dom'
import { useCoachShortlist } from '@hoop-master/features/scouting'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { ChevronRight, FileText, Tag, MessageSquare, Star, Plus } from 'lucide-react'

const statusColors: Record<string, string> = {
  saved: 'bg-white/10 text-slate-400',
  contacted: 'bg-blue-500/20 text-blue-400',
  evaluation: 'bg-amber-500/20 text-amber-400',
  interview: 'bg-purple-500/20 text-purple-400',
  offer: 'bg-green-500/20 text-green-400',
  committed: 'bg-emerald-500/20 text-emerald-400',
  archived: 'bg-slate-500/20 text-slate-400',
}

export default function CoachShortlistPage() {
  const {
    filtered,
    statusFilter,
    setStatusFilter,
    tagFilter,
    setTagFilter,
    editingNotes,
    setEditingNotes,
    updateStatus,
    updateNotes,
    updateTags,
    updateRating,
    advanceStatus,
    statuses,
    tags,
    loading
  } = useCoachShortlist()

  if (loading) return <DashboardLayout variant="coach" title="Loading..." subtitle=""><div className="animate-pulse space-y-4">{[1,2,3].map(i => <div key={i} className="bg-navy-800 p-6 rounded-lg shadow-md h-24" />)}</div></DashboardLayout>

  return (
    <DashboardLayout variant="coach" title="Coach Shortlist" subtitle="Curated roster of high-priority prospects with tracking.">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setStatusFilter('')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!statusFilter ? 'bg-[#121B47] text-white' : 'bg-white/10 text-slate-400 hover:bg-white/15'}`}>All</button>
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${statusFilter === s ? 'bg-[#121B47] text-white' : 'bg-white/10 text-slate-400 hover:bg-white/15'}`}>{s}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-400 font-semibold mr-1">Filter by Tag:</span>
          <button onClick={() => setTagFilter('')} className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${!tagFilter ? 'bg-[#0134BD] text-white' : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'}`}>None</button>
          {tags.map(t => (
            <button key={t} onClick={() => setTagFilter(t)} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${tagFilter === t ? 'bg-[#0134BD] text-white' : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'}`}><Tag size={10} /> {t}</button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map(e => (
            <div key={e.id} className="bg-navy-800 rounded-xl shadow-sm p-4 border border-white/5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-[#0134BD] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{e.name[0]}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link to={`/coach/evaluation/${e.playerId}`} className="font-semibold text-white hover:text-[#0134BD]">{e.name}</Link>
                      <select
                        value={e.status}
                        onChange={(ev) => updateStatus(e.id, ev.target.value as any)}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize outline-none border border-transparent focus:border-white/20 cursor-pointer ${statusColors[e.status]}`}
                      >
                        {statuses.map(st => (
                          <option key={st} value={st} className="bg-navy-800 text-white capitalize">{st}</option>
                        ))}
                      </select>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{e.position} • Class of {e.grade} • {e.school}, {e.state}</p>
                    
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {e.tags.map(t => (
                        <span key={t} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded text-xs">
                          <Tag size={8} /> {t}
                          <button
                            onClick={() => updateTags(e.id, e.tags.filter(tag => tag !== t))}
                            className="hover:text-red-400 ml-1 text-slate-500"
                            title="Remove tag"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <select
                        onChange={(ev) => {
                          const newTag = ev.target.value
                          if (newTag && !e.tags.includes(newTag)) {
                            updateTags(e.id, [...e.tags, newTag])
                          }
                          ev.target.value = ''
                        }}
                        className="bg-navy-900 border border-white/10 rounded px-1.5 py-0.5 text-xs text-slate-400 outline-none cursor-pointer"
                      >
                        <option value="">+ Tag</option>
                        {tags.filter(t => !e.tags.includes(t)).map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => updateRating(e.id, star === e.rating ? 0 : star)}
                        className={`transition-all hover:scale-110 ${star <= e.rating ? 'text-[#C8A24A]' : 'text-slate-600 hover:text-slate-500'}`}
                        title={`${star} Stars`}
                      >
                        <Star size={14} className={star <= e.rating ? 'fill-current' : ''} />
                      </button>
                    ))}
                  </div>
                  <button onClick={() => advanceStatus(e.id)} className="p-1.5 bg-white/10 rounded-lg hover:bg-white/15" title="Advance status"><ChevronRight size={14} className="text-slate-400" /></button>
                </div>
              </div>

              {editingNotes === e.id ? (
                <div className="mt-3 pt-3 border-t border-white/5 flex gap-2">
                  <input
                    defaultValue={e.notes}
                    autoFocus
                    onKeyDown={ev => {
                      if (ev.key === 'Enter') updateNotes(e.id, (ev.target as HTMLInputElement).value)
                    }}
                    className="flex-1 p-2 bg-[#121B47]/50 border border-white/10 rounded-lg text-sm text-white outline-none focus:ring-1 focus:ring-[#0134BD]"
                  />
                  <button onClick={() => setEditingNotes(null)} className="text-xs text-slate-400 hover:text-white px-2">Cancel</button>
                </div>
              ) : e.notes ? (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <div className="flex items-start gap-2">
                    <MessageSquare size={12} className="text-slate-500 mt-0.5 flex-shrink-0" />
                    <p onClick={() => setEditingNotes(e.id)} className="text-xs text-slate-400 flex-1 cursor-pointer hover:text-slate-300 italic">{e.notes}</p>
                  </div>
                </div>
              ) : (
                <button onClick={() => setEditingNotes(e.id)} className="mt-3 text-xs text-slate-500 hover:text-white flex items-center gap-1"><FileText size={10} /> Add note</button>
              )}
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-slate-500 py-12">No prospects match these filters.</p>}
        </div>
      </div>
    </DashboardLayout>
  )
}
