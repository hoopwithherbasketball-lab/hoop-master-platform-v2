import { useState } from 'react'

export interface ShortlistEntry {
  id: string
  name: string
  position: string
  grade: string
  school: string
  state: string
  rating: number
  status: 'saved' | 'contacted' | 'evaluation' | 'interview' | 'offer' | 'committed' | 'archived'
  tags: string[]
  notes: string
  dateAdded: string
}

const STATUS_ORDER: ShortlistEntry['status'][] = ['saved', 'contacted', 'evaluation', 'interview', 'offer', 'committed', 'archived']

const MOCK: ShortlistEntry[] = [
  { id: '1', name: 'Ava Grant', position: 'SG', grade: '2026', school: 'Sierra Canyon', state: 'CA', rating: 92, status: 'contacted', tags: ['high-major', 'guard'], notes: 'Reached out via email. Coach Williams responded positively.', dateAdded: '2026-03-10' },
  { id: '2', name: 'Jordan Lee', position: 'C', grade: '2026', school: 'Christ the King', state: 'NY', rating: 80, status: 'evaluation', tags: ['post', 'rising'], notes: 'Need to see more game film. Potential sleeper.', dateAdded: '2026-03-22' },
  { id: '3', name: 'Maya Thompson', position: 'SF', grade: '2027', school: 'Wheeler', state: 'GA', rating: 78, status: 'saved', tags: ['wing', 'athletic'], notes: '', dateAdded: '2026-04-05' },
  { id: '4', name: 'Taylor Brooks', position: 'PG', grade: '2027', school: 'Duncanville', state: 'TX', rating: 88, status: 'interview', tags: ['high-major', 'floor-general'], notes: 'Scheduled Zoom call for next week.', dateAdded: '2026-04-01' },
  { id: '5', name: 'Sophia Ramirez', position: 'PG', grade: '2028', school: 'Sierra Canyon', state: 'CA', rating: 90, status: 'saved', tags: ['emerging', 'guard'], notes: 'Young but special. Track closely.', dateAdded: '2026-04-18' },
]

const ALL_TAGS = ['high-major', 'guard', 'wing', 'post', 'floor-general', 'athletic', 'rising', 'emerging', 'sleeper', 'local']

export function useCoachShortlist() {
  const [entries, setEntries] = useState(MOCK)
  const [statusFilter, setStatusFilter] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [editingNotes, setEditingNotes] = useState<string | null>(null)

  const filtered = entries.filter(e => {
    if (statusFilter && e.status !== statusFilter) return false
    if (tagFilter && !e.tags.includes(tagFilter)) return false
    return true
  })

  const updateStatus = (id: string, status: ShortlistEntry['status']) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, status } : e))
  }

  const updateNotes = (id: string, notes: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, notes } : e))
    setEditingNotes(null)
  }

  const advanceStatus = (id: string) => {
    setEntries(prev => prev.map(e => {
      if (e.id !== id) return e
      const idx = STATUS_ORDER.indexOf(e.status)
      if (idx < STATUS_ORDER.length - 1) return { ...e, status: STATUS_ORDER[idx + 1] }
      return e
    }))
  }

  return { entries, filtered, statusFilter, setStatusFilter, tagFilter, setTagFilter, editingNotes, setEditingNotes, updateStatus, updateNotes, advanceStatus, statuses: STATUS_ORDER, tags: ALL_TAGS }
}
