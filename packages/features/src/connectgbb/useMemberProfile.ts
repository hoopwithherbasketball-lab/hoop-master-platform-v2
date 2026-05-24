

export interface MemberProfile {
  id: string
  displayName: string
  role: 'player' | 'coach' | 'parent' | 'scout'
  bio: string
  avatar: string
  location: string
  joined: string
  connections: number
  posts: number
}

const MOCK: Record<string, MemberProfile> = {
  '1': { id: '1', displayName: 'Ava Grant', role: 'player', bio: 'Class of 2026 SG at Sierra Canyon. Committed to the grind.', avatar: 'AG', location: 'Chatsworth, CA', joined: 'Jan 2026', connections: 28, posts: 12 },
}

export function useMemberProfile(id: string) {
  const profile = MOCK[id] || null
  return { profile, loading: false }
}
