import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface OpportunitySummary {
  id: string
  athlete_name?: string
  brand?: string
  title?: string
  status: string
  value_cents: number
}
interface TaskSummary {
  id: string
  title: string
  due_date: string | null
  status: string
}
interface OverviewData {
  brands: number
  athletes: number
  activeDeals: number
  openTasks: number
  opportunities: OpportunitySummary[]
  tasks: TaskSummary[]
}

export default function useNILOverview() {
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const request = useRef(0)
  const refresh = useCallback(async () => {
    const current = ++request.current
    setLoading(true)
    setError(null)
    try {
      const results = await Promise.all([
        supabase
          .from('nil_companies')
          .select('id', { count: 'exact', head: true }),
        supabase
          .from('nil_athlete_profiles')
          .select('id', { count: 'exact', head: true })
          .eq('opted_in', true),
        supabase
          .from('nil_opportunities')
          .select('id', { count: 'exact', head: true })
          .in('status', ['active', 'accepted']),
        supabase
          .from('nil_tasks')
          .select('id', { count: 'exact', head: true })
          .in('status', ['todo', 'open', 'in_progress']),
        supabase
          .from('nil_opportunities')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('nil_tasks')
          .select('id,title,due_date,status')
          .in('status', ['todo', 'open', 'in_progress'])
          .order('due_date', { ascending: true, nullsFirst: false })
          .limit(4),
      ])
      if (current !== request.current) return
      if (results.some((result) => result.error))
        throw new Error(
          'Some NIL records could not be loaded. Please try again.'
        )
      const [brands, athletes, deals, tasks, recent, upcoming] = results
      setData({
        brands: brands.count ?? 0,
        athletes: athletes.count ?? 0,
        activeDeals: deals.count ?? 0,
        openTasks: tasks.count ?? 0,
        opportunities: recent.data ?? [],
        tasks: upcoming.data ?? [],
      })
    } catch (e) {
      if (current === request.current)
        setError(
          e instanceof Error ? e.message : 'Unable to load the NIL overview.'
        )
    } finally {
      if (current === request.current) setLoading(false)
    }
  }, [])
  useEffect(() => {
    void refresh()
    return () => {
      request.current++
    }
  }, [refresh])
  return { data, loading, error, refresh }
}
