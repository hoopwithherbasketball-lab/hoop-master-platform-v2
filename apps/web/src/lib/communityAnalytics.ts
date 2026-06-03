import { supabase } from './supabase'

const getSessionId = () => {
  const key = 'community-analytics-session-id'
  const existing = localStorage.getItem(key)
  if (existing) return existing
  const created = `community-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  localStorage.setItem(key, created)
  return created
}

export async function trackCommunityEvent(eventType: string, viewerId?: string, metadata: Record<string, unknown> = {}) {
  try {
    const sessionId = getSessionId()
    await supabase.from('analytics_events').insert({
      viewer_id: viewerId || null,
      session_id: sessionId,
      event_type: 'quality_change',
      watch_seconds: 0,
      metadata: { app_event: eventType, ...metadata },
    })
  } catch (error) {
    console.error('trackCommunityEvent failed:', error)
  }
}
