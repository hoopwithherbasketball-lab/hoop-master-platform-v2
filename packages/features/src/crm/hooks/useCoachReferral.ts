import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'
import { useAuth } from '../contexts/AuthContextValue.js'

export interface ReferralNote {
  id: string
  coachName: string
  coachTitle: string
  content: string
  date: string
}

export function useCoachReferral(playerId: string) {
  const { user } = useAuth()
  const [notes, setNotes] = useState<ReferralNote[]>([])
  const [newNote, setNewNote] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!playerId) { setLoading(false); return }

    const abortController = new AbortController()

    const load = async () => {
      try {
        setLoading(true)
        const { data } = await supabase
          .from('coach_referral_notes')
          .select('*')
          .eq('player_profile_id', playerId)
          .order('created_at', { ascending: false })

        if (abortController.signal.aborted) return

        const mapped: ReferralNote[] = (data ?? []).map(r => ({
          id: r.id,
          coachName: r.coach_name,
          coachTitle: r.coach_title || 'Coach',
          content: r.content,
          date: new Date(r.created_at).toISOString().slice(0, 10),
        }))
        setNotes(mapped)
      } catch (e) {
        if (!abortController.signal.aborted) console.error('useCoachReferral:', e)
      } finally {
        if (!abortController.signal.aborted) setLoading(false)
      }
    }
    load()

    return () => abortController.abort()
  }, [playerId])

  const addNote = async () => {
    if (!newNote.trim() || !user || !playerId) return
    try {
      const { data } = await supabase.from('coach_referral_notes').insert({
        player_profile_id: playerId,
        coach_user_id: user.id,
        coach_name: user.email?.split('@')[0] || 'You',
        coach_title: 'Coach',
        content: newNote,
      }).select().single()
      if (data) {
        setNotes(prev => [{
          id: data.id,
          coachName: data.coach_name,
          coachTitle: data.coach_title || 'Coach',
          content: data.content,
          date: new Date(data.created_at).toISOString().slice(0, 10),
        }, ...prev])
      }
      setNewNote('')
    } catch (e) { console.error('addNote:', e) }
  }

  return { notes, newNote, setNewNote, addNote, loading }
}
