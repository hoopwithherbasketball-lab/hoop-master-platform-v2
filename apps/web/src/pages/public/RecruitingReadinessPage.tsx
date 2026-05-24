import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../../components/ui/PageShell'

const evaluationFactors = [
  {
    title: 'Academic Performance',
    description: 'GPA, test scores, and course rigor that colleges prioritize.',
    importance: 'High'
  },
  {
    title: 'Athletic Statistics',
    description: 'Points per game, rebounds, assists, and measurable improvements.',
    importance: 'High'
  },
  {
    title: 'Competition Level',
    description: 'Quality of opponents faced and performance in high-stakes games.',
    importance: 'High'
  },
  {
    title: 'Coach Relationships',
    description: 'Connections with college coaches and recruiting contacts.',
    importance: 'Medium'
  },
  {
    title: 'Highlight Video Quality',
    description: 'Professional editing, clear gameplay, and compelling presentation.',
    importance: 'Medium'
  },
  {
    title: 'Character & Leadership',
    description: 'Team captain status, community involvement, and personal qualities.',
    importance: 'Medium'
  }
]

const checklistItems = [
  'Complete academic profile with GPA and test scores',
  'Have a professional highlight reel under 3 minutes',
  'Participate in varsity sports with measurable stats',
  'Attend recruiting camps or showcases',
  'Build relationships with college coaches',
  'Maintain social media presence for recruiting',
  'Research target schools and NCAA requirements'
]

const timeline = [
  {
    grade: 'Freshman',
    focus: 'Build foundation skills and establish academic habits',
    actions: ['Join varsity team', 'Focus on fundamentals', 'Maintain strong GPA']
  },
  {
    grade: 'Sophomore',
    focus: 'Increase visibility and start building relationships',
    actions: ['Attend camps', 'Create basic highlight reel', 'Research colleges']
  },
  {
    grade: 'Junior',
    focus: 'Peak performance and active recruiting',
    actions: ['Maximize stats', 'Contact coaches', 'Take official visits']
  },
  {
    grade: 'Senior',
    focus: 'Finalize decisions and secure offers',
    actions: ['Narrow choices', 'Compare offers', 'Make commitment']
  }
]

export default function RecruitingReadinessPage() {
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(checklistItems.length).fill(false))

  const handleCheckChange = (index: number) => {
    setCheckedItems(prev => prev.map((checked, i) => i === index ? !checked : checked))
  }

  const completedCount = checkedItems.filter(Boolean).length

  return (
    <PageShell
      title="Recruiting Readiness Assessment"
      description="Evaluate your college basketball recruiting potential and create a personalized development plan."
      badge="Recruiting Tools"
    >
      {/* Evaluation Factors */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center text-white mb-8">What Coaches Evaluate</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {evaluationFactors.map((factor, index) => (
            <div key={factor.title} className="bg-navy-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">{factor.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  factor.importance === 'High' ? 'bg-red-500/20 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {factor.importance} Priority
                </span>
              </div>
              <p className="text-slate-400">{factor.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Checklist */}
      <section className="bg-white/5 p-8 rounded-lg mb-12">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Recruiting Readiness Checklist</h2>
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-white">Progress</span>
              <span className="text-lg font-bold text-[#0134BD]">{completedCount}/{checklistItems.length} Complete</span>
            </div>
            <div className="w-full bg-white/15 rounded-full h-3">
              <div
                className="bg-[#0134BD] h-3 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / checklistItems.length) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="space-y-3">
            {checklistItems.map((item, index) => (
              <label key={index} className="flex items-center p-3 bg-navy-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkedItems[index]}
                  onChange={() => handleCheckChange(index)}
                  className="mr-3 w-5 h-5 text-[#0134BD] focus:ring-[#0134BD] border-white/20 rounded"
                />
                <span className={`text-gray-300 ${checkedItems[index] ? 'line-through text-slate-400' : ''}`}>
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* Grade-by-Grade Timeline */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Grade-by-Grade Timeline</h2>
        <div className="space-y-6">
          {timeline.map((stage, index) => (
            <div key={stage.grade} className="flex items-start">
              <div className="flex-shrink-0 w-24 text-center">
                <div className="w-12 h-12 bg-[#0134BD] rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                  {stage.grade[0]}
                </div>
                <div className="text-sm font-semibold text-white">{stage.grade}</div>
              </div>
              <div className="flex-grow bg-navy-800 p-6 rounded-lg shadow-md ml-6">
                <h3 className="text-xl font-semibold text-white mb-2">{stage.focus}</h3>
                <ul className="text-slate-400 space-y-1">
                  {stage.actions.map((action, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="text-[#FB6C1D] mr-2">•</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#0134BD] to-[#121B47] text-white p-8 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Accelerate Your Recruiting?</h2>
        <p className="text-xl mb-6 max-w-2xl mx-auto">
          Get personalized recruiting guidance and tools to maximize your college opportunities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="bg-[#FB6C1D] hover:bg-[#e55a1a] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Create Your Profile
          </Link>
          <Link
            to="/services"
            className="bg-navy-800 text-[#0134BD] px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
          >
            Get Expert Help
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
