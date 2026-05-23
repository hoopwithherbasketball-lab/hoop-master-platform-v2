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

const MOCK_EVAL: PlayerEvaluation = {
  playerId: '1',
  playerName: 'Ava Grant',
  position: 'SG',
  gradClass: '2026',
  school: 'Sierra Canyon',
  height: "5'11\"",
  overall: 92,
  projection: 'High Major D-I / Potential WNBA',
  categories: [
    { label: 'Athleticism', score: 94, notes: 'Elite first step, explosive leaping, excellent lateral quickness.' },
    { label: 'Ball Handling', score: 90, notes: 'Tight handles in traffic, can create separation at will.' },
    { label: 'Shooting', score: 88, notes: 'Consistent mechanics, good range to NBA 3. Streaky but reliable.' },
    { label: 'Playmaking', score: 91, notes: 'High IQ passer, reads defenses well, excels in P&R.' },
    { label: 'Defense', score: 93, notes: 'Lockdown on-ball defender, active hands, great anticipation.' },
    { label: 'Basketball IQ', score: 95, notes: 'Exceptional court vision, makes quick correct decisions.' },
    { label: 'Leadership', score: 89, notes: 'Team captain, vocal leader, leads by example.' },
    { label: 'Work Ethic', score: 96, notes: 'First in gym, last to leave. Film room regular.' },
  ],
  scoutNotes: 'Ava is a complete two-way guard with the size, skill, and mentality to contribute immediately at the high-major level. Her combination of athleticism and IQ is rare. Has shown consistent improvement each season, suggesting a high ceiling. Needs to continue adding strength and consistency from deep, but projects as a multi-year starter at a Power 5 program.',
  strengths: ['Elite first step & acceleration', 'High basketball IQ', 'Lockdown on-ball defender', 'Strong playmaker', 'Leadership qualities'],
  areasToImprove: ['Consistency from 3-point range', 'Upper body strength', 'Left hand finishing'],
  comparablePlayer: 'Kelsey Plum (role comp)',
  evalDate: '2026-04-10',
  evaluator: 'National Scouting Staff',
}

export function usePlayerEvaluation(playerId: string): { evaluation: PlayerEvaluation; loading: boolean } {
  return { evaluation: { ...MOCK_EVAL, playerId }, loading: false }
}
