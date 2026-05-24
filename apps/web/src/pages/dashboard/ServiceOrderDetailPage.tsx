import { useParams } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'

export default function ServiceOrderDetailPage() {
  const { orderId } = useParams()

  return (
    <DashboardLayout variant="player" title="Order Detail" subtitle={`Review the details for ${orderId || 'this order'}.`}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Order {orderId}</h2>
          <p className="text-slate-500">This request includes recruiting strategy, video review, and follow-up planning.</p>
          <div className="space-y-3 text-sm text-slate-400">
            <div className="flex justify-between"><span>Status</span><span className="font-semibold text-white">Active</span></div>
            <div className="flex justify-between"><span>Submitted</span><span className="text-slate-400">May 2</span></div>
            <div className="flex justify-between"><span>Due</span><span className="text-slate-400">May 18</span></div>
          </div>
        </div>
        <div className="card p-6 space-y-4">
          <h3 className="text-base font-semibold text-white">Next step</h3>
          <p className="text-slate-500">Review the recommendations and schedule your follow-up call with the service team.</p>
          <button className="btn btn-primary">Message advisor</button>
        </div>
      </div>
    </DashboardLayout>
  )
}
