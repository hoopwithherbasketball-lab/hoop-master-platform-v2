export interface TvAsset {
  id: string
  title: string
  description: string | null
  storage_path: string
  thumbnail_url: string | null
  created_at: string
  tags: string[] | null
  category: string | null
  duration_seconds: number | null
}

export interface TvVideo {
  id: string
  title: string
  description: string
  streamUrl: string
  streamFormat: 'hls' | 'mp4'
  thumbnailUrl: string
  publishedAt: string
  category: string
  tags: string[]
  durationSeconds: number | null
}

/** Only absolute, public HTTPS media URLs may appear in unauthenticated feeds. */
export function publicHttpsUrl(input: unknown): URL | null {
  if (typeof input !== 'string') return null
  try {
    const url = new URL(input)
    if (url.protocol !== 'https:' || !url.hostname || url.username || url.password || url.search || url.hash) return null
    return url
  } catch { return null }
}

export function tvStreamFormat(url: URL): 'hls' | 'mp4' | null {
  if (/\.m3u8$/i.test(url.pathname)) return 'hls'
  if (/\.mp4$/i.test(url.pathname)) return 'mp4'
  return null
}

export function buildTvCatalog(assets: TvAsset[]) {
  const videos: TvVideo[] = []
  for (const asset of assets) {
    const stream = publicHttpsUrl(asset.storage_path)
    const poster = publicHttpsUrl(asset.thumbnail_url)
    const format = stream && tvStreamFormat(stream)
    if (!asset.id || !asset.title?.trim() || !stream || !poster || !format) continue

    videos.push({
      id: asset.id,
      title: asset.title,
      description: asset.description || asset.title,
      streamUrl: stream.href,
      streamFormat: format,
      thumbnailUrl: poster.href,
      publishedAt: asset.created_at,
      category: asset.category || 'Featured',
      tags: Array.isArray(asset.tags) ? asset.tags.filter((tag): tag is string => typeof tag === 'string' && !!tag.trim()) : [],
      durationSeconds: typeof asset.duration_seconds === 'number' && asset.duration_seconds > 0 ? asset.duration_seconds : null,
    })
  }
  return { providerName: 'HOOP WITH HER', videos }
}

export function buildRokuFeed(catalog: ReturnType<typeof buildTvCatalog>) {
  return {
    providerName: catalog.providerName,
    lastUpdated: new Date().toISOString(),
    language: 'en-US',
    movies: catalog.videos.map(video => ({
      id: video.id,
      title: video.title,
      shortDescription: video.description,
      thumbnail: video.thumbnailUrl,
      genres: video.tags.length ? video.tags : [video.category],
      tags: video.tags.length ? video.tags : [video.category],
      releaseDate: video.publishedAt,
      content: { dateAdded: video.publishedAt, videos: [{ url: video.streamUrl, quality: 'HD', videoType: video.streamFormat === 'hls' ? 'HLS' : 'MP4' }] },
    })),
  }
}
