import type { ReactNode } from 'react'

interface Props {
  title: string
  description: string
  badge?: string
  children: ReactNode
}

export default function PageShell({ title, description, badge, children }: Props) {
  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <header className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-display font-bold text-navy-900">{title}</h1>
            <p className="text-slate-500 mt-2 max-w-2xl">{description}</p>
          </div>
          {badge ? <span className="inline-flex rounded-full bg-royal-100 text-royal-700 px-3 py-1 text-xs font-semibold uppercase tracking-widest">{badge}</span> : null}
        </div>
      </header>
      <div className="space-y-6">{children}</div>
    </div>
  )
}
