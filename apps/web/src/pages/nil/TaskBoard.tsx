import { useNILTasks } from '@hoop-master/features/nil'
import { Plus, Clock, AlertTriangle } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'

export default function TaskBoard() {
  const { tasks, loading } = useNILTasks()

  const columns = [
    { label: 'To Do', status: 'todo' as const },
    { label: 'In Progress', status: 'in_progress' as const },
    { label: 'Completed', status: 'completed' as const },
  ]

  return (
    <DashboardLayout variant="admin" title="Tasks & Follow-ups" subtitle="Action items for NIL and outreach operations.">
      {loading ? (
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="space-y-3">{[1,2].map(j => <div key={j} className="card h-28" />)}</div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(col => {
            const colTasks = tasks.filter(t => t.status === col.status)
            return (
              <div key={col.label} className="space-y-4">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2 border-l-2 border-royal-400">{col.label} ({colTasks.length})</h2>
                <div className="space-y-3">
                  {colTasks.map(task => (
                    <div key={task.id} className="p-4 bg-navy-800 border border-white/10 rounded-lg shadow-sm hover:border-royal-200 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-[10px] font-bold text-royal-600 uppercase bg-royal-50 px-1.5 py-0.5 rounded">{task.target}</span>
                        {task.priority === 'urgent' && <AlertTriangle size={12} className="text-rose-500"/>}
                      </div>
                      <h3 className="text-sm font-bold text-white mb-3">{task.title}</h3>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400 uppercase">
                          <Clock size={10}/>{task.due || 'No due date'}
                        </div>
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && <p className="text-center text-slate-500 text-sm py-6">No tasks</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}
