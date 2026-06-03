import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageShell, PageSection, CTABanner, ReadinessGauge, ScoreBar, StatusBadge } from '@hoop-master/ui'

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
  const readinessPercent = Math.round((completedCount / checklistItems.length) * 100)

  return (
    <PageShell
      title="Recruiting Readiness Assessment"
      description="Evaluate your college basketball recruiting potential and create a personalized development plan."
      badge="Recruiting Tools"
    >
      <PageSection title="Current Readiness Snapshot">
        <div className="bg-navy-800 border border-white/10 rounded-lg p-6">
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center lg:justify-between">
            <div className="w-full lg:max-w-xl space-y-3">
              <h3 className="text-xl font-semibold text-white">Checklist Completion</h3>
              <p className="text-slate-400">Track how prepared you are before coach outreach begins.</p>
              <ScoreBar
                label="Readiness Progress"
                score={completedCount}
                maxScore={checklistItems.length}
                color="bg-[#0134BD]"
              />
            </div>
            <div className="self-center lg:self-auto">
              <ReadinessGauge percentage={readinessPercent} label="Recruiting readiness" />
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection title="What Coaches Evaluate">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {evaluationFactors.map((factor) => (
            <div key={factor.title} className="bg-navy-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">{factor.title}</h3>
                <StatusBadge
                  status={factor.importance === 'High' ? 'active' : 'pending'}
                  label={`${factor.importance} Priority`}
                />
              </div>
              <p className="text-slate-400">{factor.description}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection className="bg-white/5 p-8 rounded-lg" title="Recruiting Readiness Checklist">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-white">Progress</span>
              <span className="text-lg font-bold text-[#0134BD]">{completedCount}/{checklistItems.length} Complete</span>
            </div>
            <ScoreBar score={completedCount} maxScore={checklistItems.length} color="bg-[#0134BD]" />
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
      </PageSection>

      <PageSection title="Grade-by-Grade Timeline">
        <div className="space-y-6">
          {timeline.map((stage) => (
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
      </PageSection>

      <CTABanner
        title="Ready to Accelerate Your Recruiting?"
        description="Get personalized recruiting guidance and tools to maximize your college opportunities."
        gradient="from-[#0134BD] to-[#121B47]"
        actions={[
          { label: 'Create Your Profile', href: '/signup', testId: 'recruiting-create-profile-link' },
          { label: 'Get Expert Help', href: '/services', variant: 'secondary', testId: 'recruiting-get-expert-help-link' },
        ]}
        LinkComponent={Link}
      />
    </PageShell>
  )
}
