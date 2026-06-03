import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'
import type { TrainingTrack } from './types'
import { useCommunityMembership } from './useCommunityMembership.js'

export function useTrainingTracks() {
  const { canAccessCommunity } = useCommunityMembership()
  const [tracks, setTracks] = useState<TrainingTrack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!canAccessCommunity) {
      setTracks([])
      setLoading(false)
      return
    }

    const fetch = async () => {
      try {
        setError(null)
        const { data } = await supabase
          .from('training_videos')
          .select('*')
          .limit(20)
        const mapped: TrainingTrack[] = (data ?? []).map(v => ({
          id: v.id,
          title: v.title,
          description: v.description || '',
          category: v.category as TrainingTrack['category'],
          level: v.level as TrainingTrack['level'],
          duration: `${v.duration_minutes} min`,
          lessonCount: v.lesson_count,
          thumbnailUrl: v.thumbnail_url || undefined,
        }))
        setTracks(mapped)
      } catch (e) {
        console.error('useTrainingTracks:', e)
        setError('Unable to load premium training tracks.')
      }
      setLoading(false)
    }
    fetch()
  }, [canAccessCommunity])

  return { tracks, loading, error }
}
