import { useNILAthletes } from '@hoop-master/features/nil'
import DashboardLayout from '../../components/layout/DashboardLayout'

export default function AthleteNILProfileList() {
  const { athletes, loading } = useNILAthletes()

  return (
    <DashboardLayout variant="admin" title="Athlete NIL Profiles" subtitle="Athletes opted into NIL matchmaking.">
      {loading ? (
        <div className="animate-pulse grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="card h-48" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {athletes.map(a => (
            <div key={a.id} className="bg-navy-800 border border-white/10 rounded-lg p-5 hover:border-royal-300 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-navy-900 flex items-center justify-center text-white font-bold text-sm">{a.name[0]}</div>
                <div><p className="font-bold text-white text-sm">{a.name}</p><p className="text-[11px] text-slate-400">{a.position} | Class of {a.classYear}</p></div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div className="bg-white/5 rounded p-1.5"><p className="text-[10px] text-slate-400">Followers</p><p className="text-xs font-bold text-white">{a.followers}</p></div>
                <div className="bg-white/5 rounded p-1.5"><p className="text-[10px] text-slate-400">Readiness</p><p className="text-xs font-bold text-white">{a.readiness}%</p></div>
                <div className="bg-white/5 rounded p-1.5"><p className="text-[10px] text-slate-400">Tier</p><p className="text-xs font-bold text-white">{a.tier}</p></div>
              </div>
              <button className="w-full text-xs font-bold text-royal-600 bg-royal-50 py-1.5 rounded hover:bg-royal-100 transition-colors">View Full Profile</button>
            </div>
          ))}
          {athletes.length === 0 && <p className="col-span-3 text-center text-slate-400 py-12">No athletes opted into NIL yet.</p>}
        </div>
      )}
    </DashboardLayout>
  )
}
