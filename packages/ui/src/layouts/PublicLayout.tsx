import React from 'react'

export interface PublicLayoutProps {
  navbar?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({
  navbar,
  footer,
  children,
  className = ''
}) => {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {navbar}
      <main className="flex-1">
        {children}
      </main>
      {footer}
    </div>
  )
}
