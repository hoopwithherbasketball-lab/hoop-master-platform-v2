import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'

export interface ComparableProspect {
  id: string
  name: string
  position: string
  grade: string
  school: string
  height: string
  rating: number
  stats: { ppg: number; apg: number; rpg: number; fgp: number }
  strengths: string[]
}

export function useProspectComparison() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [allProspects, setAllProspects] = useState<ComparableProspect[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await supabase
          .from('player_profiles')
          .select('id, first_name, last_name, position, class_year, school_name, height')
          .limit(20)

        const mapped = (data ?? []).map(p => ({
          id: p.id,
          name: `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim() || 'Unknown',
          position: p.position ?? '',
          grade: p.class_year ? String(p.class_year) : '',
          school: p.school_name ?? '',
          height: p.height ?? '',
          rating: 0,
          stats: { ppg: 0, apg: 0, rpg: 0, fgp: 0 },
          strengths: [],
        }))
        setAllProspects(mapped)
        if (mapped.length >= 2) setSelectedIds([mapped[0].id, mapped[1].id])
        else if (mapped.length === 1) setSelectedIds([mapped[0].id])
      } catch (e) { console.error('useProspectComparison:', e) }
      setLoading(false)
    }
    fetch()
  }, [])

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id)
      if (prev.length >= 4) return prev
      return [...prev, id]
    })
  }

  const selected = allProspects.filter(p => selectedIds.includes(p.id))
  const available = allProspects.filter(p => !selectedIds.includes(p.id))

  return { selected, available, allProspects, selectedIds, toggleSelection, loading }
}
