import { useState } from 'react'
import { useCommunityFeed, useCommunityModeration } from '@hoop-master/features/connectgbb'
import { PageShell } from '@hoop-master/ui'
import { Send, Flag, Heart, MessageSquare } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import { trackCommunityEvent } from '../../lib/communityAnalytics'

export default function CommunityFeedPage() {
  const { user } = useAuth()
  const { posts, loading, error, membership, canAccessCommunity, toggleLike, createPost, createComment, requestMembership } = useCommunityFeed()
  const { reportPost } = useCommunityModeration()
  const [newPost, setNewPost] = useState('')
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handlePost = async () => {
    if (!newPost.trim()) return
    const result = await createPost(newPost)
    if (result.ok) {
      setNewPost('')
      setSubmitError(null)
      return
    }
    setSubmitError(result.error)
  }

  const handleAddComment = async (postId: string) => {
    const text = (commentDrafts[postId] || '').trim()
    if (!text) return
    const result = await createComment(postId, text)
    if (result.ok) {
      setCommentDrafts((prev) => ({ ...prev, [postId]: '' }))
      setSubmitError(null)
      return
    }
    setSubmitError(result.error)
  }

  const handleReport = async (postId: string) => {
    const result = await reportPost(postId, 'other', 'Reported from in-app premium community moderation control.')
    if (!result.ok) {
      setSubmitError(result.error)
      return
    }

    await trackCommunityEvent('community_report_submitted', user?.id, {
      post_id: postId,
      source: 'elitegbb_feed',
    })
  }

  if (!canAccessCommunity) {
    return (
      <PageShell title="Community" description="Members-only network with moderated discussions and trusted collaboration." badge="EliteGBB">
        <div className="max-w-2xl mx-auto bg-navy-800 border border-white/10 rounded-xl p-8 text-center" data-testid="community-feed-membership-locked">
          <h2 className="text-2xl font-semibold text-white mb-3">Membership Activation Pending</h2>
          <p className="text-slate-400 mb-5">
            Your account is currently <span className="capitalize text-white">{membership?.status || 'pending'}</span>. Community access unlocks when membership becomes active.
          </p>
          <button
            onClick={async () => {
              await trackCommunityEvent('lock_state_cta_click', user?.id, {
                cta: 'refresh_membership_status',
                source: 'community_feed_lock',
                membership_status: membership?.status || 'unknown',
              })
              await requestMembership()
            }}
            data-testid="community-feed-refresh-membership-button"
            className="bg-[#0134BD] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#002a80] transition-colors"
          >
            Refresh Membership Status
          </button>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell title="Community" description="Connect with players, coaches, and the Elite GBB community." badge="EliteGBB">
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="bg-navy-800 p-6 rounded-lg shadow-md h-32" />)}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="bg-navy-800 p-4 rounded-lg shadow-md border border-white/10" data-testid="community-feed-create-post-card">
            <textarea data-testid="community-feed-create-post-input" value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="Share a structured update with the members community..." rows={2} className="w-full resize-none outline-none text-gray-300 text-sm" />
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/10">
              <span className="text-xs text-gray-400">Tier: <span className="uppercase text-white">{membership?.tier || 'starter'}</span></span>
              <button data-testid="community-feed-create-post-button" onClick={handlePost} disabled={!newPost.trim()} className="flex items-center gap-1 bg-[#0134BD] text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-[#002a80] disabled:opacity-50 disabled:cursor-not-allowed"><Send size={14} /> Post</button>
            </div>
          </div>
          {(submitError || error) && <p className="text-red-300 text-sm" data-testid="community-feed-error-text">{submitError || error}</p>}
          {posts.map(post => (
            <div key={post.id} className="bg-navy-800 p-6 rounded-lg shadow-md border border-white/10" data-testid={`community-feed-post-${post.id}`}>
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-[#0134BD] rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  {post.authorName[0]}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{post.authorName}</p>
                  <p className="text-xs text-slate-400">{post.authorRole} · {new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-gray-300 mb-3">{post.content}</p>
              <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                <button data-testid={`community-feed-like-button-${post.id}`} onClick={() => toggleLike(post.id)} className={`flex items-center gap-1 ${post.likedByUser ? 'text-[#0134BD]' : 'hover:text-[#0134BD]'} transition-colors`}>
                  <Heart size={14} /> {post.likeCount}
                </button>
                <span className="flex items-center gap-1" data-testid={`community-feed-comment-count-${post.id}`}><MessageSquare size={14} /> {post.commentCount}</span>
                <button
                  data-testid={`community-feed-report-button-${post.id}`}
                  onClick={() => handleReport(post.id)}
                  className="flex items-center gap-1 hover:text-red-300 transition-colors"
                >
                  <Flag size={14} /> Report
                </button>
              </div>

              {post.recentComments.length > 0 && (
                <div className="space-y-2 mb-3" data-testid={`community-feed-comments-preview-${post.id}`}>
                  {post.recentComments.map((comment) => (
                    <div key={comment.id} className="bg-white/5 rounded-lg px-3 py-2">
                      <p className="text-xs text-slate-400 mb-1">{comment.authorName} · {comment.authorRole}</p>
                      <p className="text-sm text-gray-300">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  data-testid={`community-feed-comment-input-${post.id}`}
                  value={commentDrafts[post.id] || ''}
                  onChange={(e) => setCommentDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                  placeholder="Add a thoughtful comment…"
                  className="flex-1 p-2 border border-white/10 rounded-lg bg-transparent text-sm text-gray-200"
                />
                <button
                  data-testid={`community-feed-comment-submit-${post.id}`}
                  onClick={() => handleAddComment(post.id)}
                  className="bg-[#0134BD] text-white px-3 rounded-lg text-sm font-medium hover:bg-[#002a80]"
                >
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  )
}
