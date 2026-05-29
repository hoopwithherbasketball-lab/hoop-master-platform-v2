import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { BarChart3, Radio, Eye, Clock, Users, TrendingUp } from 'lucide-react'

interface Channel {
  id: string; name: string; slug: string; channel_type: string; status: string
}

interface ChannelStats {
  channelId: string
  totalViews: number
  totalWatchSeconds: number
  uniqueViewers: number
  adImpressions: number
}

interface AggregateRow {
  hour_bucket: string
  total_plays: number
  total_watch_seconds: number
  unique_viewers: number
  peak_concurrent: number
}

export default function AdminAnalyticsPage() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedChannel, setSelectedChannel] = useState<string>('')
  const [stats, setStats] = useState<ChannelStats | null>(null)
  const [aggregates, setAggregates] = useState<AggregateRow[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('7d')

  const loadChannels = useCallback(async () => {
    try {
      const { data } = await supabase.from('media_channels').select('id, name, slug, channel_type, status').order('name')
      setChannels(data ?? [])
      if (data?.length) setSelectedChannel(data[0].id)
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [])

  useEffect(() => { loadChannels() }, [loadChannels])

  const loadStats = useCallback(async () => {
    if (!selectedChannel) return
    try {
      const sinceDate = new Date()
      if (period === '7d') sinceDate.setDate(sinceDate.getDate() - 7)
      else if (period === '30d') sinceDate.setDate(sinceDate.getDate() - 30)
      else sinceDate.setDate(sinceDate.getDate() - 1)

      const { data: events } = await supabase
        .from('analytics_events')
        .select('event_type, watch_seconds, session_id')
        .eq('channel_id', selectedChannel)
        .gte('created_at', sinceDate.toISOString())

      if (events) {
        const plays = events.filter(e => e.event_type === 'play')
        const sessions = new Set(events.map(e => e.session_id))
        const adStarts = events.filter(e => e.event_type === 'ad_start')
        const totalWatch = events.reduce((sum, e) => sum + (e.watch_seconds || 0), 0)

        setStats({
          channelId: selectedChannel,
          totalViews: plays.length,
          totalWatchSeconds: totalWatch,
          uniqueViewers: sessions.size,
          adImpressions: adStarts.length,
        })
      }

      const { data: agg } = await supabase
        .from('analytics_aggregates')
        .select('hour_bucket, total_plays, total_watch_seconds, unique_viewers, peak_concurrent')
        .eq('channel_id', selectedChannel)
        .gte('hour_bucket', sinceDate.toISOString())
        .order('hour_bucket', { ascending: true })

      setAggregates(agg ?? [])
    } catch (e) { console.error(e) }
  }, [selectedChannel, period])

  useEffect(() => { loadStats() }, [loadStats])

  const formatHours = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }

  const maxPlays = Math.max(...aggregates.map(a => a.total_plays), 1)

  return (
    <DashboardLayout variant="admin" title="Analytics" subtitle="Channel and asset performance metrics">
      <div className="flex items-center gap-4 mb-6">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Channel</label>
          <select value={selectedChannel} onChange={e => setSelectedChannel(e.target.value)} className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white min-w-[200px]">
            {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Period</label>
          <select value={period} onChange={e => setPeriod(e.target.value)} className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white">
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map(i => <div key={i} className="animate-pulse card h-24" />)}
        </div>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="card p-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-2"><Eye size={14} /> Total Views</div>
              <div className="text-2xl font-bold text-white">{stats?.totalViews ?? 0}</div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-2"><Clock size={14} /> Watch Time</div>
              <div className="text-2xl font-bold text-white">{stats ? formatHours(stats.totalWatchSeconds) : '0m'}</div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-2"><Users size={14} /> Unique Viewers</div>
              <div className="text-2xl font-bold text-white">{stats?.uniqueViewers ?? 0}</div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-2"><TrendingUp size={14} /> Ad Impressions</div>
              <div className="text-2xl font-bold text-white">{stats?.adImpressions ?? 0}</div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><BarChart3 size={14} /> Plays Over Time</h3>
            {aggregates.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No analytics data yet. Data will appear once viewers start watching.</p>
            ) : (
              <div className="flex items-end gap-1 h-40">
                {aggregates.map((a, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-[#0134BD] min-h-[2px] transition-all"
                      style={{ height: `${(a.total_plays / maxPlays) * 100}%` }}
                      title={`${a.total_plays} plays`}
                    />
                  </div>
                ))}
              </div>
            )}
            {aggregates.length > 0 && (
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>{new Date(aggregates[0].hour_bucket).toLocaleDateString()}</span>
                <span>{new Date(aggregates[aggregates.length - 1].hour_bucket).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          <div className="card p-6 mt-4">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Radio size={14} /> All Channels</h3>
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="px-3 py-2 text-left text-xs text-slate-400 uppercase">Channel</th>
                  <th className="px-3 py-2 text-left text-xs text-slate-400 uppercase">Type</th>
                  <th className="px-3 py-2 text-left text-xs text-slate-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {channels.map(c => (
                  <tr key={c.id} className="hover:bg-white/5">
                    <td className="px-3 py-2 text-white">{c.name}</td>
                    <td className="px-3 py-2 text-slate-400 capitalize">{c.channel_type}</td>
                    <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded text-xs ${c.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
