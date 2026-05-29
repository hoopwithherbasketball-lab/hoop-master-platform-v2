import { Router } from 'express'
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

export const playerConfigRouter = Router()

playerConfigRouter.get('/config/:channelSlug', async (req, res) => {
  try {
    const { data: channel, error: chErr } = await getSupabase()
      .from('media_channels')
      .select('id, name, slug, channel_type, branding, stream_url')
      .eq('slug', req.params.channelSlug)
      .eq('status', 'active')
      .single()

    if (chErr || !channel) return res.status(404).json({ error: 'Channel not found' })

    const { data: adSlots } = await getSupabase()
      .from('ad_slots')
      .select('position, duration_seconds, ad_tag_url')
      .eq('channel_id', channel.id)
      .eq('is_active', true)

    const { data: tenant } = await getSupabase()
      .from('tenant_channels')
      .select('white_label_tenants!inner(name, player_branding, custom_domain)')
      .eq('channel_id', channel.id)
      .single()

    res.json({
      channel: {
        id: channel.id,
        name: channel.name,
        type: channel.channel_type,
        streamUrl: channel.stream_url,
        branding: channel.branding,
      },
      adSlots: adSlots || [],
      tenant: (tenant as any)?.white_label_tenants || null,
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch player config' })
  }
})

playerConfigRouter.get('/config/domain/:domain', async (req, res) => {
  try {
    const { data: tenant, error } = await getSupabase()
      .from('white_label_tenants')
      .select('id, name, slug, player_branding, custom_domain')
      .eq('custom_domain', req.params.domain)
      .eq('status', 'active')
      .single()

    if (error || !tenant) return res.status(404).json({ error: 'Tenant not found' })

    const { data: channels } = await getSupabase()
      .from('tenant_channels')
      .select('media_channels!inner(id, slug, name, channel_type, thumbnail_url)')
      .eq('tenant_id', tenant.id)

    res.json({
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        branding: tenant.player_branding,
      },
      channels: (channels || []).map((c: any) => c.media_channels),
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch domain config' })
  }
})
