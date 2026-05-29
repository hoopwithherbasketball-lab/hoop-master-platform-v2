import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'
import type { Database } from '@hoop-master/types'
import { useAuth } from '../crm/contexts/AuthContextValue.js'

type MediaChannel = Database['public']['Tables']['media_channels']['Row']
type MediaChannelInsert = Database['public']['Tables']['media_channels']['Insert']

export function useMediaChannels() {
  const { user } = useAuth()
  const [channels, setChannels] = useState<MediaChannel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const abortController = new AbortController()

    const fetchChannels = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from('media_channels')
          .select('*')
          .order('name', { ascending: true })

        if (abortController.signal.aborted) return
        if (fetchError) throw fetchError
        setChannels(data || [])
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Failed to load channels')
        }
      } finally {
        if (!abortController.signal.aborted) setLoading(false)
      }
    }

    fetchChannels()
    return () => abortController.abort()
  }, [])

  const createChannel = async (channel: MediaChannelInsert) => {
    const { data, error } = await supabase
      .from('media_channels')
      .insert({ ...channel, created_by: user?.id })
      .select()
      .single()

    if (error) throw error
    setChannels(prev => [...prev, data])
    return data
  }

  const updateChannel = async (id: string, updates: Partial<MediaChannelInsert>) => {
    const { data, error } = await supabase
      .from('media_channels')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setChannels(prev => prev.map(c => c.id === id ? data : c))
    return data
  }

  const deleteChannel = async (id: string) => {
    const { error } = await supabase.from('media_channels').delete().eq('id', id)
    if (error) throw error
    setChannels(prev => prev.filter(c => c.id !== id))
  }

  return { channels, loading, error, createChannel, updateChannel, deleteChannel }
}
