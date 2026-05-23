export interface StatTrend {
  label: string
  season: string
  value: number
}

export interface PlayerAnalytics {
  stats: { ppg: number[]; apg: number[]; rpg: number[]; fgp: number[] }
  months: string[]
  trends: StatTrend[]
}

const MOCK: PlayerAnalytics = {
  stats: { ppg: [12.4, 14.8, 16.2, 18.4], apg: [3.2, 4.1, 4.8, 5.2], rpg: [5.6, 6.2, 7.0, 7.8], fgp: [41.0, 43.5, 45.2, 47.2] },
  months: ['Oct', 'Dec', 'Feb', 'Apr'],
  trends: [
    { label: 'Scoring', season: '2023-24', value: 12.4 },
    { label: 'Scoring', season: '2024-25', value: 15.8 },
    { label: 'Scoring', season: '2025-26', value: 18.4 },
    { label: 'Assists', season: '2023-24', value: 3.2 },
    { label: 'Assists', season: '2024-25', value: 4.5 },
    { label: 'Assists', season: '2025-26', value: 5.2 },
  ],
}

export function usePlayerAnalytics(playerId?: string) {
  return { analytics: MOCK, loading: false }
}
