import { Link } from 'react-router-dom'
import { PageShell } from '@hoop-master/ui'

const sections = [
  { title: 'Community Feed', desc: 'Connect with players, coaches, and programs. Share updates and celebrate milestones.', path: '/connectgbb/feed', icon: '💬', color: 'border-l-[#0134BD]' },
  { title: 'Training Hub', desc: 'Skill tracks, video lessons, and drill libraries for every level.', path: '/connectgbb/training', icon: '🏋️', color: 'border-l-[#FB6C1D]' },
  { title: 'My Connections', desc: 'Manage your network of coaches, players, and programs.', path: '/connectgbb/connections', icon: '🤝', color: 'border-l-[#C8A24A]' },
  { title: 'Messages', desc: 'In-app messaging with coaches, scouts, and programs.', path: '/connectgbb/messages', icon: '✉️', color: 'border-l-[#22c55e]' },
]

export default function ConnectGBBHubPage() {
  return (
    <PageShell title="ConnectGBB" description="The membership platform for elite girls basketball development." badge="Community">
      <div className="grid gap-6 md:grid-cols-3">
        {sections.map(s => (
          <Link key={s.path} to={s.path} className={`bg-navy-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all border-l-4 ${s.color} group`}>
            <div className="text-3xl mb-3">{s.icon}</div>
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#0134BD] transition-colors">{s.title}</h3>
            <p className="text-slate-400 text-sm">{s.desc}</p>
          </Link>
        ))}
      </div>
      <section className="bg-gradient-to-r from-[#121B47] to-[#0134BD] text-white p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-3">Build Your Network</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">ConnectGBB pairs training, recruiting visibility, and trusted community messaging for players, parents, and coaches.</p>
        <Link to="/connectgbb/training" className="bg-[#FB6C1D] hover:bg-[#e55a1a] text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block">
          Start Training
        </Link>
      </section>
    </PageShell>
  )
}
