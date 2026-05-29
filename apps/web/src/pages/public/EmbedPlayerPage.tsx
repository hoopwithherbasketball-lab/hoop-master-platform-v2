import { useEffect, useState, Suspense, lazy } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const HLSPlayer = lazy(() => import('../../components/HLSPlayer'))

interface Channel {
  id: string; name: string; channel_type: string
  stream_url: string | null; branding: Record<string, unknown>
}

interface AdSlot {
  ad_tag_url: string; position: string; duration_seconds: number
}

export default function EmbedPlayerPage() {
  const { slug } = useParams<{ slug: string }>()
  const [channel, setChannel] = useState<Channel | null>(null)
  const [adSlots, setAdSlots] = useState<AdSlot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    const load = async () => {
      try {
        const { data: ch } = await supabase
          .from('media_channels')
          .select('id, name, channel_type, stream_url, branding')
          .eq('slug', slug)
          .eq('status', 'active')
          .single()

        if (!ch) { setLoading(false); return }
        setChannel(ch)

        const { data: ads } = await supabase
          .from('ad_slots')
          .select('ad_tag_url, position, duration_seconds')
          .eq('channel_id', ch.id)
          .eq('is_active', true)

        setAdSlots(ads ?? [])
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    load()
  }, [slug])

  useEffect(() => {
    window.parent?.postMessage({ type: 'hwh-player-ready', slug }, '*')
  }, [slug])

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'hwh-play') {
        const video = document.querySelector('video')
        video?.play()
      } else if (e.data?.type === 'hwh-pause') {
        const video = document.querySelector('video')
        video?.pause()
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <p className="text-white/60 text-sm">Channel not found</p>
      </div>
    )
  }

  const manifestUrl = `/api/channels/${channel.id}/manifest`

  return (
    <div className="w-full h-screen bg-black m-0 p-0 overflow-hidden">
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" /></div>}>
        <HLSPlayer
          src={manifestUrl}
          channelId={channel.id}
          branding={channel.branding as any}
          className="w-full h-full"
        />
      </Suspense>
    </div>
  )
}
