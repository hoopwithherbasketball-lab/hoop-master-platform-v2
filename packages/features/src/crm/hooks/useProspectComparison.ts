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

const ALL_STRENGTHS = ['Shooting', 'Defense', 'Playmaking', 'Rebounding', 'Athleticism', 'IQ', 'Finishing', 'Hustle']

function generateMockData(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  const nextHash = () => {
    hash = Math.sin(hash) * 10000;
    return hash - Math.floor(hash);
  };
  
  const rng = (min: number, max: number) => min + nextHash() * (max - min);
  
  const stats = {
    ppg: Number(rng(8, 25).toFixed(1)),
    apg: Number(rng(1, 8).toFixed(1)),
    rpg: Number(rng(2, 12).toFixed(1)),
    fgp: Number(rng(35, 60).toFixed(1)),
  }
  
  const shuffled = [...ALL_STRENGTHS].sort(() => nextHash() - 0.5)
  const strengths = shuffled.slice(0, Math.floor(rng(2, 5)))
  
  let localRating = 0
  try {
    const val = localStorage.getItem(`scout_shortlist_${id}_rating`)
    if (val) localRating = Number(val)
  } catch (err) {}

  return { stats, strengths, rating: localRating }
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

        const mapped = (data ?? []).map(p => {
          const mock = generateMockData(p.id)
          return {
            id: p.id,
            name: `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim() || 'Unknown',
            position: p.position ?? '',
            grade: p.class_year ? String(p.class_year) : '',
            school: p.school_name ?? '',
            height: p.height ?? '',
            rating: mock.rating,
            stats: mock.stats,
            strengths: mock.strengths,
          }
        })
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
