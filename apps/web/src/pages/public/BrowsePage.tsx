import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { PlayerCard, CTABanner, PageSection, PageShell } from '@hoop-master/ui'
import { Loader as Loader2, Users, ChevronLeft, ChevronRight } from 'lucide-react'

interface PlayerRow {
  id: string
  first_name: string | null
  last_name: string | null
  position: string | null
  class_year: number | null
  city: string | null
  state: string | null
  school_name: string | null
  gpa: number | null
}

const PLACEHOLDER_IMG = '/images/placeholder-player.svg'
const PAGE_SIZE = 24

function buildTags(p: PlayerRow): string[] {
  const tags: string[] = []
  if (p.gpa && p.gpa >= 3.5) tags.push(`GPA ${p.gpa.toFixed(1)}`)
  if (p.school_name) tags.push(p.school_name)
  return tags.slice(0, 3)
}

export default function BrowsePage() {
  const navigate = useNavigate()
  const [players, setPlayers] = useState<PlayerRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', gradYear: '', position: '' })
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(0)

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.search)
    }, 400)
    return () => clearTimeout(handler)
  }, [filters.search])

  // Reset page when filters change
  useEffect(() => {
    setPage(0)
  }, [debouncedSearch, filters.gradYear, filters.position])

  useEffect(() => {
    // If search is 1 character, do not query yet
    if (debouncedSearch.length === 1) return

    let ignore = false
    const fetchPlayers = async () => {
      setLoading(true)

      let query = supabase
        .from('player_profiles')
        .select('id, first_name, last_name, position, class_year, city, state, school_name, gpa', { count: 'exact' })
        .eq('is_public', true)

      if (debouncedSearch.length >= 2) {
        query = query.or(`first_name.ilike.%${debouncedSearch}%,last_name.ilike.%${debouncedSearch}%,city.ilike.%${debouncedSearch}%,state.ilike.%${debouncedSearch}%`)
      }
      if (filters.gradYear) {
        query = query.eq('class_year', parseInt(filters.gradYear))
      }
      if (filters.position) {
        query = query.eq('position', filters.position)
      }

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

      if (!ignore) {
        if (!error) {
          setPlayers(data ?? [])
          setTotalCount(count ?? 0)
        }
        setLoading(false)
      }
    }

    fetchPlayers()
    return () => {
      ignore = true
    }
  }, [debouncedSearch, filters.gradYear, filters.position, page])

  const currentYear = new Date().getFullYear()
  const gradYears = Array.from({ length: 7 }, (_, i) => currentYear + i)
  const positions = ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center']
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <PageShell
      title="Browse Elite Players"
      description="Evaluate high-intent prospects using advanced filters, profile depth, and readiness indicators."
      badge="Player Database"
    >
      <section className="bg-navy-800 p-7 rounded-lg shadow-md border border-white/10 mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">Find Your Next Recruit</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
            <input
              data-testid="browse-search-input"
              type="text"
              placeholder="Name or location..."
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              className="w-full p-2 border border-white/20 rounded-md bg-transparent text-white focus:outline-none focus:border-[#0134BD]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Graduation Year</label>
            <select
              data-testid="browse-grad-year-select"
              value={filters.gradYear}
              onChange={e => setFilters(f => ({ ...f, gradYear: e.target.value }))}
              className="w-full p-2 border border-white/20 rounded-md bg-navy-800 text-white focus:outline-none focus:border-[#0134BD]"
            >
              <option value="">All Years</option>
              {gradYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
            <select
              data-testid="browse-position-select"
              value={filters.position}
              onChange={e => setFilters(f => ({ ...f, position: e.target.value }))}
              className="w-full p-2 border border-white/20 rounded-md bg-navy-800 text-white focus:outline-none focus:border-[#0134BD]"
            >
              <option value="">All Positions</option>
              {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
            </select>
          </div>
        </div>
      </section>

      <PageSection title={loading ? 'Loading Players...' : `${totalCount} Player${totalCount !== 1 ? 's' : ''} Found`}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={32} className="animate-spin text-[#0134BD]" />
          </div>
        ) : players.length === 0 ? (
          <div className="text-center py-12 bg-navy-800 rounded-lg shadow-md">
            <Users size={40} className="mx-auto mb-3 text-slate-600" />
            <p className="text-slate-400 text-lg mb-2">No players match your filters</p>
            <p className="text-gray-500 text-sm">Try adjusting your search criteria</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {players.map(p => {
                const name = [p.first_name, p.last_name].filter(Boolean).join(' ') || 'Unknown Player'
                const location = [p.city, p.state].filter(Boolean).join(', ') || 'Location not set'
                return (
                  <PlayerCard
                    key={p.id}
                    name={name}
                    position={p.position ?? 'Unknown'}
                    gradYear={p.class_year ?? currentYear}
                    location={location}
                    tags={buildTags(p)}
                    image={PLACEHOLDER_IMG}
                    onViewProfile={() => navigate(`/browse/${p.id}`)}
                  />
                )
              })}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  className="p-2 border border-white/20 rounded-md bg-navy-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-slate-400">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  className="p-2 border border-white/20 rounded-md bg-navy-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </PageSection>

      <CTABanner
        title="Need a Deeper Recruiting Workflow?"
        description="Access full database workflows, coach-facing tools, and strategic support designed for competitive programs."
        actions={[
          { label: 'Create Coach Account', href: '/signup', testId: 'browse-create-coach-account-link' },
          { label: 'View Recruiting Services', href: '/services', variant: 'secondary', testId: 'browse-view-recruiting-services-link' },
        ]}
        LinkComponent={Link}
      />
    </PageShell>
  )
}
