import type { ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

export function NILError({
  message,
  retry,
}: {
  message: string
  retry: () => void
}) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center gap-3 rounded-xl border border-rose-400/25 bg-rose-400/5 p-4 text-sm text-rose-200"
    >
      <AlertCircle size={18} />
      <span className="min-w-0 flex-1">{message}</span>
      <button
        type="button"
        onClick={retry}
        className="inline-flex items-center gap-2 rounded-lg border border-rose-300/30 px-3 py-2 font-semibold hover:bg-rose-400/10"
      >
        <RefreshCw size={14} />
        Retry
      </button>
    </div>
  )
}
export function NILLoading() {
  return (
    <div role="status" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <span className="sr-only">Loading NIL workspace</span>
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          className="h-32 animate-pulse rounded-2xl border border-white/10 bg-white/5 motion-reduce:animate-none"
        />
      ))}
    </div>
  )
}
export function NILEmpty({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="rounded-xl border border-dashed border-white/15 p-8 text-center">
      <p className="font-semibold text-slate-200">{title}</p>
      <div className="mt-2 text-sm leading-relaxed text-slate-400">
        {children}
      </div>
    </div>
  )
}
export function NILStatus({ status }: { status: string }) {
  const value = status.toLowerCase()
  const color = [
    'active',
    'accepted',
    'completed',
    'approved',
    'partner',
  ].includes(value)
    ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
    : ['cancelled', 'declined', 'error'].includes(value)
      ? 'border-rose-400/20 bg-rose-400/10 text-rose-300'
      : 'border-blue-400/20 bg-blue-400/10 text-blue-200'
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${color}`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  )
}
export const nilButton =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-royal-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-royal-600 disabled:cursor-not-allowed disabled:opacity-50'
