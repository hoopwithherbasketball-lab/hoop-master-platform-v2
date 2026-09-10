import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value))
}

function errorMessage(value: unknown): string {
  return value instanceof Error ? value.message : String(value)
}

export interface NILCompany {
  id: string
  name: string
  industry: string
  contact_name: string
  contact_email: string
  website: string
  notes: string
  status: string
}

export function useNILCompanies() {
  const [companies, setCompanies] = useState<NILCompany[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchCompanies = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: supaError } = await supabase.from('nil_companies').select('*').order('name')
      if (supaError) throw new Error(supaError.message)
      setCompanies((data ?? []).map(c => ({
        id: c.id,
        name: c.name,
        industry: c.industry,
        contact_name: c.contact_name,
        contact_email: c.contact_email,
        website: c.website,
        notes: c.notes,
        status: c.status
      })))
    } catch (e) {
      console.error('useNILCompanies:', e)
      setError(toError(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  const addCompany = async (company: Omit<NILCompany, 'id'>) => {
    try {
      const { error: supaError } = await supabase.from('nil_companies').insert([company])
      if (supaError) throw new Error(supaError.message)
      await fetchCompanies()
      return { success: true }
    } catch (e) {
      console.error('Failed to add company:', e)
      return { success: false, error: errorMessage(e) }
    }
  }

  const updateCompany = async (id: string, updates: Partial<Omit<NILCompany, 'id'>>) => {
    try {
      const { error: supaError } = await supabase.from('nil_companies').update(updates).eq('id', id)
      if (supaError) throw new Error(supaError.message)
      await fetchCompanies()
      return { success: true }
    } catch (e) {
      console.error('Failed to update company:', e)
      return { success: false, error: errorMessage(e) }
    }
  }

  return { companies, loading, error, refetch: fetchCompanies, addCompany, updateCompany }
}
