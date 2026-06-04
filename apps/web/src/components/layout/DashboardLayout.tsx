import type { ReactNode } from 'react'
import DashboardSidebar from './DashboardSidebar'

interface Props {
  children: ReactNode
  variant: 'player' | 'coach' | 'admin'
  title?: string
  subtitle?: string
  action?: ReactNode
}

export default function DashboardLayout({ children, variant, title, subtitle, action }: Props) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen pt-16">
      <DashboardSidebar variant={variant} />
      <main className="flex-1 overflow-auto bg-white/5">
        {(title || action) && (
          <div className="bg-navy-800 border-b border-white/10 px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                {title && <h1 className="font-display text-xl sm:text-2xl font-bold text-white">{title}</h1>}
                {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
              </div>
              {action && <div>{action}</div>}
            </div>
          </div>
        )}
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
