import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value))
}

function errorMessage(value: unknown): string {
  return value instanceof Error ? value.message : String(value)
}

export interface NILOpportunity {
  id: string
  athlete_name: string
  brand: string
  value: string
  value_cents: number
  status: string
}

export function useNILOpportunities() {
  const [opportunities, setOpportunities] = useState<NILOpportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchOpportunities = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: supaError } = await supabase.from('nil_opportunities').select('*').order('created_at', { ascending: false })
      if (supaError) throw new Error(supaError.message)
      setOpportunities((data ?? []).map(o => ({
        id: o.id,
        athlete_name: o.athlete_name,
        brand: o.brand,
        value_cents: o.value_cents ?? 0,
        value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((o.value_cents ?? 0) / 100),
        status: o.status,
      })))
    } catch (e) {
      console.error('useNILOpportunities:', e)
      setError(toError(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOpportunities()
  }, [])

  const addOpportunity = async (opp: Record<string, unknown>) => {
    try {
      const { error: supaError } = await supabase.from('nil_opportunities').insert([opp])
      if (supaError) throw new Error(supaError.message)
      await fetchOpportunities()
      return { success: true }
    } catch (e) {
      console.error('Failed to add opportunity:', e)
      return { success: false, error: errorMessage(e) }
    }
  }

  const updateOpportunity = async (id: string, updates: Record<string, unknown>) => {
    try {
      const { error: supaError } = await supabase.from('nil_opportunities').update(updates).eq('id', id)
      if (supaError) throw new Error(supaError.message)
      await fetchOpportunities()
      return { success: true }
    } catch (e) {
      console.error('Failed to update opportunity:', e)
      return { success: false, error: errorMessage(e) }
    }
  }

  return { opportunities, loading, error, refetch: fetchOpportunities, addOpportunity, updateOpportunity }
}
