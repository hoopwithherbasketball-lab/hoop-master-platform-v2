import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'

export interface NILComplianceItem {
  id: string
  athlete: string
  opportunity: string
  items: string[]
  status: string
}

export function useNILCompliance() {
  const [items, setItems] = useState<NILComplianceItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await supabase.from('nil_compliance_items').select('*').order('created_at', { ascending: false })
        setItems((data ?? []).map(c => ({
          id: c.id,
          athlete: c.athlete_name,
          opportunity: c.opportunity_name,
          items: c.items,
          status: c.status,
        })))
      } catch (e) { console.error('useNILCompliance:', e) }
      setLoading(false)
    }
    fetch()
  }, [])

  return { items, loading }
}
