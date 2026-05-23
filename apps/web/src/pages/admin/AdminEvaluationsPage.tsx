import { Link } from 'react-router-dom'
import { useAdminEvaluations } from '@hoop-master/features/crm'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { FileText, Eye, Edit3, CheckCircle, Clock, Archive } from 'lucide-react'

const statusConfig = {
  published: { icon: CheckCircle, label: 'Published', class: 'bg-green-100 text-green-700' },
  draft: { icon: Clock, label: 'Draft', class: 'bg-yellow-100 text-yellow-700' },
  archived: { icon: Archive, label: 'Archived', class: 'bg-gray-100 text-gray-500' },
}

export default function AdminEvaluationsPage() {
  const { evaluations } = useAdminEvaluations()

  return (
    <DashboardLayout variant="admin" title="Player Evaluations" subtitle="Manage scouting evaluations across all prospects.">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Player</th>
                <th className="px-5 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-5 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-5 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-5 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Evaluator</th>
                <th className="px-5 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {evaluations.map(e => {
                const sc = statusConfig[e.status]
                const Icon = sc.icon
                return (
                  <tr key={e.playerId} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-medium text-slate-900">{e.playerName}</td>
                    <td className="px-5 py-4 text-slate-600">{e.position}</td>
                    <td className="px-5 py-4 text-slate-600">{e.gradClass}</td>
                    <td className="px-5 py-4">
                      <span className={`font-bold ${e.overall >= 90 ? 'text-green-600' : e.overall >= 80 ? 'text-blue-600' : 'text-amber-600'}`}>{e.overall}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{e.evaluator}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${sc.class}`}>
                        <Icon size={12} /> {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/coach/evaluation/${e.playerId}`} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100"><Eye size={14} className="text-gray-500" /></Link>
                        <button className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-amber-100"><Edit3 size={14} className="text-gray-500" /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
          <FileText size={14} /> {evaluations.length} evaluations • {evaluations.filter(e => e.status === 'published').length} published
        </div>
      </div>
    </DashboardLayout>
  )
}
