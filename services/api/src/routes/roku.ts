import { Router } from 'express'
import { createClient } from '@supabase/supabase-js'

export const rokuRouter = Router()

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * GET /api/roku/feed
 * Returns the Roku Direct Publisher JSON Feed
 * Caches heavily for 1 hour to prevent Supabase read-spikes from aggressive polling
 */
rokuRouter.get('/feed', async (req, res) => {
  try {
    const { data: assets, error } = await supabase
      .from('media_assets')
      .select('id, title, description, storage_path, thumbnail_url, created_at, tags')
      .eq('publish_to_roku', true)
      .eq('status', 'ready')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Roku Feed DB Error:', error)
      return res.status(500).json({ error: 'Failed to query assets' })
    }

    // Roku BrightScript Direct Publisher format
    const feed = {
      providerName: "HOOP WITH HER",
      lastUpdated: new Date().toISOString(),
      language: "en-US",
      movies: (assets || []).map(asset => ({
        id: asset.id,
        title: asset.title,
        shortDescription: asset.description || asset.title,
        thumbnail: asset.thumbnail_url || "https://hoopwithher.com/fallback-roku.png",
        genres: asset.tags && asset.tags.length > 0 ? asset.tags : ["sports"],
        tags: asset.tags || ["sports"],
        releaseDate: asset.created_at,
        content: {
          dateAdded: asset.created_at,
          videos: [
            {
              url: asset.storage_path, // Cloudflare/Mux HLS or MP4 URL
              quality: "HD",
              videoType: asset.storage_path.endsWith('.m3u8') ? "HLS" : "MP4"
            }
          ]
        }
      }))
    }

    // Protect our Supabase quotas via Edge caching
    res.set('Cache-Control', 'public, max-age=3600')
    res.json(feed)
  } catch (err) {
    console.error('Roku Feed Internal Error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})


