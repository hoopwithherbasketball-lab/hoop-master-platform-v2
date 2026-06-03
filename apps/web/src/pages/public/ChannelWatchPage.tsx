import { useEffect, useState, Suspense, lazy } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { ArrowLeft, Radio, Tv, Play, Calendar } from 'lucide-react'

const HLSPlayer = lazy(() => import('../../components/HLSPlayer'))

interface Channel {
  id: string; slug: string; name: string; description: string
  channel_type: string; stream_url: string | null; thumbnail_url: string
  branding: Record<string, unknown>
}

interface Program {
  id: string; title: string; description: string; start_time: string; end_time: string
}

export default function ChannelWatchPage() {
  const { slug } = useParams<{ slug: string }>()
  const [channel, setChannel] = useState<Channel | null>(null)
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    const load = async () => {
      try {
        const { data: ch, error: chErr } = await supabase
          .from('media_channels')
          .select('id, slug, name, description, channel_type, stream_url, thumbnail_url, branding')
          .eq('slug', slug)
          .eq('status', 'active')
          .single()

        if (chErr || !ch) { setError('Channel not found'); setLoading(false); return }
        setChannel(ch)

        const now = new Date()
        const dayStart = new Date(now)
        dayStart.setHours(0, 0, 0, 0)
        const dayEnd = new Date(now)
        dayEnd.setHours(23, 59, 59, 999)

        const { data: progs } = await supabase
          .from('epg_programs')
          .select('id, title, description, start_time, end_time')
          .eq('channel_id', ch.id)
          .lte('start_time', dayEnd.toISOString())
          .gte('end_time', dayStart.toISOString())
          .order('start_time', { ascending: true })

        setPrograms(progs ?? [])
      } catch (e) { console.error(e); setError('Failed to load channel') }
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !channel) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Channel Not Found</h2>
          <p className="text-slate-400 mb-4">{error || 'This channel does not exist or is not active.'}</p>
          <Link data-testid="channel-watch-browse-channels-link" to="/watch" className="text-[#0134BD] hover:underline">Browse Channels</Link>
        </div>
      </div>
    )
  }

  const manifestUrl = `/api/channels/${channel.id}/manifest`
  const now = new Date()
  const currentProgram = programs.find(p => new Date(p.start_time) <= now && new Date(p.end_time) > now)

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="p-4">
          <Link data-testid="channel-watch-back-link" to="/watch" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to Channels
          </Link>
        </div>

        <div className="px-4 pb-6">
          <Suspense fallback={<div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center"><div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" /></div>}>
            <HLSPlayer
              src={manifestUrl}
              channelId={channel.id}
              branding={channel.branding as any}
              className="max-w-5xl mx-auto"
            />
          </Suspense>
        </div>

        <div className="px-4 pb-10 max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            {channel.channel_type === 'live' ? <Radio size={20} className="text-red-400" /> :
             channel.channel_type === 'linear' ? <Tv size={20} className="text-blue-400" /> :
             <Play size={20} className="text-green-400" />}
            <h1 className="text-2xl font-bold text-white">{channel.name}</h1>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${channel.channel_type === 'live' ? 'bg-red-500 text-white' : channel.channel_type === 'linear' ? 'bg-blue-500/90 text-white' : 'bg-green-500/90 text-white'}`}>
              {channel.channel_type === 'live' ? 'LIVE' : channel.channel_type === 'linear' ? '24/7' : 'VOD'}
            </span>
          </div>
          {channel.description && <p className="text-slate-400 mb-6">{channel.description}</p>}

          {programs.length > 0 && (
            <div className="bg-navy-800 rounded-xl p-5 border border-white/10">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                <Calendar size={14} /> Today's Schedule
              </h2>
              <div className="space-y-2">
                {programs.map(p => {
                  const isCurrent = currentProgram?.id === p.id
                  const start = new Date(p.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                  const end = new Date(p.end_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                  return (
                    <div key={p.id} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isCurrent ? 'bg-[#0134BD]/20 ring-1 ring-[#0134BD]/50' : 'bg-white/5'}`}>
                      <span className="text-xs text-slate-400 w-24 shrink-0">{start} - {end}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${isCurrent ? 'text-white' : 'text-slate-300'}`}>{p.title}</p>
                        {p.description && <p className="text-xs text-slate-500 truncate">{p.description}</p>}
                      </div>
                      {isCurrent && <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded font-bold animate-pulse">NOW</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
