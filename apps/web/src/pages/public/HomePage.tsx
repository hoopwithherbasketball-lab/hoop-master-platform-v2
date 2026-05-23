import { Link } from 'react-router-dom'
import { IconTarget, IconMoney, IconChart } from '@hoop-master/ui'
import PageShell from '../../components/ui/PageShell'

export default function HomePage() {
  return (
    <PageShell
      title="Elite Girls Basketball Development"
      description="All-in-one player readiness, recruiting visibility, NIL opportunities, and partner services for elite female athletes."
      badge="Player Development"
    >
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-[#121B47] to-[#0134BD] text-white rounded-lg mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Elevate Your Game, Own Your Future
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          The complete platform for elite girls basketball players to build their brand, connect with coaches, and unlock NIL opportunities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup" className="bg-[#FB6C1D] hover:bg-[#e55a1a] text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
            Start Your Journey
          </Link>
          <Link to="/recruiting-readiness" className="bg-white text-[#0134BD] px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
            Check Readiness
          </Link>
        </div>
      </section>

      {/* Audience Cards */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-[#0134BD]">
          <h3 className="text-xl font-semibold text-[#121B47] mb-3">For Players</h3>
          <p className="text-gray-600 mb-4">Build your recruiting profile, track readiness, and connect with college coaches.</p>
          <Link to="/signup" className="text-[#0134BD] font-semibold hover:text-[#FB6C1D] transition-colors">Get Started →</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-[#FB6C1D]">
          <h3 className="text-xl font-semibold text-[#121B47] mb-3">For Parents</h3>
          <p className="text-gray-600 mb-4">Navigate recruiting and NIL opportunities with expert guidance and tools.</p>
          <Link to="/workshops" className="text-[#0134BD] font-semibold hover:text-[#FB6C1D] transition-colors">Learn More →</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-[#C8A24A]">
          <h3 className="text-xl font-semibold text-[#121B47] mb-3">For Coaches</h3>
          <p className="text-gray-600 mb-4">Discover top talent, access player profiles, and streamline recruiting.</p>
          <Link to="/browse" className="text-[#0134BD] font-semibold hover:text-[#FB6C1D] transition-colors">Browse Players →</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-[#0134BD]">
          <h3 className="text-xl font-semibold text-[#121B47] mb-3">For Clubs</h3>
          <p className="text-gray-600 mb-4">Partner with elite programs and provide premium services to your athletes.</p>
          <Link to="/services" className="text-[#0134BD] font-semibold hover:text-[#FB6C1D] transition-colors">View Services →</Link>
        </div>
      </section>

      {/* Platform Pillars */}
      <section className="bg-gray-50 p-8 rounded-lg mb-12">
        <h2 className="text-3xl font-bold text-center text-[#121B47] mb-8">Why Choose Elite GBB?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#0134BD] rounded-full flex items-center justify-center mx-auto mb-4">
              <IconTarget size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#121B47] mb-2">Targeted Recruiting</h3>
            <p className="text-gray-600">Get seen by the right coaches with data-driven recruiting tools and personalized strategies.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#FB6C1D] rounded-full flex items-center justify-center mx-auto mb-4">
              <IconMoney size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#121B47] mb-2">NIL Opportunities</h3>
            <p className="text-gray-600">Build your personal brand and connect with sponsors for name, image, and likeness deals.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#C8A24A] rounded-full flex items-center justify-center mx-auto mb-4">
              <IconChart size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#121B47] mb-2">Performance Tracking</h3>
            <p className="text-gray-600">Monitor your development with comprehensive analytics and readiness assessments.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center text-[#121B47] mb-8">Success Stories</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 mb-4 italic">"Elite GBB helped me get recruited to my dream school. The platform made it easy to showcase my skills and connect with coaches."</p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-[#0134BD] rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-semibold">S</span>
              </div>
              <div>
                <p className="font-semibold text-[#121B47]">Sarah Johnson</p>
                <p className="text-sm text-gray-500">Class of 2025, University of Tennessee</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 mb-4 italic">"The NIL tools helped me secure my first sponsorship deal. This platform is a game-changer for athletes."</p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-[#FB6C1D] rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-semibold">M</span>
              </div>
              <div>
                <p className="font-semibold text-[#121B47]">Maria Rodriguez</p>
                <p className="text-sm text-gray-500">NIL Athlete, Sponsored by Local Business</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#121B47] text-white p-8 rounded-lg mb-12">
        <div className="grid gap-6 md:grid-cols-4 text-center">
          <div>
            <div className="text-3xl font-bold text-[#C8A24A] mb-2">500+</div>
            <p className="text-gray-300">Players Recruited</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#FB6C1D] mb-2">$2M+</div>
            <p className="text-gray-300">NIL Earnings</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#0134BD] mb-2">200+</div>
            <p className="text-gray-300">Partner Coaches</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#C8A24A] mb-2">50+</div>
            <p className="text-gray-300">Workshops Hosted</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-16 bg-gradient-to-r from-[#FB6C1D] to-[#C8A24A] text-white rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Ready to Take Your Game to the Next Level?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of elite athletes who are building their future with Elite GBB.
        </p>
        <Link to="/signup" className="bg-white text-[#0134BD] px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
          Join Elite GBB Today
        </Link>
      </section>
    </PageShell>
  )
}
