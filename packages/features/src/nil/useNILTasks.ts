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
  const [error, setError] = useState<Error | null>(null)

  const fetchTasks = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: supaError } = await supabase.from('nil_tasks').select('*').order('created_at', { ascending: false })
      if (supaError) throw new Error(supaError.message)
      setTasks((data ?? []).map(t => ({
        id: t.id,
        title: t.title,
        target: t.target || 'General',
        priority: t.priority || 'Medium',
        status: t.status,
        due: t.due_date ? new Date(t.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
        steps: Array.isArray(t.steps) ? t.steps : [],
        notes: t.notes ?? null,
      })))
    } catch (e: any) {
      console.error('useNILTasks:', e)
      setError(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const addTask = async (task: any) => {
    try {
      const { error: supaError } = await supabase.from('nil_tasks').insert([task])
      if (supaError) throw new Error(supaError.message)
      await fetchTasks()
      return { success: true }
    } catch (e: any) {
      console.error('Failed to add task:', e)
      return { success: false, error: e.message }
    }
  }

  const updateTask = async (id: string, updates: any) => {
    try {
      const { error: supaError } = await supabase.from('nil_tasks').update(updates).eq('id', id)
      if (supaError) throw new Error(supaError.message)
      await fetchTasks()
      return { success: true }
    } catch (e: any) {
      console.error('Failed to update task:', e)
      return { success: false, error: e.message }
    }
  }

  return { tasks, setTasks, loading, error, refetch: fetchTasks, addTask, updateTask }
}

