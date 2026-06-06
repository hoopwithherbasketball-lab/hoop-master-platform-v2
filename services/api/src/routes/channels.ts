import { Router, type Request, type Response, type NextFunction } from 'express'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { generatePlaylist, generateM3U8 } from '@hoop-master/playlist-engine'
import { getAdSlotsForChannel, injectAdMarkers } from '@hoop-master/ad-insertion'

let _supabase: SupabaseClient | null = null
function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY
    if (!url || !key) throw new Error('Missing Supabase env vars: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
    _supabase = createClient(url, key)
  }
  return _supabase
}

function asyncHandler(fn: (req: Request, res: Response) => Promise<unknown>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res).catch(next)
  }
}

export const channelsRouter = Router()

channelsRouter.get('/', asyncHandler(async (_req, res) => {
  const { data, error } = await getSupabase()
    .from('media_channels')
    .select('id, slug, name, description, channel_type, status, branding, thumbnail_url, is_public')
    .eq('status', 'active')
    .order('name', { ascending: true })

  if (error) {
    console.error('[channels] List error:', error.message)
    return res.status(500).json({ error: 'Failed to fetch channels', details: error.message })
  }
  res.json({ channels: data })
}))

channelsRouter.get('/:id', asyncHandler(async (req, res) => {
  const { data, error } = await getSupabase()
    .from('media_channels')
    .select('*')
    .eq('id', req.params.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return res.status(404).json({ error: 'Channel not found' })
    console.error('[channels] Get error:', error.message)
    return res.status(500).json({ error: 'Failed to fetch channel', details: error.message })
  }
  res.json({ channel: data })
}))

channelsRouter.get('/:id/manifest', asyncHandler(async (req, res) => {
  const channelId = req.params.id
  const playlist = await generatePlaylist(channelId)
  if (!playlist) return res.status(404).json({ error: 'No schedule found for this channel' })

  let m3u8 = generateM3U8(playlist)
  
  try {
    const adSlots = await getAdSlotsForChannel(channelId)
    if (adSlots.length > 0) {
      m3u8 = injectAdMarkers(m3u8, adSlots, new Date(playlist.generatedAt))
    }
  } catch (err) {
    console.error('[channels] Ad marker injection failed:', err)
  }

  res.set('Content-Type', 'application/vnd.apple.mpegurl')
  res.set('Cache-Control', 'max-age=10')
  res.send(m3u8)
}))

channelsRouter.post('/:id/schedule', asyncHandler(async (req, res) => {
  const { asset_id, scheduled_start, scheduled_end, position, repeat_rule } = req.body

  if (!asset_id || !scheduled_start || !scheduled_end) {
    return res.status(400).json({ error: 'Missing required fields: asset_id, scheduled_start, scheduled_end' })
  }

  if (new Date(scheduled_end) <= new Date(scheduled_start)) {
    return res.status(400).json({ error: 'scheduled_end must be after scheduled_start' })
  }

  const { data, error } = await getSupabase()
    .from('channel_schedules')
    .upsert({
      channel_id: req.params.id,
      asset_id,
      scheduled_start,
      scheduled_end,
      position: position || 0,
      repeat_rule: repeat_rule || 'none',
    })
    .select()
    .single()

  if (error) {
    console.error('[channels] Schedule upsert error:', error.message)
    return res.status(500).json({ error: 'Failed to upsert schedule', details: error.message })
  }
  res.json({ schedule: data })
}))
