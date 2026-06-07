import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { PageShell, CTABanner } from '@hoop-master/ui'
import { Loader as Loader2, ShoppingBag, CircleCheck as CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Skeleton } from '../../components/ui/skeleton'

// --- Types ---
export type ProductFamily = 'QUICK_WINS' | 'PACKAGES' | 'MEDIA' | 'TRAINING' | 'DEVELOPMENT'

export interface Deliverable {
  text: string
  isKeyFeature?: boolean
}

export interface ServiceProduct {
  id: string
  slug: string
  title: string
  price: number
  family: ProductFamily
  tag?: string
  description?: string
  deliverables: Deliverable[]
  checkoutUrl: string
}

// Database type
interface DBServiceOffer {
  id: string
  slug: string
  name: string
  category: string | null
  description: string | null
  price_cents: number
  active: boolean
}

// --- Configuration ---
const SERVICE_CONFIGS: Record<string, { family: ProductFamily; tag?: string; description?: string; deliverables: Deliverable[] }> = {
  // Quick Wins
  'one-pager': {
    family: 'QUICK_WINS',
    deliverables: [
      { text: '1-page coach-ready athletic and academic resume' },
      { text: 'Customized with your specific stats, measurables, and GPA' },
      { text: 'Clickable links to your HUDL/Highlight films' },
      { text: 'Delivered in PDF format for easy email attachments' }
    ]
  },
  'recruiting-audit': {
    family: 'QUICK_WINS',
    tag: 'Best for 8th & 9th Grade',
    deliverables: [
      { text: 'Comprehensive review of current social media and film' },
      { text: 'Recruiting gap analysis to identify missing exposure assets' },
      { text: 'Actionable checklist for the next 30 days' }
    ]
  },
  'profile-optimizer': {
    family: 'QUICK_WINS',
    deliverables: [
      { text: 'Complete bio rewrite for X (Twitter) and Instagram' },
      { text: 'Strategic bio link integration for stats and film' },
      { text: 'Guidance on pinning highly visible highlights' },
      { text: 'Professional formatting to catch college coaches\' eyes' }
    ]
  },
  'college-camp': {
    family: 'QUICK_WINS',
    deliverables: [
      { text: 'Targeted camp shortlist aligned to your skill level and goals' },
      { text: 'Pre-camp communication templates to email coaches' },
      { text: 'Post-camp follow-up strategy guide' },
      { text: 'Checklist for maximizing visibility during open runs' }
    ]
  },

  // Recruiting Packages
  'recruiting-basic': {
    family: 'PACKAGES',
    tag: 'Foundation Builder',
    deliverables: [
      { text: 'Includes the Recruiting One-Pager and Profile Optimizer' },
      { text: 'Initial 45-minute strategy and goal-setting call' },
      { text: 'Monthly email check-ins for one quarter' },
      { text: 'Template library for coach outreach and DMs' }
    ]
  },
  'recruiting-premium': {
    family: 'PACKAGES',
    tag: 'The Complete Journey',
    deliverables: [
      { text: 'Everything in Basic, plus full Social Media Kit' },
      { text: 'Bi-weekly Zoom check-ins and strategy sessions' },
      { text: 'Direct assistance with building a target school list' },
      { text: 'Film breakdown session to identify teachable moments' },
      { text: 'Priority support for urgent camp or visit questions' }
    ]
  },

  // Media & Branding
  'social-media-kit': {
    family: 'MEDIA',
    deliverables: [
      { text: '3 custom-branded graphic templates (Commitment, Game Day, Stats)' },
      { text: 'Formatted specifically for Instagram and X' },
      { text: 'Delivered in easy-to-edit Canva formats' },
      { text: 'Brand color and typography alignment' }
    ]
  },
  'highlight-film': {
    family: 'MEDIA',
    deliverables: [
      { text: '60-90 second high-impact sizzle reel' },
      { text: 'Isolation graphics (spot-shadowing/circling the athlete)' },
      { text: 'Removal of dead ball time and unnecessary lead-ups' },
      { text: 'Exported in 1080p optimized for social and email' }
    ]
  },
  'film-edit-highlight': {
    family: 'MEDIA',
    deliverables: [
      { text: '60-90 second high-impact sizzle reel' },
      { text: 'Isolation graphics (spot-shadowing/circling the athlete)' },
      { text: 'Removal of dead ball time and unnecessary lead-ups' },
      { text: 'Exported in 1080p optimized for social and email' }
    ]
  },

  // Training Experiences
  'skills-clinic': {
    family: 'TRAINING',
    deliverables: [
      { text: 'Intensive half-day fundamental skills lab' },
      { text: 'Focus on ball-handling, footwork, and shooting mechanics' },
      { text: 'Live repetitions and competitive drill scenarios' },
      { text: 'Take-home drill sheet for independent practice' }
    ]
  },
  'elite-camp': {
    family: 'TRAINING',
    deliverables: [
      { text: 'Multi-day high-intensity training environment' },
      { text: 'Advanced tactical concepts and game-situational reads' },
      { text: 'Live scrimmages with evaluation feedback' },
      { text: 'Exclusive HOOP WITH HER camp gear' }
    ]
  },

  // Player Development Plans
  'player-dev-bronze': {
    family: 'DEVELOPMENT',
    deliverables: [
      { text: 'Baseline skill evaluation and recorded metrics' },
      { text: 'Customized 4-week independent workout program' },
      { text: 'Access to our drill video library' },
      { text: 'End-of-month progress review' }
    ]
  },
  'player-dev-silver': {
    family: 'DEVELOPMENT',
    tag: 'Most Popular',
    deliverables: [
      { text: 'Comprehensive physical and skill evaluation' },
      { text: '8-week tailored development curriculum' },
      { text: 'Two 1-on-1 virtual film review sessions' },
      { text: 'Direct messaging access for drill troubleshooting' }
    ]
  },
  'player-dev-gold': {
    family: 'DEVELOPMENT',
    tag: 'Elite Tier',
    deliverables: [
      { text: 'Complete seasonal development tracking (12 weeks)' },
      { text: 'Four 1-on-1 virtual film and tactical review sessions' },
      { text: 'Advanced performance analytics tracking' },
      { text: 'Priority registration for upcoming clinics and open runs' },
      { text: 'Direct collaboration with your AAU/High School coach (optional)' }
    ]
  }
}

