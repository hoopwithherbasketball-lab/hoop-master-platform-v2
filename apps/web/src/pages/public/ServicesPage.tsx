import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { PageShell, PageSection, CTABanner } from '@hoop-master/ui'
import { Loader as Loader2, ShoppingBag } from 'lucide-react'

interface ServiceOffer {
  id: string
  slug: string
  name: string
  category: string | null
  description: string | null
  price_cents: number
  active: boolean
}

const toTestId = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const formatPrice = (cents: number) => `$${(cents / 100).toFixed(0)}`

const CATEGORY_FEATURES: Record<string, string[]> = {
  development: ['Personalized Training Plan', 'Film Breakdown', 'Skills Assessment', 'Progress Tracking'],
  recruiting: ['Profile Optimization', 'School Matching', 'Coach Outreach', 'Compliance Guidance'],
  media: ['Highlight Film Editing', 'Social Strategy', 'Network Distribution', 'Monthly Updates'],
  audit: ['Full Profile Review', 'Gap Analysis', 'Action Plan', '30-min Consult'],
  camp: ['Live Coaching', 'Evaluation Report', 'Exposure Opportunity', 'Networking'],
}

function getFeatures(offer: ServiceOffer): string[] {
  const cat = offer.category?.toLowerCase() ?? ''
  for (const [key, features] of Object.entries(CATEGORY_FEATURES)) {
    if (cat.includes(key)) return features
  }
  return ['Expert Coaching', 'Personalized Plan', 'Progress Tracking', 'Follow-up Support']
}

export default function ServicesPage() {
  const [offers, setOffers] = useState<ServiceOffer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('service_offers')
      .select('id, slug, name, category, description, price_cents, active')
      .eq('active', true)
      .order('price_cents', { ascending: true })
      .then(({ data }) => {
        setOffers(data ?? [])
        setLoading(false)
      })
  }, [])

  const individual = offers.filter(o => !o.category?.toLowerCase().includes('team'))
  const team = offers.filter(o => o.category?.toLowerCase().includes('team'))

  return (
    <PageShell
      title="Elite Services & Packages"
      description="Accelerate your recruiting and NIL journey with our premium services designed for serious athletes."
      badge="Premium Services"
    >
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-[#0134BD]" />
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag size={48} className="mx-auto mb-4 text-slate-500" />
          <p className="text-slate-400">No services available at this time. Check back soon.</p>
        </div>
      ) : (
        <>
          <PageSection title="Individual Services">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {individual.map(offer => (
                <article key={offer.id} className="bg-navy-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-t-4 border-[#0134BD] flex flex-col">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-semibold text-white">{offer.name}</h3>
                    <div className="text-3xl font-bold text-[#FB6C1D] mt-2">{formatPrice(offer.price_cents)}</div>
                  </div>
                  {offer.description && (
                    <p className="text-slate-400 mb-4 text-center text-sm">{offer.description}</p>
                  )}
                  <ul className="text-sm text-slate-400 mb-6 space-y-1 flex-1">
                    {getFeatures(offer).map(f => (
                      <li key={f} className="flex items-center gap-2">
                        <span className="text-[#0134BD]">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/checkout/${offer.slug}`}
                    data-testid={`services-${toTestId(offer.name)}-cta-link`}
                    className="block text-center w-full bg-[#0134BD] hover:bg-[#002a80] text-white py-2 px-4 rounded-md font-semibold transition-colors"
                  >
                    Get Started
                  </Link>
                </article>
              ))}
            </div>
          </PageSection>

          {team.length > 0 && (
            <PageSection title="Team Packages">
              <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
                {team.map(offer => (
                  <article key={offer.id} className="bg-gradient-to-br from-[#C8A24A] to-[#FB6C1D] p-6 rounded-lg text-white">
                    <h3 className="text-2xl font-semibold mb-2">{offer.name}</h3>
                    <div className="text-3xl font-bold mb-4">{formatPrice(offer.price_cents)}</div>
                    {offer.description && <p className="mb-6 text-white/90">{offer.description}</p>}
                    <Link
                      to={`/checkout/${offer.slug}`}
                      data-testid={`services-${toTestId(offer.name)}-learn-more-link`}
                      className="inline-block bg-[#121B47] text-white py-2 px-6 rounded-md font-semibold hover:bg-[#0a1529] transition-colors"
                    >
                      Learn More
                    </Link>
                  </article>
                ))}
              </div>
            </PageSection>
          )}
        </>
      )}

      <CTABanner
        title="Not Sure Which Service is Right for You?"
        description="Schedule a free 15-minute consultation with our recruiting experts to discuss your goals and pick the best package."
        gradient="from-[#121B47] to-[#0134BD]"
        actions={[
          { label: 'Book Free Consultation', href: '/contact', testId: 'services-free-consultation-link' },
          { label: 'View Workshops', href: '/workshops', variant: 'secondary', testId: 'services-view-workshops-link' },
        ]}
        LinkComponent={Link}
      />
    </PageShell>
  )
}
