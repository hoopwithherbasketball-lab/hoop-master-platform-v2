import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@hoop-master/supabase'
import { useAuth } from '../crm/contexts/AuthContextValue.js'
import type { CommunityPost, CommunityComment } from './types'
import { useCommunityMembership } from './useCommunityMembership.js'

const mapComment = (r: {
  id: string
  post_id: string
  author_id: string
  author_name: string
  author_role: CommunityComment['authorRole']
  content: string
  created_at: string
}): CommunityComment => ({
  id: r.id,
  postId: r.post_id,
  authorId: r.author_id,
  authorName: r.author_name,
  authorRole: r.author_role,
  content: r.content,
  createdAt: r.created_at,
})

export function useCommunityFeed() {
  const { user } = useAuth()
  const { membership, canAccessCommunity, refreshMembership } = useCommunityMembership()
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) { setPosts([]); setLoading(false); return }
    if (!canAccessCommunity) { setPosts([]); setLoading(false); return }

    const abortController = new AbortController()

    const fetch = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data: postsData, error: postsError } = await supabase
          .from('community_posts')
          .select('id, author_id, author_name, author_role, content, image_url, created_at, like_count, comment_count')
          .order('created_at', { ascending: false })
          .limit(20)

        if (postsError) throw postsError

        if (abortController.signal.aborted) return

        let likedIds: Set<string> = new Set()
        if (user) {
          const { data: likesData, error: likesError } = await supabase
            .from('community_likes')
            .select('post_id')
            .eq('user_id', user.id)
          if (likesError) throw likesError
          likedIds = new Set((likesData ?? []).map(l => l.post_id))
        }

        if (abortController.signal.aborted) return

        const postIds = (postsData ?? []).map((r) => r.id)
        const commentsByPost = new Map<string, CommunityComment[]>()

        if (postIds.length > 0) {
          const { data: commentsData, error: commentsError } = await supabase
            .from('community_comments')
            .select('id, post_id, author_id, author_name, author_role, content, created_at')
            .in('post_id', postIds)
            .order('created_at', { ascending: false })

          if (commentsError) throw commentsError

          for (const row of commentsData ?? []) {
            if (!commentsByPost.has(row.post_id)) commentsByPost.set(row.post_id, [])
            const existing = commentsByPost.get(row.post_id) ?? []
            if (existing.length < 2) {
              existing.push(mapComment(row))
              commentsByPost.set(row.post_id, existing)
            }
          }
        }

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
          recentComments: commentsByPost.get(r.id) ?? [],
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
  }, [user, canAccessCommunity])

  const toggleLike = useCallback(async (postId: string) => {
    if (!user || !canAccessCommunity) return
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
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likedByUser: !isLiked, likeCount: newCount } : p))
    } catch (e) { console.error('toggleLike:', e) }
  }, [user, posts, canAccessCommunity])

  const createComment = useCallback(async (postId: string, content: string) => {
    if (!user || !canAccessCommunity) return { ok: false as const, error: 'Members-only access required.' }
    const trimmed = content.trim()
    if (!trimmed) return { ok: false as const, error: 'Comment cannot be empty.' }
    if (trimmed.length > 500) return { ok: false as const, error: 'Comment must be under 500 characters.' }

    try {
      const { data: profile } = await supabase
        .from('member_profiles')
        .select('display_name, role')
        .eq('user_id', user.id)
        .maybeSingle()

      const displayName = profile?.display_name || user.email?.split('@')[0] || 'You'
      const role = (profile?.role || 'player') as CommunityComment['authorRole']

      const { data, error: insertError } = await supabase
        .from('community_comments')
        .insert({
          post_id: postId,
          author_id: user.id,
          author_name: displayName,
          author_role: role,
          content: trimmed,
        })
        .select('id, post_id, author_id, author_name, author_role, content, created_at')
        .single()

      if (insertError || !data) throw insertError || new Error('No comment created')

      const newComment = mapComment(data)
      setPosts((prev) => prev.map((post) => {
        if (post.id !== postId) return post
        const nextComments = [newComment, ...post.recentComments].slice(0, 2)
        return {
          ...post,
          recentComments: nextComments,
          commentCount: post.commentCount + 1,
        }
      }))

      return { ok: true as const, error: null }
    } catch (e) {
      console.error('createComment:', e)
      return { ok: false as const, error: 'Unable to add comment.' }
    }
  }, [user, canAccessCommunity])

  const createPost = useCallback(async (content: string) => {
    if (!user || !canAccessCommunity) return { ok: false as const, error: 'Members-only access required.' }
    const trimmed = content.trim()
    if (!trimmed) return { ok: false as const, error: 'Post cannot be empty.' }
    if (trimmed.length > 1200) return { ok: false as const, error: 'Post must be under 1200 characters.' }

    try {
      const { data: profile } = await supabase
        .from('member_profiles')
        .select('display_name, role')
        .eq('user_id', user.id)
        .maybeSingle()

      const displayName = profile?.display_name || user.email?.split('@')[0] || 'You'
      const role = profile?.role || 'player'

      const { data, error: insertError } = await supabase.from('community_posts').insert({
        author_id: user.id,
        author_name: displayName,
        author_role: role,
        content: trimmed,
      }).select().single()

      if (insertError) throw insertError

      if (!data) return { ok: false as const, error: 'Failed to create post.' }

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
        recentComments: [],
      }
      setPosts(prev => [newPost, ...prev])
      return { ok: true as const, error: null }
    } catch (e) {
      console.error('createPost:', e)
      return { ok: false as const, error: 'Unable to create post.' }
    }
  }, [user, canAccessCommunity])

  const requestMembership = useCallback(async () => {
    try {
      await refreshMembership()
      return { ok: true as const, error: null }
    } catch (e) {
      console.error('requestMembership:', e)
      return { ok: false as const, error: 'Unable to submit membership request.' }
    }
  }, [refreshMembership])

  return {
    posts,
    loading,
    error,
    membership,
    canAccessCommunity,
    toggleLike,
    createPost,
    createComment,
    requestMembership,
  }
}
