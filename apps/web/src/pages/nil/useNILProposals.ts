import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'

export const proposalStatuses = [
  'Draft',
  'Sent',
  'Viewed',
  'Accepted',
  'Declined',
] as const
export type ProposalStatus = (typeof proposalStatuses)[number]
export interface NILProposalDetails {
  source: 'nil-hub'
  title: string
  company_id: string | null
  recipient: string
  athlete_name: string
  amount: number
  deliverables: string
  notes: string
}
export interface NILProposal {
  id: string
  status: ProposalStatus
  package_details: NILProposalDetails
  created_at: string
}
export const emptyProposal: NILProposalDetails = {
  source: 'nil-hub',
  title: '',
  company_id: null,
  recipient: '',
  athlete_name: '',
  amount: 0,
  deliverables: '',
  notes: '',
}
const PAGE_SIZE = 12

export function useNILProposals(page: number, status: string) {
  const [proposals, setProposals] = useState<NILProposal[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const request = useRef(0)
  const refetch = useCallback(async () => {
    const current = ++request.current
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('proposals')
        .select('id,status,package_details,created_at', { count: 'exact' })
        .eq('package_details->>source', 'nil-hub')
      if (status) query = query.eq('status', status)
      const result = await query
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
      if (result.error) throw new Error(result.error.message)
      if (current !== request.current) return
      setProposals(result.data ?? [])
      setTotal(result.count ?? 0)
    } catch {
      if (current === request.current)
        setError(
          'Proposals could not be loaded. Check your connection and try again.'
        )
    } finally {
      if (current === request.current) setLoading(false)
    }
  }, [page, status])
  useEffect(() => {
    void refetch()
    return () => {
      request.current++
    }
  }, [refetch])

  async function save(
    details: NILProposalDetails,
    status: ProposalStatus,
    id?: string
  ) {
    // NIL brands belong in package_details. Never assign their IDs to the CRM partner foreign key.
    const payload = { status, package_details: details }
    const query = id
      ? supabase
          .from('proposals')
          .update(payload)
          .eq('id', id)
          .eq('package_details->>source', 'nil-hub')
      : supabase.from('proposals').insert(payload)
    const result = await query.select('id').single()
    if (result.error || !result.data)
      throw new Error(
        'Your proposal was not saved. Please try again. If the issue continues, check your account permissions.'
      )
    await refetch()
    return result.data.id as string
  }
  return {
    proposals,
    total,
    loading,
    error,
    refetch,
    save,
    pageSize: PAGE_SIZE,
  }
}
