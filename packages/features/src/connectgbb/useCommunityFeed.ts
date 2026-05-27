import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@hoop-master/supabase'
import { useAuth } from '../crm/contexts/AuthContextValue.js'
import type { CommunityPost } from './types'

export function useCommunityFeed() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) { setPosts([]); setLoading(false); return }

    const abortController = new AbortController()

    const fetch = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data: postsData } = await supabase
          .from('community_posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20)

        if (abortController.signal.aborted) return

        let likedIds: Set<string> = new Set()
        if (user) {
          const { data: likesData } = await supabase
            .from('community_likes')
            .select('post_id')
            .eq('user_id', user.id)
          likedIds = new Set((likesData ?? []).map(l => l.post_id))
        }

        if (abortController.signal.aborted) return

        const mapped: CommunityPost[] = (postsData ?? []).map(r => ({
          id: r.id,
          authorId: r.author_id,
          authorName: r.author_name,
          authorRole: r.author_role as CommunityPost['authorRole'],
          content: r.content,
          imageUrl: r.image_url || undefined,
          createdAt: r.created_at,
          likeCount: r.like_count,
          commentCount: r.comment_count,
          likedByUser: likedIds.has(r.id),
        }))
        setPosts(mapped)
      } catch (e) {
        if (!abortController.signal.aborted) {
          console.error('useCommunityFeed:', e)
          setError('Failed to load feed')
        }
      } finally {
        if (!abortController.signal.aborted) setLoading(false)
      }
    }
    fetch()

    return () => abortController.abort()
  }, [user])

  const toggleLike = useCallback(async (postId: string) => {
    if (!user) return
    const post = posts.find(p => p.id === postId)
    if (!post) return
    const isLiked = post.likedByUser
    const newCount = isLiked ? post.likeCount - 1 : post.likeCount + 1
    try {
      if (isLiked) {
        await supabase.from('community_likes').delete().eq('post_id', postId).eq('user_id', user.id)
      } else {
        await supabase.from('community_likes').insert({ post_id: postId, user_id: user.id })
      }
      await supabase.from('community_posts').update({ like_count: newCount }).eq('id', postId)
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likedByUser: !isLiked, likeCount: newCount } : p))
    } catch (e) { console.error('toggleLike:', e) }
  }, [user, posts])

  const createPost = useCallback(async (content: string) => {
    if (!user) return
    try {
      const { data: profile } = await supabase
        .from('member_profiles')
        .select('display_name, role')
        .eq('user_id', user.id)
        .maybeSingle()

      const displayName = profile?.display_name || user.email?.split('@')[0] || 'You'
      const role = profile?.role || 'player'

      const { data } = await supabase.from('community_posts').insert({
        author_id: user.id,
        author_name: displayName,
        author_role: role,
        content,
      }).select().single()

      if (!data) return

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
    } catch (e) { console.error('createPost:', e) }
  }, [user])

  return { posts, loading, error, toggleLike, createPost }
}
