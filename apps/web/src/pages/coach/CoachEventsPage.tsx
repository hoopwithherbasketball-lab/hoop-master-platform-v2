import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Calendar, MapPin, Loader as Loader2 } from 'lucide-react'

interface EvalEvent {
  id: string
  title: string
  event_type: string
  location: string | null
  start_date: string
  end_date: string | null
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  evaluation: 'Evaluation Window',
  live_period: 'Live Period',
  camp: 'Camp',
  showcase: 'Showcase',
  workshop: 'Workshop',
}

function formatDateRange(start: string, end: string | null): string {
  const s = new Date(start)
  const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }
  if (!end || end === start) return s.toLocaleDateString('en-US', options)
  const e = new Date(end)
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}–${e.getDate()}, ${e.getFullYear()}`
  }
  return `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${e.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
}

export default function CoachEventsPage() {
  const [events, setEvents] = useState<EvalEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('events')
      .select('id, title, event_type, location, start_date, end_date')
      .in('event_type', ['evaluation', 'live_period', 'showcase', 'camp'])
      .eq('status', 'published')
      .order('start_date', { ascending: true })
      .then(({ data }) => {
        setEvents(data ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <DashboardLayout variant="coach" title="Events" subtitle="Upcoming exposure events and evaluation windows">
      <div className="max-w-3xl space-y-4">
        <div className="card bg-amber-50 border-amber-200">
          <p className="font-semibold text-amber-800 text-sm mb-1">July Evaluation Period Rule</p>
          <p className="text-amber-700 text-sm">During July evaluation periods marked in orange below, all communication with prospects, families, and their coaches is PROHIBITED unless the prospect is already committed.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 size={24} className="animate-spin text-slate-400" />
          </div>
        ) : events.length === 0 ? (
          <div className="card p-8 text-center text-slate-400">No upcoming events scheduled.</div>
        ) : (
          <div className="space-y-3">
            {events.map(ev => {
              const isLive = ev.event_type === 'live_period'
              return (
                <div key={ev.id} className={`card flex items-start gap-4 ${isLive ? 'border-brand-orange border-2' : ''}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isLive ? 'bg-brand-orange text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <Calendar size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-200">{ev.title}</p>
                        <p className="text-sm text-slate-500 mt-0.5">{formatDateRange(ev.start_date, ev.end_date)}</p>
                        {ev.location && (
                          <span className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                            <MapPin size={10} />{ev.location}
                          </span>
                        )}
                      </div>
                      <span className={`badge flex-shrink-0 ${isLive ? 'badge-orange' : 'badge-navy'}`}>
                        {EVENT_TYPE_LABELS[ev.event_type] ?? ev.event_type}
                      </span>
                    </div>
                    {isLive && (
                      <p className="text-xs text-red-400 mt-2 font-medium">No communication with uncommitted prospects during this window</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
