import { Link } from 'react-router-dom'
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
      {/* Individual Services */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Individual Services</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <div key={service.title} className="bg-navy-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-t-4 border-[#0134BD]">
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
              <button className="w-full bg-[#0134BD] hover:bg-[#002a80] text-white py-2 px-4 rounded-md font-semibold transition-colors">
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Team Packages */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Team Packages</h2>
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {teamPackages.map((pkg, index) => (
            <div key={pkg.title} className="bg-gradient-to-br from-[#C8A24A] to-[#FB6C1D] p-6 rounded-lg text-white">
              <h3 className="text-2xl font-semibold mb-2">{pkg.title}</h3>
              <div className="text-3xl font-bold mb-4">{pkg.price}</div>
              <p className="mb-6">{pkg.description}</p>
              <button className="bg-navy-800 text-[#0134BD] py-2 px-6 rounded-md font-semibold hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Free Consultation CTA */}
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
            className="bg-navy-800 text-[#0134BD] px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors"
          >
            View Workshops
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
