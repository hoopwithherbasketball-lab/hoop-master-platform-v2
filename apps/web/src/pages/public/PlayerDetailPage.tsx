import { useParams, Link } from 'react-router-dom'
import PageShell from '../../components/ui/PageShell'
import { players } from './players-data'

export default function PlayerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const player = players.find((p) => p.id === Number(id))

  if (!player) {
    return (
      <PageShell title="Player Not Found" description="The requested player profile could not be found.">
        <div className="text-center py-20">
          <h2 className="text-3xl font-bold text-[#121B47] mb-4">Player Not Found</h2>
          <p className="text-gray-600 mb-8">This player profile doesn't exist or has been removed.</p>
          <Link
            to="/browse"
            className="bg-[#0134BD] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#121B47] transition-colors"
          >
            Back to Browse
          </Link>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell
      title={`${player.name} — Player Profile`}
      description={`${player.position} • Class of ${player.gradYear} • ${player.location}`}
    >
      {/* Back Link */}
      <Link
        to="/browse"
        className="inline-flex items-center text-[#0134BD] hover:text-[#FB6C1D] font-medium mb-6 transition-colors"
      >
        ← Back to Browse
      </Link>

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={player.image}
            alt={player.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-[#0134BD]"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-[#121B47] mb-1">{player.name}</h1>
            <p className="text-lg text-gray-600 mb-2">
              {player.position} • Class of {player.gradYear}
            </p>
            <p className="text-gray-500 mb-3">{player.location}</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
              {player.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-[#0134BD] text-white px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 justify-center md:justify-start">
              <span><strong>Division:</strong> {player.division}</span>
              <span><strong>Height:</strong> {player.height}</span>
              <span><strong>Weight:</strong> {player.weight}</span>
              <span><strong>GPA:</strong> {player.gpa}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-[#121B47] mb-6">Player Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {player.stats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-[#0134BD]">{stat.value}</div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-[#121B47] mb-4">About</h2>
        <p className="text-gray-600 leading-relaxed">{player.bio}</p>
      </div>

      {/* Recruit CTA */}
      <div className="bg-gradient-to-r from-[#0134BD] to-[#121B47] text-white p-8 rounded-lg text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Interested in Recruiting {player.name.split(' ')[0]}?</h2>
        <p className="text-lg mb-6 max-w-xl mx-auto">
          Connect with this athlete and access full recruiting tools, transcripts, and video highlights.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="bg-[#FB6C1D] hover:bg-[#e55a1a] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Create Coach Account
          </Link>
          <Link
            to="/services"
            className="bg-white text-[#0134BD] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            View Recruiting Services
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
