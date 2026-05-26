import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@hoop-master/supabase'
import type { Database } from '@hoop-master/types'

type LeadRow = Database['public']['Tables']['leads']['Row']

export interface LeadDisplay {
  id: string
  name: string
  email: string | null
  interest: string | null
  source: string | null
  status: string
  date: string
}

const STATUSES = ['new', 'contacted', 'qualified', 'booked', 'won', 'nurture', 'lost']

function formatDate(iso: string): string {
  if (!iso) return ''
  return iso.slice(0, 10)
}

export function useAdminLeads() {
  const [allLeads, setAllLeads] = useState<LeadDisplay[]>([])
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
      if (error) { console.error('useAdminLeads error:', error.message); return }
      if (data) {
        setAllLeads(data.map((r: LeadRow) => ({
          id: r.id,
          name: `${r.first_name ?? ''} ${r.last_name ?? ''}`.trim() || 'Unknown',
          email: r.email,
          interest: r.interest,
          source: r.source,
          status: r.status,
          date: formatDate(r.created_at),
        })))
      }
    }
    fetch()
  }, [])

  const filtered = useMemo(() => allLeads.filter(l => {
    if (statusFilter && l.status !== statusFilter) return false
    if (searchQuery && !l.name.toLowerCase().includes(searchQuery.toLowerCase()) && !(l.email ?? '').toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  }), [allLeads, statusFilter, searchQuery])

  return { leads: filtered, allLeads, statusFilter, setStatusFilter, searchQuery, setSearchQuery, statuses: STATUSES }
}
