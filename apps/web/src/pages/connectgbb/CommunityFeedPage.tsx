import { useState } from 'react'
import { useCommunityFeed } from '@hoop-master/features/connectgbb'
import PageShell from '../../components/ui/PageShell'
import { Send } from 'lucide-react'

export default function CommunityFeedPage() {
  const { posts, loading, toggleLike, createPost } = useCommunityFeed()
  const [newPost, setNewPost] = useState('')

  const handlePost = () => {
    if (!newPost.trim()) return
    createPost(newPost)
    setNewPost('')
  }

  return (
    <PageShell title="Community" description="Connect with players, coaches, and the Elite GBB community." badge="ConnectGBB">
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="bg-white p-6 rounded-lg shadow-md h-32" />)}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
            <textarea value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="Share something with the community..." rows={2} className="w-full resize-none outline-none text-gray-700 text-sm" />
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-400">Share updates, milestones, or questions</span>
              <button onClick={handlePost} disabled={!newPost.trim()} className="flex items-center gap-1 bg-[#0134BD] text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-[#002a80] disabled:opacity-50 disabled:cursor-not-allowed"><Send size={14} /> Post</button>
            </div>
          </div>
          {posts.map(post => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-[#0134BD] rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  {post.authorName[0]}
                </div>
                <div>
                  <p className="font-semibold text-[#121B47] text-sm">{post.authorName}</p>
                  <p className="text-xs text-gray-500">{post.authorRole} · {new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{post.content}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1 ${post.likedByUser ? 'text-[#0134BD]' : 'hover:text-[#0134BD]'} transition-colors`}>
                  {post.likedByUser ? '❤️' : '🤍'} {post.likeCount}
                </button>
                <span className="flex items-center gap-1">💬 {post.commentCount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  )
}
