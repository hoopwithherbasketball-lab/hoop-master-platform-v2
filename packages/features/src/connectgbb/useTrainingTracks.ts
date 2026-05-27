import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'
import type { TrainingTrack } from './types'

export function useTrainingTracks() {
  const [tracks, setTracks] = useState<TrainingTrack[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
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
      } catch (e) { console.error('useTrainingTracks:', e) }
      setLoading(false)
    }
    fetch()
  }, [])

  return { tracks, loading }
}
