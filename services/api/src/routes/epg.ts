import { Router, type Request, type Response, type NextFunction } from 'express'
import { generateEPG, generateEPGJSON, generateRokuEPG } from '@hoop-master/epg-generator'

function asyncHandler(fn: (req: Request, res: Response) => Promise<unknown>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res).catch(next)
  }
}

export const epgRouter = Router()

epgRouter.get('/channels', asyncHandler(async (_req, res) => {
  const feed = await generateEPG()
  res.json({
    channels: feed.channels.map(ch => ({
      id: ch.id,
      name: ch.name,
      slug: ch.slug,
      thumbnailUrl: ch.thumbnailUrl,
    })),
  })
}))

epgRouter.get('/programs', asyncHandler(async (req, res) => {
  const { channel_id, date, format } = req.query

  if (date && isNaN(Date.parse(date as string))) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' })
  }

  const feed = await generateEPG(date as string)

  let filteredFeed = feed
  if (channel_id) {
    filteredFeed = {
      ...feed,
      channels: feed.channels.filter(ch => ch.id === channel_id),
    }
  }

  res.set('Content-Type', 'application/json')
  res.set('Cache-Control', 'max-age=300')

  if (format === 'roku') {
    return res.json(generateRokuEPG(filteredFeed))
  }

  res.send(generateEPGJSON(filteredFeed))
}))
