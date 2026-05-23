export interface AdminEvalSummary {
  playerId: string
  playerName: string
  position: string
  gradClass: string
  school: string
  overall: number
  evaluator: string
  evalDate: string
  status: 'draft' | 'published' | 'archived'
}

const MOCK: AdminEvalSummary[] = [
  { playerId: '1', playerName: 'Ava Grant', position: 'SG', gradClass: '2026', school: 'Sierra Canyon', overall: 92, evaluator: 'National Staff', evalDate: '2026-04-10', status: 'published' },
  { playerId: '2', playerName: 'Taylor Brooks', position: 'PG', gradClass: '2027', school: 'Duncanville', overall: 88, evaluator: 'Regional Scout', evalDate: '2026-04-08', status: 'published' },
  { playerId: '3', playerName: 'Mia Carter', position: 'SF', gradClass: '2026', school: 'Montverde', overall: 85, evaluator: 'National Staff', evalDate: '2026-04-05', status: 'draft' },
  { playerId: '4', playerName: 'Sophia Ramirez', position: 'PG', gradClass: '2028', school: 'Sierra Canyon', overall: 90, evaluator: 'Regional Scout', evalDate: '2026-04-12', status: 'draft' },
  { playerId: '5', playerName: 'Emma Davis', position: 'PF', gradClass: '2025', school: 'Whitney Young', overall: 87, evaluator: 'National Staff', evalDate: '2026-03-28', status: 'published' },
]

export function useAdminEvaluations() {
  return { evaluations: MOCK, loading: false }
}
