import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useIntakeForm } from '@hoop-master/features/crm'
import DashboardLayout from '../../components/layout/DashboardLayout'

const STEPS = ['Player Info', 'Parent', 'Team', 'Stats', 'Self Eval', 'Film & Links', 'Goals', 'Package', 'Consent']
const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C']
const LEVELS = ['middle_school', 'jv', 'varsity', 'aau', 'showcase']
const PRIDE_TAGS = ['ball_handling', 'defense', 'leadership', 'scoring', 'passing', 'emotional_control', 'hustle']
const PACKAGES = [
  { id: 'free', name: 'Free Preview', price: 0, features: ['Basic Profile', 'View Stats', 'Limited Coach Connections'] },
  { id: 'starter', name: 'Starter', price: 99, features: ['Recruiting One-Pager', 'Verified Prospect Badge', 'Full Coach Network'] },
  { id: 'development', name: 'Development', price: 199, features: ['Everything in Starter', 'Class Tracking Profile', 'Film Index', 'Analytics'] },
  { id: 'elite_track', name: 'Elite Track', price: 399, features: ['Everything in Development', 'Coach Referral Note', 'Season Updates', 'Priority Support'] },
]
const currentYear = new Date().getFullYear()
const GRAD_CLASSES = Array.from({ length: 12 }, (_, i) => (currentYear + i).toString())

