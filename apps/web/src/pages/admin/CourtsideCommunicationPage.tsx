import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Brain, CheckCircle2, Clock3, Mic, RefreshCcw, Shield, TimerReset, Trash2, Users } from 'lucide-react'
import { usePlayerProfiles } from '@hoop-master/features/crm'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { supabase } from '../../lib/supabase'

type DrillType = 'OFFENSIVE_PG' | 'RELAY_PG' | 'SNAPSHOT_PG' | 'LATE_CLOCK_PG' | 'DEFENSIVE_QB' | 'HARDWOOD_CHESS'
type EvalRole = 'POINT_GUARD' | 'RECEIVER_FLOOR_GENERAL' | 'DEFENSIVE_QUARTERBACK' | 'OFFENSIVE_CAPTAIN' | 'DEFENSIVE_CAPTAIN'
type Outcome = 'CHECKMATE' | 'ADVANTAGE' | 'STALEMATE' | 'TURNOVER' | 'LOCKDOWN' | 'CONTESTED' | 'BREAKDOWN' | 'GRANDMASTER' | 'TACTICIAN' | 'NOVICE'

type RubricKey = 'communication' | 'processing' | 'command' | 'spacing' | 'advantageCreation' | 'defensiveRead' | 'composure'

type QueueItem = {
  localId: string
  playerProfileId: string
  playerName: string
  drillType: DrillType
  evaluatedRole: EvalRole
  outcome: Outcome
  eventName: string
  defenseScheme: string
  offensiveSet: string
  shotClockSeconds: number
  decisionWindowSeconds: number
  coachNotes: string
  scores: Record<RubricKey, number>
  eventDate: string
}

type DrillConfig = {
  type: DrillType
  name: string
  tagline: string
  setup: string
  rules: string[]
  liveTrigger: string
  roles: EvalRole[]
  outcomes: { label: string; value: Outcome; helper: string }[]
  rubric: { key: RubricKey; label: string; levels: [string, string, string] }[]
}

const STORAGE_KEY = 'hwh-courtside-communication-queue'

