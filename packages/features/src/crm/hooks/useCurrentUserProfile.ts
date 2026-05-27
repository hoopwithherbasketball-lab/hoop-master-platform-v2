import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'
import type { Database } from '@hoop-master/types'
import { useAuth } from '../contexts/AuthContextValue.js'

type PlayerProfile = Database['public']['Tables']['player_profiles']['Row']
type PlayerProfileUpdate = Database['public']['Tables']['player_profiles']['Update']

export const useCurrentUserProfile = () => {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<PlayerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    const abortController = new AbortController()

    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from('player_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (abortController.signal.aborted) return
        if (fetchError && fetchError.code !== 'PGRST116') throw fetchError
        setProfile(data ?? null)
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Unable to load profile')
        }
      } finally {
        if (!abortController.signal.aborted) setLoading(false)
      }
    }

    fetchProfile()

    const channel = supabase
      .channel('current_user_profile')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'player_profiles',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setProfile(payload.new as PlayerProfile)
          } else if (payload.eventType === 'DELETE') {
            setProfile(null)
          }
        }
      )
      .subscribe()

    return () => {
      abortController.abort()
      supabase.removeChannel(channel)
    }
  }, [user])

  const updateProfile = async (updates: Partial<PlayerProfileUpdate>) => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const { data, error: upsertError } = await supabase
        .from('player_profiles')
        .upsert({
          user_id: user.id,
          ...updates,
        })
        .select()
        .single()

      if (upsertError) throw upsertError
      setProfile(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to update profile'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { profile, loading: authLoading || loading, error, updateProfile }
}
