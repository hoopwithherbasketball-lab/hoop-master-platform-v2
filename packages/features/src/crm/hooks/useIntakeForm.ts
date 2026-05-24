import { useState } from 'react'
import { supabase } from '@hoop-master/supabase'
import { useAuth } from '../contexts/AuthContextValue.js'

export interface IntakeFormData {
  player_name: string
  preferred_name: string
  dob: string
  grad_class: string
  gender: string
  school: string
  city: string
  state: string
  primary_position: string
  secondary_position: string
  jersey_number: string
  height: string
  weight: string
  parent_name: string
  parent_email: string
  parent_phone: string
  player_email: string
  level: string
  team_names: string
  ppg: string
  apg: string
  rpg: string
  spg: string
  bpg: string
  fg_pct: string
  three_pct: string
  ft_pct: string
  strength: string
  improvement: string
  separation: string
  self_words: string
  adversity_response: string
  iq_self_rating: string
  pride_tags: string[]
  player_model: string
  film_links: string
  highlight_links: string
  instagram_handle: string
  other_socials: string
  goal: string
  colleges_interest: string
  package_selected: string
}

const INITIAL: IntakeFormData = {
  player_name: '', preferred_name: '', dob: '', grad_class: '', gender: '', school: '', city: '', state: '',
  primary_position: '', secondary_position: '', jersey_number: '', height: '', weight: '',
  parent_name: '', parent_email: '', parent_phone: '', player_email: '',
  level: '', team_names: '',
  ppg: '', apg: '', rpg: '', spg: '', bpg: '', fg_pct: '', three_pct: '', ft_pct: '',
  strength: '', improvement: '', separation: '', self_words: '', adversity_response: '', iq_self_rating: '',
  pride_tags: [], player_model: '',
  film_links: '', highlight_links: '', instagram_handle: '', other_socials: '',
  goal: '', colleges_interest: '', package_selected: 'free',
}

export function useIntakeForm() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<IntakeFormData>(INITIAL)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const totalSteps = 9
  const { user } = useAuth()

  const update = (field: keyof IntakeFormData, value: string | string[]) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const togglePrideTag = (tag: string) => {
    setData(prev => ({
      ...prev,
      pride_tags: prev.pride_tags.includes(tag) ? prev.pride_tags.filter(t => t !== tag) : [...prev.pride_tags, tag],
    }))
  }

  const next = () => setStep(s => Math.min(s + 1, totalSteps))
  const prev = () => setStep(s => Math.max(s - 1, 1))

  const submit = async () => {
    setSubmitting(true)
    setError('')

    try {
      const { error: err } = await supabase.from('player_profiles').upsert({
        user_id: user?.id,
        first_name: data.player_name.split(' ')[0] || '',
        last_name: data.player_name.split(' ').slice(1).join(' ') || '',
        display_name: data.preferred_name || null,
        class_year: data.grad_class ? parseInt(data.grad_class) : null,
        position: data.primary_position || null,
        secondary_position: data.secondary_position || null,
        jersey_number: data.jersey_number || null,
        height: data.height || null,
        city: data.city || null,
        state: data.state || null,
        school_name: data.school || null,
        team_name: data.team_names || null,
        instagram_handle: data.instagram_handle || null,
        film_url: data.film_links || null,
        bio: data.self_words || null,
        profile_completion_percent: 100,
        is_public: true,
      })

      if (err) throw err
      setSubmitting(false)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
      setSubmitting(false)
      return false
    }
  }

  return { step, data, submitting, error, totalSteps, update, togglePrideTag, next, prev, submit }
}
