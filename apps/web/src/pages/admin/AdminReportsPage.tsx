import DashboardLayout from '../../components/layout/DashboardLayout'
import { BarChart3 } from 'lucide-react'

export default function AdminReportsPage() {
  return (
    <DashboardLayout variant="admin" title="Reports" subtitle="Admin analytics and reporting">
      <div className="max-w-4xl mx-auto text-center py-20">
        <BarChart3 size={48} className="mx-auto mb-4 text-slate-500" />
        <h2 className="text-xl font-bold text-white mb-2">Reports Coming Soon</h2>
        <p className="text-slate-400">Detailed analytics and exportable reports are being built.</p>
      </div>
    </DashboardLayout>
  )
}
