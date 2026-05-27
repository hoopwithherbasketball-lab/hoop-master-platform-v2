import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'

export interface NILOpportunity {
  id: string
  athlete_name: string
  brand: string
  value: string
  status: string
}

export function useNILOpportunities() {
  const [opportunities, setOpportunities] = useState<NILOpportunity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await supabase.from('nil_opportunities').select('*').order('created_at', { ascending: false })
        setOpportunities((data ?? []).map(o => ({
          id: o.id,
          athlete_name: o.athlete_name,
          brand: o.brand,
          value: `$${(o.value_cents / 100).toLocaleString()}`,
          status: o.status,
        })))
      } catch (e) { console.error('useNILOpportunities:', e) }
      setLoading(false)
    }
    fetch()
  }, [])

  return { opportunities, loading }
}
