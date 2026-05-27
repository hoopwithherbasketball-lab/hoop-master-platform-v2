import { useNILOutreach } from '@hoop-master/features/nil'
import DashboardLayout from '../../components/layout/DashboardLayout'

export default function OutreachInbox() {
  const { messages, loading } = useNILOutreach()

  return (
    <DashboardLayout variant="admin" title="Outreach Inbox" subtitle="Review incoming partner messages and follow up tasks." >
      {loading ? (
        <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="card h-16" />)}</div>
      ) : (
        <div className="space-y-4">
          {messages.map(m => (
            <div key={m.id} className="card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">{m.from}</p>
                <p className="text-sm text-slate-500">{m.subject}</p>
              </div>
              <div className="text-sm text-slate-500">{m.received}</div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase text-slate-400">{m.status}</span>
            </div>
          ))}
          {messages.length === 0 && <p className="text-center text-slate-400 py-12">No outreach messages yet.</p>}
        </div>
      )}
    </DashboardLayout>
  )
}
