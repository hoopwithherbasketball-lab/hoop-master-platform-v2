import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'

export interface EvalCategory {
  label: string
  score: number
  notes: string
}

export interface PlayerEvaluation {
  playerId: string
  playerName: string
  position: string
  gradClass: string
  school: string
  height: string
  overall: number
  projection: string
  categories: EvalCategory[]
  scoutNotes: string
  strengths: string[]
  areasToImprove: string[]
  comparablePlayer: string
  evalDate: string
  evaluator: string
}

export function usePlayerEvaluation(playerId: string) {
  const [evaluation, setEvaluation] = useState<PlayerEvaluation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!playerId) return
    const fetch = async () => {
      try {
        const { data: profileData } = await supabase
          .from('player_profiles')
          .select('first_name, last_name, position, class_year, school_name, height')
          .eq('id', playerId)
          .maybeSingle()

        const { data: submissionData } = await supabase
          .from('audit_submissions')
          .select('id')
          .eq('player_profile_id', playerId)
          .maybeSingle()

        let auditResult: { total_score: number; strengths: string; gaps: string; priority_actions: string; created_at: string; created_by: string } | null = null
        if (submissionData?.id) {
          const r = await supabase
            .from('audit_results')
            .select('total_score, strengths, gaps, priority_actions, created_at, created_by')
            .eq('audit_submission_id', submissionData.id)
            .maybeSingle()
          auditResult = r.data
        }

        const fn = profileData?.first_name ?? ''
        const ln = profileData?.last_name ?? ''

        setEvaluation({
          playerId,
          playerName: `${fn} ${ln}`.trim() || 'Unknown',
          position: profileData?.position ?? '',
          gradClass: profileData?.class_year ? String(profileData.class_year) : '',
          school: profileData?.school_name ?? '',
          height: profileData?.height ?? '',
          overall: auditResult?.total_score ?? 0,
          projection: auditResult ? `Score: ${auditResult.total_score}` : 'Awaiting evaluation',
          categories: [],
          scoutNotes: auditResult?.priority_actions ?? 'No evaluation notes yet.',
          strengths: auditResult?.strengths ? auditResult.strengths.split('\n').filter(Boolean) : [],
          areasToImprove: auditResult?.gaps ? auditResult.gaps.split('\n').filter(Boolean) : [],
          comparablePlayer: '',
          evalDate: auditResult?.created_at ? auditResult.created_at.slice(0, 10) : '',
          evaluator: auditResult?.created_by ? auditResult.created_by.slice(0, 8) : 'Staff',
        })
      } catch (e) { console.error('usePlayerEvaluation:', e) }
      setLoading(false)
    }
    fetch()
  }, [playerId])

  return {
    evaluation: evaluation ?? {
      playerId, playerName: 'Loading...', position: '', gradClass: '', school: '',
      height: '', overall: 0, projection: '', categories: [], scoutNotes: '',
      strengths: [], areasToImprove: [], comparablePlayer: '', evalDate: '', evaluator: '',
    },
    loading,
  }
}
