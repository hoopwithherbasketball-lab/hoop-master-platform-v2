import { useState } from 'react'

export interface Notification {
  id: string
  type: 'evaluation' | 'message' | 'connection' | 'consent' | 'milestone'
  title: string
  description: string
  timestamp: string
  read: boolean
  link?: string
}

const MOCK: Notification[] = [
  { id: 'n1', type: 'evaluation', title: 'New Evaluation Available', description: 'Coach Williams posted a new evaluation for you.', timestamp: '2026-05-22T10:00:00Z', read: false, link: '/coach/evaluation/1' },
  { id: 'n2', type: 'message', title: 'New Message', description: 'Taylor Reed sent you a message.', timestamp: '2026-05-21T14:30:00Z', read: false, link: '/connectgbb/messages' },
  { id: 'n3', type: 'connection', title: 'Connection Request', description: 'Coach Williams wants to connect.', timestamp: '2026-05-20T09:00:00Z', read: true, link: '/connectgbb/connections' },
  { id: 'n4', type: 'milestone', title: 'Class Milestone', description: 'Junior year stats tracking activated.', timestamp: '2026-05-15T08:00:00Z', read: true },
]

const typeIcons: Record<string, string> = { evaluation: '📋', message: '💬', connection: '🤝', consent: '✅', milestone: '🎯' }

export function useNotifications() {
  const [notifications, setNotifications] = useState(MOCK)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  return { notifications, unreadCount, markAllRead, markRead, typeIcons }
}
