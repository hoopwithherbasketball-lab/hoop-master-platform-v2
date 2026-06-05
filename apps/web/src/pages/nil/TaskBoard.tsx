import { useState } from 'react'
import { useNILTasks, type NILTask, type TaskStep } from '@hoop-master/features/nil'
import { supabase } from '../../lib/supabase'
import { Plus, CreditCard as Edit3, Trash2, X, Clock, TriangleAlert as AlertTriangle, Check, SquareCheck as CheckSquare, Square, ChevronDown, ChevronUp } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'

const PRIORITIES = ['low', 'medium', 'high', 'urgent']
const STATUSES = ['todo', 'in_progress', 'completed']

function newStep(): TaskStep {
  return { id: crypto.randomUUID(), label: '', done: false }
}

function mapRow(t: any): NILTask {
  return {
    id: t.id, title: t.title, target: t.target, priority: t.priority, status: t.status,
    due: t.due_date ? new Date(t.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
    steps: Array.isArray(t.steps) ? t.steps : [],
    notes: t.notes ?? null,
  }
}

export default function TaskBoard() {
  const { tasks, setTasks, loading } = useNILTasks()
  const [modal, setModal] = useState<{ type: 'create' | 'edit'; task?: NILTask } | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // form state
  const [title, setTitle] = useState('')
  const [target, setTarget] = useState('')
  const [priority, setPriority] = useState('medium')
  const [status, setStatus] = useState('todo')
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [steps, setSteps] = useState<TaskStep[]>([])

  const columns = [
    { label: 'To Do', status: 'todo' as const },
    { label: 'In Progress', status: 'in_progress' as const },
    { label: 'Completed', status: 'completed' as const },
  ]

  const openCreate = () => {
    setTitle(''); setTarget(''); setPriority('medium'); setStatus('todo'); setDueDate(''); setNotes(''); setSteps([])
    setModal({ type: 'create' })
  }

  const openEdit = (t: NILTask) => {
    setTitle(t.title); setTarget(t.target); setPriority(t.priority); setStatus(t.status)
    setDueDate(''); setNotes(t.notes ?? ''); setSteps(t.steps.length > 0 ? t.steps : [])
    setModal({ type: 'edit', task: t })
  }

  const addStep = () => setSteps(prev => [...prev, newStep()])
  const updateStep = (id: string, label: string) => setSteps(prev => prev.map(s => s.id === id ? { ...s, label } : s))
  const removeStep = (id: string) => setSteps(prev => prev.filter(s => s.id !== id))

  const handleSave = async () => {
    const cleanSteps = steps.filter(s => s.label.trim())
    const payload: any = { title, target, priority, status, steps: cleanSteps, notes: notes || null }
    if (dueDate) payload.due_date = dueDate
    if (modal?.type === 'create') {
      const { data, error } = await supabase.from('nil_tasks').insert(payload).select().single()
      if (!error && data) setTasks(prev => [mapRow(data), ...prev])
    } else if (modal?.type === 'edit' && modal.task) {
      const { data, error } = await supabase.from('nil_tasks').update(payload).eq('id', modal.task.id).select().single()
      if (!error && data) setTasks(prev => prev.map(t => t.id === modal.task!.id ? mapRow(data) : t))
    }
    setModal(null)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('nil_tasks').delete().eq('id', id)
    setTasks(prev => prev.filter(t => t.id !== id))
    setDeleteId(null)
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { data, error } = await supabase.from('nil_tasks').update({ status: newStatus }).eq('id', id).select().single()
    if (!error && data) setTasks(prev => prev.map(t => t.id === id ? mapRow(data) : t))
  }

  const toggleStep = async (taskId: string, stepId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return
    const updatedSteps = task.steps.map(s => s.id === stepId ? { ...s, done: !s.done } : s)
    const { data, error } = await supabase.from('nil_tasks').update({ steps: updatedSteps }).eq('id', taskId).select().single()
    if (!error && data) setTasks(prev => prev.map(t => t.id === taskId ? mapRow(data) : t))
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
                  {colTasks.map(task => {
                    const isExpanded = expandedId === task.id
                    const doneCount = task.steps.filter(s => s.done).length
                    const totalSteps = task.steps.length
                    return (
                      <div key={task.id} className="p-4 bg-navy-800 border border-white/10 rounded-lg shadow-sm hover:border-royal-200 transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-[10px] font-bold text-royal-600 uppercase bg-royal-50 px-1.5 py-0.5 rounded">{task.target}</span>
                          <div className="flex gap-1">
                            {task.priority === 'urgent' && <AlertTriangle size={12} className="text-rose-500" />}
                            <button onClick={() => openEdit(task)} className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded"><Edit3 size={12} /></button>
                            <button onClick={() => setDeleteId(task.id)} className="p-1 text-rose-400 hover:bg-rose-500/20 rounded"><Trash2 size={12} /></button>
                          </div>
                        </div>
                        <h3 className="text-sm font-bold text-white mb-2">{task.title}</h3>

                        {totalSteps > 0 && (
                          <div className="mb-3">
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : task.id)}
                              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                            >
                              {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                              <span>{doneCount}/{totalSteps} steps</span>
                              <div className="flex-1 ml-2 h-1 bg-white/10 rounded-full overflow-hidden w-16">
                                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: totalSteps > 0 ? `${(doneCount / totalSteps) * 100}%` : '0%' }} />
                              </div>
                            </button>
                            {isExpanded && (
                              <div className="mt-2 space-y-1.5 pl-1">
                                {task.steps.map(step => (
                                  <button
                                    key={step.id}
                                    onClick={() => toggleStep(task.id, step.id)}
                                    className="flex items-start gap-2 w-full text-left group"
                                  >
                                    {step.done
                                      ? <CheckSquare size={13} className="text-emerald-400 mt-0.5 shrink-0" />
                                      : <Square size={13} className="text-slate-500 mt-0.5 shrink-0 group-hover:text-slate-300" />}
                                    <span className={`text-xs leading-tight ${step.done ? 'line-through text-slate-500' : 'text-slate-300'}`}>{step.label}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {task.notes && !isExpanded && (
                          <p className="text-xs text-slate-500 mb-2 line-clamp-2">{task.notes}</p>
                        )}

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
                    )
                  })}
                  {colTasks.length === 0 && <p className="text-center text-slate-500 text-sm py-6">No tasks</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setModal(null)}>
          <div className="bg-navy-800 border border-white/10 rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
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
              <div className="grid grid-cols-2 gap-3">
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
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Due Date</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD]" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-400">Steps Required</label>
                  <button type="button" onClick={addStep} className="flex items-center gap-1 text-xs text-[#6b9df4] hover:text-white transition-colors">
                    <Plus size={12} /> Add Step
                  </button>
                </div>
                {steps.length === 0 && (
                  <p className="text-xs text-slate-500 py-2">No steps yet. Click "Add Step" to define required actions.</p>
                )}
                <div className="space-y-2">
                  {steps.map((step, i) => (
                    <div key={step.id} className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 w-4 shrink-0">{i + 1}.</span>
                      <input
                        value={step.label}
                        onChange={e => updateStep(step.id, e.target.value)}
                        placeholder="Describe this step..."
                        className="flex-1 p-2 border border-white/15 rounded-lg bg-white/5 text-white text-xs outline-none focus:border-[#0134BD]"
                      />
                      <button type="button" onClick={() => removeStep(step.id)} className="p-1 text-slate-500 hover:text-rose-400"><X size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white text-sm outline-none focus:border-[#0134BD] resize-none" placeholder="Additional context or follow-up notes..." />
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
