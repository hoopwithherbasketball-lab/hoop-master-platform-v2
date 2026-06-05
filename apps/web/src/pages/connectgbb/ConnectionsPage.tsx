import { useConnections } from '@hoop-master/features/connectgbb'
import { PageShell } from '@hoop-master/ui'
import { useCommunityMembership } from '@hoop-master/features/connectgbb'

const statusLabels: Record<string, string> = { approved: 'Connected', pending: 'Pending' }
const statusColors: Record<string, string> = { approved: 'bg-green-500/20 text-green-400', pending: 'bg-yellow-100 text-yellow-700' }

export default function ConnectionsPage() {
  const { connections, loading, error } = useConnections()
  const { canAccessCommunity } = useCommunityMembership()

  if (!canAccessCommunity) {
    return (
      <PageShell title="My Connections" description="Connections are available for active premium community members." badge="EliteGBB">
        <div className="max-w-2xl mx-auto bg-navy-800 border border-white/10 rounded-xl p-8 text-center" data-testid="connections-locked-state">
          <h2 className="text-2xl font-semibold text-white mb-3">Connections Locked</h2>
          <p className="text-slate-400">Your profile is pending activation. Once approved, your network will appear here.</p>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell title="My Connections" description="Manage your network of coaches, players, and programs." badge="EliteGBB">
      {error && <p className="text-red-300 mb-4" data-testid="connections-error-text">{error}</p>}
      {loading ? (
        <div className="animate-pulse space-y-4">{[1, 2, 3].map(i => <div key={i} className="bg-navy-800 p-6 rounded-lg shadow-md h-20" />)}</div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-3">
          {connections.map(c => (
            <div key={c.id} className="bg-navy-800 p-4 rounded-lg shadow-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0134BD] rounded-full flex items-center justify-center text-white font-semibold">
                  {c.displayName[0]}
                </div>
                <div>
                  <p className="font-semibold text-white">{c.displayName}</p>
                  <p className="text-xs text-slate-400 capitalize">{c.role}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[c.status] || ''}`}>
                {statusLabels[c.status] || c.status}
              </span>
            </div>
          ))}
          {connections.length === 0 && <p className="text-center text-slate-400 py-12">No connections yet.</p>}
        </div>
      )}
    </PageShell>
  )
}
