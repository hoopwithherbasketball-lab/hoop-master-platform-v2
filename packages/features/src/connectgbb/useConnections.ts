import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'
import { useAuth } from '../crm/contexts/AuthContextValue.js'
import type { Connection } from './types'

export function useConnections() {
  const { user } = useAuth()
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    const fetch = async () => {
      try {
        const { data } = await supabase
          .from('member_connections')
          .select('*')
          .or(`requester_id.eq.${user.id},target_id.eq.${user.id}`)
          .order('created_at', { ascending: false })

        const userIds = [...new Set((data ?? []).flatMap(r => [r.requester_id, r.target_id].filter(id => id !== user.id)))]
        const nameMap: Record<string, string> = {}
        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from('member_profiles')
            .select('user_id, display_name')
            .in('user_id', userIds)
          for (const p of profiles ?? []) nameMap[p.user_id] = p.display_name
        }

        const mapped: Connection[] = (data ?? []).map(r => {
          const otherId = r.requester_id === user.id ? r.target_id : r.requester_id
          return {
            id: r.id,
            userId: otherId,
            displayName: nameMap[otherId] || 'Unknown',
            role: 'player',
            status: r.status as Connection['status'],
            connectedAt: r.created_at,
          }
        })
        setConnections(mapped)
      } catch (e) { console.error('useConnections:', e) }
      setLoading(false)
    }
    fetch()
  }, [user])

  return { connections, loading }
}
