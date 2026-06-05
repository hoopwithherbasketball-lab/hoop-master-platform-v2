import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { PageShell, PageSection, CTABanner } from '@hoop-master/ui'
import { Monitor, Building2, Users, MapPin, Calendar, Users as Users2, Loader as Loader2 } from 'lucide-react'

interface WorkshopEvent {
  id: string
  title: string
  description: string | null
  location: string | null
  start_date: string | null
  end_date: string | null
  price: string | null
  max_participants: number | null
  current_participants: number | null
  age_groups: string[] | null
  featured: boolean
}

function formatDate(d: string | null) {
  if (!d) return null
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function formatPrice(price: string | null) {
  if (!price || parseFloat(price) === 0) return 'Free'
  return `$${parseFloat(price).toFixed(0)}`
}

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<WorkshopEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('events')
      .select('id, title, description, location, start_date, end_date, price, max_participants, current_participants, age_groups, featured')
      .in('event_type', ['workshop', 'camp'])
      .eq('status', 'published')
      .order('featured', { ascending: false })
      .order('start_date', { ascending: true })
      .then(({ data }) => {
        setWorkshops(data ?? [])
        setLoading(false)
      })
  }, [])

  const spotsLeft = (w: WorkshopEvent) => {
    if (!w.max_participants) return null
    const taken = w.current_participants ?? 0
    const left = w.max_participants - taken
    return left <= 0 ? 'Full' : `${left} spots left`
  }

  return (
    <PageShell
      title="Elite Workshops & Training"
      description="Interactive workshops designed to accelerate your recruiting and NIL success."
      badge="Workshops"
    >
      <PageSection title="Upcoming Workshops">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={32} className="animate-spin text-[#0134BD]" />
          </div>
        ) : workshops.length === 0 ? (
          <div className="text-center py-12 bg-navy-800 rounded-lg border border-white/10">
            <Calendar size={40} className="mx-auto mb-3 text-slate-600" />
            <p className="text-slate-400 text-lg mb-1">No workshops scheduled yet</p>
            <p className="text-slate-500 text-sm">Check back soon or contact us to request a session.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {workshops.map(w => {
              const spots = spotsLeft(w)
              const isFull = spots === 'Full'
              return (
                <article key={w.id} className="bg-navy-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-[#0134BD] flex flex-col">
                  <div className="flex justify-between items-start mb-3 gap-3">
                    <h3 className="text-xl font-semibold text-white leading-tight">{w.title}</h3>
                    <span className="bg-[#FB6C1D] text-white px-3 py-1 rounded-full text-sm font-medium shrink-0">
                      {formatPrice(w.price)}
                    </span>
                  </div>

                  {w.description && <p className="text-slate-400 mb-4 text-sm leading-relaxed flex-1">{w.description}</p>}

                  <div className="space-y-2 mb-5 text-sm text-slate-400">
                    {w.start_date && (
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-[#0134BD] shrink-0" />
                        <span>{formatDate(w.start_date)}</span>
                      </div>
                    )}
                    {w.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-[#0134BD] shrink-0" />
                        <span>{w.location}</span>
                      </div>
                    )}
                    {w.age_groups && w.age_groups.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Users2 size={14} className="text-[#0134BD] shrink-0" />
                        <span>{w.age_groups.join(', ')}</span>
                      </div>
                    )}
                    {spots && (
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isFull ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                          {spots}
                        </span>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/contact"
                    data-testid={`workshops-${w.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-book-link`}
                    className={`block text-center w-full py-2 px-4 rounded-md font-semibold transition-colors ${isFull ? 'bg-slate-600 text-slate-400 cursor-not-allowed pointer-events-none' : 'bg-[#0134BD] hover:bg-[#002a80] text-white'}`}
                  >
                    {isFull ? 'Workshop Full' : 'Book Workshop'}
                  </Link>
                </article>
              )
            })}
          </div>
        )}
      </PageSection>

      <PageSection title="Workshop Formats" className="bg-white/5 p-8 rounded-lg">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#0134BD] rounded-full flex items-center justify-center mx-auto mb-4">
              <Monitor size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Virtual Workshops</h3>
            <p className="text-slate-400">Interactive online sessions with live Q&A, accessible from anywhere.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#FB6C1D] rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">In-Person Clinics</h3>
            <p className="text-slate-400">Hands-on training at elite facilities with direct coaching feedback.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#C8A24A] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Group Sessions</h3>
            <p className="text-slate-400">Collaborative learning with peers, building community and support networks.</p>
          </div>
        </div>
      </PageSection>

      <CTABanner
        title="Bring Elite Training to Your Team"
        description="Custom workshops and training sessions for clubs, AAU teams, and high school programs. Group discounts and custom curriculum available."
        gradient="from-[#121B47] to-[#0134BD]"
        actions={[
          { label: 'Book Team Workshop', href: '/contact', testId: 'workshops-book-team-workshop-link' },
          { label: 'View All Services', href: '/services', variant: 'secondary', testId: 'workshops-view-services-link' },
        ]}
        LinkComponent={Link}
      />
    </PageShell>
  )
}
