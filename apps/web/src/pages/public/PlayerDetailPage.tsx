import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { CTABanner, PageShell } from '@hoop-master/ui'
import { VerifiedBadge } from '@hoop-master/features/crm'
import { Award, MapPin, School, User, Loader as Loader2 } from 'lucide-react'

interface PlayerProfile {
  id: string
  first_name: string | null
  last_name: string | null
  position: string | null
  secondary_position: string | null
  class_year: number | null
  city: string | null
  state: string | null
  school_name: string | null
  team_name: string | null
  height: string | null
  gpa: number | null
  bio: string | null
  film_url: string | null
  instagram_handle: string | null
  twitter_handle: string | null
  profile_completion_percent: number | null
}

export default function PlayerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [player, setPlayer] = useState<PlayerProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) { setLoading(false); return }
    supabase
      .from('player_profiles')
      .select('id, first_name, last_name, position, secondary_position, class_year, city, state, school_name, team_name, height, gpa, bio, film_url, instagram_handle, twitter_handle, profile_completion_percent')
      .eq('id', id)
      .eq('is_public', true)
      .maybeSingle()
      .then(({ data }) => {
        setPlayer(data)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <PageShell title="Loading Profile..." description="">
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-[#0134BD]" />
        </div>
      </PageShell>
    )
  }

  if (!player) {
    return (
      <PageShell title="Player Not Found" description="The requested player profile could not be found.">
        <div className="text-center py-20">
          <h2 className="text-3xl font-bold text-white mb-4">Player Not Found</h2>
          <p className="text-slate-400 mb-8">This player profile doesn't exist or has been removed.</p>
          <Link data-testid="player-not-found-back-link" to="/browse" className="bg-[#0134BD] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#121B47] transition-colors">
            Back to Browse
          </Link>
        </div>
      </PageShell>
    )
  }

  const name = [player.first_name, player.last_name].filter(Boolean).join(' ') || 'Unknown Player'
  const location = [player.city, player.state].filter(Boolean).join(', ')
  const firstName = player.first_name || name

  return (
    <PageShell
      title={`${name} - Player Profile`}
      description={[player.position, player.class_year ? `Class of ${player.class_year}` : null, location].filter(Boolean).join(' • ')}
    >
      <Link data-testid="player-detail-back-link" to="/browse" className="inline-flex items-center text-[#0134BD] hover:text-[#FB6C1D] font-medium mb-6 transition-colors">
        ← Back to Browse
      </Link>

      {/* Header */}
      <div className="bg-navy-800 rounded-lg shadow-md border border-white/10 p-8 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-28 h-28 rounded-full bg-[#0134BD]/20 border-4 border-[#0134BD] flex items-center justify-center shrink-0">
            <User size={44} className="text-[#0134BD]" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap mb-1">
              <h1 className="text-3xl font-bold text-white">{name}</h1>
              <VerifiedBadge level="elite" size="md" />
            </div>
            <p className="text-lg text-slate-400 mb-2">
              {[player.position, player.secondary_position].filter(Boolean).join(' / ')}
              {player.class_year ? ` • Class of ${player.class_year}` : ''}
            </p>
            {location && (
              <p className="text-slate-400 mb-2 flex items-center gap-1 justify-center md:justify-start">
                <MapPin size={14} /> {location}
              </p>
            )}
            {player.school_name && (
              <p className="text-slate-400 mb-3 flex items-center gap-1 justify-center md:justify-start">
                <School size={14} /> {player.school_name}
                {player.team_name ? ` • ${player.team_name}` : ''}
              </p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-slate-400 justify-center md:justify-start mt-2">
              {player.height && <span><strong className="text-slate-300">Height:</strong> {player.height}</span>}
              {player.gpa && <span><strong className="text-slate-300">GPA:</strong> {player.gpa.toFixed(2)}</span>}
              {player.profile_completion_percent != null && (
                <span><strong className="text-slate-300">Profile:</strong> {player.profile_completion_percent}% complete</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      {player.bio && (
        <div className="bg-navy-800 rounded-lg shadow-md border border-white/10 p-8 mb-6">
          <h2 className="text-xl font-bold text-white mb-3">About</h2>
          <p className="text-slate-400 leading-relaxed">{player.bio}</p>
        </div>
      )}

      {/* Film & Social */}
      {(player.film_url || player.instagram_handle || player.twitter_handle) && (
        <div className="bg-navy-800 rounded-lg shadow-md border border-white/10 p-8 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Award size={20} /> Links & Film
          </h2>
          <div className="flex flex-wrap gap-3">
            {player.film_url && (
              <a href={player.film_url} target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 bg-[#0134BD] text-white rounded-lg text-sm font-medium hover:bg-[#002a80] transition-colors">
                Watch Film
              </a>
            )}
            {player.instagram_handle && (
              <a href={`https://instagram.com/${player.instagram_handle.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 bg-white/10 text-slate-300 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors">
                @{player.instagram_handle.replace('@', '')}
              </a>
            )}
            {player.twitter_handle && (
              <a href={`https://twitter.com/${player.twitter_handle.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 bg-white/10 text-slate-300 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors">
                @{player.twitter_handle.replace('@', '')}
              </a>
            )}
          </div>
        </div>
      )}

      <CTABanner
        title={`Interested in Recruiting ${firstName}?`}
        description="Connect with this athlete and unlock complete coach tools, transcripts, and verified performance context."
        actions={[
          { label: 'Create Coach Account', href: '/signup', testId: 'player-detail-create-coach-account-link' },
          { label: 'View Recruiting Services', href: '/services', variant: 'secondary', testId: 'player-detail-view-recruiting-services-link' },
        ]}
        LinkComponent={Link}
      />
    </PageShell>
  )
}
