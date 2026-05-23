import { useAdminLeads } from '@hoop-master/features/crm'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Search, Mail, TrendingUp } from 'lucide-react'

export default function AdminLeadsPage() {
  const { leads, allLeads, statusFilter, setStatusFilter, searchQuery, setSearchQuery, statuses } = useAdminLeads()

  return (
    <DashboardLayout variant="admin" title="Leads" subtitle="Manage incoming athlete and partner inquiries.">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-white border border-gray-200 rounded-lg px-3 py-2">
            <Search size={16} className="text-gray-400" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search leads..." className="flex-1 outline-none text-sm bg-transparent" />
          </div>
          <div className="flex gap-1 bg-white rounded-lg border border-gray-200 p-1">
            <button onClick={() => setStatusFilter('')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${!statusFilter ? 'bg-[#121B47] text-white' : 'text-gray-500 hover:text-gray-700'}`}>All ({allLeads.length})</button>
            {statuses.map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${statusFilter === s ? 'bg-[#121B47] text-white' : 'text-gray-500 hover:text-gray-700'}`}>{s} ({allLeads.filter(l => l.status === s).length})</button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {leads.map(l => (
            <div key={l.id} className="bg-white rounded-xl shadow-sm p-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-[#0134BD] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{l.name[0]}</div>
                <div className="min-w-0">
                  <p className="font-semibold text-[#121B47]">{l.name}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1"><Mail size={10} /> {l.email}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{l.interest} • Source: {l.source} • {l.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${l.status === 'new' ? 'bg-blue-100 text-blue-700' : l.status === 'contacted' ? 'bg-amber-100 text-amber-700' : l.status === 'qualified' ? 'bg-purple-100 text-purple-700' : l.status === 'converted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{l.status}</span>
              </div>
            </div>
          ))}
          {leads.length === 0 && <p className="text-center text-gray-400 py-12">No leads match your filters.</p>}
        </div>
      </div>
    </DashboardLayout>
  )
}
