import { FormEvent, useEffect, useState } from 'react'
import { useCurrentUserProfile } from '../../lib/auth'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Loader2, Save, UserRound } from 'lucide-react'

interface ProfileFormState {
  first_name: string
  last_name: string
  display_name: string
  class_year: string
  position: string
  secondary_position: string
  height: string
  city: string
  state: string
  school_name: string
  team_name: string
  jersey_number: string
  gpa: string
  bio: string
  coach_name: string
  coach_email: string
  instagram_handle: string
  twitter_handle: string
  film_url: string
  is_public: boolean
}

const EMPTY_FORM: ProfileFormState = {
  first_name: '',
  last_name: '',
  display_name: '',
  class_year: '',
  position: '',
  secondary_position: '',
  height: '',
  city: '',
  state: '',
  school_name: '',
  team_name: '',
  jersey_number: '',
  gpa: '',
  bio: '',
  coach_name: '',
  coach_email: '',
  instagram_handle: '',
  twitter_handle: '',
  film_url: '',
  is_public: false,
}

function toNullableString(value: string) {
  const trimmed = value.trim()
  return trimmed.length ? trimmed : null
}

function toNullableNumber(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return null
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

export default function ProfilePage() {
  const { profile, loading, error, updateProfile } = useCurrentUserProfile()
  const [form, setForm] = useState<ProfileFormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!profile) return
    setForm({
      first_name: profile.first_name ?? '',
      last_name: profile.last_name ?? '',
      display_name: profile.display_name ?? '',
      class_year: profile.class_year ? String(profile.class_year) : '',
      position: profile.position ?? '',
      secondary_position: profile.secondary_position ?? '',
      height: profile.height ?? '',
      city: profile.city ?? '',
      state: profile.state ?? '',
      school_name: profile.school_name ?? '',
      team_name: profile.team_name ?? '',
      jersey_number: profile.jersey_number ?? '',
      gpa: profile.gpa ? String(profile.gpa) : '',
      bio: profile.bio ?? '',
      coach_name: profile.coach_name ?? '',
      coach_email: profile.coach_email ?? '',
      instagram_handle: profile.instagram_handle ?? '',
      twitter_handle: profile.twitter_handle ?? '',
      film_url: profile.film_url ?? '',
      is_public: profile.is_public ?? false,
    })
  }, [profile])

  function updateField<K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) {
    setMessage(null)
    setForm(current => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      if (!form.first_name.trim() || !form.last_name.trim()) {
        throw new Error('First and last name are required.')
      }

      await updateProfile({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        display_name: toNullableString(form.display_name),
        class_year: toNullableNumber(form.class_year),
        position: toNullableString(form.position),
        secondary_position: toNullableString(form.secondary_position),
        height: toNullableString(form.height),
        city: toNullableString(form.city),
        state: toNullableString(form.state),
        school_name: toNullableString(form.school_name),
        team_name: toNullableString(form.team_name),
        jersey_number: toNullableString(form.jersey_number),
        gpa: toNullableNumber(form.gpa),
        bio: toNullableString(form.bio),
        coach_name: toNullableString(form.coach_name),
        coach_email: toNullableString(form.coach_email),
        instagram_handle: toNullableString(form.instagram_handle),
        twitter_handle: toNullableString(form.twitter_handle),
        film_url: toNullableString(form.film_url),
        is_public: form.is_public,
      })
      setMessage('Profile saved successfully.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to save profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout variant="player" title="My Profile" subtitle="Loading your recruiting profile...">
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-slate-400" /></div>
      </DashboardLayout>
    )
  }

  const completion = profile?.profile_completion_percent ?? 0

  return (
    <DashboardLayout variant="player" title="My Profile" subtitle="Keep your public recruiting profile accurate and coach-ready.">
      <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <section className="card p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-brand-orange/15 p-3 text-brand-orange"><UserRound size={22} /></div>
              <div>
                <h2 className="text-lg font-bold text-white">Player basics</h2>
                <p className="text-sm text-slate-500">Core information appears across player dashboards and coach-facing surfaces.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="First name" value={form.first_name} onChange={value => updateField('first_name', value)} required />
              <Field label="Last name" value={form.last_name} onChange={value => updateField('last_name', value)} required />
              <Field label="Display name" value={form.display_name} onChange={value => updateField('display_name', value)} />
              <Field label="Class year" value={form.class_year} onChange={value => updateField('class_year', value)} inputMode="numeric" />
              <Field label="Primary position" value={form.position} onChange={value => updateField('position', value)} />
              <Field label="Secondary position" value={form.secondary_position} onChange={value => updateField('secondary_position', value)} />
              <Field label="Height" value={form.height} onChange={value => updateField('height', value)} placeholder="5 ft 9 in" />
              <Field label="Jersey number" value={form.jersey_number} onChange={value => updateField('jersey_number', value)} />
            </div>
          </section>

          <aside className="card p-6">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Profile completion</p>
            <p className="mt-3 font-display text-5xl font-black text-white">{completion}%</p>
            <div className="mt-4 h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-brand-orange" style={{ width: `${Math.min(100, completion)}%` }} />
            </div>
            <label className="mt-6 flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
              <input type="checkbox" checked={form.is_public} onChange={event => updateField('is_public', event.target.checked)} className="mt-1" />
              <span><strong className="block text-white">Make profile public</strong>Allow approved coach-facing pages to show non-private profile details.</span>
            </label>
            <p className="mt-4 text-xs text-slate-500">Private evaluation notes and parent contact details are not shown here.</p>
          </aside>
        </div>

        <section className="card p-6">
          <h2 className="text-lg font-bold text-white">School and team</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="School" value={form.school_name} onChange={value => updateField('school_name', value)} />
            <Field label="Team / club" value={form.team_name} onChange={value => updateField('team_name', value)} />
            <Field label="City" value={form.city} onChange={value => updateField('city', value)} />
            <Field label="State" value={form.state} onChange={value => updateField('state', value)} />
            <Field label="GPA" value={form.gpa} onChange={value => updateField('gpa', value)} inputMode="decimal" />
            <Field label="Coach name" value={form.coach_name} onChange={value => updateField('coach_name', value)} />
            <Field label="Coach email" value={form.coach_email} onChange={value => updateField('coach_email', value)} type="email" />
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-lg font-bold text-white">Recruiting media</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Film URL" value={form.film_url} onChange={value => updateField('film_url', value)} type="url" />
            <Field label="Instagram handle" value={form.instagram_handle} onChange={value => updateField('instagram_handle', value)} />
            <Field label="X / Twitter handle" value={form.twitter_handle} onChange={value => updateField('twitter_handle', value)} />
          </div>
          <label className="mt-4 block text-sm">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Bio</span>
            <textarea value={form.bio} onChange={event => updateField('bio', event.target.value)} rows={5} className="w-full rounded-xl border border-white/10 bg-navy-900 px-3 py-2 text-white outline-none focus:border-brand-orange" placeholder="Share your playing style, goals, and what coaches should know." />
          </label>
        </section>

        {(message || error) && <p className={`rounded-xl px-4 py-3 text-sm ${message?.includes('success') ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>{message ?? error}</p>}

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-5 py-3 text-sm font-bold text-white hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save profile
          </button>
        </div>
      </form>
    </DashboardLayout>
  )
}

function Field({ label, value, onChange, type = 'text', required = false, placeholder, inputMode }: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
  placeholder?: string
  inputMode?: 'text' | 'numeric' | 'decimal' | 'email' | 'url'
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">{label}{required && <span className="text-brand-orange"> *</span>}</span>
      <input
        value={value}
        onChange={event => onChange(event.target.value)}
        type={type}
        required={required}
        placeholder={placeholder}
        inputMode={inputMode}
        className="w-full rounded-xl border border-white/10 bg-navy-900 px-3 py-2 text-white outline-none focus:border-brand-orange"
      />
    </label>
  )
}
