import { useCurrentUserProfile } from '@hoop-master/features/crm'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Printer, Loader2 } from 'lucide-react'

export default function OnePagerPage() {
  const { profile, loading } = useCurrentUserProfile()

  if (loading) return <DashboardLayout variant="player" title="Recruiting One-Pager" subtitle="Loading..."><div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-slate-400" /></div></DashboardLayout>

  const p = profile
  const name = p ? `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Your Player' : 'Your Player'
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()

  return (
    <DashboardLayout variant="player" title="Recruiting One-Pager" subtitle="Your shareable profile for college coaches" action={
      <button onClick={() => window.print()} className="btn btn-secondary flex items-center gap-2"><Printer size={16} /> Print</button>
    }>
      <div id="onepager-content" className="max-w-4xl mx-auto bg-navy-800 rounded-2xl shadow-lg overflow-hidden print:shadow-none print:rounded-none">
        <div className="bg-gradient-to-r from-[#121B47] to-[#0134BD] text-white p-8 print:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{name}</h1>
              <p className="text-xl text-blue-200 mt-2">{p?.position || 'Position'} • Class of {p?.class_year || '—'} • {p?.height || '—'}</p>
              <p className="text-blue-200 mt-1">{p?.school_name || '—'} • {p?.city || ''}{p?.city && p?.state ? ', ' : ''}{p?.state || ''}</p>
            </div>
            <div className="hidden sm:block w-24 h-24 bg-white/10 rounded-full flex items-center justify-center text-3xl font-bold text-white">{initials || '?'}</div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {p?.bio && <section><h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Player Bio</h2><p className="text-gray-300 leading-relaxed">{p.bio}</p></section>}

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Player Info</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Info label="Class" value={p?.class_year?.toString() || '—'} />
              <Info label="Position" value={p?.position || '—'} />
              <Info label="Height" value={p?.height || '—'} />
              <Info label="School" value={p?.school_name || '—'} />
              <Info label="Jersey #" value={p?.jersey_number || '—'} />
              <Info label="City" value={p?.city || '—'} />
              <Info label="State" value={p?.state || '—'} />
              <Info label="Team" value={p?.team_name || '—'} />
            </div>
          </section>

          {p?.film_url && <section><h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Film</h2><a href={p.film_url} target="_blank" rel="noopener noreferrer" className="text-[#0134BD] hover:underline">{p.film_url}</a></section>}
        </div>
      </div>
    </DashboardLayout>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="text-center p-3 bg-white/5 rounded-lg"><p className="text-lg font-bold text-white">{value}</p><p className="text-xs text-slate-400 uppercase mt-1">{label}</p></div>
}
