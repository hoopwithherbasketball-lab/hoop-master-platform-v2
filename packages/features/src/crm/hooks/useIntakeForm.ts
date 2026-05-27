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

const PACKAGE_SLUG_MAP: Record<string, string> = {
  bronze: 'player-dev-bronze',
  silver: 'player-dev-silver',
  gold: 'player-dev-gold',
}

function calcCompletion(data: IntakeFormData): number {
  const fields: (keyof IntakeFormData)[] = [
    'player_name', 'grad_class', 'gender', 'primary_position', 'height',
    'parent_name', 'parent_email', 'parent_phone', 'player_email',
    'school', 'city', 'state',
  ]
  const filled = fields.filter(f => {
    const v = data[f]
    return typeof v === 'string' ? v.trim() !== '' : Array.isArray(v) ? v.length > 0 : true
  }).length
  return Math.round((filled / fields.length) * 100)
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
      const { data: profileData, error: profileErr } = await supabase.from('player_profiles').upsert({
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
        profile_completion_percent: calcCompletion(data),
        is_public: true,
      }).select('id').single()

      if (profileErr) throw profileErr
      const playerProfileId = profileData.id

      let serviceOrderId: string | null = null
      if (data.package_selected !== 'free') {
        const slug = PACKAGE_SLUG_MAP[data.package_selected]
        if (slug) {
          const { data: offer } = await supabase
            .from('service_offers')
            .select('id')
            .eq('slug', slug)
            .maybeSingle()

          if (offer) {
            const { data: orderData, error: orderErr } = await supabase
              .from('service_orders')
              .insert({
                service_offer_id: offer.id,
                player_profile_id: playerProfileId,
                customer_user_id: user?.id || null,
                status: 'new',
              })
              .select('id')
              .single()

            if (!orderErr && orderData) {
              serviceOrderId = orderData.id
            }
          }
        }
      }

      const { error: intakeErr } = await supabase.from('intake_submissions').insert({
        player_name: data.player_name,
        preferred_name: data.preferred_name || null,
        dob: data.dob || null,
        grad_class: data.grad_class || null,
        gender: data.gender || null,
        school: data.school || null,
        city: data.city || null,
        state: data.state || null,
        primary_position: data.primary_position || null,
        secondary_position: data.secondary_position || null,
        jersey_number: data.jersey_number || null,
        height: data.height || null,
        weight: data.weight || null,
        parent_name: data.parent_name || null,
        parent_email: data.parent_email || null,
        parent_phone: data.parent_phone || null,
        player_email: data.player_email || null,
        level: data.level || null,
        team_names: data.team_names || null,
        ppg: data.ppg ? parseFloat(data.ppg) : null,
        apg: data.apg ? parseFloat(data.apg) : null,
        rpg: data.rpg ? parseFloat(data.rpg) : null,
        spg: data.spg ? parseFloat(data.spg) : null,
        bpg: data.bpg ? parseFloat(data.bpg) : null,
        fg_pct: data.fg_pct ? parseFloat(data.fg_pct) : null,
        three_pct: data.three_pct ? parseFloat(data.three_pct) : null,
        ft_pct: data.ft_pct ? parseFloat(data.ft_pct) : null,
        self_words: data.self_words || null,
        strength: data.strength || null,
        improvement: data.improvement || null,
        separation: data.separation || null,
        adversity_response: data.adversity_response || null,
        iq_self_rating: data.iq_self_rating || null,
        pride_tags: data.pride_tags.length > 0 ? data.pride_tags : null,
        player_model: data.player_model || null,
        film_links: data.film_links || null,
        highlight_links: data.highlight_links || null,
        instagram_handle: data.instagram_handle || null,
        other_socials: data.other_socials || null,
        goal: data.goal || null,
        colleges_interest: data.colleges_interest || null,
        package_selected: data.package_selected || 'free',
        player_profile_id: playerProfileId,
        service_order_id: serviceOrderId,
        auth_user_id: user?.id || null,
      })

      if (intakeErr) throw intakeErr

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
