import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PlayerCard } from '@hoop-master/ui/components/PlayerCard'
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
      {/* Search Filters */}
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
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
              <option value="2029">2029</option>
              <option value="2030">2030</option>
              <option value="2031">2031</option>
              <option value="2032">2032</option>

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

      {/* Player Profiles */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-[#121B47] mb-6">Featured Players</h2>
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
      </section>

      {/* Coach CTA Banner */}
      <section className="bg-gradient-to-r from-[#0134BD] to-[#121B47] text-white p-8 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Are You a Coach Looking for Talent?</h2>
        <p className="text-xl mb-6 max-w-2xl mx-auto">
          Access our complete player database, advanced search filters, and recruiting tools designed for college coaches.
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
      </section>
    </PageShell>
  )
}
