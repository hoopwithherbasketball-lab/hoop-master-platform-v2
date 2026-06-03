export interface CommunityPost {
  id: string
  authorId: string
  authorName: string
  authorRole: 'player' | 'parent' | 'coach' | 'club_admin' | 'scout'
  content: string
  imageUrl?: string
  createdAt: string
  likeCount: number
  commentCount: number
  likedByUser: boolean
  recentComments: CommunityComment[]
}

export type CommunityMembershipStatus = 'pending' | 'active' | 'suspended'
export type CommunityMembershipTier = 'starter' | 'pro' | 'elite'

export interface CommunityMembership {
  id: string
  userId: string
  status: CommunityMembershipStatus
  tier: CommunityMembershipTier
  approvedAt: string | null
  expiresAt: string | null
  isActive: boolean
}

export interface CommunityComment {
  id: string
  postId: string
  authorId: string
  authorName: string
  authorRole: 'player' | 'parent' | 'coach' | 'club_admin' | 'scout'
  content: string
  createdAt: string
}

export type CommunityReportReason = 'spam' | 'abuse' | 'harassment' | 'misinformation' | 'other'

export interface TrainingTrack {
  id: string
  title: string
  description: string
  category: 'skill' | 'strength' | 'film' | 'recruiting'
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  lessonCount: number
  thumbnailUrl?: string
}

export interface Connection {
  id: string
  userId: string
  displayName: string
  role: string
  status: 'pending' | 'approved' | 'blocked'
  connectedAt: string
}

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

export interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  read: boolean
}

export interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantAvatar: string
  participantRole: string
  lastMessage: string
  lastTimestamp: string
  unread: number
  messages: Message[]
}
