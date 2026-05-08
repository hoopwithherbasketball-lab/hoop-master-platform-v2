import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../../components/ui/PageShell'

const players = [
  {
    id: 1,
    name: 'Sarah Johnson',
    position: 'Point Guard',
    gradYear: 2025,
    division: 'D1',
    location: 'Tennessee',
    tags: ['All-State', 'Team Captain', 'Academic Excellence'],
    image: '/api/placeholder/150/150'
  },
  {
    id: 2,
    name: 'Maria Rodriguez',
    position: 'Shooting Guard',
    gradYear: 2026,
    division: 'D2',
    location: 'California',
    tags: ['3-Point Specialist', 'Leadership', 'NIL Ready'],
    image: '/api/placeholder/150/150'
  },
  {
    id: 3,
    name: 'Emma Davis',
    position: 'Center',
    gradYear: 2024,
    division: 'D1',
    location: 'Texas',
    tags: ['Dominant Rebounder', 'Block Specialist', 'Scholar Athlete'],
    image: '/api/placeholder/150/150'
  }
]

export default function BrowsePage() {
  const [filters, setFilters] = useState({
    gradYear: '',
    position: '',
    division: ''
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const filteredPlayers = players.filter(player => {
    return (
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
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
            <select
              value={filters.gradYear}
              onChange={(e) => handleFilterChange('gradYear', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0134BD] focus:border-[#0134BD]"
            >
              <option value="">All Years</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
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

      {/* Featured Player Profiles */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-[#121B47] mb-6">Featured Players</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlayers.map((player) => (
            <div key={player.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={player.image}
                    alt={player.name}
                    className="w-16 h-16 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-[#121B47]">{player.name}</h3>
                    <p className="text-gray-600">{player.position} • Class of {player.gradYear}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{player.location}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {player.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-[#0134BD] text-white px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="w-full bg-[#FB6C1D] hover:bg-[#e55a1a] text-white py-2 px-4 rounded-md font-semibold transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
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
