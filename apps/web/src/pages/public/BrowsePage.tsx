import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlayerCard, CTABanner, PageSection } from '@hoop-master/ui'
import PageShell from '../../components/ui/PageShell'
import { players } from './players-data'

export default function BrowsePage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    search: '',
    gradYear: '',
    position: '',
    division: '',
  })

  const currentYear = new Date().getFullYear()
  const gradYears = Array.from({ length: 7 }, (_, i) => currentYear + i)

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const filteredPlayers = players.filter(player => {
    const query = filters.search.toLowerCase()
    return (
      (!filters.search || player.name.toLowerCase().includes(query) || player.location.toLowerCase().includes(query) || player.position.toLowerCase().includes(query)) &&
      (!filters.gradYear || player.gradYear.toString() === filters.gradYear) &&
      (!filters.position || player.position === filters.position) &&
      (!filters.division || player.division === filters.division)
    )
  })

  return (
    <PageShell
      title="Browse Elite Players"
      description="Discover top girls basketball talent ready for college recruiting."
      badge="Player Database"
    >
      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-[#121B47] mb-4">Find Your Next Recruit</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Name, position, or location..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0134BD] focus:border-[#0134BD]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
            <select
              value={filters.gradYear}
              onChange={(e) => handleFilterChange('gradYear', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0134BD] focus:border-[#0134BD]"
            >
              <option value="">All Years</option>
              {gradYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
            <select
              value={filters.position}
              onChange={(e) => handleFilterChange('position', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0134BD] focus:border-[#0134BD]"
            >
              <option value="">All Positions</option>
              <option value="Point Guard">Point Guard</option>
              <option value="Shooting Guard">Shooting Guard</option>
              <option value="Small Forward">Small Forward</option>
              <option value="Power Forward">Power Forward</option>
              <option value="Center">Center</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Division</label>
            <select
              value={filters.division}
              onChange={(e) => handleFilterChange('division', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0134BD] focus:border-[#0134BD]"
            >
              <option value="">All Divisions</option>
              <option value="D1">Division 1</option>
              <option value="D2">Division 2</option>
              <option value="D3">Division 3</option>
            </select>
          </div>
        </div>
      </section>

      <PageSection title="Featured Players">
        {filteredPlayers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg mb-2">No players match your filters</p>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                name={player.name}
                position={player.position}
                gradYear={player.gradYear}
                location={player.location}
                tags={player.tags}
                image={player.image}
                onViewProfile={() => navigate(`/browse/${player.id}`)}
              />
            ))}
          </div>
        )}
      </PageSection>

      <CTABanner
        title="Are You a Coach Looking for Talent?"
        description="Access our complete player database, advanced search filters, and recruiting tools designed for college coaches."
        actions={[
          { label: 'Create Coach Account', href: '/signup' },
          { label: 'View Recruiting Services', href: '/services', variant: 'secondary' },
        ]}
      />
    </PageShell>
  )
}
