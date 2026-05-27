import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@hoop-master/supabase'
import { useAuth } from '../contexts/AuthContextValue.js'

export interface ConnectedPlayer {
  id: string
  name: string
  position: string
  gradClass: string
  school: string
  consentStatus: 'pending' | 'approved' | 'changes_requested'
  consentDate: string | null
}

export interface ActivityEntry {
  id: string
  type: 'consent' | 'profile_update' | 'message' | 'evaluation'
  description: string
  date: string
  playerName: string
}

export function useParentApproval() {
  const { user } = useAuth()
  const [players, setPlayers] = useState<ConnectedPlayer[]>([])
  const [activity, setActivity] = useState<ActivityEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    const fetch = async () => {
      try {
        const { data } = await supabase
          .from('player_profiles')
          .select('id, first_name, last_name, position, class_year, school_name')
          .eq('user_id', user.id)

        const mapped: ConnectedPlayer[] = (data ?? []).map(p => ({
          id: p.id,
          name: `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim() || 'Unknown',
          position: p.position ?? '',
          gradClass: p.class_year ? String(p.class_year) : '',
          school: p.school_name ?? '',
          consentStatus: 'approved' as const,
          consentDate: null,
        }))
        setPlayers(mapped)
        setActivity(mapped.map(p => ({
          id: `${p.id}-connected`,
          type: 'consent' as const,
          description: `Connected to ${p.name}`,
          date: new Date().toISOString().slice(0, 10),
          playerName: p.name,
        })))
      } catch (e) { console.error('useParentApproval:', e) }
      setLoading(false)
    }
    fetch()
  }, [user])

  const approveConsent = useCallback((playerId: string) => {
    setPlayers(prev => prev.map(p =>
      p.id === playerId
        ? { ...p, consentStatus: 'approved' as const, consentDate: new Date().toISOString().slice(0, 10) }
        : p
    ))
  }, [])

  return { players, activity, approveConsent, loading }
}
