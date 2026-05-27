import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'

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
const ALL_TAGS = ['high-major', 'guard', 'wing', 'post', 'floor-general', 'athletic', 'rising', 'emerging', 'sleeper', 'local']

interface ShortlistRow {
  id: string
  created_at: string
  player_profiles: {
    first_name: string
    last_name: string
    position: string
    class_year: number
    school_name: string
    state: string
  }[]
}

export function useCoachShortlist() {
  const [entries, setEntries] = useState<ShortlistEntry[]>([])
  const [statusFilter, setStatusFilter] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        setError(null)
        const { data, error: fetchError } = await supabase
          .from('coach_saved_players')
          .select(`
            id,
            created_at,
            player_profile_id,
            player_profiles!inner(first_name, last_name, position, class_year, school_name, state)
          `)
          .order('created_at', { ascending: false })
        if (fetchError) throw fetchError
        if (!data) { setEntries([]); return }
        const rows = data as unknown as ShortlistRow[]
        setEntries(rows.map((r) => {
          const p = r.player_profiles?.[0] ?? {} as ShortlistRow['player_profiles'][0]
          return {
            id: r.id,
            name: `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim() || 'Unknown',
            position: p.position ?? '',
            grade: p.class_year ? String(p.class_year) : '',
            school: p.school_name ?? '',
            state: p.state ?? '',
            rating: 0,
            status: 'saved' as const,
            tags: [],
            notes: '',
            dateAdded: r.created_at ? r.created_at.slice(0, 10) : '',
          }
        }))
      } catch (e) {
        console.error('useCoachShortlist:', e)
        setError('Failed to load shortlist')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

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

  return { entries, filtered, statusFilter, setStatusFilter, tagFilter, setTagFilter, editingNotes, setEditingNotes, updateStatus, updateNotes, advanceStatus, statuses: STATUS_ORDER, tags: ALL_TAGS, loading, error }
}
