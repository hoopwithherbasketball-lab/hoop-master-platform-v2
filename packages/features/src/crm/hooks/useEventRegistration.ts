import { useState } from 'react'

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

const MOCK_EVENTS: EventInfo[] = [
  { id: 'e1', title: 'Elite GBB Showcase', date: 'June 15-17, 2026', location: 'Atlanta, GA', description: 'Top girls basketball players compete in front of college scouts from across the country.', capacity: 200, registered: 156, price: 199 },
  { id: 'e2', title: 'Recruiting Workshop', date: 'July 8, 2026', location: 'Virtual', description: 'Learn the ins and outs of the college recruiting process from expert coaches.', capacity: 500, registered: 312, price: 49 },
  { id: 'e3', title: 'Summer Skills Camp', date: 'August 5-7, 2026', location: 'Chicago, IL', description: 'Intensive skills development camp with D1 coaches and current college players.', capacity: 150, registered: 89, price: 299 },
  { id: 'e4', title: 'NIL Summit', date: 'September 12, 2026', location: 'Los Angeles, CA', description: 'Connect with brands and learn how to maximize your NIL opportunities.', capacity: 300, registered: 124, price: 149 },
]

export function useEventRegistration() {
  const [registered, setRegistered] = useState<Set<string>>(new Set())
  const [events] = useState(MOCK_EVENTS)

  const toggleRegistration = (eventId: string) => {
    setRegistered(prev => {
      const next = new Set(prev)
      if (next.has(eventId)) next.delete(eventId)
      else next.add(eventId)
      return next
    })
  }

  const isRegistered = (eventId: string) => registered.has(eventId)
  const myEvents = events.filter(e => registered.has(e.id))

  return { events, myEvents, registeredCount: registered.size, toggleRegistration, isRegistered }
}
