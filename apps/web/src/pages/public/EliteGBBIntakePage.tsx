import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { ChevronLeft, ChevronRight, Check, Loader2, User, Users, Target, BarChart3, BookOpen, Film, Flag, Package, FileSignature } from 'lucide-react'

const STEPS = [
  { id: 1, label: 'Player Info', icon: <User size={14} /> },
  { id: 2, label: 'Parent', icon: <Users size={14} /> },
  { id: 3, label: 'Team', icon: <Users size={14} /> },
  { id: 4, label: 'Stats', icon: <BarChart3 size={14} /> },
  { id: 5, label: 'Self Eval', icon: <Target size={14} /> },
  { id: 6, label: 'Film & Links', icon: <Film size={14} /> },
  { id: 7, label: 'Goals', icon: <Flag size={14} /> },
  { id: 8, label: 'Package', icon: <Package size={14} /> },
  { id: 9, label: 'Consent', icon: <FileSignature size={14} /> },
]

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C']
const currentYear = new Date().getFullYear()
const GRAD_CLASSES = Array.from({ length: 12 }, (_, i) => (currentYear + i).toString())
const LEVELS = ['middle_school', 'jv', 'varsity', 'aau', 'showcase']
const PRIDE_TAGS = ['ball_handling', 'defense', 'leadership', 'scoring', 'passing', 'emotional_control', 'hustle']
const PACKAGES = [
  { id: 'free', name: 'Free Preview', price: 0, features: ['Basic Profile Visible to Coaches', 'View Your Stats', 'Limited Coach Connections'] },
  { id: 'starter', name: 'Starter', price: 99, features: ['Recruiting One-Pager', 'Verified Prospect Badge', 'Full Coach Network Access'] },
  { id: 'development', name: 'Development', price: 199, features: ['Everything in Starter', 'Class Tracking Profile', 'Film Index', 'Analytics Dashboard'] },
  { id: 'elite_track', name: 'Elite Track', price: 399, features: ['Everything in Development', 'Coach Referral Note', 'Mid & End Season Updates', 'Priority Support'] },
]

const initialForm = {
  player_name: '', preferred_name: '', dob: '', grad_class: '', gender: '', school: '', city: '', state: '',
  primary_position: '', secondary_position: '', jersey_number: '', height: '', weight: '',
  parent_name: '', parent_email: '', parent_phone: '', player_email: '',
  level: '', team_names: '', league_region: '',
  games_played: '', ppg: '', apg: '', rpg: '', spg: '', bpg: '', fg_pct: '', three_pct: '', ft_pct: '',
  self_words: '', strength: '', improvement: '', separation: '', adversity_response: '', iq_self_rating: '',
  pride_tags: [] as string[], player_model: '',
  film_links: '', highlight_links: '', instagram_handle: '', other_socials: '',
  goal: '', colleges_interest: '', package_selected: '', consent_eval: false, consent_media: false, guardian_signature: '',
}

