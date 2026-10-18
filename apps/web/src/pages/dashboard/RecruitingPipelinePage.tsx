
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCommunityMembership } from '@hoop-master/features/connectgbb'
import { recruitingPipelineStages, summarizeRecruitingPipeline } from '@hoop-master/features/recruiting'
import type { RecruitingPipelineStage, RecruitingChannel, RecruitingActivityDirection } from '@hoop-master/features/recruiting'
import { useAuth } from '../../lib/auth'
import { supabase } from '../../lib/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'

type Target = {
  id: string
  college_name: string
  division: string
  coach_name: string
  coach_email: string
  source: string
  stage: RecruitingPipelineStage
  next_action: string
  next_action_date: string | null
  created_at: string
}
type Interaction = {
  id: string
  target_id: string
  channel: RecruitingChannel
  direction: RecruitingActivityDirection
  summary: string
  occurred_at: string
}
const divisions = [
  ['unknown','Division not decided'], ['ncaa_d1','NCAA Division I'], ['ncaa_d2','NCAA Division II'],
  ['ncaa_d3','NCAA Division III'], ['naia','NAIA'], ['njcaa','NJCAA'], ['other','Other'],
]
const sources = [
  ['research','Research'], ['email','Email'], ['x','X / Twitter'],
  ['referral','Coach referral'], ['event','Recruiting event'], ['inbound','Coach initiated'], ['other','Other'],
]
const channels: RecruitingChannel[] = ['email','x','text','phone','event','referral','other']
const directions: RecruitingActivityDirection[] = ['outbound','inbound','in_person']
const inputClass = 'w-full rounded-lg border border-white/20 bg-navy-900 text-white p-2.5 text-sm'
const todayLocal = () => {
  const d = new Date()
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-')
}

