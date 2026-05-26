import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'

export interface AdminEvalSummary {
  playerId: string
  playerName: string
  position: string
  gradClass: string
  school: string
  overall: number
  evaluator: string
  evalDate: string
  status: 'draft' | 'published' | 'archived'
}

export function useAdminEvaluations() {
  const [evaluations, setEvaluations] = useState<AdminEvalSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, error } = await supabase
          .from('audit_results')
          .select(`
            id,
            total_score,
            created_at,
            created_by,
            readiness_band,
            audit_submissions!inner(
              player_profile_id,
              player_profiles!inner(first_name, last_name, position, class_year, school_name)
            )
          `)
          .order('created_at', { ascending: false })

        if (error) { console.error('useAdminEvaluations error:', error.message); return }
        if (!data) return

        const mapped: AdminEvalSummary[] = data.map((r: any) => {
          const sub = r.audit_submissions ?? {}
          const prof = sub.player_profiles ?? {}
          return {
            playerId: sub.player_profile_id ?? '',
            playerName: `${prof.first_name ?? ''} ${prof.last_name ?? ''}`.trim() || 'Unknown',
            position: prof.position ?? '',
            gradClass: prof.class_year ? String(prof.class_year) : '',
            school: prof.school_name ?? '',
            overall: r.total_score ?? 0,
            evaluator: r.created_by ? r.created_by.slice(0, 8) : 'Staff',
            evalDate: r.created_at ? r.created_at.slice(0, 10) : '',
            status: (r.readiness_band === 'complete' ? 'published' : 'draft') as 'draft' | 'published' | 'archived',
          }
        })
        setEvaluations(mapped)
      } catch (e) { console.error('useAdminEvaluations exception:', e) }
      setLoading(false)
    }
    fetch()
  }, [])

  return { evaluations, loading }
}
