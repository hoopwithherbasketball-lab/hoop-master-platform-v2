import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@hoop-master/supabase'
import { useAuth } from '../crm/contexts/AuthContextValue.js'
import type { CommunityMembership } from './types'

let rpcUnavailable = false

const mapMembership = (row: {
  id: string
  user_id: string
  status: 'pending' | 'active' | 'suspended'
  tier: 'starter' | 'pro' | 'elite'
  approved_at: string | null
  expires_at: string | null
}): CommunityMembership => {
  const expiresAt = row.expires_at
  const validExpiry = !expiresAt || new Date(expiresAt).getTime() > Date.now()
  return {
    id: row.id,
    userId: row.user_id,
    status: row.status,
    tier: row.tier,
    approvedAt: row.approved_at,
    expiresAt: row.expires_at,
    isActive: row.status === 'active' && validExpiry,
  }
}

export function useCommunityMembership() {
  const { user, roles } = useAuth()
  const [membership, setMembership] = useState<CommunityMembership | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const ensureMembership = useCallback(async () => {
    if (!user) return
    try {
      setError(null)

      const { data: existingMembership, error: existingError } = await supabase
        .from('community_memberships')
        .select('id, user_id, status, tier, approved_at, expires_at')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!existingError && existingMembership?.id && existingMembership?.user_id) {
        setMembership(mapMembership(existingMembership))
        return
      }

      if (!rpcUnavailable) {
        const { data: ensured, error: ensureError } = await supabase
          .rpc('ensure_community_membership')
          .single()

        if (ensureError && ensureError.code === 'PGRST202') {
          rpcUnavailable = true
        }

        if (ensureError && ensureError.code !== 'PGRST202') {
          throw ensureError
        }

        const ensuredRecord = ensured as {
        id: string
        user_id: string
        status: 'pending' | 'active' | 'suspended'
        tier: 'starter' | 'pro' | 'elite'
        approved_at: string | null
        expires_at: string | null
        } | null

        if (ensuredRecord?.id && ensuredRecord?.user_id) {
          setMembership(mapMembership(ensuredRecord))
          return
        }
      }

      const { data: roleRows } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .limit(5)

      const fallbackRoles = roleRows?.map((r) => r.role) || roles
      const fallbackActive = fallbackRoles.includes('admin') || fallbackRoles.includes('coach') || fallbackRoles.includes('club_admin') || fallbackRoles.includes('service_specialist')
      setMembership({
        id: `legacy-${user.id}`,
        userId: user.id,
        status: fallbackActive ? 'active' : 'pending',
        tier: fallbackActive ? 'pro' : 'starter',
        approvedAt: null,
        expiresAt: null,
        isActive: fallbackActive,
      })
    } catch (e) {
      console.error('useCommunityMembership ensureMembership:', e)
      const fallbackActive = roles.includes('admin') || roles.includes('coach') || roles.includes('club_admin') || roles.includes('service_specialist')
      setMembership({
        id: `legacy-${user.id}`,
        userId: user.id,
        status: fallbackActive ? 'active' : 'pending',
        tier: fallbackActive ? 'pro' : 'starter',
        approvedAt: null,
        expiresAt: null,
        isActive: fallbackActive,
      })
      setError('Membership backend is not fully provisioned yet; using role-based fallback.')
    }
  }, [user, roles])

  useEffect(() => {
    let ignore = false
    const run = async () => {
      if (!user) {
        if (!ignore) {
          setMembership(null)
          setLoading(false)
        }
        return
      }

      setLoading(true)
      await ensureMembership()
      if (!ignore) setLoading(false)
    }

    run()
    return () => {
      ignore = true
    }
  }, [user, ensureMembership])

  const isAdmin = roles.includes('admin')
  const canAccessCommunity = Boolean(membership?.isActive || isAdmin)

  return {
    membership,
    canAccessCommunity,
    isAdmin,
    loading,
    error,
    refreshMembership: ensureMembership,
  }
}
