import { useState } from 'react'

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

const POOL: ComparableProspect[] = [
  { id: '1', name: 'Ava Grant', position: 'SG', grade: '2026', school: 'Sierra Canyon', height: "5'11\"", rating: 92, stats: { ppg: 18.4, apg: 5.2, rpg: 7.8, fgp: 47.2 }, strengths: ['Athleticism', 'IQ', 'Defense'] },
  { id: '2', name: 'Taylor Brooks', position: 'PG', grade: '2027', school: 'Duncanville', height: "5'7\"", rating: 88, stats: { ppg: 16.2, apg: 6.1, rpg: 4.3, fgp: 44.8 }, strengths: ['Playmaking', 'Speed', 'Ball Handling'] },
  { id: '3', name: 'Mia Carter', position: 'SF', grade: '2026', school: 'Montverde', height: "6'0\"", rating: 85, stats: { ppg: 14.8, apg: 3.5, rpg: 6.2, fgp: 45.0 }, strengths: ['Length', 'Shooting', 'Versatility'] },
  { id: '4', name: 'Sophia Ramirez', position: 'PG', grade: '2028', school: 'Sierra Canyon', height: "5'6\"", rating: 90, stats: { ppg: 20.1, apg: 4.8, rpg: 3.9, fgp: 46.5 }, strengths: ['Scoring', 'Athleticism', 'Clutch'] },
  { id: '5', name: 'Emma Davis', position: 'PF', grade: '2025', school: 'Whitney Young', height: "6'1\"", rating: 87, stats: { ppg: 15.3, apg: 2.1, rpg: 9.4, fgp: 48.1 }, strengths: ['Rebounding', 'Post Game', 'Strength'] },
]

export function useProspectComparison() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['1', '2'])
  const [allProspects] = useState(POOL)

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id)
      if (prev.length >= 4) return prev
      return [...prev, id]
    })
  }

  const selected = allProspects.filter(p => selectedIds.includes(p.id))
  const available = allProspects.filter(p => !selectedIds.includes(p.id))

  return { selected, available, allProspects, selectedIds, toggleSelection }
}
