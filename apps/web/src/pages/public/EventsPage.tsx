import { Link } from 'react-router-dom'
import { useEventRegistration } from '@hoop-master/features/crm'
import { PageShell, PageSection, CTABanner } from '@hoop-master/ui'
import { MapPin, Users, CheckCircle } from 'lucide-react'

export default function EventsPage() {
  const { events, isRegistered, toggleRegistration } = useEventRegistration()
  const hasEvents = events.length > 0

  return (
    <PageShell title="Events & Showcases" description="Curated showcases and development events for high-intent girls basketball athletes." badge="Events">
      <PageSection title="Upcoming Events & Showcases">
      {hasEvents ? (
      <div className="grid gap-6 md:grid-cols-2">
        {events.map((event) => {
          const registered = isRegistered(event.id)
          const spotsLeft = event.capacity - event.registered
          return (
            <article key={event.id} className={`bg-navy-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 ${registered ? 'border-green-500' : 'border-[#0134BD]'}`}>
              <div className="flex justify-between items-start mb-3 gap-3">
                <h3 className="text-xl font-semibold text-white leading-tight">{event.title}</h3>
                <span className="bg-[#FB6C1D] text-white px-3 py-1 rounded-full text-xs font-medium shrink-0">{event.date}</span>
              </div>
              <p className="text-sm text-slate-400 mb-1 flex items-center gap-1"><MapPin size={12} /> {event.location}</p>
              <p className="text-xs text-gray-400 mb-3 flex items-center gap-1"><Users size={12} /> {event.registered} registered · {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}</p>
              <p className="text-slate-400 mb-4">{event.description}</p>
              <div className="flex items-center gap-3">
                <button data-testid={`events-register-button-${event.id}`} onClick={() => toggleRegistration(event.id)} className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all ${registered ? 'bg-green-500/20 text-green-400 border-2 border-green-300' : 'bg-[#0134BD] hover:bg-[#002a80] text-white'}`}>
                  {registered ? <span className="flex items-center justify-center gap-1"><CheckCircle size={16} /> Registered</span> : `Register · $${event.price}`}
                </button>
              </div>
            </article>
          )
        })}
      </div>
      ) : (
      <div data-testid="events-empty-state" className="bg-navy-800 border border-white/10 rounded-xl p-8 text-center max-w-3xl mx-auto">
        <h3 className="text-2xl font-semibold text-white mb-3">No Open Events Right Now</h3>
        <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
          Our next showcase window is being finalized. Register your interest now and our team will notify you when priority slots open.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/contact"
            data-testid="events-empty-contact-link"
            className="bg-[#FB6C1D] hover:bg-[#e55a1a] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Register Interest
          </Link>
          <Link
            to="/services"
            data-testid="events-empty-services-link"
            className="bg-[#121B47] text-white border border-white/20 px-6 py-3 rounded-lg font-semibold hover:bg-[#1b2a66] transition-colors"
          >
            Explore Services
          </Link>
        </div>
      </div>
      )}
      </PageSection>

      <CTABanner
        title="Track Registrations & Priority Access"
        description="Already in the pipeline? Manage confirmations, updates, and upcoming event invitations from your dashboard."
        actions={[
          { label: 'View your events dashboard', href: '/dashboard/events', testId: 'events-dashboard-link' },
          { label: 'Explore services', href: '/services', variant: 'secondary', testId: 'events-explore-services-link' },
        ]}
        LinkComponent={Link}
      />
    </PageShell>
  )
}
