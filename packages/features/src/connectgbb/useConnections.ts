import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'
import { useAuth } from '../crm/contexts/AuthContextValue.js'
import type { Connection } from './types'
import { useCommunityMembership } from './useCommunityMembership.js'

export function useConnections() {
  const { user } = useAuth()
  const { canAccessCommunity } = useCommunityMembership()
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) { setConnections([]); setLoading(false); return }
    if (!canAccessCommunity) { setConnections([]); setLoading(false); return }

    const abortController = new AbortController()

    const fetch = async () => {
      try {
        setLoading(true)
        setError(null)
        const { data } = await supabase
          .from('member_connections')
          .select('*')
          .or(`requester_id.eq.${user.id},target_id.eq.${user.id}`)
          .order('created_at', { ascending: false })

        if (abortController.signal.aborted) return

        const userIds = [...new Set((data ?? []).flatMap(r => [r.requester_id, r.target_id].filter(id => id !== user.id)))]
        const nameMap: Record<string, { display_name: string; role: string }> = {}
        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from('member_profiles')
            .select('user_id, display_name, role')
            .in('user_id', userIds)
          for (const p of profiles ?? []) nameMap[p.user_id] = { display_name: p.display_name, role: p.role }
        }

        if (abortController.signal.aborted) return

        const mapped: Connection[] = (data ?? []).map(r => {
          const otherId = r.requester_id === user.id ? r.target_id : r.requester_id
          const info = nameMap[otherId] || { display_name: 'Unknown', role: 'player' }
          return {
            id: r.id,
            userId: otherId,
            displayName: info.display_name,
            role: info.role,
            status: r.status as Connection['status'],
            connectedAt: r.created_at,
          }
        })
        setConnections(mapped)
      } catch (e) {
        if (!abortController.signal.aborted) {
          console.error('useConnections:', e)
          setError('Failed to load connections')
        }
      } finally {
        if (!abortController.signal.aborted) setLoading(false)
      }
    }
    fetch()

    return () => abortController.abort()
  }, [user, canAccessCommunity])

  return { connections, loading, error }
}
