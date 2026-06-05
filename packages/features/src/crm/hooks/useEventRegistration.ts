import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@hoop-master/supabase'
import { useAuth } from '../contexts/AuthContextValue.js'

export interface EventInfo {
  id: string
  title: string
  date: string
  location: string
  description: string
  capacity: number
  registered: number
  price: number
}

interface EventRow {
  id: string
  title: string
  start_date: string | null
  location: string | null
  description: string | null
  max_participants: number | null
  current_participants: number | null
  price: number | string | null
}

function mapEvent(e: EventRow): EventInfo {
  return {
    id: e.id,
    title: e.title,
    date: e.start_date ? new Date(e.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '',
    location: e.location ?? '',
    description: e.description ?? '',
    capacity: e.max_participants ?? 0,
    registered: e.current_participants ?? 0,
    price: e.price ? Number(e.price) : 0,
  }
}

export function useEventRegistration() {
  const [registered, setRegistered] = useState<Set<string>>(new Set())
  const [events, setEvents] = useState<EventInfo[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const pendingRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('id, title, description, location, start_date, price, max_participants, current_participants, status')
          .neq('status', 'cancelled')
          .order('start_date', { ascending: true })

        if (error) { console.error('useEventRegistration events error:', error.message); return }
        if (data) setEvents(data.map(mapEvent))
      } catch (e) { console.error('useEventRegistration loadEvents exception:', e) }
    }

    if (!user) {
      loadEvents()
      setLoading(false)
      return
    }

    const loadRegistrations = async () => {
      try {
        const { data, error } = await supabase
          .from('event_registrations')
          .select('event_id')
          .eq('user_id', user.id)
          .eq('status', 'registered')

        if (error) { console.error('useEventRegistration registrations error:', error.message); return }
        if (data) {
          setRegistered(new Set(data.map(r => r.event_id)))
        }
      } catch (e) { console.error('useEventRegistration loadRegistrations exception:', e) }
      setLoading(false)
    }

    loadEvents()
    loadRegistrations()
  }, [user])

  const toggleRegistration = useCallback(async (eventId: string) => {
    if (!user) return
    if (pendingRef.current.has(eventId)) return

    pendingRef.current.add(eventId)

    try {
      if (registered.has(eventId)) {
        const { error } = await supabase
          .from('event_registrations')
          .update({ status: 'cancelled' })
          .eq('event_id', eventId)
          .eq('user_id', user.id)

        if (error) { console.error('useEventRegistration cancel error:', error.message) }
        if (!error) {
          setRegistered(prev => {
            const next = new Set(prev)
            next.delete(eventId)
            return next
          })
        }
      } else {
        const { error } = await supabase
          .from('event_registrations')
          .insert({ event_id: eventId, user_id: user.id })

        if (error) { console.error('useEventRegistration register error:', error.message) }
        if (!error) {
          setRegistered(prev => {
            const next = new Set(prev)
            next.add(eventId)
            return next
          })
        }
      }
    } catch (e) { console.error('useEventRegistration toggle exception:', e) }
    pendingRef.current.delete(eventId)
  }, [user, registered])

  const isRegistered = (eventId: string) => registered.has(eventId)
  const myEvents = events.filter(e => registered.has(e.id))

  return { events, myEvents, registeredCount: registered.size, toggleRegistration, isRegistered, loading }
}
