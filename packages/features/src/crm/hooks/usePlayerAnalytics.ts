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

export function usePlayerAnalytics(_playerId?: string) {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<PlayerAnalytics>({ stats: { ppg: [], apg: [], rpg: [], fgp: [] }, months: [], trends: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }

    supabase.from('player_profiles').select('id').eq('user_id', user.id).maybeSingle().then(({ data: profile }) => {
      if (!profile) { setLoading(false); return }
      supabase.from('player_game_stats').select('*').eq('player_profile_id', profile.id).order('created_at', { ascending: true }).then(({ data }) => {
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
        }
        setLoading(false)
      })
    })
  }, [user])

  return { analytics, loading }
}
