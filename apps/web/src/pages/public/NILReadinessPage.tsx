import StatusBadge from '../../components/ui/StatusBadge'
import PageShell from '../../components/ui/PageShell'
import { Link } from 'react-router-dom'

const partners = [
  { name: 'PerformBetter', category: 'Training', status: 'Open' },
  { name: 'Baller Brand', category: 'Apparel', status: 'Match Pending' },
  { name: 'Hoops Nutrition', category: 'Supplement', status: 'Approved' },
]

const myths = [
  {
    myth: 'NIL deals are only for Division 1 athletes',
    truth: 'NIL opportunities exist at all levels, though D1 athletes typically have more options.'
  },
  {
    myth: 'You need millions of followers to get NIL deals',
    truth: 'Quality content and engagement matter more than follower count. Many deals start with local businesses.'
  },
  {
    myth: 'NIL money comes directly from the school',
    truth: 'NIL deals are separate from athletic scholarships and come from external sponsors.'
  },
  {
    myth: 'NIL deals are guaranteed for top recruits',
    truth: 'NIL success requires proactive brand building and relationship development.'
  }
]

const brandPillars = [
  {
    title: 'Authenticity',
    description: 'Be genuine in your content and partnerships. Sponsors want real athletes, not personas.',
    icon: '🎭'
  },
  {
    title: 'Consistency',
    description: 'Post regularly and maintain a cohesive brand voice across all platforms.',
    icon: '📅'
  },
  {
    title: 'Engagement',
    description: 'Interact with your audience. Respond to comments and build a community.',
    icon: '💬'
  },
  {
    title: 'Professionalism',
    description: 'Present yourself as a serious athlete with clear goals and work ethic.',
    icon: '👔'
  }
]

const socialExpectations = [
  'Post 3-5 times per week consistently',
  'Mix game highlights with behind-the-scenes content',
  'Use relevant hashtags (#GirlsBasketball, #Recruiting)',
  'Engage with other athletes and coaches',
  'Share your journey and personal growth',
  'Collaborate with local businesses for authentic partnerships'
]

const parentActionPlan = [
  'Educate yourself on NIL rules and regulations',
  'Help your athlete identify their unique brand story',
  'Support content creation without taking over',
  'Network with local businesses for partnership opportunities',
  'Track NIL earnings and ensure proper tax reporting',
  'Celebrate small wins and maintain realistic expectations'
]

export default function NILReadinessPage() {
  return (
    <PageShell
      title="NIL Readiness Guide"
      description="Everything you need to know about Name, Image, and Likeness opportunities in girls basketball."
      badge="NIL Education"
    >
      {/* NIL Definition */}
      <section className="bg-gradient-to-r from-[#0134BD] to-[#121B47] text-white p-8 rounded-lg mb-12">
        <h2 className="text-3xl font-bold mb-4">What is NIL?</h2>
        <p className="text-xl mb-6 max-w-3xl">
          Name, Image, and Likeness (NIL) rights allow college athletes to profit from their personal brand through endorsements,
          sponsorships, and social media partnerships. This historic change in NCAA rules opened new opportunities for athletes
          to monetize their achievements and build their future careers.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Name</h3>
            <p>Your personal identity and reputation as an athlete</p>
          </div>
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Image</h3>
            <p>Your visual presence and brand representation</p>
          </div>
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Likeness</h3>
            <p>Your right to profit from your athletic achievements</p>
          </div>
        </div>
      </section>

      {/* Myth Busting */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center text-[#121B47] mb-8">NIL Myths vs Reality</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {myths.map((item, index) => (
            <div key={index} className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">Myth: {item.myth}</h3>
              <p className="text-gray-700"><strong>Reality:</strong> {item.truth}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Pillars */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center text-[#121B47] mb-8">4 Pillars of NIL Success</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {brandPillars.map((pillar, index) => (
            <div key={pillar.title} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="text-4xl mb-4">{pillar.icon}</div>
              <h3 className="text-xl font-semibold text-[#121B47] mb-3">{pillar.title}</h3>
              <p className="text-gray-600">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Media Expectations */}
      <section className="bg-gray-50 p-8 rounded-lg mb-12">
        <h2 className="text-3xl font-bold text-center text-[#121B47] mb-8">Social Media Expectations</h2>
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-600 mb-6 text-center">
            Building a strong social media presence is crucial for NIL success. Here's what sponsors expect:
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {socialExpectations.map((expectation, index) => (
              <div key={index} className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                <span className="text-[#0134BD] mr-3 mt-1">✓</span>
                <span className="text-gray-700">{expectation}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parent Action Plan */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center text-[#121B47] mb-8">Parent Action Plan</h2>
        <div className="bg-[#C8A24A] text-white p-8 rounded-lg">
          <p className="text-lg mb-6 text-center">
            Parents play a crucial role in supporting their athlete's NIL journey. Here's how to help:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {parentActionPlan.map((action, index) => (
              <div key={index} className="flex items-start">
                <span className="text-[#121B47] mr-3 mt-1 text-xl">•</span>
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#FB6C1D] to-[#C8A24A] text-white p-8 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your NIL Journey?</h2>
        <p className="text-xl mb-6 max-w-2xl mx-auto">
          Get personalized NIL guidance, brand building tools, and access to sponsorship opportunities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="bg-white text-[#0134BD] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Create NIL Profile
          </Link>
          <Link
            to="/services"
            className="bg-[#121B47] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0a1529] transition-colors"
          >
            Get NIL Coaching
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
