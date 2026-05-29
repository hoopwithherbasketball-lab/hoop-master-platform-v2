import { useEffect, useRef, useState, useCallback } from 'react'
import Hls from 'hls.js'

export interface PlayerBranding {
  logo_url?: string
  primary_color?: string
  secondary_color?: string
  accent_color?: string
  font_family?: string
  watermark_url?: string
}

export interface PlayerProps {
  src: string
  channelId?: string
  assetId?: string
  branding?: PlayerBranding
  className?: string
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onHeartbeat?: (watchSeconds: number) => void
}

const defaultBranding: PlayerBranding = {
  primary_color: '#0134BD',
  secondary_color: '#ffffff',
  accent_color: '#ff6b35',
  font_family: 'Inter',
}

export default function HLSPlayer({
  src,
  branding = {},
  className = '',
  onPlay,
  onPause,
  onEnded,
  onHeartbeat,
}: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const watchSecondsRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const theme = { ...defaultBranding, ...branding }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let destroyed = false

    const initPlayer = async () => {
      try {
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            maxBufferLength: 30,
          })
          if (destroyed) { hls.destroy(); return }
          hlsRef.current = hls

          hls.loadSource(src)
          hls.attachMedia(video)

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (!destroyed) { setLoading(false); video.play().catch(() => {}) }
          })

          hls.on(Hls.Events.ERROR, (_event: any, data: any) => {
            if (data?.fatal && !destroyed) {
              setError('Stream playback error. Please try again.')
              hls.destroy()
            }
          })
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src
          video.addEventListener('loadedmetadata', () => {
            if (!destroyed) { setLoading(false); video.play().catch(() => {}) }
          })
        } else {
          setError('HLS is not supported in this browser.')
          setLoading(false)
        }
      } catch {
        setError('Failed to load video player.')
        setLoading(false)
      }
    }

    initPlayer()

    return () => {
      destroyed = true
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null }
    }
  }, [src])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onTimeUpdate = () => setCurrentTime(video.currentTime)
    const onDurationChange = () => setDuration(video.duration)
    const onPlayHandler = () => { setIsPlaying(true); onPlay?.(); startHeartbeat() }
    const onPauseHandler = () => { setIsPlaying(false); onPause?.(); stopHeartbeat() }
    const onEndedHandler = () => { setIsPlaying(false); onEnded?.(); stopHeartbeat() }

    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('durationchange', onDurationChange)
    video.addEventListener('play', onPlayHandler)
    video.addEventListener('pause', onPauseHandler)
    video.addEventListener('ended', onEndedHandler)

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('durationchange', onDurationChange)
      video.removeEventListener('play', onPlayHandler)
      video.removeEventListener('pause', onPauseHandler)
      video.removeEventListener('ended', onEndedHandler)
    }
  }, [onPlay, onPause, onEnded])

  const startHeartbeat = useCallback(() => {
    stopHeartbeat()
    heartbeatRef.current = setInterval(() => {
      watchSecondsRef.current += 30
      onHeartbeat?.(watchSecondsRef.current)
    }, 30000)
  }, [onHeartbeat])

  const stopHeartbeat = useCallback(() => {
    if (heartbeatRef.current) { clearInterval(heartbeatRef.current); heartbeatRef.current = null }
  }, [])

  useEffect(() => () => stopHeartbeat(), [stopHeartbeat])

  const togglePlay = () => { const v = videoRef.current; if (v) v.paused ? v.play() : v.pause() }
  const toggleMute = () => { const v = videoRef.current; if (v) { v.muted = !v.muted; setIsMuted(v.muted) } }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current; if (!v) return
    const val = parseFloat(e.target.value); v.volume = val; setVolume(val)
    if (val === 0) { v.muted = true; setIsMuted(true) } else if (v.muted) { v.muted = false; setIsMuted(false) }
  }

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => { const v = videoRef.current; if (v) v.currentTime = parseFloat(e.target.value) }

  const toggleFullscreen = () => {
    const c = containerRef.current; if (!c) return
    if (!document.fullscreenElement) { c.requestFullscreen(); setIsFullscreen(true) }
    else { document.exitFullscreen(); setIsFullscreen(false) }
  }

  const formatTime = (s: number) => { const m = Math.floor(s / 60); return `${m}:${Math.floor(s % 60).toString().padStart(2, '0')}` }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    controlsTimeoutRef.current = setTimeout(() => { if (isPlaying) setShowControls(false) }, 3000)
  }

  if (error) {
    return (
      <div className={`relative bg-black rounded-lg overflow-hidden flex items-center justify-center ${className}`} style={{ aspectRatio: '16/9' }}>
        <div className="text-center p-6">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={() => { setError(null); window.location.reload() }} className="mt-3 px-4 py-2 text-xs rounded-lg" style={{ backgroundColor: theme.primary_color, color: theme.secondary_color }}>Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`relative bg-black rounded-lg overflow-hidden group ${className}`} onMouseMove={handleMouseMove} onMouseLeave={() => isPlaying && setShowControls(false)} style={{ fontFamily: theme.font_family }}>
      {loading && <div className="absolute inset-0 flex items-center justify-center z-10"><div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" /></div>}

      <video ref={videoRef} className="w-full aspect-video object-contain" playsInline onClick={togglePlay} />

      {theme.watermark_url && <div className="absolute top-3 right-3 opacity-50 pointer-events-none"><img src={theme.watermark_url} alt="" className="h-6" /></div>}
      {theme.logo_url && !loading && <div className="absolute top-3 left-3 opacity-80 pointer-events-none"><img src={theme.logo_url} alt="" className="h-8" /></div>}

      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        <input type="range" min={0} max={duration || 0} value={currentTime} onChange={seek} className="w-full h-1 mb-2 rounded-full appearance-none cursor-pointer" style={{ accentColor: theme.primary_color }} />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={togglePlay} className="text-white hover:opacity-80">
              {isPlaying
                ? <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21" /></svg>}
            </button>
            <button onClick={toggleMute} className="text-white hover:opacity-80">
              {isMuted || volume === 0
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>}
            </button>
            <input type="range" min={0} max={1} step={0.05} value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="w-16 h-1 rounded-full appearance-none cursor-pointer" style={{ accentColor: theme.primary_color }} />
            <span className="text-white/80 text-xs ml-1">{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>
          <button onClick={toggleFullscreen} className="text-white hover:opacity-80">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              {isFullscreen
                ? <><polyline points="4,14 10,14 10,20" /><polyline points="20,10 14,10 14,4" /><line x1="14" y1="10" x2="21" y2="3" /><line x1="3" y1="21" x2="10" y2="14" /></>
                : <><polyline points="15,3 21,3 21,9" /><polyline points="9,21 3,21 3,15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></>}
            </svg>
          </button>
        </div>
      </div>

      {!isPlaying && !loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm" style={{ backgroundColor: `${theme.primary_color}CC` }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill={theme.secondary_color}><polygon points="8,5 19,12 8,19" /></svg>
          </div>
        </div>
      )}
    </div>
  )
}
