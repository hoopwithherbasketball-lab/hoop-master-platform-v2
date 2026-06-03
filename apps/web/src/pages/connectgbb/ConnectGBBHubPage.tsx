import { Link } from 'react-router-dom'
import { PageShell } from '@hoop-master/ui'
import { useCommunityMembership } from '@hoop-master/features/connectgbb'
import { Crown, ShieldCheck, Lock } from 'lucide-react'

const sections = [
  { title: 'Community Feed', desc: 'Network with vetted members, share progress, and follow recruiting discussions.', path: '/connectgbb/feed', icon: 'C', color: 'border-l-[#0134BD]' },
  { title: 'Training Hub', desc: 'Access premium tracks, curated lesson plans, and role-specific development content.', path: '/connectgbb/training', icon: 'T', color: 'border-l-[#FB6C1D]' },
  { title: 'My Connections', desc: 'Build a trusted network with players, coaches, families, and approved programs.', path: '/connectgbb/connections', icon: 'N', color: 'border-l-[#C8A24A]' },
  { title: 'Messages', desc: 'Secure direct messaging across your approved community network.', path: '/connectgbb/messages', icon: 'M', color: 'border-l-[#22c55e]' },
]

export default function ConnectGBBHubPage() {
  const { membership, canAccessCommunity, loading } = useCommunityMembership()

  return (
    <PageShell title="ConnectGBB" description="The membership platform for elite girls basketball development." badge="Community">
      {loading ? (
        <section className="bg-navy-800 border border-white/10 rounded-xl p-6 mb-8" data-testid="connectgbb-membership-loading-card">
          <p className="text-slate-400">Checking membership access…</p>
        </section>
      ) : (
        <>
          <section className="bg-navy-800 border border-white/10 rounded-xl p-6 mb-8" data-testid="connectgbb-membership-summary-card">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400 mb-1">Membership Status</p>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#0134BD]" />
                <p className="text-white font-semibold capitalize" data-testid="connectgbb-membership-status-text">
                  {membership?.status || 'pending'}
                </p>
                <span className="text-xs uppercase tracking-wide bg-[#0134BD]/20 text-[#0134BD] px-2 py-1 rounded-full" data-testid="connectgbb-membership-tier-pill">
                  {membership?.tier || 'starter'}
                </span>
              </div>
              {!canAccessCommunity && (
                <p className="text-amber-300 text-sm mt-2" data-testid="connectgbb-membership-pending-note">
                  Access is pending approval. Your request has been captured for admin review.
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Crown size={16} className="text-[#C8A24A]" />
              Premium community includes verified members, moderation, and audit-backed governance.
            </div>
          </div>
          </section>

          {!canAccessCommunity ? (
            <section className="bg-gradient-to-r from-[#121B47] to-[#0134BD] text-white p-8 rounded-xl text-center" data-testid="connectgbb-members-only-locked-state">
              <Lock size={34} className="mx-auto mb-3" />
              <h2 className="text-2xl font-bold mb-3">Members-Only Community</h2>
              <p className="text-slate-200 max-w-2xl mx-auto mb-5">
                ConnectGBB is now premium-access. Your account is in the approval pipeline and will unlock automatically once activated.
              </p>
              <Link
                to="/connectgbb/settings"
                data-testid="connectgbb-locked-complete-profile-link"
                className="inline-block bg-[#FB6C1D] hover:bg-[#e55a1a] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Complete Profile for Priority Review
              </Link>
            </section>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-3">
                {sections.map(s => (
                  <Link key={s.path} to={s.path} className={`bg-navy-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all border-l-4 ${s.color} group`} data-testid={`connectgbb-hub-link-${s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                    <div className="w-10 h-10 rounded-full bg-[#0134BD]/20 border border-white/10 text-white font-semibold flex items-center justify-center mb-3">{s.icon}</div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#0134BD] transition-colors">{s.title}</h3>
                    <p className="text-slate-400 text-sm">{s.desc}</p>
                  </Link>
                ))}
              </div>
              <section className="bg-gradient-to-r from-[#121B47] to-[#0134BD] text-white p-8 rounded-lg text-center">
                <h2 className="text-2xl font-bold mb-3">Build Your Premium Network</h2>
                <p className="text-lg mb-6 max-w-2xl mx-auto">ConnectGBB pairs elite training pathways, recruiting visibility, and trusted member messaging for players, families, and coaches.</p>
                <Link to="/connectgbb/training" className="bg-[#FB6C1D] hover:bg-[#e55a1a] text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block" data-testid="connectgbb-start-training-link">
                  Start Training
                </Link>
              </section>
            </>
          )}
        </>
      )}
    </PageShell>
  )
}
