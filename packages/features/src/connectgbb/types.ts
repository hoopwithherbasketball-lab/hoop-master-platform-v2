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
