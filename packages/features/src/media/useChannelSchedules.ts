import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'
import type { Database } from '@hoop-master/types'

type ChannelSchedule = Database['public']['Tables']['channel_schedules']['Row']
type ChannelScheduleInsert = Database['public']['Tables']['channel_schedules']['Insert']

export function useChannelSchedules(channelId: string) {
  const [schedules, setSchedules] = useState<ChannelSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!channelId) { setSchedules([]); setLoading(false); return }

    const abortController = new AbortController()

    const fetchSchedules = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from('channel_schedules')
          .select('*, media_assets!inner(title, duration_seconds, thumbnail_url)')
          .eq('channel_id', channelId)
          .order('scheduled_start', { ascending: true })

        if (abortController.signal.aborted) return
        if (fetchError) throw fetchError
        setSchedules(data || [])
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Failed to load schedules')
        }
      } finally {
        if (!abortController.signal.aborted) setLoading(false)
      }
    }

    fetchSchedules()
    return () => abortController.abort()
  }, [channelId])

  const createSchedule = async (schedule: ChannelScheduleInsert) => {
    const { data, error } = await supabase
      .from('channel_schedules')
      .insert(schedule)
      .select()
      .single()

    if (error) throw error
    setSchedules(prev => [...prev, data].sort((a, b) =>
      new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime()
    ))
    return data
  }

  const updateSchedule = async (id: string, updates: Partial<ChannelScheduleInsert>) => {
    const { data, error } = await supabase
      .from('channel_schedules')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setSchedules(prev => prev.map(s => s.id === id ? data : s))
    return data
  }

  const deleteSchedule = async (id: string) => {
    const { error } = await supabase.from('channel_schedules').delete().eq('id', id)
    if (error) throw error
    setSchedules(prev => prev.filter(s => s.id !== id))
  }

  return { schedules, loading, error, createSchedule, updateSchedule, deleteSchedule }
}
