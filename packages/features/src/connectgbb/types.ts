export interface CommunityPost {
  id: string
  authorId: string
  authorName: string
  authorRole: 'player' | 'parent' | 'coach' | 'club_admin'
  content: string
  imageUrl?: string
  createdAt: string
  likeCount: number
  commentCount: number
  likedByUser: boolean
}

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
