import { useState, useEffect } from 'react'
import type { CommunityPost } from './types'

const MOCK_POSTS: CommunityPost[] = [
  { id: '1', authorId: 'a1', authorName: 'Sarah Johnson', authorRole: 'player', content: 'Just wrapped up an amazing training session at the Elite GBB showcase! Grateful for the coaching staff and all the support.', createdAt: '2026-05-20T14:30:00Z', likeCount: 24, commentCount: 5, likedByUser: false },
  { id: '2', authorId: 'a2', authorName: 'Coach Williams', authorRole: 'coach', content: 'Looking for 2027 guards with strong court vision. DM me if you want to connect about upcoming camps.', createdAt: '2026-05-19T10:15:00Z', likeCount: 18, commentCount: 8, likedByUser: false },
  { id: '3', authorId: 'a3', authorName: 'Maria Rodriguez', authorRole: 'player', content: 'Committed to Cal Poly! Could not have done it without Elite GBB helping me build my recruiting profile.', createdAt: '2026-05-18T22:00:00Z', likeCount: 56, commentCount: 12, likedByUser: false },
  { id: '4', authorId: 'a4', authorName: 'Elite GBB', authorRole: 'club_admin', content: 'New workshop alert: "NIL 101" - May 28th at 6pm EST. Learn how to build your brand and connect with sponsors. Link in bio!', createdAt: '2026-05-17T16:45:00Z', likeCount: 32, commentCount: 3, likedByUser: false },
]

export function useCommunityFeed() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setPosts(MOCK_POSTS)
    setLoading(false)
  }, [])

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likedByUser: !p.likedByUser, likeCount: p.likedByUser ? p.likeCount - 1 : p.likeCount + 1 } : p))
  }

  return { posts, loading, toggleLike }
}
