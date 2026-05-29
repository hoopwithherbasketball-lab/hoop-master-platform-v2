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

export interface AdSlot {
  id: string
  channel_id: string
  position: 'pre' | 'mid' | 'post'
  duration_seconds: number
  ad_tag_url: string
  scte35_cue: string | null
}

export interface SCTE35Cue {
  outTime: string
  duration: number
  adTagUrl: string
  cueId: string
}

function formatSCTE35Date(isoDate: string): string {
  const d = new Date(isoDate)
  const year = d.getUTCFullYear()
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  const hours = String(d.getUTCHours()).padStart(2, '0')
  const minutes = String(d.getUTCMinutes()).padStart(2, '0')
  const seconds = String(d.getUTCSeconds()).padStart(2, '0')
  return `${year}${month}${day}T${hours}${minutes}${seconds}.000Z`
}

export function generateSCTE35Tag(cue: SCTE35Cue): string {
  const durationMs = cue.duration * 1000
  const hexCueId = cue.cueId.replace(/-/g, '').substring(0, 8).toUpperCase()

  return [
    `#EXT-X-DATERANGE:${[
      `ID="${cue.cueId}"`,
      `CLASS="ADS-PLAYER-GOOGLE-ADS"`,
      `START-DATE="${formatSCTE35Date(cue.outTime)}"`,
      `DURATION=${durationMs / 1000}`,
      `SCTE35-OUT=0x${hexCueId}`,
      `SCTE35-IN=0x${hexCueId}`,
      `X-AD-TAG-URL="${cue.adTagUrl}"`,
    ].join(',')}`,
  ].join('\n')
}

export async function getAdSlotsForChannel(channelId: string): Promise<AdSlot[]> {
  const { data, error } = await getSupabase()
    .from('ad_slots')
    .select('*')
    .eq('channel_id', channelId)
    .eq('is_active', true)

  if (error) return []
  return (data || []) as AdSlot[]
}

export function injectAdMarkers(
  m3u8Content: string,
  adSlots: AdSlot[],
  scheduleStart: Date
): string {
  const lines = m3u8Content.split('\n')
  const result: string[] = []
  let elapsedSeconds = 0

  const preRollAds = adSlots.filter(s => s.position === 'pre')
  if (preRollAds.length > 0) {
    const ad = preRollAds[0]
    const cue: SCTE35Cue = {
      outTime: scheduleStart.toISOString(),
      duration: ad.duration_seconds,
      adTagUrl: ad.ad_tag_url,
      cueId: ad.id,
    }
    result.push(generateSCTE35Tag(cue))
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    result.push(line)

    if (line.startsWith('#EXTINF:')) {
      const match = line.match(/#EXTINF:([\d.]+)/)
      if (match) {
        elapsedSeconds += parseFloat(match[1])
      }
    }
  }

  const midAds = adSlots.filter(s => s.position === 'mid')
  for (const ad of midAds) {
    const adTime = new Date(scheduleStart.getTime() + elapsedSeconds * 500)
    const cue: SCTE35Cue = {
      outTime: adTime.toISOString(),
      duration: ad.duration_seconds,
      adTagUrl: ad.ad_tag_url,
      cueId: ad.id,
    }
    result.splice(result.length - 1, 0, generateSCTE35Tag(cue))
  }

  return result.join('\n')
}