// Ensure formatting helper
const formatPrice = (cents: number) => `$${(cents / 100).toFixed(0)}`
const toTestId = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

// --- Components ---

function PricingCard({ product }: { product: ServiceProduct }) {
  return (
    <motion.article 
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-navy-800 p-6 rounded-xl shadow-md border-t-4 border-[#0134BD] flex flex-col relative h-full"
    >
      {product.tag && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FB6C1D] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-sm whitespace-nowrap z-10">
          {product.tag}
        </span>
      )}
      <div className="text-center mb-6 pt-2">
        <h3 className="text-lg font-semibold text-white leading-tight mb-2">{product.title}</h3>
        <div className="text-3xl font-extrabold text-white">{formatPrice(product.price)}</div>
      </div>
      <ul className="text-sm text-slate-300 mb-8 space-y-3 flex-1">
        {product.deliverables.map((d, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle size={16} className="text-[#0134BD] shrink-0 mt-0.5" />
            <span className={d.isKeyFeature ? 'font-semibold text-white' : ''}>{d.text}</span>
          </li>
        ))}
      </ul>
      <Link
        to={product.checkoutUrl}
        data-testid={`services-${toTestId(product.title)}-cta-link`}
        className="block text-center w-full bg-[#0134BD] hover:bg-[#002a80] text-white py-2.5 px-4 rounded-lg font-semibold transition-colors mt-auto"
      >
        Select Package
      </Link>
    </motion.article>
  )
}

