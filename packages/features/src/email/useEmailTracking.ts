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
        const opened = data.filter((t: any) => t.opened).length
        const clicked = data.filter((t: any) => t.clicked).length
        const total = data.length

        const statuses = data.reduce((acc: any, t: any) => {
          acc[t.delivery_status] = (acc[t.delivery_status] || 0) + 1
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
    } catch (e: any) {
      console.error('useEmailTracking:', e)
      setError(e)
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
  const [preferences, setPreferences] = useState<any>(null)
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

  const updatePreferences = async (updates: any) => {
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
    } catch (e: any) {
      return { success: false, error: e.message }
    }
  }

  return { preferences, loading, updatePreferences }
}