export default function IntakeFormPage() {
  const navigate = useNavigate()
  const { step, data, submitting, totalSteps, update, togglePrideTag, next, prev, submit } = useIntakeForm()

  const handleSubmit = async () => {
    const ok = await submit()
    if (ok) navigate('/dashboard')
  }

  return (
    <DashboardLayout variant="player" title="Player Intake" subtitle="Complete your player profile">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {STEPS.map((label, i) => (
            <div key={label} className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${i + 1 === step ? 'bg-[#0134BD] text-white' : i + 1 < step ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-400'}`}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border border-current">{i + 1}</span>
              <span className="hidden sm:inline">{label}</span>
            </div>
          ))}
        </div>

        <div className="bg-navy-800 rounded-lg shadow-md p-6 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Player Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Full Name *" value={data.player_name} onChange={v => update('player_name', v)} />
                <InputField label="Preferred Name" value={data.preferred_name} onChange={v => update('preferred_name', v)} />
                <InputField label="Date of Birth" type="date" value={data.dob} onChange={v => update('dob', v)} />
                <SelectField label="Graduation Class *" value={data.grad_class} onChange={v => update('grad_class', v)} options={GRAD_CLASSES.map(g => ({ value: g, label: g }))} placeholder="Select class" />
                <SelectField label="Gender *" value={data.gender} onChange={v => update('gender', v)} options={[{ value: 'female', label: 'Female' }, { value: 'male', label: 'Male' }]} placeholder="Select gender" />
                <InputField label="School" value={data.school} onChange={v => update('school', v)} />
                <InputField label="City" value={data.city} onChange={v => update('city', v)} />
                <SelectField label="State" value={data.state} onChange={v => update('state', v)} options={STATES.map(s => ({ value: s, label: s }))} placeholder="Select state" />
                <SelectField label="Primary Position *" value={data.primary_position} onChange={v => update('primary_position', v)} options={POSITIONS.map(p => ({ value: p, label: p }))} placeholder="Select position" />
                <SelectField label="Secondary Position" value={data.secondary_position} onChange={v => update('secondary_position', v)} options={POSITIONS.map(p => ({ value: p, label: p }))} placeholder="Select position" />
                <InputField label="Jersey Number" value={data.jersey_number} onChange={v => update('jersey_number', v)} />
                <InputField label="Height (e.g. 5ft 8in)" value={data.height} onChange={v => update('height', v)} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Parent / Guardian</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Parent Name *" value={data.parent_name} onChange={v => update('parent_name', v)} />
                <InputField label="Parent Email *" type="email" value={data.parent_email} onChange={v => update('parent_email', v)} />
                <InputField label="Parent Phone" type="tel" value={data.parent_phone} onChange={v => update('parent_phone', v)} />
                <InputField label="Player Email" type="email" value={data.player_email} onChange={v => update('player_email', v)} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Team Context</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField label="Level" value={data.level} onChange={v => update('level', v)} options={LEVELS.map(l => ({ value: l, label: l.replace('_', ' ').toUpperCase() }))} placeholder="Select level" />
                <InputField label="Team Name(s)" value={data.team_names} onChange={v => update('team_names', v)} placeholder="School team, AAU team" />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Stats Snapshot</h2>
              <p className="text-slate-400">Current season statistics (leave blank if not available)</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <InputField label="PPG" type="number" value={data.ppg} onChange={v => update('ppg', v)} />
                <InputField label="APG" type="number" value={data.apg} onChange={v => update('apg', v)} />
                <InputField label="RPG" type="number" value={data.rpg} onChange={v => update('rpg', v)} />
                <InputField label="SPG" type="number" value={data.spg} onChange={v => update('spg', v)} />
                <InputField label="BPG" type="number" value={data.bpg} onChange={v => update('bpg', v)} />
                <InputField label="FG%" type="number" value={data.fg_pct} onChange={v => update('fg_pct', v)} />
                <InputField label="3PT%" type="number" value={data.three_pct} onChange={v => update('three_pct', v)} />
                <InputField label="FT%" type="number" value={data.ft_pct} onChange={v => update('ft_pct', v)} />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Self Evaluation</h2>
              <InputField label="Describe yourself in 3 words" value={data.self_words} onChange={v => update('self_words', v)} placeholder="e.g. Competitive, Focused, Leader" />
              <TextAreaField label="Greatest Strength" value={data.strength} onChange={v => update('strength', v)} />
              <TextAreaField label="Area for Improvement" value={data.improvement} onChange={v => update('improvement', v)} />
              <TextAreaField label="What Separates You" value={data.separation} onChange={v => update('separation', v)} />
              <SelectField label="Adversity Response" value={data.adversity_response} onChange={v => update('adversity_response', v)} options={[{ value: 'reset_immediately', label: 'Reset Immediately' }, { value: 'need_a_moment', label: 'Need a Moment' }, { value: 'motivation', label: 'Use It as Motivation' }]} placeholder="Select response" />
              <SelectField label="Basketball IQ" value={data.iq_self_rating} onChange={v => update('iq_self_rating', v)} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'learning', label: 'Still Learning' }]} placeholder="Select rating" />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">What do you take pride in?</label>
                <div className="flex flex-wrap gap-2">
                  {PRIDE_TAGS.map(tag => (
                    <button key={tag} type="button" onClick={() => togglePrideTag(tag)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${data.pride_tags.includes(tag) ? 'bg-[#0134BD] text-white' : 'bg-white/10 text-slate-400 hover:bg-white/15'}`}>{tag.replace('_', ' ').toUpperCase()}</button>
                  ))}
                </div>
              </div>
              <InputField label="Player you model your game after" value={data.player_model} onChange={v => update('player_model', v)} placeholder="e.g. A'ja Wilson" />
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Film & Links</h2>
              <TextAreaField label="Game Film Links (one per line)" value={data.film_links} onChange={v => update('film_links', v)} />
              <TextAreaField label="Highlight Reel Links" value={data.highlight_links} onChange={v => update('highlight_links', v)} />
              <InputField label="Instagram Handle" value={data.instagram_handle} onChange={v => update('instagram_handle', v)} placeholder="@username" />
              <TextAreaField label="Other Social Media" value={data.other_socials} onChange={v => update('other_socials', v)} />
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Goals</h2>
              <SelectField label="Primary Goal" value={data.goal} onChange={v => update('goal', v)} options={[{ value: 'exposure', label: 'Exposure' }, { value: 'tracking', label: 'Tracking' }, { value: 'evaluation', label: 'Evaluation' }, { value: 'media', label: 'Media' }, { value: 'recruiting_prep', label: 'Recruiting Prep' }]} placeholder="Select goal" />
              <TextAreaField label="Colleges of Interest" value={data.colleges_interest} onChange={v => update('colleges_interest', v)} />
            </div>
          )}

          {step === 8 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Select Your Package</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {PACKAGES.map(pkg => (
                  <button key={pkg.id} type="button" onClick={() => update('package_selected', pkg.id)} className={`p-5 rounded-xl border-2 text-left transition-all ${data.package_selected === pkg.id ? 'border-[#0134BD] bg-blue-500/10' : 'border-white/10 hover:border-gray-300'}`}>
                    <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                    <p className={`text-2xl font-bold my-2 ${pkg.id === 'free' ? 'text-purple-600' : 'text-[#FB6C1D]'}`}>{pkg.price === 0 ? 'FREE' : `$${pkg.price}`}</p>
                    <ul className="space-y-1 text-sm text-slate-400">{pkg.features.map(f => <li key={f} className="flex items-center gap-1"><span className="text-[#0134BD]">✓</span>{f}</li>)}</ul>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 9 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Consent & Signature</h2>
              <label className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 w-5 h-5 text-[#0134BD] border-white/20 rounded" />
                <span className="text-sm text-gray-300">I consent to evaluation services and understand this is informational and not a guarantee of recruiting outcomes.</span>
              </label>
              <label className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 w-5 h-5 text-[#0134BD] border-white/20 rounded" />
                <span className="text-sm text-gray-300">I consent to the use of player photos, videos, and information for promotional and recruiting purposes.</span>
              </label>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <button onClick={prev} disabled={step === 1} className="px-6 py-2 border border-white/20 rounded-lg text-gray-300 font-medium hover:bg-white/5 disabled:opacity-50">← Previous</button>
          {step < totalSteps ? (
            <button onClick={next} className="px-6 py-2 bg-[#0134BD] text-white rounded-lg font-medium hover:bg-[#002a80]">Next →</button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} className="px-6 py-2 bg-[#FB6C1D] text-white rounded-lg font-medium hover:bg-[#e55a1a] disabled:opacity-50">{submitting ? 'Submitting...' : 'Submit & Pay'}</button>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

function InputField({ label, type = 'text', value, onChange, placeholder }: { label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <div><label className="block text-sm font-medium text-gray-300 mb-1">{label}</label><input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full p-2 border border-white/20 rounded-md focus:ring-[#0134BD] focus:border-[#0134BD]" /></div>
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <div><label className="block text-sm font-medium text-gray-300 mb-1">{label}</label><textarea value={value} onChange={e => onChange(e.target.value)} rows={3} className="w-full p-2 border border-white/20 rounded-md focus:ring-[#0134BD] focus:border-[#0134BD]" /></div>
}

function SelectField({ label, value, onChange, options, placeholder }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string }) {
  return <div><label className="block text-sm font-medium text-gray-300 mb-1">{label}</label><select value={value} onChange={e => onChange(e.target.value)} className="w-full p-2 border border-white/20 rounded-md focus:ring-[#0134BD] focus:border-[#0134BD]">{placeholder && <option value="">{placeholder}</option>}{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
}

const STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']
