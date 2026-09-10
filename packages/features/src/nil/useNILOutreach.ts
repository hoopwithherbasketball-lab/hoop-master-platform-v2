import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'

interface NILOutreachRow {
  id: string
  subject: string
  notes: string | null
  created_at: string
  status: string
  nil_companies?: { name?: string | null } | null
}

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value))
}

function errorMessage(value: unknown): string {
  return value instanceof Error ? value.message : String(value)
}

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
      setMessages(((data ?? []) as NILOutreachRow[]).map((m) => ({
        id: m.id,
        from: m.nil_companies?.name || 'General Outreach',
        subject: m.subject,
        body: m.notes || '',
        received: timeAgo(m.created_at),
        status: m.status,
      })))
    } catch (e) {
      console.error('useNILOutreach:', e)
      setError(toError(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOutreach()
  }, [])

  const addOutreach = async (outreach: Record<string, unknown>) => {
    try {
      const { error: supaError } = await supabase.from('nil_outreach').insert([outreach])
      if (supaError) throw new Error(supaError.message)
      await fetchOutreach()
      return { success: true }
    } catch (e) {
      console.error('Failed to add outreach:', e)
      return { success: false, error: errorMessage(e) }
    }
  }

  const updateOutreach = async (id: string, updates: Record<string, unknown>) => {
    try {
      const { error: supaError } = await supabase.from('nil_outreach').update(updates).eq('id', id)
      if (supaError) throw new Error(supaError.message)
      await fetchOutreach()
      return { success: true }
    } catch (e) {
      console.error('Failed to update outreach:', e)
      return { success: false, error: errorMessage(e) }
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
