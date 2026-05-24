import { useParams, Link } from 'react-router-dom'
import { CTABanner } from '@hoop-master/ui'
import { VerifiedBadge, usePlayerEvaluation } from '@hoop-master/features/crm'
import PageShell from '../../components/ui/PageShell'
import { players } from './players-data'
import { Award, TrendingUp } from 'lucide-react'

function scoreColor(s: number): string { if (s >= 90) return 'text-green-600'; if (s >= 80) return 'text-blue-600'; return 'text-amber-600' }

export default function PlayerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const player = players.find((p) => p.id === Number(id))
  const playerStrId = id || '1'
  const { evaluation: evalData } = usePlayerEvaluation(playerStrId)

  if (!player) {
    return (
      <PageShell title="Player Not Found" description="The requested player profile could not be found.">
        <div className="text-center py-20">
          <h2 className="text-3xl font-bold text-white mb-4">Player Not Found</h2>
          <p className="text-slate-400 mb-8">This player profile doesn't exist or has been removed.</p>
          <Link to="/browse" className="bg-[#0134BD] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#121B47] transition-colors">Back to Browse</Link>
        </div>
      </PageShell>
    )
  }

  const firstName = player.name.split(' ')[0]

  return (
    <PageShell title={`${player.name} - Player Profile`} description={`${player.position} - Class of ${player.gradYear} - ${player.location}`}>
      <Link to="/browse" className="inline-flex items-center text-[#0134BD] hover:text-[#FB6C1D] font-medium mb-6 transition-colors">Back to Browse</Link>

      <div className="bg-navy-800 rounded-lg shadow-md p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img src={player.image} alt={player.name} className="w-32 h-32 rounded-full object-cover border-4 border-[#0134BD]" />
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap mb-1">
              <h1 className="text-3xl font-bold text-white">{player.name}</h1>
              <VerifiedBadge level="elite" size="md" />
              <span className={`text-xl font-bold ${scoreColor(evalData.overall)}`}>{evalData.overall}</span>
            </div>
            <p className="text-lg text-slate-400 mb-2">{player.position} - Class of {player.gradYear}</p>
            <p className="text-slate-400 mb-3">{player.location}</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
              {player.tags.map(tag => <span key={tag} className="bg-[#0134BD] text-white px-3 py-1 rounded-full text-sm font-medium">{tag}</span>)}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-400 justify-center md:justify-start">
              <span><strong>Division:</strong> {player.division}</span>
              <span><strong>Height:</strong> {player.height}</span>
              <span><strong>Weight:</strong> {player.weight}</span>
              <span><strong>GPA:</strong> {player.gpa}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-navy-800 rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Player Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {player.stats.map(stat => <div key={stat.label} className="bg-white/5 rounded-lg p-4 text-center"><div className="text-3xl font-bold text-[#0134BD]">{stat.value}</div><div className="text-sm text-slate-400 mt-1">{stat.label}</div></div>)}
        </div>
      </div>

      <div className="bg-navy-800 rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">About</h2>
        <p className="text-slate-400 leading-relaxed">{player.bio}</p>
      </div>

      <div className="bg-navy-800 rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Award size={22} /> Evaluation Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {evalData.categories.slice(0, 8).map(cat => (
            <div key={cat.label} className="bg-white/5 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-1">
                <TrendingUp size={14} className={scoreColor(cat.score)} />
                <span className={`text-2xl font-bold ${scoreColor(cat.score)}`}>{cat.score}</span>
              </div>
              <div className="text-sm text-slate-400 mt-1">{cat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <CTABanner title={`Interested in Recruiting ${firstName}?`} description="Connect with this athlete and access full recruiting tools, transcripts, and video highlights." actions={[{ label: 'Create Coach Account', href: '/signup' }, { label: 'View Recruiting Services', href: '/services', variant: 'secondary' }]} />
    </PageShell>
  )
}
