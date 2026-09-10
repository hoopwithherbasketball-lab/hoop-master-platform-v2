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
  const [error, setError] = useState<Error | null>(null)

  const fetchAthletes = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: supaError } = await supabase
        .from('nil_athlete_profiles')
        .select('*')
        .eq('opted_in', true)
        .order('readiness_score', { ascending: false })

      if (supaError) throw new Error(supaError.message)

      setAthletes((data ?? []).map(a => ({
        id: a.id,
        name: a.display_name,
        position: a.position,
        classYear: a.class_year,
        followers: a.followers,
        readiness: a.readiness_score,
        tier: a.tier,
      })))
    } catch (e: any) {
      console.error('useNILAthletes:', e)
      setError(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAthletes()
  }, [])

  const updateAthlete = async (id: string, updates: Partial<any>) => {
    try {
      const { error: supaError } = await supabase
        .from('nil_athlete_profiles')
        .update(updates)
        .eq('id', id)
      
      if (supaError) throw new Error(supaError.message)
      await fetchAthletes()
      return { success: true }
    } catch (e: any) {
      console.error('Failed to update athlete:', e)
      return { success: false, error: e.message }
    }
  }

  return { athletes, loading, error, refetch: fetchAthletes, updateAthlete }
}
