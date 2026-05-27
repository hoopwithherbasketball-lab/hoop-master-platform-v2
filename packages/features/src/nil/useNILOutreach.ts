import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'

export interface NILOutreachMessage {
  id: string
  from: string
  subject: string
  received: string
  status: string
}

export function useNILOutreach() {
  const [messages, setMessages] = useState<NILOutreachMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await supabase.from('nil_outreach').select('*').order('created_at', { ascending: false })
        setMessages((data ?? []).map(m => ({
          id: m.id,
          from: m.from_entity,
          subject: m.subject,
          received: timeAgo(m.created_at),
          status: m.status,
        })))
      } catch (e) { console.error('useNILOutreach:', e) }
      setLoading(false)
    }
    fetch()
  }, [])

  return { messages, loading }
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
