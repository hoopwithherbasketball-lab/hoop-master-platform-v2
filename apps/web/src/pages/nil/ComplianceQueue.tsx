import { useNILCompliance } from '@hoop-master/features/nil'
import { CheckCircle2, XCircle } from 'lucide-react'
import { StatusBadge } from '@hoop-master/ui'
import DashboardLayout from '../../components/layout/DashboardLayout'

export default function ComplianceQueue() {
  const { items, loading } = useNILCompliance()

  return (
    <DashboardLayout variant="admin" title="Compliance & Review" subtitle="Review athlete disclosures and sponsorship contracts.">
      {loading ? (
        <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="card h-14" />)}</div>
      ) : (
        <div className="bg-navy-800 border border-white/10 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-white/5 border-b border-white/10 text-xs font-bold text-slate-500 uppercase tracking-wider"><th className="px-4 py-3">Athlete</th><th className="px-4 py-3">Opportunity</th><th className="px-4 py-3">Items</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-white/10">
              {items.map((item, i) => (
                <tr key={item.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 font-bold text-white text-sm">{item.athlete}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{item.opportunity}</td>
                  <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{item.items.map(p => (<span key={p} className="text-[10px] font-bold bg-white/10 text-slate-400 px-1.5 py-0.5 rounded uppercase">{p}</span>))}</div></td>
                  <td className="px-4 py-3"><StatusBadge status={item.status as 'pending'|'error'}/></td>
                  <td className="px-4 py-3 text-right"><div className="flex justify-end gap-2"><button className="p-1.5 text-emerald-400 hover:bg-emerald-500/20 rounded"><CheckCircle2 size={16}/></button><button className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded"><XCircle size={16}/></button></div></td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-400">No compliance items.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}
