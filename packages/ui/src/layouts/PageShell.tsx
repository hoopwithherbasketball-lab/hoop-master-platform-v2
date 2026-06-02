import React from 'react'

export interface PageShellProps {
  title: string
  description: string
  badge?: string
  className?: string
  children: React.ReactNode
}

export const PageShell: React.FC<PageShellProps> = ({
  title,
  description,
  badge,
  className = '',
  children,
}) => {
  return (
    <div className={`max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8 ${className}`}>
      <header className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white">{title}</h1>
            <p className="text-slate-400 mt-2 max-w-2xl">{description}</p>
          </div>
          {badge ? (
            <span className="inline-flex rounded-full bg-royal-100 text-royal-700 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
              {badge}
            </span>
          ) : null}
        </div>
      </header>
      <div className="space-y-6">{children}</div>
    </div>
  )
}
