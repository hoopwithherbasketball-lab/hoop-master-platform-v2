import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null
function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY
    if (!url || !key) throw new Error('Missing Supabase env vars')
    _supabase = createClient(url, key)
  }
  return _supabase
}

export interface EPGProgram {
  id: string
  channelId: string
  channelName: string
  title: string
  description: string
  startTime: string
  endTime: string
  thumbnailUrl?: string
  assetId?: string
  episodeNumber?: number
  seasonNumber?: number
}

export interface EPGChannel {
  id: string
  name: string
  slug: string
  thumbnailUrl: string
  programs: EPGProgram[]
}

export interface EPGFeed {
  generatedAt: string
  date: string
  channels: EPGChannel[]
}

export async function generateEPG(date?: string): Promise<EPGFeed> {
  const targetDate = date || new Date().toISOString().split('T')[0]
  const dayStart = `${targetDate}T00:00:00Z`
  const dayEnd = `${targetDate}T23:59:59Z`

  const { data: channels } = await getSupabase()
    .from('media_channels')
    .select('id, name, slug, thumbnail_url')
    .eq('status', 'active')
    .eq('is_public', true)

  const channelList: EPGChannel[] = []

  for (const ch of channels || []) {
    const { data: programs } = await getSupabase()
      .from('epg_programs')
      .select(`
        id, channel_id, asset_id, start_time, end_time, title, description,
        episode_number, season_number, metadata,
        media_assets (thumbnail_url)
      `)
      .eq('channel_id', ch.id)
      .lte('start_time', dayEnd)
      .gte('end_time', dayStart)
      .order('start_time', { ascending: true })

    const epgPrograms: EPGProgram[] = (programs || []).map((p: any) => ({
      id: p.id,
      channelId: ch.id,
      channelName: ch.name,
      title: p.title,
      description: p.description || '',
      startTime: p.start_time,
      endTime: p.end_time,
      thumbnailUrl: p.media_assets?.thumbnail_url || ch.thumbnail_url,
      assetId: p.asset_id,
      episodeNumber: p.episode_number,
      seasonNumber: p.season_number,
    }))

    channelList.push({
      id: ch.id,
      name: ch.name,
      slug: ch.slug,
      thumbnailUrl: ch.thumbnail_url || '',
      programs: epgPrograms,
    })
  }

  return {
    generatedAt: new Date().toISOString(),
    date: targetDate,
    channels: channelList,
  }
}

export function generateEPGJSON(epgFeed: EPGFeed): string {
  return JSON.stringify(epgFeed, null, 2)
}

export function generateRokuEPG(epgFeed: EPGFeed): object {
  return {
    provider: 'Hoop With Her',
    date: epgFeed.date,
    generatedAt: epgFeed.generatedAt,
    channels: epgFeed.channels.map(ch => ({
      id: ch.id,
      name: ch.name,
      image: ch.thumbnailUrl,
      number: ch.slug,
      program: ch.programs.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        startTime: p.startTime,
        endTime: p.endTime,
        image: p.thumbnailUrl,
        episodeNumber: p.episodeNumber,
        seasonNumber: p.seasonNumber,
      })),
    })),
  }
}
