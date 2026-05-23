import { Link } from 'react-router-dom'
import { WorkshopCard, IconTarget, IconMoney, IconChart } from '@hoop-master/ui'
import PageShell from '../../components/ui/PageShell'

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
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center text-[#121B47] mb-8">Workshop Offerings</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {workshops.map((workshop) => (
            <WorkshopCard
              key={workshop.title}
              title={workshop.title}
              description={workshop.description}
              duration={workshop.duration}
              format={workshop.format}
              topics={workshop.topics}
            />
          ))}
        </div>
      </section>

      <section className="bg-gray-50 p-8 rounded-lg mb-12">
        <h2 className="text-3xl font-bold text-center text-[#121B47] mb-8">Workshop Formats</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#0134BD] rounded-full flex items-center justify-center mx-auto mb-4">
              <IconTarget size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#121B47] mb-2">Virtual Workshops</h3>
            <p className="text-gray-600">Interactive online sessions with live Q&A, accessible from anywhere.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#FB6C1D] rounded-full flex items-center justify-center mx-auto mb-4">
              <IconMoney size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#121B47] mb-2">In-Person Clinics</h3>
            <p className="text-gray-600">Hands-on training at elite facilities with direct coaching feedback.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#C8A24A] rounded-full flex items-center justify-center mx-auto mb-4">
              <IconChart size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#121B47] mb-2">Group Sessions</h3>
            <p className="text-gray-600">Collaborative learning with peers, building community and support networks.</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#121B47] to-[#0134BD] text-white p-8 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Bring Elite Training to Your Team</h2>
        <p className="text-xl mb-6 max-w-2xl mx-auto">
          Custom workshops and training sessions for clubs, AAU teams, and high school programs.
          Develop your entire roster with professional recruiting and NIL education.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/contact"
            className="bg-[#FB6C1D] hover:bg-[#e55a1a] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Book Team Workshop
          </Link>
          <Link
            to="/services"
            className="bg-white text-[#0134BD] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            View All Services
          </Link>
        </div>
        <p className="text-sm mt-4 text-gray-300">
          Group discounts available &bull; Custom curriculum options &bull; On-site training available
        </p>
      </section>
    </PageShell>
  )
}
