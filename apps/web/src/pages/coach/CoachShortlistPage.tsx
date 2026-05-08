import DashboardLayout from '../../components/layout/DashboardLayout'

const shortlist = [
  { name: 'Ava Grant', position: 'SG', grade: '2026', status: 'Contacted' },
  { name: 'Jordan Lee', position: 'C', grade: '2026', status: 'Evaluation' },
  { name: 'Maya Thompson', position: 'SF', grade: '2027', status: 'Saved' },
]

export default function CoachShortlistPage() {
  return (
    <DashboardLayout variant="coach" title="Coach Shortlist" subtitle="Your curated roster of high-priority prospects." >
      <div className="card overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-slate-500 uppercase text-xs">Athlete</th>
              <th className="px-4 py-3 text-slate-500 uppercase text-xs">Position</th>
              <th className="px-4 py-3 text-slate-500 uppercase text-xs">Class</th>
              <th className="px-4 py-3 text-slate-500 uppercase text-xs">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {shortlist.map((player) => (
              <tr key={player.name} className="hover:bg-slate-50">
                <td className="px-4 py-4 font-medium text-slate-900">{player.name}</td>
                <td className="px-4 py-4 text-slate-600">{player.position}</td>
                <td className="px-4 py-4 text-slate-600">{player.grade}</td>
                <td className="px-4 py-4 text-slate-600">{player.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}
