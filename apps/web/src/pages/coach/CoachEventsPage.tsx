import DashboardLayout from '../../components/layout/DashboardLayout'
import { Calendar, MapPin } from 'lucide-react'

const evalPeriods = [
  { name: 'Adidas Earn Your Stripes', dates: 'April 25-26, 2026', location: 'Rock Hill, SC', type: 'Circuit Event' },
  { name: 'Beast of the East', dates: 'May 15-17, 2026', location: 'Greensboro, NC', type: 'Evaluation Window' },
  { name: 'PXB Showcase', dates: 'May 30-31, 2026', location: 'Bermuda Run, NC', type: 'Showcase' },
  { name: 'Big Shots Spring Nationals', dates: 'June 6-7, 2026', location: 'Rock Hill, SC', type: 'Circuit Event' },
  { name: 'Phenom Hoops Summer Nationals', dates: 'July 10-12, 2026', location: 'Bermuda Run, NC', type: 'Live Period', live: true },
  { name: 'Adidas 3SSB Palmetto Championships', dates: 'July 24-27, 2026', location: 'Rock Hill, SC', type: 'Live Period', live: true },
]

export default function CoachEventsPage() {
  return (
    <DashboardLayout variant="coach" title="Events" subtitle="Upcoming exposure events and evaluation windows">
      <div className="max-w-3xl space-y-4">
        <div className="card bg-amber-50 border-amber-200"><p className="font-semibold text-amber-800 text-sm mb-1">July Evaluation Period Rule</p><p className="text-amber-700 text-sm">During July evaluation periods marked in orange below, all communication with prospects, families, and their coaches is PROHIBITED unless the prospect is already committed.</p></div>
        <div className="space-y-3">
          {evalPeriods.map(ev => (
            <div key={ev.name} className={`card flex items-start gap-4 ${ev.live ? 'border-brand-orange border-2' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${ev.live ? 'bg-brand-orange text-white' : 'bg-slate-100 text-slate-400'}`}><Calendar size={18} /></div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="font-semibold text-slate-800">{ev.name}</p><p className="text-sm text-slate-500 mt-0.5">{ev.dates}</p><span className="flex items-center gap-1 text-xs text-slate-400 mt-1"><MapPin size={10} />{ev.location}</span></div>
                  <span className={`badge flex-shrink-0 ${ev.live ? 'badge-orange' : 'badge-navy'}`}>{ev.type}</span>
                </div>
                {ev.live && <p className="text-xs text-red-600 mt-2 font-medium">No communication with uncommitted prospects during this window</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
