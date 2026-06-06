import { Router } from 'express'
import { compileBIF, type BIFFrameInput } from '../utils/bif.js'

// A small, valid 320x240 grey JPEG image (base64 encoded) to use as mock frame content
const MOCK_JPEG_BASE64 = 
  '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCADIAHgBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA='

export const bifRouter = Router()

/**
 * POST /api/bif/compile
 * Body: {
 *   frames: [ { timestamp: number, imageBase64: string } ],
 *   intervalMs?: number
 * }
 * Returns the raw binary .bif file
 */
bifRouter.post('/compile', (req, res) => {
  try {
    const { frames, intervalMs = 2000 } = req.body

    if (!frames || !Array.isArray(frames) || frames.length === 0) {
      return res.status(400).json({ error: 'Missing or invalid "frames" array in request body.' })
    }

    const compiledFrames: BIFFrameInput[] = frames.map((f: any, idx: number) => {
      if (typeof f.timestamp !== 'number') {
        throw new Error(`Frame at index ${idx} is missing a numeric timestamp.`)
      }
      if (typeof f.imageBase64 !== 'string') {
        throw new Error(`Frame at index ${idx} is missing a string imageBase64 content.`)
      }
      
      // Strip data URL header if present
      const base64Data = f.imageBase64.replace(/^data:image\/jpeg;base64,/, '')
      return {
        timestamp: f.timestamp,
        buffer: Buffer.from(base64Data, 'base64')
      }
    })

    const bifBuffer = compileBIF(compiledFrames, intervalMs)

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="video.bif"',
      'Content-Length': bifBuffer.length,
      'Cache-Control': 'no-cache'
    })

    res.send(bifBuffer)
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to compile BIF file', details: err.message })
  }
})

/**
 * GET /api/bif/mock
 * Serves a pre-generated mock .bif file for quick integration testing.
 */
bifRouter.get('/mock', (_req, res) => {
  try {
    const frameBuffer = Buffer.from(MOCK_JPEG_BASE64, 'base64')
    
    // Generate a 10-frame mock stream (representing a 20-second clip at 2s interval)
    const mockFrames: BIFFrameInput[] = []
    for (let i = 0; i < 10; i++) {
      mockFrames.push({
        timestamp: i * 2,
        buffer: frameBuffer
      })
    }

    const bifBuffer = compileBIF(mockFrames, 2000)

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="mock.bif"',
      'Content-Length': bifBuffer.length,
      'Cache-Control': 'max-age=60'
    })

    res.send(bifBuffer)
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate mock BIF', details: err.message })
  }
})
