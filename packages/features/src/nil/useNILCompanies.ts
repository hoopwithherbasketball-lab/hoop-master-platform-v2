import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'

export interface NILCompany {
  id: string
  name: string
  category: string
  stage: string
}

export function useNILCompanies() {
  const [companies, setCompanies] = useState<NILCompany[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await supabase.from('nil_companies').select('*').order('name')
        setCompanies((data ?? []).map(c => ({ id: c.id, name: c.name, category: c.category, stage: c.stage })))
      } catch (e) { console.error('useNILCompanies:', e) }
      setLoading(false)
    }
    fetch()
  }, [])

  return { companies, loading }
}
