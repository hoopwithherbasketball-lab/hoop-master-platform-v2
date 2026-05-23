import { useState } from 'react'

export interface ConnectedPlayer {
  id: string
  name: string
  position: string
  gradClass: string
  school: string
  consentStatus: 'pending' | 'approved' | 'changes_requested'
  consentDate: string | null
}

export interface ActivityEntry {
  id: string
  type: 'consent' | 'profile_update' | 'message' | 'evaluation'
  description: string
  date: string
  playerName: string
}

const MOCK_PLAYERS: ConnectedPlayer[] = [
  { id: '1', name: 'Ava Grant', position: 'SG', gradClass: '2026', school: 'Sierra Canyon', consentStatus: 'approved', consentDate: '2026-03-15' },
  { id: '2', name: 'Maya Grant', position: 'PG', gradClass: '2029', school: 'Sierra Canyon Middle', consentStatus: 'pending', consentDate: null },
]

const MOCK_ACTIVITY: ActivityEntry[] = [
  { id: 'a1', type: 'consent', description: 'Consented to player profile for Ava Grant', date: '2026-03-15', playerName: 'Ava Grant' },
  { id: 'a2', type: 'profile_update', description: 'Stats updated for Ava Grant', date: '2026-04-10', playerName: 'Ava Grant' },
  { id: 'a3', type: 'evaluation', description: 'New evaluation available for Ava Grant', date: '2026-04-10', playerName: 'Ava Grant' },
]

export function useParentApproval() {
  const [players, setPlayers] = useState(MOCK_PLAYERS)
  const [activity] = useState(MOCK_ACTIVITY)

  const approveConsent = (playerId: string) => {
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, consentStatus: 'approved' as const, consentDate: new Date().toISOString().slice(0, 10) } : p))
  }

  return { players, activity, approveConsent }
}
