import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'

export interface NILAthlete {
  id: string
  name: string
  position: string
  classYear: number | null
  followers: string
  readiness: number
  tier: string
}

export function useNILAthletes() {
  const [athletes, setAthletes] = useState<NILAthlete[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await supabase.from('nil_athlete_profiles').select('*').eq('opted_in', true).order('readiness_score', { ascending: false })
        setAthletes((data ?? []).map(a => ({
          id: a.id,
          name: a.display_name,
          position: a.position,
          classYear: a.class_year,
          followers: a.followers,
          readiness: a.readiness_score,
          tier: a.tier,
        })))
      } catch (e) { console.error('useNILAthletes:', e) }
      setLoading(false)
    }
    fetch()
  }, [])

  return { athletes, loading }
}
