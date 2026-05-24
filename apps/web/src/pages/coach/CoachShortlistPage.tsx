import { Link } from 'react-router-dom'
import { useCoachShortlist } from '@hoop-master/features/crm'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { ChevronRight, FileText, Tag, MessageSquare, Star } from 'lucide-react'

const statusColors: Record<string, string> = {
  saved: 'bg-white/10 text-slate-400',
  contacted: 'bg-blue-500/20 text-blue-700',
  evaluation: 'bg-amber-100 text-amber-700',
  interview: 'bg-purple-100 text-purple-700',
  offer: 'bg-green-500/20 text-green-400',
  committed: 'bg-emerald-100 text-emerald-700',
  archived: 'bg-slate-100 text-slate-400',
}

export default function CoachShortlistPage() {
  const { filtered, statusFilter, setStatusFilter, tagFilter, setTagFilter, editingNotes, setEditingNotes, updateNotes, advanceStatus, statuses, tags } = useCoachShortlist()

  return (
    <DashboardLayout variant="coach" title="Coach Shortlist" subtitle="Curated roster of high-priority prospects with tracking.">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setStatusFilter('')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!statusFilter ? 'bg-[#121B47] text-white' : 'bg-white/10 text-slate-400 hover:bg-white/15'}`}>All</button>
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${statusFilter === s ? 'bg-[#121B47] text-white' : 'bg-white/10 text-slate-400 hover:bg-white/15'}`}>{s}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map(t => (
            <button key={t} onClick={() => setTagFilter(t)} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${tagFilter === t ? 'bg-[#0134BD] text-white' : 'bg-blue-500/10 text-blue-600 hover:bg-blue-100'}`}><Tag size={10} /> {t}</button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map(e => (
            <div key={e.id} className="bg-navy-800 rounded-xl shadow-sm p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-[#0134BD] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{e.name[0]}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link to={`/coach/evaluation/${e.id}`} className="font-semibold text-white hover:text-[#0134BD]">{e.name}</Link>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[e.status]}`}>{e.status}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{e.position} • Class of {e.grade} • {e.school}, {e.state}</p>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      {e.tags.map(t => <span key={t} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-500/10 text-blue-600 rounded text-xs"><Tag size={8} /> {t}</span>)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="flex items-center gap-1 text-sm font-bold text-[#C8A24A]"><Star size={14} className="fill-current" /> {e.rating}</span>
                  <button onClick={() => advanceStatus(e.id)} className="p-1.5 bg-white/10 rounded-lg hover:bg-white/15" title="Advance status"><ChevronRight size={14} className="text-slate-400" /></button>
                </div>
              </div>
              {e.notes && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-start gap-2">
                    <MessageSquare size={12} className="text-gray-400 mt-0.5" />
                    {editingNotes === e.id ? (
                      <div className="flex-1 flex gap-2">
                        <input defaultValue={e.notes} autoFocus onKeyDown={ev => { if (ev.key === 'Enter') updateNotes(e.id, (ev.target as HTMLInputElement).value) }} className="flex-1 p-2 border border-white/10 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#0134BD]" />
                        <button onClick={() => setEditingNotes(null)} className="text-xs text-slate-400 hover:text-gray-300">Cancel</button>
                      </div>
                    ) : (
                      <p onClick={() => setEditingNotes(e.id)} className="text-xs text-slate-400 flex-1 cursor-pointer hover:text-gray-300">{e.notes}</p>
                    )}
                  </div>
                </div>
              )}
              {!e.notes && (
                <button onClick={() => setEditingNotes(e.id)} className="mt-2 text-xs text-gray-400 hover:text-[#0134BD] flex items-center gap-1"><FileText size={10} /> Add note</button>
              )}
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-gray-400 py-12">No prospects match these filters.</p>}
        </div>
      </div>
    </DashboardLayout>
  )
}
