import { Router, type Request, type Response, type NextFunction } from 'express'
import { ingestEvent, ingestBatch, getChannelStats, getAssetStats } from '@hoop-master/analytics-ingester'

function asyncHandler(fn: (req: Request, res: Response) => Promise<unknown>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res).catch(next)
  }
}

const VALID_EVENT_TYPES = ['play', 'pause', 'stop', 'heartbeat', 'seek', 'ad_start', 'ad_end', 'fullscreen', 'quality_change']

export const analyticsRouter = Router()

analyticsRouter.post('/ingest', asyncHandler(async (req, res) => {
  const event = req.body

  if (!event.session_id || typeof event.session_id !== 'string') {
    return res.status(400).json({ error: 'session_id (string) is required' })
  }
  if (!event.event_type || !VALID_EVENT_TYPES.includes(event.event_type)) {
    return res.status(400).json({ error: `event_type must be one of: ${VALID_EVENT_TYPES.join(', ')}` })
  }

  const success = await ingestEvent(event)
  if (!success) return res.status(500).json({ error: 'Failed to ingest event' })
  res.json({ ok: true })
}))

analyticsRouter.post('/ingest/batch', asyncHandler(async (req, res) => {
  const events = req.body.events

  if (!Array.isArray(events) || events.length === 0) {
    return res.status(400).json({ error: 'events array is required and must not be empty' })
  }
  if (events.length > 100) {
    return res.status(400).json({ error: 'Batch size limited to 100 events' })
  }

  for (const event of events) {
    if (!event.session_id || !event.event_type) {
      return res.status(400).json({ error: 'Each event must have session_id and event_type' })
    }
  }

  const result = await ingestBatch(events)
  res.json(result)
}))

analyticsRouter.get('/channel/:channelId', asyncHandler(async (req, res) => {
  const stats = await getChannelStats(req.params.channelId)
  if (!stats) return res.status(404).json({ error: 'No analytics data found for this channel' })
  res.json({ stats })
}))

analyticsRouter.get('/asset/:assetId', asyncHandler(async (req, res) => {
  const stats = await getAssetStats(req.params.assetId)
  if (!stats) return res.status(404).json({ error: 'No analytics data found for this asset' })
  res.json({ stats })
}))
