import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@hoop-master/supabase'
import { useAuth } from '../crm/contexts/AuthContextValue.js'
import type { CommunityPost } from './types'

export function useCommunityFeed() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await supabase
          .from('community_posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20)
        const mapped: CommunityPost[] = (data ?? []).map(r => ({
          id: r.id,
          authorId: r.author_id,
          authorName: r.author_name,
          authorRole: r.author_role as CommunityPost['authorRole'],
          content: r.content,
          imageUrl: r.image_url || undefined,
          createdAt: r.created_at,
          likeCount: r.like_count,
          commentCount: r.comment_count,
          likedByUser: false,
        }))
        setPosts(mapped)
      } catch (e) { console.error('useCommunityFeed:', e) }
      setLoading(false)
    }
    fetch()
  }, [])

  const toggleLike = useCallback(async (postId: string) => {
    if (!user) return
    const post = posts.find(p => p.id === postId)
    if (!post) return
    const isLiked = post.likedByUser
    const newCount = isLiked ? post.likeCount - 1 : post.likeCount + 1
    if (isLiked) {
      await supabase.from('community_likes').delete().eq('post_id', postId).eq('user_id', user.id)
    } else {
      await supabase.from('community_likes').insert({ post_id: postId, user_id: user.id })
    }
    await supabase.from('community_posts').update({ like_count: newCount }).eq('id', postId)
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likedByUser: !isLiked, likeCount: newCount } : p))
  }, [user, posts])

  const createPost = useCallback(async (content: string) => {
    if (!user) return
    const { data } = await supabase.from('community_posts').insert({
      author_id: user.id,
      author_name: user.email?.split('@')[0] ?? 'You',
      author_role: 'player',
      content,
    }).select().single()
    if (data) {
      const newPost: CommunityPost = {
        id: data.id,
        authorId: data.author_id,
        authorName: data.author_name,
        authorRole: data.author_role as CommunityPost['authorRole'],
        content: data.content,
        imageUrl: undefined,
        createdAt: data.created_at,
        likeCount: 0,
        commentCount: 0,
        likedByUser: false,
      }
      setPosts(prev => [newPost, ...prev])
    }
  }, [user])

  return { posts, loading, toggleLike, createPost }
}
