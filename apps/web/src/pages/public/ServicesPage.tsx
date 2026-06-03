import { Link } from 'react-router-dom'
import { PageShell, PageSection, CTABanner } from '@hoop-master/ui'

const services = [
  {
    title: 'Profile Audit',
    price: '$99',
    description: 'Comprehensive review of your recruiting profile, highlight reel, and academic standing with actionable improvement recommendations.',
    features: ['Profile Analysis', 'Video Feedback', 'Academic Review', '30-min Consultation'],
    ctaHref: '/contact',
  },
  {
    title: 'Media Package',
    price: '$299',
    description: 'Professional highlight reel creation, social media content strategy, and exposure across recruiting networks.',
    features: ['Custom Highlight Reel', 'Social Media Strategy', 'Network Distribution', 'Monthly Updates'],
    ctaHref: '/contact',
  },
  {
    title: 'Recruiting Strategy',
    price: '$199',
    description: 'Personalized recruiting plan with target schools, timeline, and NCAA compliance guidance.',
    features: ['School Matching', 'Recruiting Timeline', 'Compliance Guidance', 'Coach Outreach Support'],
    ctaHref: '/contact',
  },
  {
    title: 'Full-Service Package',
    price: '$599',
    description: 'Complete recruiting and NIL preparation including profile optimization, media package, and ongoing strategy support.',
    features: ['Everything Above', 'Ongoing Support', 'NIL Preparation', 'Priority Access'],
    ctaHref: '/contact',
  }
]

const teamPackages = [
  {
    title: 'Team Profile Audit',
    price: '$299',
    description: 'Complete team evaluation with individual player assessments and team development recommendations.',
    ctaHref: '/contact',
  },
  {
    title: 'Team Media Package',
    price: '$799',
    description: 'Professional team highlight reels, social media strategy, and exposure for the entire program.',
    ctaHref: '/contact',
  }
]

const toTestId = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export default function ServicesPage() {
  return (
    <PageShell
      title="Elite Services & Packages"
      description="Accelerate your recruiting and NIL journey with our premium services designed for serious athletes."
      badge="Premium Services"
    >
      <PageSection title="Individual Services">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <article key={service.title} className="bg-navy-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-t-4 border-[#0134BD]">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                <div className="text-3xl font-bold text-[#FB6C1D] mt-2">{service.price}</div>
              </div>
              <p className="text-slate-400 mb-4 text-center">{service.description}</p>
              <ul className="text-sm text-slate-400 mb-6 space-y-1">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="text-[#0134BD] mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to={service.ctaHref}
                data-testid={`services-${toTestId(service.title)}-cta-link`}
                className="block text-center w-full bg-[#0134BD] hover:bg-[#002a80] text-white py-2 px-4 rounded-md font-semibold transition-colors"
              >
                Get Started
              </Link>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection title="Team Packages">
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {teamPackages.map((pkg) => (
            <article key={pkg.title} className="bg-gradient-to-br from-[#C8A24A] to-[#FB6C1D] p-6 rounded-lg text-white">
              <h3 className="text-2xl font-semibold mb-2">{pkg.title}</h3>
              <div className="text-3xl font-bold mb-4">{pkg.price}</div>
              <p className="mb-6">{pkg.description}</p>
              <Link
                to={pkg.ctaHref}
                data-testid={`services-${toTestId(pkg.title)}-learn-more-link`}
                className="inline-block bg-[#121B47] text-white py-2 px-6 rounded-md font-semibold hover:bg-[#0a1529] transition-colors"
              >
                Learn More
              </Link>
            </article>
          ))}
        </div>
      </PageSection>

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
