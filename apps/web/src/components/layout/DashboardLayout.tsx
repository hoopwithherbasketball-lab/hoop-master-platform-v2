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
    <div className="flex min-h-screen pt-16">
      <DashboardSidebar variant={variant} />
      <main className="flex-1 overflow-auto bg-slate-50">
        {(title || action) && (
          <div className="bg-white border-b border-slate-100 px-8 py-5">
            <div className="flex items-center justify-between">
              <div>
                {title && <h1 className="font-display text-2xl font-bold text-navy-900">{title}</h1>}
                {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
              </div>
              {action && <div>{action}</div>}
            </div>
          </div>
        )}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
