import { Router, type Response } from 'express'
import { createClient } from '@supabase/supabase-js'
import { buildTvCatalog, buildRokuFeed, type TvAsset } from '../tv/catalog.js'

export const rokuRouter = Router()

// Created per request so the API can boot and report a useful error when media
// credentials have not yet been configured in a deployment.
async function getCatalog() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('TV catalog Supabase credentials are not configured')

  const { data, error } = await createClient(url, key)
    .from('media_assets')
    .select('id, title, description, storage_path, thumbnail_url, created_at, tags, category, duration_seconds')
    .eq('publish_to_roku', true)
    .eq('status', 'ready')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`TV catalog query failed: ${error.message}`)
  return buildTvCatalog((data ?? []) as TvAsset[])
}

async function sendCatalog(res: Response, format: 'roku' | 'catalog') {
  try {
    const catalog = await getCatalog()
    // Publishing changes should propagate quickly, including removals.
    res.set('Cache-Control', 'public, max-age=60, s-maxage=60')
    res.json(format === 'roku' ? buildRokuFeed(catalog) : catalog)
  } catch (error) {
    console.error('[tv] Catalog unavailable:', error)
    res.status(503).json({ error: 'TV catalog temporarily unavailable' })
  }
}

// Existing Roku SceneGraph consumer; do not change its feed contract.
rokuRouter.get('/feed', (_req, res) => { void sendCatalog(res, 'roku') })

// Provider-neutral HTTPS catalog for channel-builder mapping. FireBossTV's
// exact import schema must be confirmed before offering a provider-specific feed.
export const tvRouter = Router()
tvRouter.get('/catalog', (_req, res) => { void sendCatalog(res, 'catalog') })
