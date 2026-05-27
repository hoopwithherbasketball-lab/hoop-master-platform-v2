import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'
import type { MemberProfile } from './types'

export function useMemberProfile(id: string) {
  const [profile, setProfile] = useState<MemberProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) { setLoading(false); return }
    const fetch = async () => {
      try {
        const { data } = await supabase
          .from('member_profiles')
          .select('*')
          .eq('user_id', id)
          .maybeSingle()

        if (data) {
          setProfile({
            id: data.id,
            displayName: data.display_name,
            role: data.role as MemberProfile['role'],
            bio: data.bio || '',
            avatar: (data.avatar_url || data.display_name?.[0] || '?').toUpperCase(),
            location: data.location || '',
            joined: new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            connections: 0,
            posts: 0,
          })
        } else {
          setProfile({
            id, displayName: 'Unknown', role: 'player', bio: '', avatar: '?',
            location: '', joined: '', connections: 0, posts: 0,
          })
        }
      } catch (e) { console.error('useMemberProfile:', e) }
      setLoading(false)
    }
    fetch()
  }, [id])

  return { profile, loading }
}
