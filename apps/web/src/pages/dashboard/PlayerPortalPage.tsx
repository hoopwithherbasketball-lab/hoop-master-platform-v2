import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { BarChart3, Users, FileText, Shield, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const TABS = [
  { id: 'stats', label: 'Stats & Analytics', icon: BarChart3 },
  { id: 'connections', label: 'Connections', icon: Users },
  { id: 'deliverables', label: 'Deliverables', icon: FileText },
  { id: 'security', label: 'Security', icon: Shield },
]

export default function PlayerPortalPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('stats')
  const [profile, setProfile] = useState<{ id: string; first_name: string; last_name: string; position: string; class_year: number; school_name: string } | null>(null)
  const [stats, setStats] = useState<{ ppg: number; apg: number; rpg: number; spg: number; bpg: number; fg_pct: number } | null>(null)
  const [orders, setOrders] = useState<{ id: string; status: string; due_at: string | null }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const { data: p } = await supabase.from('player_profiles').select('id, first_name, last_name, position, class_year, school_name').eq('user_id', user.id).maybeSingle()
      setProfile(p)
      if (p) {
        const { data: gs } = await supabase.from('player_game_stats').select('ppg, apg, rpg, spg, bpg, fg_pct').eq('player_profile_id', p.id).order('created_at', { ascending: false }).limit(1).maybeSingle()
        setStats(gs)
      }
      const { data: o } = await supabase.from('service_orders').select('id, status, due_at').eq('customer_user_id', user.id).order('created_at', { ascending: false })
      setOrders(o ?? [])
      setLoading(false)
    }
    load()
  }, [user])

  if (loading) return <DashboardLayout variant="player" title="Player Portal" subtitle="Loading..."><div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-slate-400" /></div></DashboardLayout>

  const name = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Your Player'
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()

  return (
    <DashboardLayout variant="player" title="Player Portal" subtitle="Your central hub for stats, network, and recruiting materials.">
      <div className="mb-6 card p-5 flex items-center gap-4">
        <div className="w-14 h-14 bg-[#0134BD] rounded-full flex items-center justify-center text-xl font-bold text-white">{initials}</div>
        <div><h2 className="text-xl font-bold text-white">{name}</h2><p className="text-slate-400 text-sm">{profile?.position || 'Position'} • Class of {profile?.class_year || '—'} • {profile?.school_name || 'School'}</p></div>
      </div>

      <div className="flex gap-1 bg-navy-900 rounded-xl p-1 overflow-x-auto mb-8">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-navy-800 text-white shadow-sm' : 'text-white/70 hover:text-white'}`}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'stats' && (
        stats ? (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            <StatBlock label="PPG" value={stats.ppg} />
            <StatBlock label="APG" value={stats.apg} />
            <StatBlock label="RPG" value={stats.rpg} />
            <StatBlock label="SPG" value={stats.spg} />
            <StatBlock label="BPG" value={stats.bpg} />
            <StatBlock label="FG%" value={stats.fg_pct} />
          </div>
        ) : (
          <div className="card p-8 text-center text-slate-400">
            <BarChart3 size={32} className="mx-auto mb-3 text-slate-500" />
            <p>No stats yet. Game data will appear here once uploaded.</p>
            <Link to="/dashboard/analytics" className="inline-block mt-2 text-royal-400 hover:underline text-sm">View Analytics</Link>
          </div>
        )
      )}

      {activeTab === 'connections' && (
        <div className="card p-8 text-center text-slate-400">
          <Users size={32} className="mx-auto mb-3 text-slate-500" />
          <p>Your coach network will appear here as coaches view your profile.</p>
        </div>
      )}

      {activeTab === 'deliverables' && (
        <div className="space-y-3">
          {orders.length > 0 ? orders.map(o => (
            <div key={o.id} className="card p-4 flex items-center justify-between">
              <div><p className="font-semibold text-white">Order {o.id.slice(0, 8)}</p><p className="text-xs text-slate-500">Status: {o.status.replace(/_/g, ' ')}</p></div>
              <Link to={`/dashboard/services/${o.id}`} className="text-royal-400 hover:underline text-sm">View</Link>
            </div>
          )) : (
            <div className="card p-8 text-center text-slate-400">
              <FileText size={32} className="mx-auto mb-3 text-slate-500" />
              <p>No deliverables yet.</p>
              <Link to="/elitegbb" className="inline-block mt-2 text-royal-400 hover:underline text-sm">Get started</Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'security' && (
        <div className="card p-6 max-w-xl space-y-4">
          <p className="text-sm text-slate-500">Manage your account security and privacy settings.</p>
          <div className="space-y-2">
            <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-sm font-medium text-white">Profile Visibility (Coaches)</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#0134BD] rounded" />
            </label>
            <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-sm font-medium text-white">Show Stats Publicly</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#0134BD] rounded" />
            </label>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

function StatBlock({ label, value }: { label: string; value: number }) {
  return <div className="card p-4 text-center"><p className="text-2xl font-bold text-white">{value}</p><p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{label}</p></div>
}
