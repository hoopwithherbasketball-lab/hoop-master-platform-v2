import { Link } from 'react-router-dom'
import PageShell from '../../components/ui/PageShell'

const upcomingEvents = [
  { title: 'Elite GBB Showcase', date: 'June 15-17, 2026', location: 'Atlanta, GA', description: 'Top girls basketball players compete in front of college scouts from across the country.' },
  { title: 'Recruiting Workshop', date: 'July 8, 2026', location: 'Virtual', description: 'Learn the ins and outs of the college recruiting process from expert coaches.' },
  { title: 'Summer Skills Camp', date: 'August 5-7, 2026', location: 'Chicago, IL', description: 'Intensive skills development camp with D1 coaches and current college players.' },
  { title: 'NIL Summit', date: 'September 12, 2026', location: 'Los Angeles, CA', description: 'Connect with brands and learn how to maximize your NIL opportunities.' },
]

export default function EventsPage() {
  return (
    <PageShell title="Events & Showcases" description="Upcoming events, camps, and showcases for elite girls basketball players." badge="Events">
      <div className="grid gap-6 md:grid-cols-2">
        {upcomingEvents.map((event) => (
          <div key={event.title} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-[#0134BD]">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold text-[#121B47]">{event.title}</h3>
              <span className="bg-[#FB6C1D] text-white px-3 py-1 rounded-full text-xs font-medium">{event.date}</span>
            </div>
            <p className="text-sm text-gray-500 mb-2">{event.location}</p>
            <p className="text-gray-600 mb-4">{event.description}</p>
            <button className="w-full bg-[#0134BD] hover:bg-[#002a80] text-white py-2 px-4 rounded-md font-semibold transition-colors">
              Register Now
            </button>
          </div>
        ))}
      </div>
      <div className="text-center">
        <p className="text-gray-500">
          Signed in? <Link to="/dashboard/events" className="text-[#0134BD] hover:text-[#FB6C1D] font-semibold">View your events dashboard</Link>
        </p>
      </div>
    </PageShell>
  )
}
