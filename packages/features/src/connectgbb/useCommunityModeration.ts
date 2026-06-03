import { useCallback, useState } from 'react'
import { supabase } from '@hoop-master/supabase'
import { useAuth } from '../crm/contexts/AuthContextValue.js'
import type { CommunityReportReason } from './types'

export function useCommunityModeration() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reportPost = useCallback(async (postId: string, reason: CommunityReportReason, details = '') => {
    if (!user) return { ok: false, error: 'Authentication required' }
    try {
      setLoading(true)
      setError(null)
      const trimmedDetails = details.trim().slice(0, 500)

      const { error: insertError } = await supabase
        .from('analytics_events')
        .insert({
          viewer_id: user.id,
          session_id: `community-report-${Date.now()}`,
          event_type: 'quality_change',
          metadata: {
            app_event: 'community_report_submitted',
            post_id: postId,
            reason,
            details: trimmedDetails,
            source: 'connectgbb_feed',
          },
          watch_seconds: 0,
        })

      if (insertError) throw insertError
      return { ok: true, error: null }
    } catch (e) {
      console.error('useCommunityModeration reportPost:', e)
      const message = 'Could not submit report at this time.'
      setError(message)
      return { ok: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [user])

  return { reportPost, loading, error }
}
