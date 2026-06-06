import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'

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

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await supabase.from('nil_companies').select('*').order('name')
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
      } catch (e) { console.error('useNILCompanies:', e) }
      setLoading(false)
    }
    fetch()
  }, [])

  return { companies, loading }
}
