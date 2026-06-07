import express from 'express'
import cors from 'cors'
import { channelsRouter } from './routes/channels.js'
import { epgRouter } from './routes/epg.js'
import { analyticsRouter } from './routes/analytics.js'
import { playerConfigRouter } from './routes/player-config.js'
import { bifRouter } from './routes/bif.js'
import { paymentsRouter } from './routes/payments.js'

const app = express()
const PORT = process.env.PORT || 3001

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
if (!supabaseUrl) {
  console.warn('[API] Warning: VITE_SUPABASE_URL not set. Routes will fail until configured.')
  console.warn('[API] Copy .env.example to .env and fill in your Supabase credentials.')
}

app.use(cors())
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))
app.use(express.json())

app.use('/api/channels', channelsRouter)
app.use('/api/epg', epgRouter)
app.use('/api/analytics', analyticsRouter)
app.use('/api/player', playerConfigRouter)
app.use('/api/bif', bifRouter)
app.use('/api/payments', paymentsRouter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), supabase: !!supabaseUrl })
})

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[API] Unhandled error:', err.message)
  res.status(500).json({ error: 'Internal server error', details: err.message })
})

app.listen(PORT, () => {
  console.log(`[API] Hoop With Her API server running on http://localhost:${PORT}`)
  console.log(`[API] Supabase: ${supabaseUrl ? 'configured' : 'NOT configured — set VITE_SUPABASE_URL'}`)
})
