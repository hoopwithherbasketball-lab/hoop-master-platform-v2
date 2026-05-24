import DashboardLayout from '../../components/layout/DashboardLayout'

const messages = [
  { from: 'Gatorade', subject: 'Partnership interest', received: '2h ago', status: 'Open' },
  { from: 'Nike', subject: 'Sponsorship package review', received: '1d ago', status: 'Pending' },
  { from: 'Hoops Nutrition', subject: 'Contract terms', received: '3d ago', status: 'Replied' },
]

export default function OutreachInbox() {
  return (
    <DashboardLayout variant="admin" title="Outreach Inbox" subtitle="Review incoming partner messages and follow up tasks." >
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={`${message.from}-${message.subject}`} className="card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">{message.from}</p>
              <p className="text-sm text-slate-500">{message.subject}</p>
            </div>
            <div className="text-sm text-slate-500">{message.received}</div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase text-slate-400">{message.status}</span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
