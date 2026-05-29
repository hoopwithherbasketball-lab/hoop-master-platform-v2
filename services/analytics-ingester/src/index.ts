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

export type EventType = 'play' | 'pause' | 'stop' | 'heartbeat' | 'seek' | 'ad_start' | 'ad_end' | 'fullscreen' | 'quality_change'

export interface AnalyticsEvent {
  channel_id?: string
  asset_id?: string
  viewer_id?: string
  session_id: string
  event_type: EventType
  watch_seconds?: number
  metadata?: Record<string, unknown>
}

export interface ChannelStats {
  channelId: string
  totalViews: number
  totalWatchSeconds: number
  uniqueViewers: number
  avgWatchPercent: number
  adImpressions: number
}

export async function ingestEvent(event: AnalyticsEvent): Promise<boolean> {
  const { error } = await getSupabase().from('analytics_events').insert({
    channel_id: event.channel_id || null,
    asset_id: event.asset_id || null,
    viewer_id: event.viewer_id || null,
    session_id: event.session_id,
    event_type: event.event_type,
    watch_seconds: event.watch_seconds || 0,
    metadata: event.metadata || {},
  })

  return !error
}

export async function ingestBatch(events: AnalyticsEvent[]): Promise<{ success: number; failed: number }> {
  const rows = events.map(e => ({
    channel_id: e.channel_id || null,
    asset_id: e.asset_id || null,
    viewer_id: e.viewer_id || null,
    session_id: e.session_id,
    event_type: e.event_type,
    watch_seconds: e.watch_seconds || 0,
    metadata: e.metadata || {},
  }))

  const { error } = await getSupabase().from('analytics_events').insert(rows)
  return { success: error ? 0 : events.length, failed: error ? events.length : 0 }
}

export async function getChannelStats(channelId: string, since?: Date): Promise<ChannelStats | null> {
  const sinceTime = since || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const { data: plays } = await getSupabase()
    .from('analytics_events')
    .select('event_type, watch_seconds, session_id')
    .eq('channel_id', channelId)
    .gte('created_at', sinceTime.toISOString())

  if (!plays) return null

  const totalViews = plays.filter(p => p.event_type === 'play').length
  const totalWatchSeconds = plays.reduce((sum, p) => sum + (p.watch_seconds || 0), 0)
  const uniqueSessions = new Set(plays.map(p => p.session_id)).size
  const adImpressions = plays.filter(p => p.event_type === 'ad_start').length

  return {
    channelId,
    totalViews,
    totalWatchSeconds,
    uniqueViewers: uniqueSessions,
    avgWatchPercent: 0,
    adImpressions,
  }
}

export async function getAssetStats(assetId: string, since?: Date): Promise<Record<string, unknown> | null> {
  const sinceTime = since || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const { data: events } = await getSupabase()
    .from('analytics_events')
    .select('event_type, watch_seconds, session_id')
    .eq('asset_id', assetId)
    .gte('created_at', sinceTime.toISOString())

  if (!events) return null

  return {
    assetId,
    totalPlays: events.filter(e => e.event_type === 'play').length,
    totalWatchSeconds: events.reduce((sum, e) => sum + (e.watch_seconds || 0), 0),
    uniqueViewers: new Set(events.map(e => e.session_id)).size,
  }
}
