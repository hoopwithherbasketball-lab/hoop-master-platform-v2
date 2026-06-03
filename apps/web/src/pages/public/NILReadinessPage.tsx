import { PageShell, PageSection, CTABanner, StatusBadge, StatsGrid } from '@hoop-master/ui'
import { Link } from 'react-router-dom'
import { Theater, CalendarClock, MessageCircle, Briefcase } from 'lucide-react'

const partners = [
  { name: 'PerformBetter', category: 'Training', status: 'active' as const },
  { name: 'Baller Brand', category: 'Apparel', status: 'pending' as const },
  { name: 'Hoops Nutrition', category: 'Supplement', status: 'completed' as const },
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
    icon: Theater,
  },
  {
    title: 'Consistency',
    description: 'Post regularly and maintain a cohesive brand voice across all platforms.',
    icon: CalendarClock,
  },
  {
    title: 'Engagement',
    description: 'Interact with your audience. Respond to comments and build a community.',
    icon: MessageCircle,
  },
  {
    title: 'Professionalism',
    description: 'Present yourself as a serious athlete with clear goals and work ethic.',
    icon: Briefcase,
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
      <StatsGrid
        columns={3}
        stats={[
          { value: '3', label: 'Partner Tracks', color: 'text-[#FB6C1D]' },
          { value: '4', label: 'Brand Pillars', color: 'text-[#C8A24A]' },
          { value: '6', label: 'Parent Action Steps', color: 'text-[#0134BD]' },
        ]}
      />

      <PageSection className="bg-gradient-to-r from-[#0134BD] to-[#121B47] text-white p-8 rounded-lg" title="What is NIL?">
        <h2 className="text-3xl font-bold mb-4">What is NIL?</h2>
        <p className="text-xl mb-6 max-w-3xl">
          Name, Image, and Likeness (NIL) rights allow college athletes to profit from their personal brand through endorsements,
          sponsorships, and social media partnerships. This historic change in NCAA rules opened new opportunities for athletes
          to monetize their achievements and build their future careers.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-navy-800 bg-opacity-10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Name</h3>
            <p>Your personal identity and reputation as an athlete</p>
          </div>
          <div className="bg-navy-800 bg-opacity-10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Image</h3>
            <p>Your visual presence and brand representation</p>
          </div>
          <div className="bg-navy-800 bg-opacity-10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Likeness</h3>
            <p>Your right to profit from your athletic achievements</p>
          </div>
        </div>
      </PageSection>

      <PageSection title="Active Partner Opportunities">
        <div className="grid gap-4 md:grid-cols-3">
          {partners.map((partner) => (
            <article key={partner.name} className="bg-navy-800 rounded-lg border border-white/10 p-5 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-white">{partner.name}</h3>
                <StatusBadge status={partner.status} />
              </div>
              <p className="text-sm text-slate-400">Category: {partner.category}</p>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection title="NIL Myths vs Reality">
        <div className="grid gap-6 md:grid-cols-2">
          {myths.map((item, index) => (
            <div key={index} className="bg-red-500/10 border-l-4 border-red-400 p-6 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">Myth: {item.myth}</h3>
              <p className="text-gray-300"><strong>Reality:</strong> {item.truth}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection title="4 Pillars of NIL Success">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {brandPillars.map((pillar) => {
            const Icon = pillar.icon
            return (
            <div key={pillar.title} className="bg-navy-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 bg-[#0134BD] rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{pillar.title}</h3>
              <p className="text-slate-400">{pillar.description}</p>
            </div>
          )})}
        </div>
      </PageSection>

      <PageSection className="bg-white/5 p-8 rounded-lg" title="Social Media Expectations">
        <div className="max-w-2xl mx-auto">
          <p className="text-slate-400 mb-6 text-center">
            Building a strong social media presence is crucial for NIL success. Here's what sponsors expect:
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {socialExpectations.map((expectation, index) => (
              <div key={index} className="flex items-start bg-navy-800 p-4 rounded-lg shadow-sm">
                <span className="text-[#0134BD] mr-3 mt-1">✓</span>
                <span className="text-gray-300">{expectation}</span>
              </div>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection title="Parent Action Plan">
        <div className="bg-[#C8A24A] text-white p-8 rounded-lg">
          <p className="text-lg mb-6 text-center">
            Parents play a crucial role in supporting their athlete's NIL journey. Here's how to help:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {parentActionPlan.map((action, index) => (
              <div key={index} className="flex items-start">
                <span className="text-white mr-3 mt-1 text-xl">•</span>
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>
      </PageSection>

      <CTABanner
        title="Ready to Start Your NIL Journey?"
        description="Get personalized NIL guidance, brand building tools, and access to sponsorship opportunities."
        gradient="from-[#FB6C1D] to-[#C8A24A]"
        actions={[
          { label: 'Create NIL Profile', href: '/signup', variant: 'secondary', testId: 'nil-readiness-create-profile-link' },
          { label: 'Get NIL Coaching', href: '/services', testId: 'nil-readiness-get-coaching-link' },
        ]}
        LinkComponent={Link}
      />
    </PageShell>
  )
}
