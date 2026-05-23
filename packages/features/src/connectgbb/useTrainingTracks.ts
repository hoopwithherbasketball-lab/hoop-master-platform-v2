import { useState, useEffect } from 'react'
import type { TrainingTrack } from './types'

const MOCK_TRACKS: TrainingTrack[] = [
  { id: '1', title: 'Ball Handling Fundamentals', description: 'Master dribbling, crossovers, and handles for any defensive pressure.', category: 'skill', level: 'beginner', duration: '4 weeks', lessonCount: 8 },
  { id: '2', title: 'Shooting Mechanics', description: 'Perfect your form, release, and range with drills used by pros.', category: 'skill', level: 'intermediate', duration: '6 weeks', lessonCount: 12 },
  { id: '3', title: 'Strength & Conditioning', description: 'Build court-specific strength, agility, and endurance.', category: 'strength', level: 'intermediate', duration: '8 weeks', lessonCount: 16 },
  { id: '4', title: 'Film Study & IQ', description: 'Learn to read defenses, recognize sets, and make smarter decisions.', category: 'film', level: 'advanced', duration: '4 weeks', lessonCount: 8 },
  { id: '5', title: 'Recruiting Prep', description: 'Build your highlight reel, write coach emails, and ace official visits.', category: 'recruiting', level: 'beginner', duration: '3 weeks', lessonCount: 6 },
]

export function useTrainingTracks() {
  const [tracks, setTracks] = useState<TrainingTrack[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTracks(MOCK_TRACKS)
    setLoading(false)
  }, [])

  return { tracks, loading }
}
