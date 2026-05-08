import DashboardLayout from '../../components/layout/DashboardLayout'

const events = [
  { name: 'Summer Recruiting Showcase', date: 'Jun 12', location: 'Orlando, FL' },
  { name: 'Elite Skills Camp', date: 'Jul 3', location: 'Nashville, TN' },
  { name: 'NIL Coaching Clinic', date: 'Aug 21', location: 'Virtual' },
]

export default function EventsPage() {
  return (
    <DashboardLayout variant="player" title="Events" subtitle="Upcoming showcase events, training camps, and recruiting clinics." >
      <div className="grid gap-5">
        {events.map((event) => (
          <div key={event.name} className="card p-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-navy-900">{event.name}</h2>
              <p className="text-slate-500">{event.location}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{event.date}</span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