const drillConfigs: DrillConfig[] = [
  {
    type: 'OFFENSIVE_PG',
    name: 'Offensive PG Freeze-Frame',
    tagline: 'Point guard turns offensive execution into a vocal, stop-motion puzzle.',
    setup: 'Five offensive players and five defenders start in a defensive scheme. PG calls the matching offensive set before anyone moves.',
    rules: [
      'No offensive player may move, screen, cut, or relocate without a precise PG command.',
      'PG must use names/numbers and basketball terminology: “Two, Iverson cut across the nail.”',
      'After each instructed burst, offense and defense freeze for the next read.',
    ],
    liveTrigger: 'Coach yells “Live!” once the PG creates a clean shot, mismatch, late rotation, or paint touch.',
    roles: ['POINT_GUARD'],
    outcomes: [
      { label: 'Checkmate', value: 'CHECKMATE', helper: 'Great shot in a high-percentage zone' },
      { label: 'Advantage', value: 'ADVANTAGE', helper: 'Mismatch, late rotation, or clear driving lane' },
      { label: 'Stalemate', value: 'STALEMATE', helper: 'Defense counters; PG must reset or counter' },
      { label: 'Turnover', value: 'TURNOVER', helper: 'Vague language, bad spacing, hesitation, or trap' },
    ],
    rubric: [
      { key: 'communication', label: 'Vocabulary', levels: ['Vague/incorrect', 'Correct but delayed', 'Exact, loud, concise'] },
      { key: 'processing', label: 'Processing', levels: ['Misses coverage', 'Uses full window', 'Anticipates counter'] },
      { key: 'spacing', label: 'Spacing', levels: ['Crowds action', 'Maintains usable spacing', 'Creates optimal geometry'] },
      { key: 'advantageCreation', label: 'Advantage Creation', levels: ['No advantage', 'Small edge', 'Clear checkmate look'] },
    ],
  },
  {
    type: 'RELAY_PG',
    name: 'Relay Floor-General',
    tagline: 'The playmaker responsibility transfers with the ball.',
    setup: 'Start like PG Freeze-Frame. After a pass, the receiver becomes the next caller and owns the next command.',
    rules: [
      'Original PG commands the first action and pass.',
      'The receiver has three seconds to command the next action.',
      'Any receiver who catches and stays silent creates a dead-ball turnover.',
    ],
    liveTrigger: 'Go live after the second or third clean relay command creates a defensive compromise.',
    roles: ['POINT_GUARD', 'RECEIVER_FLOOR_GENERAL'],
    outcomes: [
      { label: 'Checkmate', value: 'CHECKMATE', helper: 'Ball changed sides and produced a great shot' },
      { label: 'Advantage', value: 'ADVANTAGE', helper: 'Receiver made the right next read' },
      { label: 'Stalemate', value: 'STALEMATE', helper: 'Safe reset only' },
      { label: 'Turnover', value: 'TURNOVER', helper: 'Receiver froze or used vague language' },
    ],
    rubric: [
      { key: 'communication', label: 'Relay Command', levels: ['Silent/vague', 'Audible but late', 'Instant and specific'] },
      { key: 'processing', label: 'Next Read', levels: ['Predetermined/wrong', 'Reactive', 'Anticipates second side'] },
      { key: 'composure', label: 'Composure', levels: ['Rushed/panicked', 'Stable', 'Poised under pressure'] },
    ],
  },
  {
    type: 'SNAPSHOT_PG',
    name: 'Snapshot Mode',
    tagline: 'PG pivots into a random defensive picture and must command instantly.',
    setup: 'PG starts turned away. Defense shifts into a random look. On whistle, PG pivots and has two seconds to speak.',
    rules: [
      'No pointing after the pivot.',
      'The first command must name the player, action, and destination.',
      'Defense may disguise coverage before the PG turns around.',
    ],
    liveTrigger: 'Go live after one precise command and one realistic defensive reaction.',
    roles: ['POINT_GUARD'],
    outcomes: [
      { label: 'Checkmate', value: 'CHECKMATE', helper: 'Instantly attacks the hidden coverage' },
      { label: 'Advantage', value: 'ADVANTAGE', helper: 'Gets offense organized quickly' },
      { label: 'Stalemate', value: 'STALEMATE', helper: 'Safe but not threatening' },
      { label: 'Turnover', value: 'TURNOVER', helper: 'Fails two-second window' },
    ],
    rubric: [
      { key: 'processing', label: 'Recognition', levels: ['Does not identify look', 'Identifies late', 'Names and attacks look'] },
      { key: 'communication', label: 'First Command', levels: ['Incomplete', 'Technically correct', 'Complete and urgent'] },
      { key: 'composure', label: 'Poise', levels: ['Rattled', 'Settles eventually', 'Calm and decisive'] },
    ],
  },
  {
    type: 'LATE_CLOCK_PG',
    name: 'Late-Clock Live Trigger',
    tagline: 'One command, then chaos: structured orchestration becomes late-clock playmaking.',
    setup: 'Put seven seconds on the clock. PG gets one stop-motion command before the floor goes live.',
    rules: [
      'PG gets exactly one vocal command.',
      'All players freeze after the commanded action finishes.',
      'Coach calls “Live!” regardless of advantage quality.',
    ],
    liveTrigger: 'Immediate live play after the first action finishes, with the clock still running.',
    roles: ['POINT_GUARD'],
    outcomes: [
      { label: 'Checkmate', value: 'CHECKMATE', helper: 'One command creates a clean look' },
      { label: 'Advantage', value: 'ADVANTAGE', helper: 'Creates an emergency edge' },
      { label: 'Stalemate', value: 'STALEMATE', helper: 'No edge, but organized' },
      { label: 'Turnover', value: 'TURNOVER', helper: 'Clock/pressure causes breakdown' },
    ],
    rubric: [
      { key: 'communication', label: 'Clarity', levels: ['Unclear', 'Clear but slow', 'Immediate and actionable'] },
      { key: 'processing', label: 'Late-Clock Read', levels: ['Wrong action', 'Acceptable action', 'Best quick-hitter'] },
      { key: 'advantageCreation', label: 'Shot Creation', levels: ['Forced/bad shot', 'Contested shot', 'Clean look/rim touch'] },
      { key: 'composure', label: 'Pressure Handling', levels: ['Panics', 'Survives', 'Controls tempo'] },
    ],
  },
  {
    type: 'DEFENSIVE_QB',
    name: 'Defensive Quarterback',
    tagline: 'The anchor must call every rotation before teammates are allowed to move.',
    setup: 'Offense runs continuous motion at 75%. Designate the center or high-IQ forward as the defensive quarterback.',
    rules: [
      'No defender can switch, stunt, tag, or sink unless the quarterback names them and the rotation.',
      'Quarterback must call screens, tags, low-man help, and closeouts early.',
      'If a defender moves without a command or the QB misses a paint rotation, defense is penalized.',
    ],
    liveTrigger: 'Go live when the defense strings together three correct calls or when offense creates a breakdown to finish.',
    roles: ['DEFENSIVE_QUARTERBACK'],
    outcomes: [
      { label: 'Lockdown', value: 'LOCKDOWN', helper: 'Early calls erase the action' },
      { label: 'Contested', value: 'CONTESTED', helper: 'Defense survives with a tough shot' },
      { label: 'Breakdown', value: 'BREAKDOWN', helper: 'Missed/late rotation creates an open look' },
      { label: 'Turnover', value: 'TURNOVER', helper: 'Defense forces a turnover with communication' },
    ],
    rubric: [
      { key: 'communication', label: 'Early Talk', levels: ['Late/no calls', 'Calls on contact', 'Calls before action'] },
      { key: 'command', label: 'Authority', levels: ['Quiet/unclear', 'Audible', 'Loud and direct'] },
      { key: 'defensiveRead', label: 'Coverage Accuracy', levels: ['Wrong rotation', 'Standard coverage', 'Anticipates counter'] },
      { key: 'composure', label: 'Chaos Control', levels: ['Scramble', 'Recovers', 'Organizes all five'] },
    ],
  },
  {
    type: 'HARDWOOD_CHESS',
    name: 'Hardwood Chess',
    tagline: 'Offensive and defensive captains alternate commands until one side wins the possession.',
    setup: 'Name one offensive captain and one defensive captain. Teams move in alternating turn-based bursts.',
    rules: [
      'Offensive captain calls one action; offense executes and freezes.',
      'Defensive captain has three seconds to call the exact counter coverage.',
      'Captains can use dummy calls, slips, switches, traps, and resets as long as commands are precise.',
    ],
    liveTrigger: 'Coach calls “Live!” after a clear offensive advantage or a defensive trap/checkmate.',
    roles: ['OFFENSIVE_CAPTAIN', 'DEFENSIVE_CAPTAIN'],
    outcomes: [
      { label: 'Grandmaster', value: 'GRANDMASTER', helper: 'Reads opponent plan and punishes it' },
      { label: 'Tactician', value: 'TACTICIAN', helper: 'Calls a safe, correct counter' },
      { label: 'Novice', value: 'NOVICE', helper: 'Calls into opponent trap' },
      { label: 'Turnover', value: 'TURNOVER', helper: 'Communication error ends possession' },
    ],
    rubric: [
      { key: 'processing', label: 'Counter-Move IQ', levels: ['Helps opponent', 'Safe response', 'Exploits strategy'] },
      { key: 'communication', label: 'Command Precision', levels: ['Vague', 'Correct', 'Specific and fast'] },
      { key: 'command', label: 'Tempo Control', levels: ['Rushed', 'Matches tempo', 'Dictates tempo'] },
      { key: 'composure', label: 'Competitive Poise', levels: ['Flustered', 'Stable', 'Controls huddle/voice'] },
    ],
  },
]

