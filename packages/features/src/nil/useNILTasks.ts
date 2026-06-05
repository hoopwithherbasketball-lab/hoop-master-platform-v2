import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'

export interface TaskStep {
  id: string
  label: string
  done: boolean
}

export interface NILTask {
  id: string
  title: string
  target: string
  priority: string
  status: string
  due: string
  steps: TaskStep[]
  notes: string | null
}

export function useNILTasks() {
  const [tasks, setTasks] = useState<NILTask[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await supabase.from('nil_tasks').select('*').order('created_at', { ascending: false })
        setTasks((data ?? []).map(t => ({
          id: t.id,
          title: t.title,
          target: t.target,
          priority: t.priority,
          status: t.status,
          due: t.due_date ? new Date(t.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
          steps: Array.isArray(t.steps) ? t.steps : [],
          notes: t.notes ?? null,
        })))
      } catch (e) { console.error('useNILTasks:', e) }
      setLoading(false)
    }
    fetch()
  }, [])

  return { tasks, setTasks, loading }
}

