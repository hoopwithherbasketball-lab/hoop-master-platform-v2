import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { BarChart3, Users, FileText, Shield } from 'lucide-react'

const TABS = [
  { id: 'stats', label: 'Stats & Analytics', icon: BarChart3 },
  { id: 'connections', label: 'Connections', icon: Users },
  { id: 'deliverables', label: 'Deliverables', icon: FileText },
  { id: 'security', label: 'Security', icon: Shield },
]

const statBlocks = [
  { label: 'Games', value: '24' },
  { label: 'PPG', value: '18.4' },
  { label: 'APG', value: '5.2' },
  { label: 'RPG', value: '7.8' },
  { label: 'SPG', value: '2.1' },
  { label: 'BPG', value: '1.3' },
  { label: 'FG%', value: '47.2' },
  { label: '3PT%', value: '34.5' },
  { label: 'FT%', value: '81.0' },
]

export default function PlayerPortalPage() {
  const [activeTab, setActiveTab] = useState('stats')

  return (
    <DashboardLayout variant="player" title="Player Portal" subtitle="Your central hub for stats, network, and recruiting materials.">
      <div className="flex gap-1 bg-navy-900 rounded-xl p-1 overflow-x-auto mb-8">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-white text-navy-900 shadow-sm' : 'text-white/70 hover:text-white'}`}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'stats' && (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {statBlocks.map(s => (
            <div key={s.label} className="card p-4 text-center">
              <p className="text-2xl font-bold text-navy-900">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'connections' && (
        <div className="space-y-3">
          <p className="text-sm text-slate-500 mb-4">Your network of coaches, scouts, and programs.</p>
          {[
            { name: 'Coach Williams', role: 'College Scout', org: 'Duke University', status: 'Connected' },
            { name: 'Taylor Reed', role: 'Recruiting Coordinator', org: 'Stanford', status: 'Pending' },
            { name: 'Jordan Blake', role: 'Head Coach', org: 'UConn', status: 'Connected' },
          ].map(c => (
            <div key={c.name} className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0134BD] rounded-full flex items-center justify-center text-white font-semibold text-sm">{c.name[0]}</div>
                <div><p className="font-semibold text-navy-900">{c.name}</p><p className="text-xs text-slate-500">{c.role} • {c.org}</p></div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${c.status === 'Connected' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{c.status}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'deliverables' && (
        <div className="space-y-3">
          <p className="text-sm text-slate-500 mb-4">Your recruiting deliverables and evaluations.</p>
          {[
            { name: 'Recruiting One-Pager', status: 'Ready', date: 'Apr 2026', icon: '📄' },
            { name: 'Player Evaluation Report', status: 'Pending', date: 'In progress', icon: '📋' },
            { name: 'Highlight Reel', status: 'Ready', date: 'Mar 2026', icon: '🎬' },
            { name: 'Season Analytics Packet', status: 'Ready', date: 'Feb 2026', icon: '📊' },
          ].map(d => (
            <div key={d.name} className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{d.icon}</span>
                <div><p className="font-semibold text-navy-900">{d.name}</p><p className="text-xs text-slate-500">{d.date}</p></div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${d.status === 'Ready' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{d.status}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'security' && (
        <div className="card p-6 max-w-xl space-y-4">
          <p className="text-sm text-slate-500">Manage your account security and privacy settings.</p>
          <div className="space-y-2">
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-navy-900">Two-Factor Authentication</span>
              <input type="checkbox" className="w-5 h-5 text-[#0134BD] border-gray-300 rounded" />
            </label>
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-navy-900">Profile Visibility (Coaches)</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-[#0134BD] border-gray-300 rounded" />
            </label>
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-navy-900">Show Stats Publicly</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-[#0134BD] border-gray-300 rounded" />
            </label>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
