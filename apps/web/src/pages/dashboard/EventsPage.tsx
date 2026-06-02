import { useEventRegistration } from '@hoop-master/features/crm'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Link } from 'react-router-dom'
import { MapPin, Users, Calendar, XCircle } from 'lucide-react'

export default function EventsPage() {
  const { myEvents, events, toggleRegistration, registeredCount } = useEventRegistration()

  return (
    <DashboardLayout variant="player" title="My Events" subtitle={`${registeredCount} event${registeredCount !== 1 ? 's' : ''} registered`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {registeredCount === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
            <p className="font-semibold text-amber-800 mb-1">No events registered</p>
            <p className="text-amber-600 text-sm mb-4">Browse upcoming events and register to attend.</p>
            <Link to="/events" className="inline-block bg-[#0134BD] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#002a80]">Browse Events</Link>
          </div>
        )}

        {myEvents.map(event => {
          const fullEvent = events.find(e => e.id === event.id)!
          const spotsLeft = fullEvent.capacity - fullEvent.registered
          return (
            <div key={event.id} className="bg-navy-800 rounded-xl shadow-sm p-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar size={22} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{event.title}</h3>
                  <p className="text-sm text-slate-400 flex items-center gap-1 mt-0.5"><MapPin size={12} /> {event.location}</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Users size={12} /> {event.registered} registered · {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">{event.date}</span>
                <button onClick={() => toggleRegistration(event.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <XCircle size={18} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </DashboardLayout>
  )
}
