import React, { useState } from 'react'
import { useEmailTracking } from '@hoop-master/features/email'
import { EmailTracking } from '@hoop-master/types'
import { Plus } from 'lucide-react'

interface OutreachAnalyticsProps {
  outreachId?: string
}

export default function OutreachAnalytics({ outreachId }: OutreachAnalyticsProps) {
  const { tracking, stats, loading } = useEmailTracking(outreachId)
  const [filter, setFilter] = useState<'all' | 'opened' | 'clicked' | 'pending'>('all')

  const filteredTracking = (tracking as EmailTracking[]).filter((t: EmailTracking) => {
    if (filter === 'opened') return t.opened
    if (filter === 'clicked') return t.clicked
    if (filter === 'pending') return !t.opened && t.delivery_status === 'sent'
    return true
  })

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-slate-200 dark:bg-slate-700 h-12 rounded" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 rounded-lg p-4">
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Sent</div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.total || 0}</div>
        </div>

        <div className="bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 rounded-lg p-4">
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Opened</div>
          <div className="text-3xl font-bold text-green-600">{stats?.opened || 0}</div>
          <div className="text-sm text-green-600 mt-1">{stats?.openRate.toFixed(1) || 0}% rate</div>
        </div>

        <div className="bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 rounded-lg p-4">
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Clicked</div>
          <div className="text-3xl font-bold text-blue-600">{stats?.clicked || 0}</div>
          <div className="text-sm text-blue-600 mt-1">{stats?.clickRate.toFixed(1) || 0}% rate</div>
        </div>

        <div className="bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 rounded-lg p-4">
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Delivery Status</div>
          <div className="text-3xl font-bold text-orange-600">
            {stats?.deliveryStatus['delivered'] || 0}
          </div>
          <div className="text-sm text-red-600 mt-1">{stats?.deliveryStatus['bounced'] || 0} bounced</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-white/10">
        {(['all', 'opened', 'clicked', 'pending'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === f
                ? 'border-[#0134BD] text-[#0134BD]'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({filteredTracking.length})
          </button>
        ))}
      </div>

      {/* Tracking List */}
      <div className="space-y-2">
        {filteredTracking.length > 0 ? (
          filteredTracking.map((t: EmailTracking) => (
            <div
              key={t.id}
              className="bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="font-semibold text-slate-900 dark:text-white">{t.recipient_email}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {t.recipient_name && <span>{t.recipient_name} • </span>}
                  {new Date(t.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  {t.opened && <div className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">Opened {t.opened_count}x</div>}
                  {t.clicked && <div className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded mt-1">Clicked {t.click_count}x</div>}
                  {!t.opened && <div className="text-xs text-slate-500 dark:text-slate-400">Not opened</div>}
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded ${
                  t.delivery_status === 'delivered'
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : t.delivery_status === 'bounced'
                    ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                }`}>
                  {t.delivery_status}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            No emails match this filter
          </div>
        )}
      </div>
    </div>
  )
}

