import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@hoop-master/supabase'
import type { Database } from '@hoop-master/types'

type PlayerProfile = Database['public']['Tables']['player_profiles']['Row']

export interface Prospect {
  id: string
  name: string
  position: string
  grade: string
  rating: number
  state: string
  height: string
  school: string
  saved: boolean
}

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C']
const GRADES: string[] = []

export function useProspectSearch() {
  const [query, setQuery] = useState('')
  const [positionFilter, setPositionFilter] = useState('')
  const [gradeFilter, setGradeFilter] = useState('')
  const [allProspects, setAllProspects] = useState<Prospect[]>([])
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('player_profiles').select('*').order('created_at', { ascending: false })
      if (!data) return
      setAllProspects((data as PlayerProfile[]).map(p => ({
        id: p.id,
        name: `${p.first_name} ${p.last_name}`.trim() || 'Unknown',
        position: p.position ?? '',
        grade: p.class_year ? String(p.class_year) : '',
        rating: 0,
        state: p.state ?? '',
        height: p.height ?? '',
        school: p.school_name ?? '',
        saved: false,
      })))
    }
    const fetchSaved = async () => {
      const { data } = await supabase.from('coach_saved_players').select('player_profile_id')
      if (data) setSavedIds(new Set(data.map(r => r.player_profile_id)))
    }
    fetch()
    fetchSaved()
  }, [])

  const prospects = useMemo(() => allProspects.map(p => ({ ...p, saved: savedIds.has(p.id) })), [allProspects, savedIds])

  const filtered = useMemo(() => {
    return prospects.filter(p => {
      if (query && !p.name.toLowerCase().includes(query.toLowerCase()) && !p.school.toLowerCase().includes(query.toLowerCase())) return false
      if (positionFilter && p.position !== positionFilter) return false
      if (gradeFilter && p.grade !== gradeFilter) return false
      return true
    })
  }, [query, positionFilter, gradeFilter, prospects])

  const toggleSave = async (id: string) => {
    const wasSaved = savedIds.has(id)
    if (wasSaved) {
      await supabase.from('coach_saved_players').delete().eq('player_profile_id', id)
      savedIds.delete(id)
    } else {
      await supabase.from('coach_saved_players').insert({ coach_profile_id: '', player_profile_id: id })
      savedIds.add(id)
    }
    setSavedIds(new Set(savedIds))
  }

  return { query, setQuery, positionFilter, setPositionFilter, gradeFilter, setGradeFilter, filtered, toggleSave, positions: POSITIONS, grades: GRADES }
}