const scoreLabels = {
  1: 'Breakdown',
  2: 'Solid',
  3: 'Elite',
} as const

function nowLocalDateTime() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

export default function CourtsideCommunicationPage() {
  const { profiles, loading } = usePlayerProfiles()
  const [selectedPlayerId, setSelectedPlayerId] = useState('')
  const [drillType, setDrillType] = useState<DrillType>('OFFENSIVE_PG')
  const [evaluatedRole, setEvaluatedRole] = useState<EvalRole>('POINT_GUARD')
  const [outcome, setOutcome] = useState<Outcome>('ADVANTAGE')
  const [eventName, setEventName] = useState('Elite Open Run')
  const [defenseScheme, setDefenseScheme] = useState('Man-to-man')
  const [offensiveSet, setOffensiveSet] = useState('4-Out')
  const [shotClockSeconds, setShotClockSeconds] = useState(24)
  const [decisionWindowSeconds, setDecisionWindowSeconds] = useState(3)
  const [coachNotes, setCoachNotes] = useState('')
  const [scores, setScores] = useState<Record<RubricKey, number>>({
    communication: 2,
    processing: 2,
    command: 2,
    spacing: 2,
    advantageCreation: 2,
    defensiveRead: 2,
    composure: 2,
  })
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [syncing, setSyncing] = useState(false)
  const [clockRemaining, setClockRemaining] = useState(24)
  const [clockRunning, setClockRunning] = useState(false)

  const selectedConfig = useMemo(() => drillConfigs.find((d) => d.type === drillType) ?? drillConfigs[0], [drillType])
  const selectedPlayer = profiles.find((p) => p.id === selectedPlayerId)

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setQueue(JSON.parse(saved))
      } catch {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
  }, [queue])

  useEffect(() => {
    if (!profiles.length || selectedPlayerId) return
    setSelectedPlayerId(profiles[0].id)
  }, [profiles, selectedPlayerId])

  useEffect(() => {
    const nextConfig = drillConfigs.find((d) => d.type === drillType)
    if (nextConfig && !nextConfig.roles.includes(evaluatedRole)) {
      setEvaluatedRole(nextConfig.roles[0])
    }
    if (nextConfig && !nextConfig.outcomes.some((item) => item.value === outcome)) {
      setOutcome(nextConfig.outcomes[0].value)
    }
  }, [drillType, evaluatedRole, outcome])

  useEffect(() => {
    setClockRemaining(shotClockSeconds)
    setClockRunning(false)
  }, [shotClockSeconds])

  useEffect(() => {
    if (!clockRunning) return
    const timer = window.setInterval(() => {
      setClockRemaining((current) => {
        if (current <= 1) {
          setClockRunning(false)
          return 0
        }
        return current - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [clockRunning])

  const activeRubric = selectedConfig.rubric
  const totalScore = activeRubric.reduce((sum, item) => sum + scores[item.key], 0)
  const maxScore = activeRubric.length * 3

  function tapScore(key: RubricKey, value: number) {
    setScores((current) => ({ ...current, [key]: value }))
    if ('vibrate' in navigator) navigator.vibrate?.(12)
  }

  function addToQueue() {
    if (!selectedPlayer) {
      toast.error('Select a player before saving the rep.')
      return
    }

    const item: QueueItem = {
      localId: crypto.randomUUID(),
      playerProfileId: selectedPlayer.id,
      playerName: `${selectedPlayer.first_name} ${selectedPlayer.last_name}`.trim(),
      drillType,
      evaluatedRole,
      outcome,
      eventName,
      defenseScheme,
      offensiveSet,
      shotClockSeconds,
      decisionWindowSeconds,
      coachNotes,
      scores,
      eventDate: nowLocalDateTime(),
    }

    setQueue((current) => [item, ...current])
    setCoachNotes('')
    toast.success('Rep saved locally. Sync when the drill pauses.')
  }

  async function syncQueue() {
    if (!queue.length) return
    setSyncing(true)
    const payload = queue.map((item) => ({
      player_profile_id: item.playerProfileId,
      drill_type: item.drillType,
      evaluated_role: item.evaluatedRole,
      outcome: item.outcome,
      event_name: item.eventName,
      defense_scheme: item.defenseScheme,
      offensive_set: item.offensiveSet,
      shot_clock_seconds: item.shotClockSeconds,
      decision_window_seconds: item.decisionWindowSeconds,
      communication_score: item.scores.communication,
      processing_score: item.scores.processing,
      command_score: item.scores.command,
      spacing_score: item.scores.spacing,
      advantage_creation_score: item.scores.advantageCreation,
      defensive_read_score: item.scores.defensiveRead,
      composure_score: item.scores.composure,
      rubric_scores: item.scores,
      coach_notes: item.coachNotes,
      event_date: item.eventDate,
    }))

    const { error } = await supabase.from('courtside_communication_evaluations').insert(payload)
    setSyncing(false)

    if (error) {
      toast.error(`Sync failed: ${error.message}`)
      return
    }

    setQueue([])
    toast.success('Courtside evaluations synced to the database.')
  }

  function clearQueue() {
    setQueue([])
    toast.info('Local queue cleared.')
  }

  return (
    <DashboardLayout
      variant="admin"
      title="Courtside Communication Lab"
      subtitle="Fast-tap tracking for PG orchestration, defensive quarterbacking, and Hardwood Chess drill reps."
    >
      <div className="mx-auto max-w-7xl space-y-6 pb-28 lg:pb-6">
        <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="card court-texture">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="badge-orange mb-3">Live-player tactical game</p>
                <h2 className="font-display text-3xl font-bold text-white">{selectedConfig.name}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{selectedConfig.tagline}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
                <div className={`font-display text-5xl font-black ${clockRemaining <= 7 ? 'text-brand-orange' : 'text-white'}`}>{clockRemaining}</div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setClockRunning((value) => !value)} className="btn-primary px-4 py-2 text-xs">
                    <Clock3 size={14} /> {clockRunning ? 'Pause' : 'Start'}
                  </button>
                  <button onClick={() => { setClockRunning(false); setClockRemaining(shotClockSeconds) }} className="btn-outline px-4 py-2 text-xs">
                    <TimerReset size={14} /> Reset
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Setup</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{selectedConfig.setup}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 md:col-span-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Rules of engagement</p>
                <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-300">
                  {selectedConfig.rules.map((rule) => <li key={rule}>• {rule}</li>)}
                </ul>
                <p className="mt-3 text-sm font-semibold text-orange-200">Live trigger: {selectedConfig.liveTrigger}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="mb-4 flex items-center gap-2">
              <Brain className="text-brand-orange" size={20} />
              <h3 className="font-display text-xl font-bold text-white">Drill Controls</h3>
            </div>
            <div className="space-y-3">
              <label className="label">Variation</label>
              <select value={drillType} onChange={(e) => setDrillType(e.target.value as DrillType)} className="input">
                {drillConfigs.map((drill) => <option key={drill.type} value={drill.type}>{drill.name}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Defense</label>
                  <input value={defenseScheme} onChange={(e) => setDefenseScheme(e.target.value)} className="input" placeholder="2-3 zone, switch-all..." />
                </div>
                <div>
                  <label className="label">Offensive Set</label>
                  <input value={offensiveSet} onChange={(e) => setOffensiveSet(e.target.value)} className="input" placeholder="Horns, 4-Out..." />
                </div>
                <div>
                  <label className="label">Shot Clock</label>
                  <input type="number" min={1} max={30} value={shotClockSeconds} onChange={(e) => setShotClockSeconds(Number(e.target.value))} className="input" />
                </div>
                <div>
                  <label className="label">Decision Window</label>
                  <input type="number" min={1} max={10} value={decisionWindowSeconds} onChange={(e) => setDecisionWindowSeconds(Number(e.target.value))} className="input" />
                </div>
              </div>
              <div>
                <label className="label">Event / Run</label>
                <input value={eventName} onChange={(e) => setEventName(e.target.value)} className="input" />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="card">
            <div className="mb-4 flex items-center gap-2">
              <Users className="text-blue-300" size={20} />
              <h3 className="font-display text-xl font-bold text-white">Active Player</h3>
            </div>
            <label className="label">Player</label>
            <select value={selectedPlayerId} onChange={(e) => setSelectedPlayerId(e.target.value)} className="input" disabled={loading || !profiles.length}>
              {loading && <option>Loading players...</option>}
              {!loading && !profiles.length && <option>No player profiles found</option>}
              {profiles.map((player) => (
                <option key={player.id} value={player.id}>{player.first_name} {player.last_name} {player.position ? `• ${player.position}` : ''}</option>
              ))}
            </select>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label className="label">Evaluated Role</label>
                <select value={evaluatedRole} onChange={(e) => setEvaluatedRole(e.target.value as EvalRole)} className="input">
                  {selectedConfig.roles.map((role) => <option key={role} value={role}>{role.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Outcome</label>
                <select value={outcome} onChange={(e) => setOutcome(e.target.value as Outcome)} className="input">
                  {selectedConfig.outcomes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Outcome Definitions</p>
              <div className="mt-3 space-y-2">
                {selectedConfig.outcomes.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setOutcome(item.value)}
                    className={`w-full rounded-lg border p-3 text-left transition ${outcome === item.value ? 'border-brand-orange bg-brand-orange/20' : 'border-white/10 bg-black/20 hover:border-white/30'}`}
                  >
                    <span className="block font-bold text-white">{item.label}</span>
                    <span className="text-xs text-slate-400">{item.helper}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Shield className="text-brand-orange" size={20} />
                <h3 className="font-display text-xl font-bold text-white">Fast-Tap Rubric</h3>
              </div>
              <span className="badge-royal">{totalScore}/{maxScore}</span>
            </div>

            <div className="space-y-4">
              {activeRubric.map((item) => (
                <div key={item.key} className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="font-bold text-white">{item.label}</p>
                    <p className="text-sm text-slate-400">{scoreLabels[scores[item.key] as 1 | 2 | 3]}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onPointerDown={() => tapScore(item.key, value)}
                        className={`min-h-[68px] touch-manipulation rounded-xl border px-2 py-3 text-center transition active:scale-[0.98] ${scores[item.key] === value ? 'border-brand-orange bg-brand-orange text-white shadow-glow-orange' : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'}`}
                      >
                        <span className="block text-2xl font-black">{value}</span>
                        <span className="mt-1 block text-[11px] leading-4">{item.levels[value - 1]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="label flex items-center gap-2"><Mic size={14} /> Coach Notes</label>
              <textarea
                value={coachNotes}
                onChange={(e) => setCoachNotes(e.target.value)}
                rows={3}
                className="input resize-none"
                placeholder="Use phone dictation: hesitated on the second read, called the wrong screen, punished top-lock with a slip..."
              />
            </div>

            <button onClick={addToQueue} className="btn-secondary mt-4 w-full justify-center py-4 text-base" disabled={!selectedPlayerId}>
              <CheckCircle2 size={18} /> Save Rep Locally
            </button>
          </div>
        </section>

        <section className="card">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-xl font-bold text-white">Local Batch Queue</h3>
              <p className="text-sm text-slate-400">No network request is made until you tap Sync, so gym Wi-Fi never slows the drill.</p>
            </div>
            <button onClick={clearQueue} disabled={!queue.length} className="btn-ghost text-red-300 disabled:opacity-40"><Trash2 size={16} /> Clear</button>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {queue.slice(0, 6).map((item) => (
              <div key={item.localId} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-white">{item.playerName}</p>
                    <p className="text-xs text-slate-400">{item.drillType.replace(/_/g, ' ')} • {item.evaluatedRole.replace(/_/g, ' ')}</p>
                  </div>
                  <span className="badge-gold">{item.outcome.replace(/_/g, ' ')}</span>
                </div>
                <p className="mt-3 text-sm text-slate-300">{item.coachNotes || 'No notes added.'}</p>
              </div>
            ))}
            {!queue.length && <div className="rounded-xl border border-dashed border-white/10 p-6 text-sm text-slate-400">Saved reps will appear here until synced.</div>}
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy-800/95 p-3 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div>
            <p className="font-bold text-white">{queue.length} unsynced rep{queue.length === 1 ? '' : 's'}</p>
            <p className="text-xs text-slate-400">Batch-submit when the drill pauses.</p>
          </div>
          <button onClick={syncQueue} disabled={!queue.length || syncing} className="btn-primary px-5 py-3 disabled:opacity-50">
            <RefreshCcw size={16} className={syncing ? 'animate-spin' : ''} /> {syncing ? 'Syncing...' : 'Sync to Database'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
