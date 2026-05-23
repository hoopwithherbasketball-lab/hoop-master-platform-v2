import { useState, useMemo } from 'react'

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

const MOCK: Prospect[] = [
  { id: '1', name: 'Ava Grant', position: 'SG', grade: '2026', rating: 92, state: 'CA', height: "5'11\"", school: 'Sierra Canyon', saved: false },
  { id: '2', name: 'Taylor Brooks', position: 'PG', grade: '2027', rating: 88, state: 'TX', height: "5'7\"", school: 'Duncanville', saved: false },
  { id: '3', name: 'Mia Carter', position: 'SF', grade: '2026', rating: 85, state: 'FL', height: "6'0\"", school: 'Montverde', saved: false },
  { id: '4', name: 'Jordan Lee', position: 'C', grade: '2026', rating: 80, state: 'NY', height: "6'3\"", school: 'Christ the King', saved: true },
  { id: '5', name: 'Maya Thompson', position: 'SF', grade: '2027', rating: 78, state: 'GA', height: "5'10\"", school: 'Wheeler', saved: true },
  { id: '6', name: 'Sophia Ramirez', position: 'PG', grade: '2028', rating: 90, state: 'CA', height: "5'6\"", school: 'Sierra Canyon', saved: false },
  { id: '7', name: 'Emma Davis', position: 'PF', grade: '2025', rating: 87, state: 'IL', height: "6'1\"", school: 'Whitney Young', saved: false },
  { id: '8', name: 'Olivia Jones', position: 'SG', grade: '2027', rating: 83, state: 'NC', height: "5'9\"", school: 'Cary Academy', saved: false },
]

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C']
const GRADES = ['2025', '2026', '2027', '2028']

export function useProspectSearch() {
  const [query, setQuery] = useState('')
  const [positionFilter, setPositionFilter] = useState('')
  const [gradeFilter, setGradeFilter] = useState('')
  const [prospects, setProspects] = useState(MOCK)

  const filtered = useMemo(() => {
    return prospects.filter(p => {
      if (query && !p.name.toLowerCase().includes(query.toLowerCase()) && !p.school.toLowerCase().includes(query.toLowerCase())) return false
      if (positionFilter && p.position !== positionFilter) return false
      if (gradeFilter && p.grade !== gradeFilter) return false
      return true
    })
  }, [query, positionFilter, gradeFilter, prospects])

  const toggleSave = (id: string) => {
    setProspects(prev => prev.map(p => p.id === id ? { ...p, saved: !p.saved } : p))
  }

  return { query, setQuery, positionFilter, setPositionFilter, gradeFilter, setGradeFilter, filtered, toggleSave, positions: POSITIONS, grades: GRADES }
}