export default function EliteGBBIntakePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [resultEmail, setResultEmail] = useState('')

  const update = (field: string, value: string | boolean | string[]) => setForm(prev => ({ ...prev, [field]: value }))
  const togglePrideTag = (tag: string) => setForm(prev => ({
    ...prev,
    pride_tags: prev.pride_tags.includes(tag) ? prev.pride_tags.filter(t => t !== tag) : [...prev.pride_tags, tag],
  }))

  const validate = (): boolean => {
    setError('')
    switch (step) {
      case 1: if (!form.player_name || !form.grad_class || !form.gender || !form.primary_position) { setError('Please fill in Name, Class, Gender, and Position'); return false }; break
      case 2: if (!form.parent_name || !form.parent_email) { setError('Please fill in Parent Name and Email'); return false }; break
      case 8: if (!form.package_selected) { setError('Please select a package'); return false }; break
      case 9: if (!form.consent_eval || !form.consent_media) { setError('Please accept both consent checkboxes'); return false }; if (!form.guardian_signature) { setError('Please provide guardian signature'); return false }; break
    }
    return true
  }

  const next = () => { if (validate()) setStep(s => Math.min(s + 1, 9)) }
  const prev = () => { if (step > 1) setStep(s => s - 1) }

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)
    setError('')

    try {
      const email = form.parent_email.trim()
      const password = Math.random().toString(36).slice(2) + 'A1!'

      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: form.parent_name, player_name: form.player_name } }
      })
      if (authErr) { setError(authErr.message); setSubmitting(false); return }

      const userId = authData.user?.id

      const { data: profileData, error: profileErr } = await supabase.from('player_profiles').upsert({
        user_id: userId,
        first_name: form.player_name.split(' ')[0] || '',
        last_name: form.player_name.split(' ').slice(1).join(' ') || '',
        display_name: form.preferred_name || null,
        grad_class: form.grad_class ? parseInt(form.grad_class) : null,
        position: form.primary_position || null,
        secondary_position: form.secondary_position || null,
        jersey_number: form.jersey_number || null,
        height: form.height || null,
        city: form.city || null,
        state: form.state || null,
        school_name: form.school || null,
        team_name: form.team_names || null,
        instagram_handle: form.instagram_handle || null,
        film_url: form.film_links || null,
        bio: form.self_words || null,
        profile_completion_percent: 100,
        is_public: true,
      }).select('id').single()
      if (profileErr) { setError(profileErr.message); setSubmitting(false); return }

      let orderId: string | null = null
      if (form.package_selected !== 'free') {
        const offerSlug = form.package_selected === 'starter' ? 'starter' : form.package_selected === 'development' ? 'development' : 'elite-track'
        const { data: offer } = await supabase.from('service_offers').select('id').eq('slug', offerSlug).maybeSingle()
        if (offer) {
          const { data: order } = await supabase.from('service_orders').insert({
            service_offer_id: offer.id,
            customer_user_id: userId,
            player_profile_id: profileData.id,
            status: 'awaiting_intake',
            intake_complete: true,
          }).select('id').single()
          if (order) orderId = order.id
        }
      }

      const { error: intakeErr } = await supabase.from('intake_submissions').insert({
        player_name: form.player_name, preferred_name: form.preferred_name, dob: form.dob,
        grad_class: form.grad_class, gender: form.gender, school: form.school,
        city: form.city, state: form.state, primary_position: form.primary_position,
        secondary_position: form.secondary_position, jersey_number: form.jersey_number,
        height: form.height, weight: form.weight,
        parent_name: form.parent_name, parent_email: form.parent_email,
        parent_phone: form.parent_phone, player_email: form.player_email,
        level: form.level, team_names: form.team_names, league_region: form.league_region,
        games_played: form.games_played ? parseInt(form.games_played) : null,
        ppg: form.ppg ? parseFloat(form.ppg) : null, apg: form.apg ? parseFloat(form.apg) : null,
        rpg: form.rpg ? parseFloat(form.rpg) : null, spg: form.spg ? parseFloat(form.spg) : null,
        bpg: form.bpg ? parseFloat(form.bpg) : null,
        fg_pct: form.fg_pct ? parseFloat(form.fg_pct) : null,
        three_pct: form.three_pct ? parseFloat(form.three_pct) : null,
        ft_pct: form.ft_pct ? parseFloat(form.ft_pct) : null,
        self_words: form.self_words, strength: form.strength, improvement: form.improvement,
        separation: form.separation, adversity_response: form.adversity_response,
        iq_self_rating: form.iq_self_rating, pride_tags: form.pride_tags,
        player_model: form.player_model, film_links: form.film_links,
        highlight_links: form.highlight_links, instagram_handle: form.instagram_handle,
        other_socials: form.other_socials, goal: form.goal, colleges_interest: form.colleges_interest,
        package_selected: form.package_selected,
        consent_eval: form.consent_eval, consent_media: form.consent_media,
        guardian_signature: form.guardian_signature,
        player_profile_id: profileData.id,
        service_order_id: orderId,
        auth_user_id: userId,
      })
      if (intakeErr) { setError(intakeErr.message); setSubmitting(false); return }

      setSubmitted(true)
      setResultEmail(email)
    } catch (e) {
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Profile Created!</h1>
            <p className="text-slate-400">We sent a confirmation email to <strong className="text-white">{resultEmail}</strong>. Check your inbox, confirm your email, and log in to access your player dashboard.</p>
            <button onClick={() => navigate('/login')} className="bg-[#0134BD] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#002a80]">Go to Login</button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b]">
      <Navbar />

      <div className="border-b border-white/10 bg-[#0b0b0b] sticky top-16 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
            {STEPS.map(s => (
              <button key={s.id} onClick={() => s.id < step && setStep(s.id)}
                className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  step === s.id ? 'bg-[#0134BD] text-white' :
                  step > s.id ? 'bg-green-500/20 text-green-400 cursor-pointer' :
                  'bg-white/10 text-white/50'
                }`}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-current">
                  {step > s.id ? <Check className="w-3 h-3" /> : s.id}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Player Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Full Name *" value={form.player_name} onChange={v => update('player_name', v)} />
              <InputField label="Preferred Name" value={form.preferred_name} onChange={v => update('preferred_name', v)} />
              <InputField label="Date of Birth" type="date" value={form.dob} onChange={v => update('dob', v)} />
              <SelectField label="Graduation Class *" value={form.grad_class} onChange={v => update('grad_class', v)} options={GRAD_CLASSES} placeholder="Select class" />
              <SelectField label="Gender *" value={form.gender} onChange={v => update('gender', v)} options={['Female', 'Male']} valueMap={{ Female: 'female', Male: 'male' }} placeholder="Select gender" />
              <InputField label="School" value={form.school} onChange={v => update('school', v)} />
              <InputField label="City" value={form.city} onChange={v => update('city', v)} />
              <SelectField label="State" value={form.state} onChange={v => update('state', v)} options={STATES} placeholder="Select state" />
              <SelectField label="Primary Position *" value={form.primary_position} onChange={v => update('primary_position', v)} options={POSITIONS} placeholder="Select position" />
              <SelectField label="Secondary Position" value={form.secondary_position} onChange={v => update('secondary_position', v)} options={POSITIONS} placeholder="Select position" />
              <InputField label="Jersey Number" value={form.jersey_number} onChange={v => update('jersey_number', v)} />
              <InputField label="Height (e.g. 5ft 8in)" value={form.height} onChange={v => update('height', v)} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Parent / Guardian</h2>
            <p className="text-slate-400 text-sm">Your parent email will be used as your login email.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Parent Name *" value={form.parent_name} onChange={v => update('parent_name', v)} />
              <InputField label="Parent Email *" type="email" value={form.parent_email} onChange={v => update('parent_email', v)} />
              <InputField label="Parent Phone" type="tel" value={form.parent_phone} onChange={v => update('parent_phone', v)} />
              <InputField label="Player Email" type="email" value={form.player_email} onChange={v => update('player_email', v)} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Team Context</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField label="Level" value={form.level} onChange={v => update('level', v)} options={LEVELS} labels={{ middle_school: 'Middle School', jv: 'JV', varsity: 'Varsity', aau: 'AAU', showcase: 'Showcase' }} placeholder="Select level" />
              <InputField label="Team Name(s)" value={form.team_names} onChange={v => update('team_names', v)} placeholder="School team, AAU team" />
              <div className="md:col-span-2"><InputField label="League/Region" value={form.league_region} onChange={v => update('league_region', v)} placeholder="e.g., Nike EYBL, AAU Circuit" /></div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Stats Snapshot</h2>
            <p className="text-slate-400">Current season statistics (leave blank if not available)</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <InputField label="Games Played" type="number" value={form.games_played} onChange={v => update('games_played', v)} />
              <InputField label="PPG" type="number" value={form.ppg} onChange={v => update('ppg', v)} />
              <InputField label="APG" type="number" value={form.apg} onChange={v => update('apg', v)} />
              <InputField label="RPG" type="number" value={form.rpg} onChange={v => update('rpg', v)} />
              <InputField label="SPG" type="number" value={form.spg} onChange={v => update('spg', v)} />
              <InputField label="BPG" type="number" value={form.bpg} onChange={v => update('bpg', v)} />
              <InputField label="FG%" type="number" value={form.fg_pct} onChange={v => update('fg_pct', v)} />
              <InputField label="3PT%" type="number" value={form.three_pct} onChange={v => update('three_pct', v)} />
              <InputField label="FT%" type="number" value={form.ft_pct} onChange={v => update('ft_pct', v)} />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Self Evaluation</h2>
            <InputField label="Describe yourself in 3 words" value={form.self_words} onChange={v => update('self_words', v)} placeholder="e.g. Competitive, Focused, Leader" />
            <TextAreaField label="Greatest Strength" value={form.strength} onChange={v => update('strength', v)} placeholder="What's your best attribute on the court?" />
            <TextAreaField label="Area for Improvement" value={form.improvement} onChange={v => update('improvement', v)} placeholder="What are you working to improve?" />
            <TextAreaField label="What Separates You" value={form.separation} onChange={v => update('separation', v)} placeholder="What makes you different from other players?" />
            <SelectField label="How do you respond to adversity?" value={form.adversity_response} onChange={v => update('adversity_response', v)} options={['reset_immediately', 'need_a_moment', 'motivation']} labels={{ reset_immediately: 'Reset Immediately', need_a_moment: 'Need a Moment', motivation: 'Use It as Motivation' }} placeholder="Select response" />
            <SelectField label="Do you consider yourself a high basketball IQ player?" value={form.iq_self_rating} onChange={v => update('iq_self_rating', v)} options={['yes', 'no', 'learning']} labels={{ yes: 'Yes', no: 'No', learning: 'Still Learning' }} placeholder="Select rating" />
            <div><label className="block text-sm font-medium text-gray-300 mb-2">What do you take pride in?</label>
              <div className="flex flex-wrap gap-2">{PRIDE_TAGS.map(tag => (
                <button key={tag} type="button" onClick={() => togglePrideTag(tag)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${form.pride_tags.includes(tag) ? 'bg-[#0134BD] text-white' : 'bg-white/10 text-slate-400 hover:bg-white/15'}`}>{tag.replace('_', ' ').toUpperCase()}</button>
              ))}</div>
            </div>
            <InputField label="Player you model your game after" value={form.player_model} onChange={v => update('player_model', v)} placeholder="e.g. A'ja Wilson" />
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Film & Links</h2>
            <TextAreaField label="Game Film Links (one per line)" value={form.film_links} onChange={v => update('film_links', v)} placeholder="https://youtube.com/..." />
            <TextAreaField label="Highlight Reel Links" value={form.highlight_links} onChange={v => update('highlight_links', v)} />
            <InputField label="Instagram Handle" value={form.instagram_handle} onChange={v => update('instagram_handle', v)} placeholder="@username" />
            <TextAreaField label="Other Social Media" value={form.other_socials} onChange={v => update('other_socials', v)} />
          </div>
        )}

        {step === 7 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Goals</h2>
            <SelectField label="Primary Goal" value={form.goal} onChange={v => update('goal', v)} options={['exposure', 'tracking', 'evaluation', 'media', 'recruiting_prep']} labels={{ exposure: 'Exposure', tracking: 'Tracking', evaluation: 'Evaluation', media: 'Media', recruiting_prep: 'Recruiting Prep' }} placeholder="Select goal" />
            <TextAreaField label="Colleges of Interest" value={form.colleges_interest} onChange={v => update('colleges_interest', v)} />
          </div>
        )}

        {step === 8 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Select Your Package</h2>
            <p className="text-slate-400">Start free and upgrade anytime</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {PACKAGES.map(pkg => (
                <button key={pkg.id} type="button" onClick={() => update('package_selected', pkg.id)} className={`p-5 rounded-xl border-2 text-left transition-all relative ${form.package_selected === pkg.id ? (pkg.id === 'free' ? 'border-purple-500 bg-purple-500/10' : 'border-[#FB6C1D] bg-[#FB6C1D]/10') : 'border-white/10 hover:border-white/30'}`}>
                  {pkg.id === 'free' && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">NO COST</span>}
                  <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                  <p className={`text-2xl font-bold my-2 ${pkg.id === 'free' ? 'text-purple-400' : 'text-[#FB6C1D]'}`}>{pkg.price === 0 ? 'FREE' : `$${pkg.price}`}</p>
                  <ul className="space-y-1 text-xs text-slate-400">{pkg.features.map((f, i) => <li key={i} className="flex items-start gap-1"><Check className={`w-3 h-3 mt-0.5 flex-shrink-0 ${pkg.id === 'free' ? 'text-purple-400' : 'text-[#FB6C1D]'}`} /><span>{f}</span></li>)}</ul>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 9 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Consent & Signature</h2>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.consent_eval} onChange={e => update('consent_eval', e.target.checked)} className="mt-1 w-5 h-5 accent-[#0134BD] rounded" />
              <span className="text-sm text-slate-300">I consent to evaluation services and understand this is informational and not a guarantee of recruiting outcomes.</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.consent_media} onChange={e => update('consent_media', e.target.checked)} className="mt-1 w-5 h-5 accent-[#0134BD] rounded" />
              <span className="text-sm text-slate-300">I consent to the use of player photos, videos, and information for promotional and recruiting purposes.</span>
            </label>
            <InputField label="Guardian Signature (Type full name) *" value={form.guardian_signature} onChange={v => update('guardian_signature', v)} />
            <div className="bg-navy-800 border border-white/10 rounded-xl p-4 text-sm text-slate-400"><p className="font-medium text-white mb-2">Disclaimer</p><p>This evaluation is informational and not a guarantee of recruiting outcomes. Hoop With Her provides player tracking, evaluation, and media services to support the recruiting process but cannot guarantee college placement or scholarship offers.</p></div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-8 border-t border-white/10">
          <button onClick={prev} disabled={step === 1} className="flex items-center gap-2 px-6 py-2 border border-white/20 rounded-lg text-gray-300 font-medium hover:bg-white/5 disabled:opacity-50"><ChevronLeft size={16} /> Previous</button>
          {step < 9 ? (
            <button onClick={next} className="flex items-center gap-2 px-6 py-2 bg-[#0134BD] text-white rounded-lg font-medium hover:bg-[#002a80]">Next <ChevronRight size={16} /></button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium ${form.package_selected === 'free' ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-[#FB6C1D] text-white hover:bg-[#e55a1a]'} disabled:opacity-50`}>
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Creating Profile...</> : <>{form.package_selected === 'free' ? 'Create Free Profile' : 'Submit & Pay'} <Check size={16} /></>}
            </button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

function InputField({ label, type = 'text', value, onChange, placeholder }: { label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <div><label className="block text-sm font-medium text-gray-300 mb-1">{label}</label><input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white text-sm outline-none focus:border-[#0134BD]" /></div>
}

function TextAreaField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <div><label className="block text-sm font-medium text-gray-300 mb-1">{label}</label><textarea value={value} onChange={e => onChange(e.target.value)} rows={3} placeholder={placeholder} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white text-sm outline-none focus:border-[#0134BD]" /></div>
}

function SelectField({ label, value, onChange, options, placeholder, labels, valueMap }: { label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder?: string; labels?: Record<string, string>; valueMap?: Record<string, string> }) {
  return <div><label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-navy-800 text-white text-sm outline-none focus:border-[#0134BD]">
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o} value={valueMap?.[o] || o}>{labels?.[o] || o}</option>)}
    </select></div>
}

const STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']
