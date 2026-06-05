import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Flag, CircleCheck as CheckCircle, Circle as XCircle, Eye, RefreshCw, TriangleAlert as AlertTriangle } from 'lucide-react'

interface Report {
  id: string
  post_id: string
  reporter_id: string
  reason: string
  details: string
  status: string
  created_at: string
  resolved_at: string | null
  post_content: string
  post_author: string
}

const reasonColors: Record<string, string> = {
  spam: 'bg-yellow-500/20 text-yellow-400',
  abuse: 'bg-red-500/20 text-red-400',
  harassment: 'bg-red-500/20 text-red-400',
  misinformation: 'bg-orange-500/20 text-orange-400',
  other: 'bg-slate-500/20 text-slate-400',
}

const statusColors: Record<string, string> = {
  open: 'bg-amber-500/20 text-amber-400',
  reviewing: 'bg-blue-500/20 text-blue-400',
  resolved: 'bg-green-500/20 text-green-400',
  rejected: 'bg-slate-500/20 text-slate-400',
}

export default function AdminModerationQueuePage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('open')
  const [processing, setProcessing] = useState<string | null>(null)
  const [viewPost, setViewPost] = useState<Report | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      let q = supabase
        .from('community_post_reports')
        .select('id, post_id, reporter_id, reason, details, status, created_at, resolved_at')
        .order('created_at', { ascending: false })

      if (statusFilter) q = q.eq('status', statusFilter)

      const { data: reportData, error } = await q
      if (error) { console.error('AdminModerationQueuePage load error:', error.message); setLoading(false); return }

      const postIds = [...new Set((reportData ?? []).map(r => r.post_id))]
      const postsMap: Record<string, { content: string; author_name: string }> = {}

      if (postIds.length > 0) {
        const { data: posts } = await supabase
          .from('community_posts')
          .select('id, content, author_name')
          .in('id', postIds)
        for (const p of posts ?? []) postsMap[p.id] = { content: p.content, author_name: p.author_name }
      }

      setReports((reportData ?? []).map(r => ({
        ...r,
        post_content: postsMap[r.post_id]?.content ?? '[post deleted]',
        post_author: postsMap[r.post_id]?.author_name ?? 'Unknown',
      })))
    } catch (e) { console.error('AdminModerationQueuePage exception:', e) }
    setLoading(false)
  }, [statusFilter])

  useEffect(() => { load() }, [load])

  async function updateStatus(reportId: string, newStatus: string) {
    setProcessing(reportId)
    const { error } = await supabase
      .from('community_post_reports')
      .update({ status: newStatus, resolved_at: ['resolved', 'rejected'].includes(newStatus) ? new Date().toISOString() : null })
      .eq('id', reportId)
    if (error) console.error('updateStatus error:', error.message)
    setProcessing(null)
    load()
  }

  async function deletePost(postId: string, reportId: string) {
    setProcessing(reportId)
    await supabase.from('community_posts').delete().eq('id', postId)
    await supabase.from('community_post_reports').update({ status: 'resolved', resolved_at: new Date().toISOString() }).eq('id', reportId)
    setProcessing(null)
    setViewPost(null)
    load()
  }

  const counts = reports.reduce<Record<string, number>>((acc, r) => { acc[r.status] = (acc[r.status] || 0) + 1; return acc }, {})

  return (
    <DashboardLayout variant="admin" title="Moderation Queue" subtitle="Review and action community post reports">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {['open', 'reviewing', 'resolved', 'rejected', ''].map(s => (
            <button
              key={s || 'all'}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${statusFilter === s ? 'bg-[#0134BD] text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}
            >
              {s || 'All'}
              {s === 'open' && counts['open'] ? ` (${counts['open']})` : ''}
            </button>
          ))}
          <button onClick={load} className="ml-auto p-2 text-slate-400 hover:text-white">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-navy-800 rounded-xl" />)}
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-navy-800 rounded-xl p-12 text-center border border-white/5">
            <CheckCircle size={36} className="mx-auto mb-3 text-green-500" />
            <p className="text-white font-semibold">No {statusFilter || ''} reports</p>
            <p className="text-slate-400 text-sm mt-1">The queue is clear.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map(r => (
              <div key={r.id} className="bg-navy-800 rounded-xl p-4 border border-white/5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Flag size={16} className="text-red-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${reasonColors[r.reason] ?? 'bg-slate-500/20 text-slate-400'}`}>{r.reason}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[r.status] ?? 'bg-slate-500/20 text-slate-400'}`}>{r.status}</span>
                        <span className="text-xs text-slate-500">{new Date(r.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-300 mt-1.5 line-clamp-1">
                        <span className="text-slate-500">Post by</span> <span className="text-white font-medium">{r.post_author}</span>
                        {' — '}<span className="italic">{r.post_content.slice(0, 100)}{r.post_content.length > 100 ? '…' : ''}</span>
                      </p>
                      {r.details && <p className="text-xs text-slate-500 mt-1">Reporter note: {r.details}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setViewPost(r)}
                      className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
                      title="View full post"
                    >
                      <Eye size={14} className="text-slate-400" />
                    </button>
                    {r.status === 'open' && (
                      <button
                        onClick={() => updateStatus(r.id, 'reviewing')}
                        disabled={processing === r.id}
                        className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        Review
                      </button>
                    )}
                    {(r.status === 'open' || r.status === 'reviewing') && (
                      <>
                        <button
                          onClick={() => updateStatus(r.id, 'rejected')}
                          disabled={processing === r.id}
                          className="w-8 h-8 bg-white/5 hover:bg-slate-500/20 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                          title="Dismiss report"
                        >
                          <XCircle size={14} className="text-slate-400" />
                        </button>
                        <button
                          onClick={() => updateStatus(r.id, 'resolved')}
                          disabled={processing === r.id}
                          className="w-8 h-8 bg-white/5 hover:bg-green-500/20 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                          title="Mark resolved (keep post)"
                        >
                          <CheckCircle size={14} className="text-green-400" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post detail modal */}
      {viewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setViewPost(null)}>
          <div className="bg-navy-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-amber-400" />
              <h3 className="font-bold text-white">Reported Post</h3>
            </div>
            <div className="bg-white/5 rounded-xl p-4 mb-4">
              <p className="text-xs text-slate-500 mb-1">Author: <span className="text-slate-300">{viewPost.post_author}</span></p>
              <p className="text-sm text-white leading-relaxed">{viewPost.post_content}</p>
            </div>
            <div className="flex items-center gap-2 mb-5">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${reasonColors[viewPost.reason] ?? ''}`}>{viewPost.reason}</span>
              {viewPost.details && <p className="text-xs text-slate-500">"{viewPost.details}"</p>}
            </div>
            <div className="flex justify-between gap-2">
              <button
                onClick={() => deletePost(viewPost.post_id, viewPost.id)}
                disabled={processing === viewPost.id}
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                <Flag size={14} /> Delete Post
              </button>
              <div className="flex gap-2">
                <button onClick={() => { updateStatus(viewPost.id, 'rejected'); setViewPost(null) }} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Dismiss</button>
                <button onClick={() => { updateStatus(viewPost.id, 'resolved'); setViewPost(null) }} className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <CheckCircle size={14} /> Resolve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
