import { useState, useEffect } from 'react'
import type { Connection } from './types'

const MOCK_CONNECTIONS: Connection[] = [
  { id: '1', userId: 'u1', displayName: 'Coach Williams', role: 'coach', status: 'approved', connectedAt: '2026-05-15T10:00:00Z' },
  { id: '2', userId: 'u2', displayName: 'Sarah Johnson', role: 'player', status: 'approved', connectedAt: '2026-05-10T14:30:00Z' },
  { id: '3', userId: 'u3', displayName: 'Michigan State University', role: 'coach', status: 'pending', connectedAt: '2026-05-20T08:00:00Z' },
  { id: '4', userId: 'u4', displayName: 'Elite GBB Club', role: 'club_admin', status: 'approved', connectedAt: '2026-05-01T12:00:00Z' },
]

export function useConnections() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setConnections(MOCK_CONNECTIONS)
    setLoading(false)
  }, [])

  return { connections, loading }
}
