import { useState } from 'react'
import { useNILTasks } from '@hoop-master/features/nil'
import { supabase } from '../../lib/supabase'
import { Plus, Edit3, Trash2, X, Clock, AlertTriangle, Check } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'

const PRIORITIES = ['low', 'medium', 'high', 'urgent']
const STATUSES = ['todo', 'in_progress', 'completed']

export default function TaskBoard() {
  const { tasks, loading } = useNILTasks()
  const [modal, setModal] = useState<{ type: 'create' | 'edit'; task?: any } | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [target, setTarget] = useState('')
  const [priority, setPriority] = useState('medium')
  const [status, setStatus] = useState('todo')
  const [due_date, setDueDate] = useState('')

  const columns = [
    { label: 'To Do', status: 'todo' as const },
    { label: 'In Progress', status: 'in_progress' as const },
    { label: 'Completed', status: 'completed' as const },
  ]

  const openCreate = () => { setTitle(''); setTarget(''); setPriority('medium'); setStatus('todo'); setDueDate(''); setModal({ type: 'create' }) }
  const openEdit = (t: any) => { setTitle(t.title); setTarget(t.target); setPriority(t.priority); setStatus(t.status); setDueDate(''); setModal({ type: 'edit', task: t }) }

  const handleSave = async () => {
    const payload: any = { title, target, priority, status }
    if (due_date) payload.due_date = due_date
    if (modal?.type === 'create') {
      await supabase.from('nil_tasks').insert(payload)
    } else if (modal?.type === 'edit' && modal.task) {
      await supabase.from('nil_tasks').update(payload).eq('id', modal.task.id)
    }
    setModal(null)
    window.location.reload()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('nil_tasks').delete().eq('id', id)
    setDeleteId(null)
    window.location.reload()
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    await supabase.from('nil_tasks').update({ status: newStatus }).eq('id', id)
    window.location.reload()
  }

  return (
    <DashboardLayout variant="admin" title="Tasks & Follow-ups" subtitle="Action items for NIL and outreach operations." action={<button onClick={openCreate} className="flex items-center gap-1.5 bg-[#0134BD] text-white px-3 py-1.5 rounded-lg text-sm font-semibold"><Plus size={16} /> New Task</button>}>
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
                        <div className="flex gap-1">
                          {task.priority === 'urgent' && <AlertTriangle size={12} className="text-rose-500" />}
                          <button onClick={() => openEdit(task)} className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded"><Edit3 size={12} /></button>
                          <button onClick={() => setDeleteId(task.id)} className="p-1 text-rose-400 hover:bg-rose-500/20 rounded"><Trash2 size={12} /></button>
                        </div>
                      </div>
                      <h3 className="text-sm font-bold text-white mb-3">{task.title}</h3>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400 uppercase">
                          <Clock size={10} />{task.due || 'No due date'}
                        </div>
                        <div className="flex gap-1">
                          {col.status !== 'todo' && (
                            <button onClick={() => handleStatusChange(task.id, 'todo')} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 hover:bg-white/10">Todo</button>
                          )}
                          {col.status !== 'in_progress' && (
                            <button onClick={() => handleStatusChange(task.id, 'in_progress')} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 hover:bg-white/10">In Prog</button>
                          )}
                          {col.status !== 'completed' && (
                            <button onClick={() => handleStatusChange(task.id, 'completed')} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-emerald-400 hover:bg-white/10"><Check size={10} /></button>
                          )}
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

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setModal(null)}>
          <div className="bg-navy-800 border border-white/10 rounded-xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">{modal.type === 'create' ? 'New Task' : 'Edit Task'}</h2>
              <button onClick={() => setModal(null)} className="p-1 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Target</label>
                <input value={target} onChange={e => setTarget(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Priority</label>
                <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-navy-800 text-white outline-none focus:border-[#0134BD]">
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-navy-800 text-white outline-none focus:border-[#0134BD]">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Due Date</label>
                <input type="date" value={due_date} onChange={e => setDueDate(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD]" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold bg-[#0134BD] text-white rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setDeleteId(null)}>
          <div className="bg-navy-800 border border-white/10 rounded-xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-2">Delete Task</h2>
            <p className="text-sm text-slate-400 mb-5">Are you sure you want to delete this task? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
