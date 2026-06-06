/**
 * Roku BIF (Base Index Frame) File Compiler
 * 
 * Roku BIF format structure:
 * - Header (32 bytes):
 *   - bytes 0-7:   Magic number: 89 42 49 46 0D 0A 1A 0A
 *   - bytes 8-11:  Version (32-bit integer, value = 0)
 *   - bytes 12-15: Number of images (32-bit integer)
 *   - bytes 16-19: Frame interval in milliseconds (32-bit integer, e.g. 2000 or 10000)
 *   - bytes 20-31: Reserved (12 bytes, value = 0)
 * 
 * - Index Table:
 *   - N entries (each 8 bytes):
 *     - 4 bytes: Frame timestamp (32-bit integer, offset in seconds or frame index)
 *     - 4 bytes: Absolute byte offset of the image data in the BIF file (32-bit integer)
 *   - Sentinel entry (8 bytes):
 *     - 4 bytes: 0xFFFFFFFF
 *     - 4 bytes: Total file size (absolute offset representing the end of the last image)
 * 
 * - Image Data:
 *   - Concatenated raw JPEG files. The first image starts at offset 32 + (N + 1) * 8.
 */

export interface BIFFrameInput {
  timestamp: number // in seconds
  buffer: Buffer     // Raw JPEG buffer
}

export function compileBIF(frames: BIFFrameInput[], intervalMs: number = 2000): Buffer {
  // Sort frames by timestamp to ensure chronological order
  const sortedFrames = [...frames].sort((a, b) => a.timestamp - b.timestamp)
  
  const n = sortedFrames.length
  if (n === 0) {
    throw new Error('Cannot compile BIF file: No frames provided.')
  }

  const headerSize = 32
  const indexTableSize = (n + 1) * 8
  const startOffset = headerSize + indexTableSize

  // Compute byte offsets for all images
  let currentOffset = startOffset
  const offsets: number[] = []
  for (let i = 0; i < n; i++) {
    offsets.push(currentOffset)
    currentOffset += sortedFrames[i].buffer.length
  }
  const totalSize = currentOffset

  // Allocate target buffer
  const outBuffer = Buffer.alloc(totalSize)

  // 1. Write Header
  // Magic Number (0x89, 0x42, 0x49, 0x46, 0x0d, 0x0a, 0x1a, 0x0a)
  const magic = Buffer.from([0x89, 0x42, 0x49, 0x46, 0x0d, 0x0a, 0x1a, 0x0a])
  magic.copy(outBuffer, 0)

  // Version = 0
  outBuffer.writeUInt32LE(0, 8)

  // Number of images = N
  outBuffer.writeUInt32LE(n, 12)

  // Interval in ms (e.g. 2000ms = 2s)
  outBuffer.writeUInt32LE(intervalMs, 16)

  // Reserved (12 bytes zeroed - automatic since we allocated with alloc)

  // 2. Write Index Table
  let indexPos = 32
  for (let i = 0; i < n; i++) {
    // Timestamp in seconds
    outBuffer.writeUInt32LE(sortedFrames[i].timestamp, indexPos)
    // Offset in bytes
    outBuffer.writeUInt32LE(offsets[i], indexPos + 4)
    indexPos += 8
  }

  // Sentinel entry
  outBuffer.writeUInt32LE(0xffffffff, indexPos)
  outBuffer.writeUInt32LE(totalSize, indexPos + 4)

  // 3. Write Image data
  for (let i = 0; i < n; i++) {
    sortedFrames[i].buffer.copy(outBuffer, offsets[i])
  }

  return outBuffer
}
