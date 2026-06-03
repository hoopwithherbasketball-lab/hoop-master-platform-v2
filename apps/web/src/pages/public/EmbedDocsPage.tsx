import { useState } from 'react'
import { PageShell } from '@hoop-master/ui'
import { Code, Copy, Check } from 'lucide-react'

const channels = [
  { slug: 'hoop-with-her-live', name: 'Hoop With Her Live' },
  { slug: 'skills-showcase', name: 'Skills Showcase' },
  { slug: 'recruiting-tips', name: 'Recruiting Tips' },
]

export default function EmbedDocsPage() {
  const [copied, setCopied] = useState<string | null>(null)
  const [selectedChannel, setSelectedChannel] = useState(channels[0].slug)
  const [playerWidth, setPlayerWidth] = useState('100%')
  const [playerHeight, setPlayerHeight] = useState('540')

  const embedUrl = `${window.location.origin}/embed/${selectedChannel}`
  const iframeCode = `<iframe
  src="${embedUrl}"
  width="${playerWidth}"
  height="${playerHeight}"
  frameborder="0"
  allow="autoplay; fullscreen; picture-in-picture"
  allowfullscreen
  title="Hoop With Her Player"
></iframe>`

  const jsApiCode = `<script>
  // Control the player from your page
  const player = document.querySelector('iframe').contentWindow;

  // Play
  player.postMessage({ type: 'hwh-play' }, '*');

  // Pause
  player.postMessage({ type: 'hwh-pause' }, '*');

  // Listen for events
  window.addEventListener('message', (e) => {
    if (e.data?.type === 'hwh-player-ready') {
      console.log('Channel loaded:', e.data.slug);
    }
  });
</script>`

  const reactCode = `import { useEffect, useRef } from 'react';

function HWHPlayer({ channelSlug, width = '100%', height = 540 }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'hwh-player-ready') {
        console.log('Player ready:', e.data.slug);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={\`\${window.location.origin}/embed/\${channelSlug}\`}
      width={width}
      height={height}
      frameBorder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      title="Hoop With Her Player"
    />
  );
}

// Usage
<HWHPlayer channelSlug="hoop-with-her-live" height={720} />`

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const CodeBlock = ({ title, code, id }: { title: string; code: string; id: string }) => (
    <div className="bg-slate-900 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <span className="text-xs text-slate-400 font-medium">{title}</span>
        <button data-testid={`embed-docs-copy-${id}-button`} onClick={() => copyToClipboard(code, id)} className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
          {copied === id ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
        </button>
      </div>
      <pre className="p-4 text-sm text-slate-300 overflow-x-auto"><code>{code}</code></pre>
    </div>
  )

  return (
    <PageShell
      title="Embed Player"
      description="Integrate the Elite GBB video player into your site or application with minimal setup."
      badge="Developer Docs"
    >
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="card p-7">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Code size={18} /> Quick Start</h2>
            <p className="text-sm text-slate-400 mb-4">Copy the iframe code below to embed the player on any webpage. No API key required for public channels.</p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Channel</label>
                <select data-testid="embed-docs-channel-select" value={selectedChannel} onChange={e => setSelectedChannel(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white">
                  {channels.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Width</label>
                  <input data-testid="embed-docs-width-input" value={playerWidth} onChange={e => setPlayerWidth(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Height (px)</label>
                  <input data-testid="embed-docs-height-input" value={playerHeight} onChange={e => setPlayerHeight(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
              </div>
            </div>

            <CodeBlock title="HTML" code={iframeCode} id="html" />
          </div>

          <div className="card p-7">
            <h2 className="text-lg font-semibold text-white mb-4">Player Events</h2>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <code className="px-2 py-0.5 bg-slate-700 rounded text-green-400 text-xs shrink-0">hwh-player-ready</code>
                <span className="text-slate-400">Fired when channel loads. Payload: <code className="text-slate-300">{`{ slug }`}</code></span>
              </div>
              <div className="flex gap-3">
                <code className="px-2 py-0.5 bg-slate-700 rounded text-blue-400 text-xs shrink-0">hwh-play</code>
                <span className="text-slate-400">Send to iframe to start playback</span>
              </div>
              <div className="flex gap-3">
                <code className="px-2 py-0.5 bg-slate-700 rounded text-yellow-400 text-xs shrink-0">hwh-pause</code>
                <span className="text-slate-400">Send to iframe to pause playback</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="card p-7">
            <h2 className="text-lg font-semibold text-white mb-4">JavaScript API</h2>
            <CodeBlock title="JavaScript" code={jsApiCode} id="js" />
          </div>

          <div className="card p-7">
            <h2 className="text-lg font-semibold text-white mb-4">React Component</h2>
            <CodeBlock title="React" code={reactCode} id="react" />
          </div>

          <div className="card p-7">
            <h2 className="text-lg font-semibold text-white mb-4">URL Patterns</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <code className="px-2 py-0.5 bg-slate-700 rounded text-slate-300 text-xs">/embed/:slug</code>
                <span className="text-slate-400">Embeddable player (iframe-optimized)</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="px-2 py-0.5 bg-slate-700 rounded text-slate-300 text-xs">/watch/:slug</code>
                <span className="text-slate-400">Full-page viewer with schedule</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="px-2 py-0.5 bg-slate-700 rounded text-slate-300 text-xs">/api/channels/:id/manifest</code>
                <span className="text-slate-400">Raw HLS M3U8 playlist</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="px-2 py-0.5 bg-slate-700 rounded text-slate-300 text-xs">/api/epg/programs</code>
                <span className="text-slate-400">JSON EPG feed (Roku-compatible)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
