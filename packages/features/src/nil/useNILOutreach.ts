import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'

export interface NILOutreachMessage {
  id: string
  from: string
  subject: string
  body: string
  received: string
  status: string
}

export function useNILOutreach() {
  const [messages, setMessages] = useState<NILOutreachMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchOutreach = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: supaError } = await supabase
        .from('nil_outreach')
        .select('*, nil_companies(name)')
        .order('created_at', { ascending: false })
      
      if (supaError) throw new Error(supaError.message)
      setMessages((data ?? []).map((m: any) => ({
        id: m.id,
        from: m.nil_companies?.name || 'General Outreach',
        subject: m.subject,
        body: m.notes || '',
        received: timeAgo(m.created_at),
        status: m.status,
      })))
    } catch (e: any) {
      console.error('useNILOutreach:', e)
      setError(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOutreach()
  }, [])

  const addOutreach = async (outreach: any) => {
    try {
      const { error: supaError } = await supabase.from('nil_outreach').insert([outreach])
      if (supaError) throw new Error(supaError.message)
      await fetchOutreach()
      return { success: true }
    } catch (e: any) {
      console.error('Failed to add outreach:', e)
      return { success: false, error: e.message }
    }
  }

  const updateOutreach = async (id: string, updates: any) => {
    try {
      const { error: supaError } = await supabase.from('nil_outreach').update(updates).eq('id', id)
      if (supaError) throw new Error(supaError.message)
      await fetchOutreach()
      return { success: true }
    } catch (e: any) {
      console.error('Failed to update outreach:', e)
      return { success: false, error: e.message }
    }
  }

  return { messages, loading, error, refetch: fetchOutreach, addOutreach, updateOutreach }
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
