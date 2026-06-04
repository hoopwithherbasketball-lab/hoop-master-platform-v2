import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Trash2, X, AlertTriangle, MessageSquare, Heart } from 'lucide-react'
import { useAuth } from '../../lib/auth'

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

interface ReportRow {
  id: string
  post_id: string
  reporter_id: string
  reason: 'spam' | 'abuse' | 'harassment' | 'misinformation' | 'other'
  details: string
  status: 'open' | 'reviewing' | 'resolved' | 'rejected'
  created_at: string
}

export default function AdminCommunityFeedPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [reports, setReports] = useState<ReportRow[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [resolvingReportId, setResolvingReportId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from('community_posts')
          .select('*')
          .order('created_at', { ascending: false })

        const { data: reportData } = await supabase
          .from('community_post_reports')
          .select('id, post_id, reporter_id, reason, details, status, created_at')
          .in('status', ['open', 'reviewing'])
          .order('created_at', { ascending: false })
          .limit(100)

        setPosts(data ?? [])
        setReports((reportData ?? []) as ReportRow[])
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    load()
  }, [])

  const resolveReport = async (id: string, status: ReportRow['status']) => {
    try {
      setResolvingReportId(id)
      const { error } = await supabase
        .from('community_post_reports')
        .update({
          status,
          resolved_at: status === 'resolved' || status === 'rejected' ? new Date().toISOString() : null,
          resolved_by: status === 'resolved' || status === 'rejected' ? user?.id || null : null,
        })
        .eq('id', id)

      if (error) throw error
      setReports((prev) => prev.filter((r) => r.id !== id))
    } catch (e) {
      console.error('resolveReport:', e)
    } finally {
      setResolvingReportId(null)
    }
  }

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
      <div className="card p-4 mb-4" data-testid="admin-community-report-queue-summary">
        <p className="text-xs text-slate-400 mb-1">Open Moderation Reports</p>
        <p className="text-2xl font-bold text-white">{reports.length}</p>
      </div>

      {reports.length > 0 && (
        <div className="card overflow-hidden mb-6" data-testid="admin-community-report-queue-table">
          <div className="px-4 py-3 border-b border-white/10">
            <h3 className="text-sm font-semibold text-white">Moderation Queue</h3>
          </div>
          <div className="divide-y divide-white/10">
            {reports.map((report) => (
              <div key={report.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-sm text-white">Post: {report.post_id}</p>
                  <p className="text-xs text-slate-400">Reason: {report.reason} · {new Date(report.created_at).toLocaleString()}</p>
                  {report.details && <p className="text-xs text-slate-300 mt-1">{report.details}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => resolveReport(report.id, 'resolved')}
                    disabled={resolvingReportId === report.id}
                    data-testid={`admin-community-resolve-report-button-${report.id}`}
                    className="px-3 py-1.5 rounded text-xs font-medium bg-green-600/30 text-green-200 hover:bg-green-600/40 disabled:opacity-50"
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() => resolveReport(report.id, 'rejected')}
                    disabled={resolvingReportId === report.id}
                    data-testid={`admin-community-reject-report-button-${report.id}`}
                    className="px-3 py-1.5 rounded text-xs font-medium bg-red-600/30 text-red-200 hover:bg-red-600/40 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
