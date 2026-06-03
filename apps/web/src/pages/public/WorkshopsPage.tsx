import { Link } from 'react-router-dom'
import { PageShell, PageSection, CTABanner } from '@hoop-master/ui'
import { Monitor, Building2, Users } from 'lucide-react'

const workshops = [
  {
    title: 'Recruiting 101',
    description: 'Master the fundamentals of college recruiting. Learn what coaches look for, how to build relationships, and create a winning strategy.',
    duration: '2 hours',
    format: 'Interactive Workshop',
    topics: ['Coach Communication', 'Timeline Planning', 'Academic Requirements', 'Q&A Session']
  },
  {
    title: 'NIL Basics',
    description: 'Understand Name, Image, and Likeness opportunities. Learn how to build your personal brand and connect with sponsors.',
    duration: '1.5 hours',
    format: 'Educational Seminar',
    topics: ['NIL Rules & Regulations', 'Brand Building', 'Sponsorship Strategies', 'Success Stories']
  },
  {
    title: 'Film Breakdown',
    description: 'Get expert analysis of your game footage. Learn to identify strengths, improve weaknesses, and create compelling highlight reels.',
    duration: '3 hours',
    format: 'One-on-One Session',
    topics: ['Video Analysis', 'Skill Development', 'Highlight Reel Creation', 'Personal Feedback']
  },
  {
    title: 'Parent Guide',
    description: 'Navigate the recruiting process as a parent. Learn how to support your athlete without overstepping, and understand your role in their journey.',
    duration: '2 hours',
    format: 'Parent-Only Workshop',
    topics: ['Supporting Your Athlete', 'Communication Tips', 'Red Flags to Watch', 'Building the Team']
  }
]

export default function WorkshopsPage() {
  return (
    <PageShell
      title="Elite Workshops & Training"
      description="Interactive workshops designed to accelerate your recruiting and NIL success."
      badge="Workshops"
    >
      <PageSection title="Workshop Offerings">
        <div className="grid gap-8 md:grid-cols-2">
          {workshops.map((workshop) => (
            <article key={workshop.title} className="bg-navy-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-[#0134BD]">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-semibold text-white">{workshop.title}</h3>
                <span className="bg-[#FB6C1D] text-white px-3 py-1 rounded-full text-sm font-medium">
                  {workshop.duration}
                </span>
              </div>
              <p className="text-slate-400 mb-4">{workshop.description}</p>
              <div className="mb-4">
                <span className="font-semibold text-white">Format:</span> {workshop.format}
              </div>
              <div className="mb-6">
                <h4 className="font-semibold text-white mb-2">What You'll Learn:</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  {workshop.topics.map((topic, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="text-[#0134BD] mr-2">•</span>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to="/contact"
                data-testid={`workshops-${workshop.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-book-link`}
                className="block text-center w-full bg-[#0134BD] hover:bg-[#002a80] text-white py-2 px-4 rounded-md font-semibold transition-colors"
              >
                Book Workshop
              </Link>
            </article>
          ))}
        </div>
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
