import { useState } from 'react'

export interface ReferralNote {
  id: string
  coachName: string
  coachTitle: string
  content: string
  date: string
}

export function useCoachReferral(_playerId: string) {
  const [notes, setNotes] = useState<ReferralNote[]>([])
  const [newNote, setNewNote] = useState('')

  const addNote = () => {
    if (!newNote.trim()) return
    setNotes(prev => [...prev, { id: Date.now().toString(), coachName: 'You', coachTitle: 'Coach', content: newNote, date: new Date().toISOString().slice(0, 10) }])
    setNewNote('')
  }

  return { notes, newNote, setNewNote, addNote }
}
