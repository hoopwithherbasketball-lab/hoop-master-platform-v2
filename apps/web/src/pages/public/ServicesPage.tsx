import { Link } from 'react-router-dom'
import { ServiceCard } from '@hoop-master/ui'
import PageShell from '../../components/ui/PageShell'

const services = [
  {
    title: 'Profile Audit',
    price: '$99',
    description: 'Comprehensive review of your recruiting profile, highlight reel, and academic standing with actionable improvement recommendations.',
    features: ['Profile Analysis', 'Video Feedback', 'Academic Review', '30-min Consultation']
  },
  {
    title: 'Media Package',
    price: '$299',
    description: 'Professional highlight reel creation, social media content strategy, and exposure across recruiting networks.',
    features: ['Custom Highlight Reel', 'Social Media Strategy', 'Network Distribution', 'Monthly Updates']
  },
  {
    title: 'Recruiting Strategy',
    price: '$199',
    description: 'Personalized recruiting plan with target schools, timeline, and NCAA compliance guidance.',
    features: ['School Matching', 'Recruiting Timeline', 'Compliance Guidance', 'Coach Outreach Support']
  },
  {
    title: 'Full-Service Package',
    price: '$599',
    description: 'Complete recruiting and NIL preparation including profile optimization, media package, and ongoing strategy support.',
    features: ['Everything Above', 'Ongoing Support', 'NIL Preparation', 'Priority Access']
  }
]

const teamPackages = [
  {
    title: 'Team Profile Audit',
    price: '$299',
    description: 'Complete team evaluation with individual player assessments and team development recommendations.'
  },
  {
    title: 'Team Media Package',
    price: '$799',
    description: 'Professional team highlight reels, social media strategy, and exposure for the entire program.'
  }
]

export default function ServicesPage() {
  return (
    <PageShell
      title="Elite Services & Packages"
      description="Accelerate your recruiting and NIL journey with our premium services designed for serious athletes."
      badge="Premium Services"
    >
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center text-[#121B47] mb-8">Individual Services</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              price={service.price}
              description={service.description}
              features={service.features}
            />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center text-[#121B47] mb-8">Team Packages</h2>
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {teamPackages.map((pkg) => (
            <div key={pkg.title} className="bg-gradient-to-br from-[#C8A24A] to-[#FB6C1D] p-6 rounded-lg text-white">
              <h3 className="text-2xl font-semibold mb-2">{pkg.title}</h3>
              <div className="text-3xl font-bold mb-4">{pkg.price}</div>
              <p className="mb-6">{pkg.description}</p>
              <button className="bg-white text-[#0134BD] py-2 px-6 rounded-md font-semibold hover:bg-gray-100 transition-colors">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#121B47] text-white p-8 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Not Sure Which Service is Right for You?</h2>
        <p className="text-xl mb-6 max-w-2xl mx-auto">
          Schedule a free 15-minute consultation with our recruiting experts to discuss your goals and find the perfect package.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/contact"
            className="bg-[#FB6C1D] hover:bg-[#e55a1a] text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            Book Free Consultation
          </Link>
          <Link
            to="/workshops"
            className="bg-white text-[#0134BD] px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            View Workshops
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
