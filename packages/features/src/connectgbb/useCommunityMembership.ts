import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@hoop-master/supabase'
import { useAuth } from '../crm/contexts/AuthContextValue.js'
import type { CommunityMembership } from './types'

let rpcUnavailable = false
let membershipsTableUnavailable = false
let requestCooldownUntil = 0

const CACHE_TTL_MS = 30_000
const RATE_LIMIT_BACKOFF_MS = 30_000

type CachedMembership = {
  membership: CommunityMembership
  error: string | null
  fetchedAt: number
}

const membershipCache = new Map<string, CachedMembership>()
const inFlightRequests = new Map<string, Promise<{ membership: CommunityMembership; error: string | null }>>()

const hasPrivilegedRole = (roles: string[]) =>
  roles.includes('admin') || roles.includes('coach') || roles.includes('club_admin') || roles.includes('service_specialist')

const buildFallbackMembership = (userId: string, roles: string[]) => {
  const active = hasPrivilegedRole(roles)
  return {
    id: `legacy-${userId}`,
    userId,
    status: active ? ('active' as const) : ('pending' as const),
    tier: active ? ('pro' as const) : ('starter' as const),
    approvedAt: null,
    expiresAt: null,
    isActive: active,
  }
}

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

const shouldUseStrictMembershipMode = () => {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem('connectgbb_strict_membership_mode') === 'true'
}

const isMissingResourceError = (error: unknown) => {
  const maybe = error as { code?: string; status?: number } | null
  return maybe?.code === 'PGRST202' || maybe?.code === 'PGRST205' || maybe?.status === 404
}

const isRateLimitError = (error: unknown) => {
  const maybe = error as { status?: number; code?: string } | null
  return maybe?.status === 429 || maybe?.code === '429'
}

export function useCommunityMembership() {
  const { user, roles } = useAuth()
  const [membership, setMembership] = useState<CommunityMembership | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const roleKey = roles.slice().sort().join('|')

  const resolveMembership = useCallback(async (forceRefresh = false) => {
    if (!user) return { membership: null as CommunityMembership | null, error: null as string | null }

    const now = Date.now()
    const cached = membershipCache.get(user.id)
    if (!forceRefresh && cached && now - cached.fetchedAt < CACHE_TTL_MS) {
      return { membership: cached.membership, error: cached.error }
    }

    if (!forceRefresh && inFlightRequests.has(user.id)) {
      return inFlightRequests.get(user.id)!
    }

    const run = (async () => {
      if (Date.now() < requestCooldownUntil) {
        if (shouldUseStrictMembershipMode()) {
          return {
            membership: buildFallbackMembership(user.id, []),
            error: 'Membership service is currently rate-limited. Please retry shortly.',
          }
        }

        const fallback = buildFallbackMembership(user.id, roles)
        return {
          membership: fallback,
          error: 'Membership service is rate-limited; using role-based fallback.',
        }
      }

      try {
        if (!membershipsTableUnavailable) {
          const { data, error: queryError } = await supabase
            .from('community_memberships')
            .select('id, user_id, status, tier, approved_at, expires_at')
            .eq('user_id', user.id)
            .maybeSingle()

          if (queryError) {
            if (isRateLimitError(queryError)) {
              requestCooldownUntil = Date.now() + RATE_LIMIT_BACKOFF_MS
            } else if (isMissingResourceError(queryError)) {
              membershipsTableUnavailable = true
            } else {
              throw queryError
            }
          }

          if (data?.id && data?.user_id) {
            return { membership: mapMembership(data), error: null }
          }
        }

        if (!rpcUnavailable && !membershipsTableUnavailable) {
          const { data: ensured, error: rpcError } = await supabase
            .rpc('ensure_community_membership')
            .single()

          if (rpcError) {
            if (isRateLimitError(rpcError)) {
              requestCooldownUntil = Date.now() + RATE_LIMIT_BACKOFF_MS
            } else if (isMissingResourceError(rpcError)) {
              rpcUnavailable = true
            } else {
              throw rpcError
            }
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
            return { membership: mapMembership(ensuredRecord), error: null }
          }
        }

        const fallback = buildFallbackMembership(user.id, shouldUseStrictMembershipMode() ? [] : roles)
        return {
          membership: fallback,
          error: shouldUseStrictMembershipMode()
            ? 'Membership is required and your account has not been activated yet.'
            : 'Membership backend is not provisioned in this environment; using role-based fallback.',
        }
      } catch (e) {
        console.error('useCommunityMembership resolveMembership:', e)
        const fallback = buildFallbackMembership(user.id, shouldUseStrictMembershipMode() ? [] : roles)
        return {
          membership: fallback,
          error: shouldUseStrictMembershipMode()
            ? 'Unable to verify membership right now. Please retry.'
            : 'Unable to verify membership right now; using role-based fallback.',
        }
      }
    })()

    inFlightRequests.set(user.id, run)
    const result = await run
    inFlightRequests.delete(user.id)

    if (result.membership) {
      membershipCache.set(user.id, {
        membership: result.membership,
        error: result.error,
        fetchedAt: Date.now(),
      })
    }

    return result
  }, [user, roleKey])

  const ensureMembership = useCallback(async (forceRefresh = false) => {
    if (!user) {
      setMembership(null)
      setError(null)
      return
    }

    const result = await resolveMembership(forceRefresh)
    setMembership(result.membership)
    setError(result.error)
  }, [user, resolveMembership])

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
      await ensureMembership(false)
      if (!ignore) setLoading(false)
    }

    run()
    return () => {
      ignore = true
    }
  }, [user, ensureMembership, roleKey])

  const isAdmin = roles.includes('admin')
  const canAccessCommunity = Boolean(membership?.isActive || isAdmin)

  return {
    membership,
    canAccessCommunity,
    isAdmin,
    loading,
    error,
    refreshMembership: () => ensureMembership(true),
  }
}
