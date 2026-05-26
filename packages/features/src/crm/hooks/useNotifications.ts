import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@hoop-master/supabase'
import { useAuth } from '../contexts/AuthContextValue.js'

export interface Notification {
  id: string
  type: 'evaluation' | 'message' | 'connection' | 'consent' | 'milestone'
  title: string
  description: string
  timestamp: string
  read: boolean
  link?: string
}

const typeIcons: Record<string, string> = { evaluation: '📋', message: '💬', connection: '🤝', consent: '✅', milestone: '🎯' }

export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetch = async () => {
      try {
        const { data } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20)

        const mapped: Notification[] = (data ?? []).map(n => ({
          id: n.id,
          type: (['evaluation', 'message', 'connection', 'consent', 'milestone'].includes(n.type) ? n.type : 'message') as Notification['type'],
          title: n.title,
          description: n.body ?? '',
          timestamp: n.created_at,
          read: n.is_read,
          link: n.link ?? undefined,
        }))
        setNotifications(mapped)
      } catch (e) { console.error('useNotifications:', e) }
      setLoading(false)
    }
    fetch()
  }, [user])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = useCallback(async () => {
    if (!user) return
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (e) { console.error('markAllRead:', e) }
  }, [user])

  const markRead = useCallback(async (id: string) => {
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    } catch (e) { console.error('markRead:', e) }
  }, [])

  return { notifications, unreadCount, markAllRead, markRead, typeIcons, loading }
}
