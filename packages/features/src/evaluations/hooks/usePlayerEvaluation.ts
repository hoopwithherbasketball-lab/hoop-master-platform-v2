import { useEffect, useState, useCallback } from 'react'
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
  overall: string
  projection: string
  categories: EvalCategory[]
  scoutNotes: string
  recommendation: string
  evalDate: string
  evaluator: string
}

export function usePlayerEvaluation(playerId: string) {
  const [evaluation, setEvaluation] = useState<PlayerEvaluation | null>(null)
  const [loading, setLoading] = useState(true)
  const [refetchIndex, setRefetchIndex] = useState(0)

  const triggerRefetch = useCallback(() => {
    setRefetchIndex(prev => prev + 1)
  }, [])

  useEffect(() => {
    if (!playerId) return

    const abortController = new AbortController()

    const fetch = async () => {
      try {
        setLoading(true)
        const { data: profileData } = await supabase
          .from('player_profiles')
          .select('first_name, last_name, position, class_year, school_name, height')
          .eq('id', playerId)
          .maybeSingle()

        if (abortController.signal.aborted) return

        // Get the latest coach evaluation for the player
        const { data: latestEvaluation } = await supabase
          .from('coach_evaluations')
          .select('*')
          .eq('player_profile_id', playerId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (abortController.signal.aborted) return

        const fn = profileData?.first_name ?? ''
        const ln = profileData?.last_name ?? ''

        const cats: EvalCategory[] = []
        if (latestEvaluation) {
          cats.push({ label: 'Athleticism', score: latestEvaluation.athleticism_score, notes: '' })
          cats.push({ label: 'Skill', score: latestEvaluation.skill_score, notes: '' })
          cats.push({ label: 'IQ', score: latestEvaluation.iq_score, notes: '' })
          cats.push({ label: 'Character', score: latestEvaluation.character_score, notes: '' })
          cats.push({ label: 'Academics', score: latestEvaluation.academics_score, notes: '' })
        }

        setEvaluation({
          playerId,
          playerName: `${fn} ${ln}`.trim() || 'Unknown',
          position: profileData?.position ?? '',
          gradClass: profileData?.class_year ? String(profileData.class_year) : '',
          school: profileData?.school_name ?? '',
          height: profileData?.height ?? '',
          overall: latestEvaluation?.overall_grade ?? 'N/A',
          projection: latestEvaluation ? `Rec: ${latestEvaluation.recommendation}` : 'Awaiting evaluation',
          categories: cats,
          scoutNotes: latestEvaluation?.notes ?? 'No evaluation notes yet.',
          recommendation: latestEvaluation?.recommendation ?? '',
          evalDate: latestEvaluation?.created_at ? latestEvaluation.created_at.slice(0, 10) : '',
          evaluator: latestEvaluation?.coach_id ?? 'Staff',
        })
      } catch (e) {
        console.error('usePlayerEvaluation:', e)
      } finally {
        setLoading(false)
      }
    }
    fetch()

    return () => abortController.abort()
  }, [playerId, refetchIndex])

  const submitPlayerEvaluation = async (data: {
    overallGrade: string
    athleticismScore: number
    skillScore: number
    iqScore: number
    characterScore: number
    academicsScore: number
    scoutNotes: string
    recommendation: string
    evaluatorId: string
  }) => {
    try {
      const { error } = await supabase
        .from('coach_evaluations')
        .insert({
          coach_id: data.evaluatorId,
          player_profile_id: playerId,
          overall_grade: data.overallGrade,
          athleticism_score: data.athleticismScore,
          skill_score: data.skillScore,
          iq_score: data.iqScore,
          character_score: data.characterScore,
          academics_score: data.academicsScore,
          notes: data.scoutNotes,
          recommendation: data.recommendation,
        })

      if (error) throw error

      triggerRefetch()
      return { success: true }
    } catch (err) {
      console.error('Error submitting evaluation:', err)
      return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
  }

  return {
    evaluation: evaluation ?? {
      playerId,
      playerName: 'Loading...',
      position: '',
      gradClass: '',
      school: '',
      height: '',
      overall: '',
      projection: '',
      categories: [],
      scoutNotes: '',
      recommendation: '',
      evalDate: '',
      evaluator: '',
    },
    loading,
    submitPlayerEvaluation,
  }
}
