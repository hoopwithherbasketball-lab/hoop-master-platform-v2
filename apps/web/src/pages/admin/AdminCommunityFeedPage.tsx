import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Trash2, X, AlertTriangle, MessageSquare, Heart } from 'lucide-react'

interface Post {
  id: string
  author_id: string
  author_name: string
  author_role: string
  content: string
  image_url: string
  created_at: string
  like_count: number
  comment_count: number
}

export default function AdminCommunityFeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from('community_posts')
          .select('*')
          .order('created_at', { ascending: false })
        setPosts(data ?? [])
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    load()
  }, [])

  const del = async () => {
    if (!deleteId) return
    try {
      await supabase.from('community_posts').delete().eq('id', deleteId)
      setPosts(prev => prev.filter(p => p.id !== deleteId))
      setDeleteId(null)
    } catch (e) { console.error(e) }
  }

  return (
    <DashboardLayout variant="admin" title="Community Feed" subtitle="Moderate all community posts">
      {loading ? (
        <div className="animate-pulse space-y-3">{[1,2,3,4].map(i => <div key={i} className="card h-16" />)}</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Author</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Content</th>
                <th className="px-4 py-3 text-center text-xs text-slate-400 uppercase"><Heart size={12} className="inline" /></th>
                <th className="px-4 py-3 text-center text-xs text-slate-400 uppercase"><MessageSquare size={12} className="inline" /></th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Date</th>
                <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {posts.map(p => (
                <tr key={p.id} className="hover:bg-white/5">
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{p.author_name}</p>
                    <p className="text-xs text-slate-400 capitalize">{p.author_role}</p>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="text-slate-300 truncate">{p.content}</p>
                    {p.image_url && <img src={p.image_url} alt="" className="mt-1 h-10 w-10 rounded object-cover" />}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-400">{p.like_count}</td>
                  <td className="px-4 py-3 text-center text-slate-400">{p.comment_count}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setDeleteId(p.id)} className="p-1.5 text-red-400 hover:bg-red-500/20 rounded"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">No posts yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setDeleteId(null)}>
          <div className="bg-navy-800 rounded-xl shadow-xl w-full max-w-sm mx-4 p-6 text-center" onClick={e => e.stopPropagation()}>
            <AlertTriangle size={32} className="mx-auto mb-3 text-red-400" />
            <h3 className="text-lg font-bold text-white mb-1">Delete Post?</h3>
            <p className="text-sm text-slate-400 mb-5">This permanently removes the post from the community feed.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
              <button onClick={del} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
