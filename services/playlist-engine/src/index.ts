import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null
function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY
    if (!url || !key) throw new Error('Missing Supabase env vars: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
    _supabase = createClient(url, key)
  }
  return _supabase
}

export interface ScheduleEntry {
  id: string
  channel_id: string
  asset_id: string
  scheduled_start: string
  scheduled_end: string
  position: number
  repeat_rule: string
  asset_title: string
  asset_duration: number
  asset_storage_path: string
  asset_thumbnail_url: string
}

export interface PlaylistSegment {
  uri: string
  duration: number
  title: string
  thumbnailUri?: string
}

export interface Playlist {
  channelId: string
  channelName: string
  generatedAt: string
  segments: PlaylistSegment[]
  totalDuration: number
}

export async function generatePlaylist(channelId: string, date?: Date): Promise<Playlist | null> {
  const targetDate = date || new Date()
  const dayStart = new Date(targetDate)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(targetDate)
  dayEnd.setHours(23, 59, 59, 999)

  const { data: channel, error: chErr } = await getSupabase()
    .from('media_channels')
    .select('id, name, slug, stream_url')
    .eq('id', channelId)
    .single()

  if (chErr || !channel) return null

  const { data: schedules, error: schedErr } = await getSupabase()
    .from('channel_schedules')
    .select(`
      id, channel_id, asset_id, scheduled_start, scheduled_end, position, repeat_rule,
      media_assets!inner (id, title, duration_seconds, storage_path, thumbnail_url, status)
    `)
    .eq('channel_id', channelId)
    .eq('is_active', true)
    .lte('scheduled_start', dayEnd.toISOString())
    .gte('scheduled_end', dayStart.toISOString())
    .order('scheduled_start', { ascending: true })

  if (schedErr || !schedules?.length) return null

  const segments: PlaylistSegment[] = []
  let totalDuration = 0

  for (const sched of schedules) {
    const asset = (sched as any).media_assets
    if (!asset || asset.status !== 'ready') continue

    segments.push({
      uri: asset.storage_path,
      duration: asset.duration_seconds,
      title: asset.title,
      thumbnailUri: asset.thumbnail_url || undefined,
    })
    totalDuration += asset.duration_seconds
  }

  return {
    channelId: channel.id,
    channelName: channel.name,
    generatedAt: new Date().toISOString(),
    segments,
    totalDuration,
  }
}

export function generateM3U8(playlist: Playlist): string {
  const lines: string[] = [
    '#EXTM3U',
    '#EXT-X-VERSION:3',
    `#EXT-X-PLAYLIST-TYPE:EVENT`,
    '#EXT-X-TARGETDURATION:10',
  ]

  for (const seg of playlist.segments) {
    if (seg.thumbnailUri) {
      lines.push(`#EXT-X-DISCONTINUITY`)
      lines.push(`#EXTINF:${seg.duration},`)
      lines.push(seg.uri)
    } else {
      lines.push(`#EXTINF:${seg.duration},`)
      lines.push(seg.uri)
    }
  }

  lines.push('#EXT-X-ENDLIST')
  return lines.join('\n')
}

export async function getChannelManifest(channelId: string): Promise<string | null> {
  const playlist = await generatePlaylist(channelId)
  if (!playlist) return null
  return generateM3U8(playlist)
}
