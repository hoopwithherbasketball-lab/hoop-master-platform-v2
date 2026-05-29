import { useState } from 'react'
import type { Database } from '@hoop-master/types'

type AnalyticsEvent = Database['public']['Tables']['analytics_events']['Insert']

export function useAnalyticsIngestion() {
  const [sending, setSending] = useState(false)

  const ingestEvent = async (event: AnalyticsEvent) => {
    setSending(true)
    try {
      const res = await fetch('/api/analytics/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      })
      if (!res.ok) throw new Error('Failed to ingest event')
      return true
    } catch (err) {
      console.error('Analytics ingestion error:', err)
      return false
    } finally {
      setSending(false)
    }
  }

  const ingestBatch = async (events: AnalyticsEvent[]) => {
    setSending(true)
    try {
      const res = await fetch('/api/analytics/ingest/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
      })
      if (!res.ok) throw new Error('Failed to ingest batch')
      return await res.json()
    } catch (err) {
      console.error('Analytics batch ingestion error:', err)
      return { success: 0, failed: events.length }
    } finally {
      setSending(false)
    }
  }

  const fetchChannelStats = async (channelId: string) => {
    try {
      const res = await fetch(`/api/analytics/channel/${channelId}`)
      if (!res.ok) return null
      const data = await res.json()
      return data.stats
    } catch (err) {
      console.error('Failed to fetch channel stats:', err)
      return null
    }
  }

  return { sending, ingestEvent, ingestBatch, fetchChannelStats }
}
