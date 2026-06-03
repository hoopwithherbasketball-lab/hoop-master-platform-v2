import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { PageShell } from '@hoop-master/ui'
import { Radio, Tv, Play, Search } from 'lucide-react'

interface Channel {
  id: string; slug: string; name: string; description: string
  channel_type: string; thumbnail_url: string; status: string
  branding: Record<string, unknown>
}

const TYPE_FILTERS = [
  { value: '', label: 'All Channels' },
  { value: 'live', label: 'Live' },
  { value: 'linear', label: '24/7 Linear' },
  { value: 'vod', label: 'On Demand' },
]

export default function ChannelsBrowsePage() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from('media_channels')
          .select('id, slug, name, description, channel_type, thumbnail_url, status, branding')
          .eq('status', 'active')
          .eq('is_public', true)
          .order('name')
        setChannels(data ?? [])
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    return channels.filter(ch => {
      const matchesSearch = !search || ch.name.toLowerCase().includes(search.toLowerCase()) || ch.description?.toLowerCase().includes(search.toLowerCase())
      const matchesType = !typeFilter || ch.channel_type === typeFilter
      return matchesSearch && matchesType
    })
  }, [channels, search, typeFilter])

  const typeIcon = (t: string) => {
    if (t === 'live') return <Radio size={16} className="text-red-400" />
    if (t === 'linear') return <Tv size={16} className="text-blue-400" />
    return <Play size={16} className="text-green-400" />
  }

  const typeLabel = (t: string) => {
    if (t === 'live') return 'LIVE'
    if (t === 'linear') return '24/7'
    return 'VOD'
  }

  return (
    <PageShell
      title="Watch Now"
      description="Stream live events, 24/7 channels, and on-demand content from Hoop With Her."
      badge="Media"
    >
      {!loading && channels.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              data-testid="channels-search-input"
              type="text"
              placeholder="Search channels..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-navy-800 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0134BD]"
            />
          </div>
          <div className="flex gap-2">
            {TYPE_FILTERS.map(f => (
              <button
                key={f.value}
                data-testid={`channels-type-filter-${f.value || 'all'}`}
                onClick={() => setTypeFilter(f.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${typeFilter === f.value ? 'bg-[#0134BD] text-white' : 'bg-navy-800 text-slate-400 hover:text-white border border-white/10'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => (
            <div key={i} className="animate-pulse bg-navy-800 rounded-xl overflow-hidden">
              <div className="aspect-video bg-slate-700" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-slate-700 rounded w-2/3" />
                <div className="h-3 bg-slate-700 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : channels.length === 0 ? (
        <div className="text-center py-16">
          <Radio size={48} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No channels available yet</h3>
          <p className="text-slate-400">Check back soon for live events and 24/7 content.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Search size={48} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No channels match your search</h3>
          <p className="text-slate-400">Try a different search term or filter.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(ch => (
            <Link
              key={ch.id}
              data-testid={`channel-card-link-${ch.slug}`}
              to={`/watch/${ch.slug}`}
              className="group bg-navy-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-[#0134BD] transition-all"
            >
              <div className="relative aspect-video bg-slate-800">
                {ch.thumbnail_url ? (
                  <img src={ch.thumbnail_url} alt={ch.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0134BD] to-[#002a80]">
                    <span className="text-4xl font-bold text-white/20">{ch.name.charAt(0)}</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${ch.channel_type === 'live' ? 'bg-red-500 text-white' : ch.channel_type === 'linear' ? 'bg-blue-500/90 text-white' : 'bg-green-500/90 text-white'}`}>
                    {typeLabel(ch.channel_type)}
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-[#0134BD]/90 flex items-center justify-center">
                    <Play size={24} className="text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  {typeIcon(ch.channel_type)}
                  <h3 className="font-semibold text-white group-hover:text-[#0134BD] transition-colors">{ch.name}</h3>
                </div>
                <p className="text-sm text-slate-400 line-clamp-2">{ch.description || 'No description'}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  )
}
