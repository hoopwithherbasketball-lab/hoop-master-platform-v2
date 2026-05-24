import { useParentApproval } from '@hoop-master/features/crm'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Shield, CheckCircle, Clock, Activity, UserCheck } from 'lucide-react'

export default function ParentCenterPage() {
  const { players, activity, approveConsent } = useParentApproval()

  return (
    <DashboardLayout variant="player" title="Parent Center" subtitle="Manage player profiles, consent, and account activity.">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-navy-800 rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Shield size={18} /> Connected Players</h2>
          <div className="space-y-4">
            {players.map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0134BD] rounded-full flex items-center justify-center text-white font-semibold text-sm">{p.name[0]}</div>
                  <div>
                    <p className="font-semibold text-white">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.position} • Class of {p.gradClass} • {p.school}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {p.consentStatus === 'approved' ? (
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium"><CheckCircle size={12} /> Approved</span>
                  ) : (
                    <>
                      <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium"><Clock size={12} /> Consent Needed</span>
                      <button onClick={() => approveConsent(p.id)} className="bg-[#0134BD] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002a80]">Approve</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-navy-800 rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Activity size={18} /> Recent Activity</h2>
          <div className="space-y-3">
            {activity.map(a => (
              <div key={a.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="w-8 h-8 bg-[#0134BD]/10 rounded-full flex items-center justify-center">
                  {a.type === 'consent' ? <UserCheck size={14} className="text-[#0134BD]" /> : <Activity size={14} className="text-[#0134BD]" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{a.description}</p>
                  <p className="text-xs text-gray-400">{a.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#121B47] to-[#0134BD] text-white p-6 rounded-xl text-center">
          <p className="text-lg font-semibold">Parent Dashboard</p>
          <p className="text-blue-200 text-sm mt-1">Monitor your athlete's progress, approve profile changes, and stay informed.</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
