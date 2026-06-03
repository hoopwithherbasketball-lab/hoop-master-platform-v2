import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'
import type { MemberProfile } from './types'
import { useCommunityMembership } from './useCommunityMembership.js'
import { useAuth } from '../crm/contexts/AuthContextValue.js'

export function useMemberProfile(id: string) {
  const { user } = useAuth()
  const { canAccessCommunity } = useCommunityMembership()
  const [profile, setProfile] = useState<MemberProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) { setProfile(null); setLoading(false); return }
    const viewingOwnProfile = user?.id === id
    if (!canAccessCommunity && !viewingOwnProfile) { setProfile(null); setLoading(false); return }

    const abortController = new AbortController()

    const fetch = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data } = await supabase
          .from('member_profiles')
          .select('*')
          .eq('user_id', id)
          .maybeSingle()

        if (abortController.signal.aborted) return

        let connectionsCount = 0
        let postsCount = 0

        if (id) {
          const { count: connCount } = await supabase
            .from('member_connections')
            .select('*', { count: 'exact', head: true })
            .or(`requester_id.eq.${id},target_id.eq.${id}`)
            .eq('status', 'approved')
          connectionsCount = connCount ?? 0

          const { count: postCount } = await supabase
            .from('community_posts')
            .select('*', { count: 'exact', head: true })
            .eq('author_id', id)
          postsCount = postCount ?? 0
        }

        if (abortController.signal.aborted) return

        if (data) {
          setProfile({
            id: data.id,
            displayName: data.display_name,
            role: data.role as MemberProfile['role'],
            bio: data.bio || '',
            avatar: (data.avatar_url || data.display_name?.[0] || '?').toUpperCase(),
            location: data.location || '',
            joined: new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            connections: connectionsCount,
            posts: postsCount,
          })
        } else {
          setProfile({
            id, displayName: 'Unknown', role: 'player', bio: '', avatar: '?',
            location: '', joined: '', connections: connectionsCount, posts: postsCount,
          })
        }
      } catch (e) {
        if (!abortController.signal.aborted) {
          console.error('useMemberProfile:', e)
          setError('Failed to load profile')
        }
      } finally {
        if (!abortController.signal.aborted) setLoading(false)
      }
    }
    fetch()

    return () => abortController.abort()
  }, [id, canAccessCommunity, user])

  return { profile, loading, error }
}
