import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'
import type { EmailTracking } from '@hoop-master/types'

export interface EmailTrackingStats {
  total: number
  opened: number
  clicked: number
  openRate: number
  clickRate: number
  deliveryStatus: Record<string, number>
}

export function useEmailTracking(outreachId?: string) {
  const [tracking, setTracking] = useState<EmailTracking[]>([])
  const [stats, setStats] = useState<EmailTrackingStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchTracking = async () => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase.from('email_tracking').select('*')

      if (outreachId) {
        query = query.eq('outreach_id', outreachId)
      }

      const { data, error: supaError } = await query.order('created_at', { ascending: false })

      if (supaError) throw new Error(supaError.message)

      setTracking((data ?? []) as EmailTracking[])

      // Calculate stats
      if (data && data.length > 0) {
        const opened = data.filter((t: Record<string, unknown>) => t.opened).length
        const clicked = data.filter((t: Record<string, unknown>) => t.clicked).length
        const total = data.length

        const statuses = data.reduce((acc: Record<string, number>, t: Record<string, unknown>) => {
          const status = String(t.delivery_status)
          acc[status] = (acc[status] || 0) + 1
          return acc
        }, {})

        setStats({
          total,
          opened,
          clicked,
          openRate: total > 0 ? (opened / total) * 100 : 0,
          clickRate: total > 0 ? (clicked / total) * 100 : 0,
          deliveryStatus: statuses,
        })
      }
    } catch (e: unknown) {
      console.error('useEmailTracking:', e)
      setError(e instanceof Error ? e : new Error(String(e)))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTracking()
  }, [outreachId])

  return { tracking, stats, loading, error, refetch: fetchTracking }
}

export function useEmailPreferences() {
  const [preferences, setPreferences] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('email_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setPreferences(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPreferences()
  }, [])

  const updatePreferences = async (updates: Record<string, unknown>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('email_preferences')
        .update(updates)
        .eq('user_id', user.id)

      if (error) throw error
      await fetchPreferences()
      return { success: true }
    } catch (e: unknown) {
      return { success: false, error: e instanceof Error ? e.message : String(e) }
    }
  }

  return { preferences, loading, updatePreferences }
}