export default function RecruitingPipelinePage() {
  const { user } = useAuth()
  const { canAccessCommunity, loading: membershipLoading } = useCommunityMembership()
  const [profileId, setProfileId] = useState<string | null>(null)
  const [targets, setTargets] = useState<Target[]>([])
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [activeTargetId, setActiveTargetId] = useState('')
  const [editingId, setEditingId] = useState('')
  const [editAction, setEditAction] = useState('')
  const [editDate, setEditDate] = useState('')
  const [targetForm, setTargetForm] = useState({
    college_name: '', division: 'unknown', coach_name: '', coach_email: '',
    source: 'research', next_action: '', next_action_date: '',
  })
  const [activityForm, setActivityForm] = useState({
    channel: 'email' as RecruitingChannel, direction: 'outbound' as RecruitingActivityDirection, summary: '',
  })

  const reload = useCallback(async () => {
    if (!user?.id || !canAccessCommunity) return
    setError('')
    setLoading(true)
    const profile = await supabase.from('player_profiles').select('id').eq('user_id', user.id).limit(1).maybeSingle()
    if (profile.error) { setError(profile.error.message); setLoading(false); return }
    const pid = profile.data?.id ?? null
    setProfileId(pid)
    if (!pid) { setTargets([]); setInteractions([]); setLoading(false); return }
    const [targetResult, activityResult] = await Promise.all([
      supabase.from('recruiting_targets').select('*').eq('owner_user_id', user.id).eq('player_profile_id', pid).order('created_at', { ascending: false }).limit(500),
      supabase.from('recruiting_interactions').select('*').eq('owner_user_id', user.id).order('occurred_at', { ascending: false }).limit(1000),
    ])
    if (targetResult.error || activityResult.error) {
      setError(targetResult.error?.message || activityResult.error?.message || 'Could not load recruiting records.')
    } else {
      setTargets((targetResult.data ?? []) as Target[])
      setInteractions((activityResult.data ?? []) as Interaction[])
    }
    setLoading(false)
  }, [user?.id, canAccessCommunity])

  useEffect(() => { void reload() }, [reload])
  const summary = useMemo(
    () => summarizeRecruitingPipeline(targets, interactions, todayLocal()),
    [targets, interactions],
  )
  const activeTarget = targets.find(t => t.id === activeTargetId)
  const activeHistory = interactions.filter(a => a.target_id === activeTargetId)

  async function createTarget(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user?.id || !profileId || !targetForm.college_name.trim()) return
    setError(''); setNotice(''); setBusy(true)
    const { error: insertError } = await supabase.from('recruiting_targets').insert({
      owner_user_id: user.id,
      player_profile_id: profileId,
      college_name: targetForm.college_name.trim(),
      division: targetForm.division,
      coach_name: targetForm.coach_name.trim(),
      coach_email: targetForm.coach_email.trim(),
      source: targetForm.source,
      next_action: targetForm.next_action.trim(),
      next_action_date: targetForm.next_action_date || null,
    })
    setBusy(false)
    if (insertError) { setError(insertError.message); return }
    setTargetForm({ college_name: '', division: 'unknown', coach_name: '', coach_email: '', source: 'research', next_action: '', next_action_date: '' })
    setNotice('Program added. No messages were sent.')
    await reload()
  }

  async function changeStage(targetId: string, stage: RecruitingPipelineStage) {
    if (!user?.id) return
    setError(''); setBusy(true)
    const { error: updateError } = await supabase.from('recruiting_targets')
      .update({ stage, updated_at: new Date().toISOString() })
      .eq('id', targetId).eq('owner_user_id', user.id)
    setBusy(false)
    if (updateError) setError(updateError.message)
    else await reload()
  }

  async function saveNextAction(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user?.id || !editingId) return
    setError(''); setBusy(true)
    const { error: updateError } = await supabase.from('recruiting_targets')
      .update({ next_action: editAction.trim(), next_action_date: editDate || null, updated_at: new Date().toISOString() })
      .eq('id', editingId).eq('owner_user_id', user.id)
    setBusy(false)
    if (updateError) setError(updateError.message)
    else { setEditingId(''); await reload() }
  }

  async function addInteraction(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user?.id || !activeTargetId || activityForm.summary.trim().length < 3) return
    setError(''); setNotice(''); setBusy(true)
    const { error: insertError } = await supabase.from('recruiting_interactions').insert({
      owner_user_id: user.id, target_id: activeTargetId,
      channel: activityForm.channel, direction: activityForm.direction, summary: activityForm.summary.trim(),
    })
    setBusy(false)
    if (insertError) { setError(insertError.message); return }
    setActivityForm({ channel: 'email', direction: 'outbound', summary: '' })
    setNotice('Interaction recorded. This does not send a message.')
    await reload()
  }

  if (membershipLoading) return <DashboardLayout variant="player" title="Recruiting Tracker"><p className="text-slate-400">Checking ConnectGBB access…</p></DashboardLayout>
  if (!canAccessCommunity) return (
    <DashboardLayout variant="player" title="Recruiting Tracker">
      <div className="card p-8 max-w-xl">
        <h2 className="text-xl font-bold text-white">ConnectGBB membership required</h2>
        <p className="text-slate-400 mt-2">This private recruiting workspace is available to activated members.</p>
        <Link className="text-orange-400 underline mt-4 inline-block" to="/connectgbb">Review membership</Link>
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout variant="player" title="Recruiting Tracker" subtitle="Organize real coach relationships, recruiting events and next steps. No automatic outreach.">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="rounded-xl bg-navy-800 border border-white/10 p-4 text-sm text-slate-300">
          <strong className="text-white">Private family workspace.</strong> This is a manual record, not proof of college interest, an offer, or NCAA contact eligibility. Confirm coach identity and applicable rules; have a guardian review outreach for minors. Do not enter transcripts or sensitive health information here.
        </div>
        {error && <p role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 text-red-200 p-3">{error}</p>}
        {notice && <p role="status" className="rounded-lg border border-green-500/30 bg-green-500/10 text-green-200 p-3">{notice}</p>}
        {loading ? <p className="text-slate-400">Loading recruiting records…</p> : !profileId ? (
          <div className="card p-8">
            <h2 className="text-lg font-bold text-white">Complete your player profile first</h2>
            <p className="text-slate-400 mt-2">Your recruiting records are linked to your private athlete profile.</p>
            <Link to="/dashboard/profile" className="text-orange-400 underline inline-block mt-3">Open Player Profile</Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                ['Programs tracked', summary.programs],
                ['Replies actually logged', summary.programsWithLoggedReplies],
                ['Next actions due', summary.followUpsDue],
                ['Offers self-reported', summary.offersReported],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-xl bg-navy-800 border border-white/10 p-4">
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-sm text-slate-400 mt-1">{label}</p>
                </div>
              ))}
            </div>

            <form onSubmit={createTarget} className="rounded-xl bg-navy-800 border border-white/10 p-5 space-y-4">
              <h2 className="text-lg font-bold text-white">Add college program</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <label className="text-sm text-slate-300">College / program *
                  <input required maxLength={180} className={inputClass} value={targetForm.college_name} onChange={e => setTargetForm({ ...targetForm, college_name: e.target.value })} placeholder="College name" />
                </label>
                <label className="text-sm text-slate-300">Division
                  <select className={inputClass} value={targetForm.division} onChange={e => setTargetForm({ ...targetForm, division: e.target.value })}>
                    {divisions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
                <label className="text-sm text-slate-300">How discovered
                  <select className={inputClass} value={targetForm.source} onChange={e => setTargetForm({ ...targetForm, source: e.target.value })}>
                    {sources.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
                <label className="text-sm text-slate-300">Coach name (optional)
                  <input maxLength={150} className={inputClass} value={targetForm.coach_name} onChange={e => setTargetForm({ ...targetForm, coach_name: e.target.value })} />
                </label>
                <label className="text-sm text-slate-300">Public professional coach email (optional)
                  <input type="email" maxLength={254} className={inputClass} value={targetForm.coach_email} onChange={e => setTargetForm({ ...targetForm, coach_email: e.target.value })} />
                </label>
                <label className="text-sm text-slate-300">Next action date (optional)
                  <input type="date" className={inputClass} value={targetForm.next_action_date} onChange={e => setTargetForm({ ...targetForm, next_action_date: e.target.value })} />
                </label>
              </div>
              <label className="block text-sm text-slate-300">Next action (optional)
                <input maxLength={500} className={inputClass} value={targetForm.next_action} onChange={e => setTargetForm({ ...targetForm, next_action: e.target.value })} placeholder="Review program fit, confirm coach identity..." />
              </label>
              <button disabled={busy} className="bg-[#FB6C1D] hover:bg-orange-600 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-lg">Add to tracker</button>
            </form>

            <div className="grid lg:grid-cols-[1fr_1fr] gap-5">
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-white">College shortlist</h2>
                {targets.length === 0 && <div className="card p-6 text-slate-400">No programs added yet. Start with academic and athletic fit, not rankings.</div>}
                {targets.map(target => (
                  <div key={target.id} className={'rounded-xl bg-navy-800 border p-4 space-y-3 ' + (activeTargetId === target.id ? 'border-[#FB6C1D]' : 'border-white/10')}>
                    <div className="flex flex-wrap justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-white">{target.college_name}</h3>
                        <p className="text-xs text-slate-400">{divisions.find(([value]) => value === target.division)?.[1] || 'Division unknown'} · {target.coach_name || 'Coach not recorded'}</p>
                      </div>
                      <button type="button" onClick={() => setActiveTargetId(target.id)} className="text-sm text-orange-300 hover:underline">View interactions</button>
                    </div>
                    <label className="text-xs text-slate-400 block">User-reported relationship stage
                      <select disabled={busy} className={inputClass} value={target.stage} onChange={e => void changeStage(target.id, e.target.value as RecruitingPipelineStage)}>
                        {recruitingPipelineStages.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                      </select>
                    </label>
                    <p className="text-sm text-slate-300">{target.next_action || 'No next action set.'} {target.next_action_date && <span className="font-semibold">· Due {target.next_action_date}</span>}</p>
                    {editingId === target.id ? (
                      <form onSubmit={saveNextAction} className="space-y-2">
                        <label className="block text-xs text-slate-300">Next action
                          <input maxLength={500} className={inputClass} value={editAction} onChange={e => setEditAction(e.target.value)} />
                        </label>
                        <label className="block text-xs text-slate-300">Due date
                          <input type="date" className={inputClass} value={editDate} onChange={e => setEditDate(e.target.value)} />
                        </label>
                        <button disabled={busy} className="rounded-lg bg-[#0134BD] text-white px-3 py-1.5 text-sm">Save</button>
                        <button type="button" onClick={() => setEditingId('')} className="ml-3 text-sm text-slate-400">Cancel</button>
                      </form>
                    ) : (
                      <button type="button" onClick={() => { setEditingId(target.id); setEditAction(target.next_action); setEditDate(target.next_action_date || '') }} className="text-sm text-blue-300 hover:underline">Edit next action</button>
                    )}
                  </div>
                ))}
                {targets.length >= 500 && <p className="text-amber-200 text-sm">Showing the newest 500 programs. Pagination will be added in a later release.</p>}
              </section>

              <section className="rounded-xl bg-navy-800 border border-white/10 p-5 space-y-4 self-start">
                <h2 className="text-lg font-bold text-white">Interaction timeline</h2>
                {!activeTarget ? <p className="text-slate-400 text-sm">Choose a college to record a real conversation, event, referral or follow-up.</p> : (
                  <>
                    <p className="text-sm text-slate-300">{activeTarget.college_name} · {activeTarget.coach_name || 'Staff contact not yet confirmed'}</p>
                    <form onSubmit={addInteraction} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <label className="text-xs text-slate-300">Channel
                          <select className={inputClass} value={activityForm.channel} onChange={e => setActivityForm({ ...activityForm, channel: e.target.value as RecruitingChannel })}>
                            {channels.map(c => <option key={c} value={c}>{c === 'x' ? 'X / Twitter' : c}</option>)}
                          </select>
                        </label>
                        <label className="text-xs text-slate-300">What occurred
                          <select className={inputClass} value={activityForm.direction} onChange={e => setActivityForm({ ...activityForm, direction: e.target.value as RecruitingActivityDirection })}>
                            {directions.map(d => <option key={d} value={d}>{d === 'in_person' ? 'In person' : d === 'inbound' ? 'Coach replied / inbound' : 'Outbound contact'}</option>)}
                          </select>
                        </label>
                      </div>
                      <label className="block text-xs text-slate-300">Factual summary *
                        <textarea minLength={3} maxLength={2000} required rows={3} className={inputClass} value={activityForm.summary} onChange={e => setActivityForm({ ...activityForm, summary: e.target.value })} placeholder="What really happened, what was requested, and the agreed next step." />
                      </label>
                      <button disabled={busy} className="rounded-lg bg-[#0134BD] hover:bg-blue-800 disabled:opacity-60 px-4 py-2 text-sm font-semibold text-white">Log interaction</button>
                      <p className="text-xs text-slate-400">Logging an outbound contact is not sending it. Only record communication that actually occurred.</p>
                    </form>
                    <div className="border-t border-white/10 pt-4 space-y-3">
                      {activeHistory.length === 0 && <p className="text-sm text-slate-400">No actual interactions logged.</p>}
                      {activeHistory.map(a => (
                        <div key={a.id} className="border-l-2 border-orange-400 pl-3 text-sm">
                          <p className="text-slate-300 font-medium">{a.direction.replace('_',' ')} · {a.channel} · {new Date(a.occurred_at).toLocaleDateString()}</p>
                          <p className="text-slate-400 whitespace-pre-wrap break-words mt-1">{a.summary}</p>
                        </div>
                      ))}
                    </div>
                    {interactions.length >= 1000 && <p className="text-amber-200 text-xs">Showing the most recent 1,000 interactions.</p>}
                  </>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
