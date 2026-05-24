import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Film, Plus, ExternalLink, Tag, Trash2 } from 'lucide-react'

interface FilmEntry {
  id: string
  title: string
  url: string
  tags: string[]
  date: string
  season: string
}

const MOCK_FILMS: FilmEntry[] = [
  { id: '1', title: 'Tournament Highlights - Adidas 3SSB', url: 'youtube.com/watch?v=abc123', tags: ['highlights', 'tournament'], date: '2026-04-15', season: '2026 Spring' },
  { id: '2', title: 'Full Game - Sierra Canyon vs Mater Dei', url: 'youtube.com/watch?v=def456', tags: ['full-game', 'showcase'], date: '2026-03-22', season: '2025-26 Season' },
]

const TAGS = ['highlights', 'full-game', 'tournament', 'showcase', 'skill-work', 'interview']

export default function FilmIndexPage() {
  const [films] = useState(MOCK_FILMS)
  const [filterTag, setFilterTag] = useState('')

  const filtered = filterTag ? films.filter(f => f.tags.includes(filterTag)) : films

  return (
    <DashboardLayout variant="player" title="Film Index" subtitle="Organize and showcase your game film and highlights." action={
      <button className="btn btn-primary flex items-center gap-2"><Plus size={16} /> Add Film</button>
    }>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilterTag('')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!filterTag ? 'bg-[#0134BD] text-white' : 'bg-white/10 text-slate-400 hover:bg-white/15'}`}>All</button>
          {TAGS.map(t => (
            <button key={t} onClick={() => setFilterTag(t)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filterTag === t ? 'bg-[#0134BD] text-white' : 'bg-white/10 text-slate-400 hover:bg-white/15'}`}>{t.replace('-', ' ')}</button>
          ))}
        </div>

        <div className="grid gap-4">
          {filtered.map(f => (
            <div key={f.id} className="bg-navy-800 rounded-xl shadow-sm p-5 flex items-start gap-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Film size={22} className="text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-white">{f.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{f.date} • {f.season}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a href={`https://${f.url}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/15"><ExternalLink size={14} className="text-slate-400" /></a>
                    <button className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-500/20"><Trash2 size={14} className="text-gray-400 hover:text-red-500" /></button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {f.tags.map(t => (
                    <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 text-blue-600 rounded-full text-xs font-medium">
                      <Tag size={10} /> {t.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-gray-400 py-12">No films match this tag.</p>}
        </div>
      </div>
    </DashboardLayout>
  )
}
