import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'
import { useAuth } from '../contexts/AuthContextValue.js'

export interface StatTrend {
  label: string
  season: string
  value: number
}

export interface PlayerAnalytics {
  stats: { ppg: number[]; apg: number[]; rpg: number[]; fgp: number[] }
  months: string[]
  trends: StatTrend[]
}

export function usePlayerAnalytics(playerId?: string) {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<PlayerAnalytics>({ stats: { ppg: [], apg: [], rpg: [], fgp: [] }, months: [], trends: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) { setLoading(false); return }

    const abortController = new AbortController()

    const fetch = async () => {
      try {
        setLoading(true)
        setError(null)

        let profileId: string | null = null
        if (playerId) {
          profileId = playerId
        } else {
          const { data: profile, error: profileErr } = await supabase
            .from('player_profiles')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle()
          if (profileErr) throw profileErr
          if (!profile) { setLoading(false); return }
          profileId = profile.id
        }

        if (abortController.signal.aborted) return

        const { data, error: statsErr } = await supabase
          .from('player_game_stats')
          .select('*')
          .eq('player_profile_id', profileId)
          .order('created_at', { ascending: true })

        if (statsErr) throw statsErr
        if (abortController.signal.aborted) return

        if (data && data.length > 0) {
          setAnalytics({
            stats: {
              ppg: data.map(r => r.ppg ?? 0),
              apg: data.map(r => r.apg ?? 0),
              rpg: data.map(r => r.rpg ?? 0),
              fgp: data.map(r => r.fg_pct ?? 0),
            },
            months: data.map(r => r.month_label || ''),
            trends: data.map(r => ({ label: 'Scoring', season: r.season, value: r.ppg ?? 0 })),
          })
        } else {
          setAnalytics({ stats: { ppg: [], apg: [], rpg: [], fgp: [] }, months: [], trends: [] })
        }
      } catch (e) {
        if (!abortController.signal.aborted) {
          console.error('usePlayerAnalytics:', e)
          setError('Failed to load analytics')
        }
      } finally {
        if (!abortController.signal.aborted) setLoading(false)
      }
    }
    fetch()

    return () => abortController.abort()
  }, [user, playerId])

  return { analytics, loading, error }
}