function TieredComparison({ products }: { products: ServiceProduct[] }) {
  if (!products.length) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {products.map(product => {
        const isHighlighted = product.tag === 'Most Popular' || product.tag === 'The Complete Journey';
        return (
          <motion.article 
            whileHover={{ y: isHighlighted ? -20 : -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            key={product.id} 
            className={`flex flex-col relative rounded-2xl shadow-xl p-8 ${
              isHighlighted 
                ? 'bg-gradient-to-b from-[#121B47] to-[#0a1529] border-2 border-[#FB6C1D] transform md:-translate-y-4 md:scale-105 z-10' 
                : 'bg-navy-800 border border-white/10'
            }`}
          >
            {product.tag && (
              <span className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[11px] font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-md whitespace-nowrap z-10 ${
                isHighlighted ? 'bg-[#FB6C1D] text-white' : 'bg-white/10 text-slate-300'
              }`}>
                {product.tag}
              </span>
            )}
            <div className="text-center mb-6 pt-2">
              <h3 className="text-xl font-bold text-white mb-2">{product.title}</h3>
              <div className="text-4xl font-extrabold text-white mb-2">{formatPrice(product.price)}</div>
            </div>
            <ul className="text-sm text-slate-300 mb-8 space-y-4 flex-1">
              {product.deliverables.map((d, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle size={18} className={`${isHighlighted ? 'text-[#FB6C1D]' : 'text-[#0134BD]'} shrink-0 mt-0.5`} />
                  <span className="leading-snug">{d.text}</span>
                </li>
              ))}
            </ul>
            <Link
              to={product.checkoutUrl}
              data-testid={`services-${toTestId(product.title)}-cta-link`}
              className={`block text-center w-full py-3 px-4 rounded-lg font-bold transition-colors mt-auto ${
                isHighlighted
                  ? 'bg-[#FB6C1D] hover:bg-[#e55a1a] text-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              Select Package
            </Link>
          </motion.article>
        )
      })}
    </div>
  )
}

// --- Main Page ---
export default function ServicesPage() {
  const [products, setProducts] = useState<ServiceProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('service_offers')
      .select('id, slug, name, category, description, price_cents, active')
      .eq('active', true)
      .order('price_cents', { ascending: true })
      .then(({ data }) => {
        if (!data) {
          setLoading(false)
          return
        }

        // Map DB records to new Product architecture
        const mapped: ServiceProduct[] = data.map((offer: DBServiceOffer) => {
          const conf = SERVICE_CONFIGS[offer.slug]
          return {
            id: offer.id,
            slug: offer.slug,
            title: offer.name,
            price: offer.price_cents,
            family: conf?.family || 'QUICK_WINS', // Fallback to Quick Wins if unmapped
            tag: conf?.tag,
            description: conf?.description || offer.description || '',
            deliverables: conf?.deliverables || [
              { text: 'Professional evaluation and support' },
              { text: 'Customized strategy session' },
              { text: 'Ongoing coach communication' }
            ],
            checkoutUrl: `/checkout/${offer.slug}`
          }
        })

        setProducts(mapped)
        setLoading(false)
      })
  }, [])

  // Grouping
  const quickWins = products.filter(p => p.family === 'QUICK_WINS')
  const packages = products.filter(p => p.family === 'PACKAGES')
  const media = products.filter(p => p.family === 'MEDIA')
  const training = products.filter(p => p.family === 'TRAINING')
  const devPlans = products.filter(p => p.family === 'DEVELOPMENT')

  return (
    <PageShell
      title="Level Up Your Game"
      description="Targeted development and exposure for female athletes grades 8-12."
      badge="Premium Services"
    >
      {loading ? (
        <div className="max-w-7xl mx-auto py-16 space-y-24 px-4">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64 mx-auto bg-slate-800" />
            <Skeleton className="h-4 w-96 mx-auto bg-slate-800" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pt-8">
              <Skeleton className="h-[400px] w-full rounded-2xl bg-slate-800" />
              <Skeleton className="h-[440px] w-full rounded-2xl bg-slate-800 transform md:-translate-y-4" />
              <Skeleton className="h-[400px] w-full rounded-2xl bg-slate-800" />
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-48 bg-slate-800" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-[320px] w-full rounded-xl bg-slate-800" />)}
            </div>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag size={48} className="mx-auto mb-4 text-slate-500" />
          <p className="text-slate-400">No services available at this time. Check back soon.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto py-8 space-y-24">
          
          {/* TIERED: Player Development */}
          {devPlans.length > 0 && (
            <section>
              <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-white mb-3">Player Development Plans</h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">Comprehensive roadmaps tailored to your current skill level.</p>
              </div>
              <TieredComparison products={devPlans} />
            </section>
          )}

          {/* GRID: Quick Wins */}
          {quickWins.length > 0 && (
            <section>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Recruiting Quick Wins</h2>
                <p className="text-slate-400">High-impact assets to immediately upgrade your profile.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickWins.map(product => <PricingCard key={product.id} product={product} />)}
              </div>
            </section>
          )}

          {/* TIERED: Recruiting Packages */}
          {packages.length > 0 && (
            <section>
              <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-white mb-3">Complete Recruiting Packages</h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">End-to-end guidance for the college recruitment journey.</p>
              </div>
              <TieredComparison products={packages} />
            </section>
          )}

          {/* GRID: Media & Training */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {media.length > 0 && (
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Media & Branding</h2>
                  <p className="text-slate-400 text-sm">Professional content to get you noticed.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
                  {media.map(product => <PricingCard key={product.id} product={product} />)}
                </div>
              </section>
            )}

            {training.length > 0 && (
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Training Experiences</h2>
                  <p className="text-slate-400 text-sm">Intensive in-person labs and camps.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
                  {training.map(product => <PricingCard key={product.id} product={product} />)}
                </div>
              </section>
            )}
          </div>

        </div>
      )}

      <div className="mt-20">
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
      </div>
    </PageShell>
  )
}
