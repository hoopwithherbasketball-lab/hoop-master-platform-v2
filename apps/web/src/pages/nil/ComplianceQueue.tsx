import React from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { StatusBadge } from '@hoop-master/ui'

export default function ComplianceQueue() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <header><h1 className="text-2xl font-bold text-white">Compliance & Review</h1><p className="text-slate-500 text-sm">Review athlete disclosures and sponsorship contracts.</p></header>
      <div className="bg-navy-800 border border-white/10 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead><tr className="bg-white/5 border-b border-white/10 text-xs font-bold text-slate-500 uppercase tracking-wider"><th className="px-4 py-3">Athlete</th><th className="px-4 py-3">Opportunity</th><th className="px-4 py-3">Items</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-white/10">
            {[{athlete:'Sarah Jenkins',opp:'Nike Summer Series',items:['Disclosure','Contract'],status:'pending'},{athlete:'Maya Thompson',opp:'Red Bull Promo',items:['Institutional Policy'],status:'pending'},{athlete:'Jordan Lee',opp:'Local Cafe Deal',items:['Tax Notice'],status:'error'}].map((item,i)=>(
              <tr key={i} className="hover:bg-white/5"><td className="px-4 py-3 font-bold text-white text-sm">{item.athlete}</td><td className="px-4 py-3 text-sm text-slate-400">{item.opp}</td><td className="px-4 py-3"><div className="flex flex-wrap gap-1">{item.items.map(p=>(<span key={p} className="text-[10px] font-bold bg-white/10 text-slate-400 px-1.5 py-0.5 rounded uppercase">{p}</span>))}</div></td><td className="px-4 py-3"><StatusBadge status={item.status as 'pending'|'error'}/></td><td className="px-4 py-3 text-right"><div className="flex justify-end gap-2"><button className="p-1.5 text-emerald-400 hover:bg-emerald-500/20 rounded"><CheckCircle2 size={16}/></button><button className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded"><XCircle size={16}/></button></div></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
