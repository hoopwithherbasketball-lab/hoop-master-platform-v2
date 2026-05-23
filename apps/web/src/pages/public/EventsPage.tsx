import { Link } from 'react-router-dom'
import { useEventRegistration } from '@hoop-master/features/crm'
import PageShell from '../../components/ui/PageShell'
import { MapPin, Users, CheckCircle } from 'lucide-react'

export default function EventsPage() {
  const { events, isRegistered, toggleRegistration } = useEventRegistration()

  return (
    <PageShell title="Events & Showcases" description="Upcoming events, camps, and showcases for elite girls basketball players." badge="Events">
      <div className="grid gap-6 md:grid-cols-2">
        {events.map(event => {
          const registered = isRegistered(event.id)
          const spotsLeft = event.capacity - event.registered
          return (
            <div key={event.id} className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 ${registered ? 'border-green-500' : 'border-[#0134BD]'}`}>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-[#121B47]">{event.title}</h3>
                <span className="bg-[#FB6C1D] text-white px-3 py-1 rounded-full text-xs font-medium">{event.date}</span>
              </div>
              <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><MapPin size={12} /> {event.location}</p>
              <p className="text-xs text-gray-400 mb-3 flex items-center gap-1"><Users size={12} /> {event.registered} registered · {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}</p>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="flex items-center gap-3">
                <button onClick={() => toggleRegistration(event.id)} className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all ${registered ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-[#0134BD] hover:bg-[#002a80] text-white'}`}>
                  {registered ? <span className="flex items-center justify-center gap-1"><CheckCircle size={16} /> Registered</span> : `Register · $${event.price}`}
                </button>
              </div>
            </div>
          )
        })}
      </div>
      <div className="text-center">
        <p className="text-gray-500">Signed in? <Link to="/dashboard/events" className="text-[#0134BD] hover:text-[#FB6C1D] font-semibold">View your events dashboard</Link></p>
      </div>
    </PageShell>
  )
}
