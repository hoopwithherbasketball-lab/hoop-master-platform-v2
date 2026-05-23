import { useState } from 'react'

export interface ServiceOrder {
  id: string
  athlete: string
  athleteId: string
  service: string
  package: string
  status: 'draft' | 'active' | 'review' | 'completed' | 'cancelled'
  submitted: string
  due: string
  amount: number
}

const MOCK: ServiceOrder[] = [
  { id: 'ORD-2154', athlete: 'Sophia Lee', athleteId: 's1', service: 'Video Review', package: 'Starter', status: 'active', submitted: '2026-05-02', due: '2026-05-18', amount: 99 },
  { id: 'ORD-2051', athlete: 'Kylie Brooks', athleteId: 's2', service: 'Recruiting Outreach', package: 'Development', status: 'review', submitted: '2026-04-28', due: '2026-05-15', amount: 199 },
  { id: 'ORD-2017', athlete: 'Jamie Clark', athleteId: 's3', service: 'Brand Review', package: 'Starter', status: 'completed', submitted: '2026-04-15', due: '2026-04-30', amount: 99 },
  { id: 'ORD-1984', athlete: 'Ava Grant', athleteId: '1', service: 'Elite Track Package', package: 'Elite Track', status: 'active', submitted: '2026-05-01', due: '2026-06-01', amount: 399 },
  { id: 'ORD-1892', athlete: 'Maya Thompson', athleteId: 'm1', service: 'NIL Brand Strategy', package: 'Development', status: 'draft', submitted: '2026-04-20', due: '2026-06-01', amount: 199 },
]

const STATUS_COLORS: Record<string, string> = { draft: 'bg-gray-100 text-gray-500', active: 'bg-blue-100 text-blue-700', review: 'bg-amber-100 text-amber-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' }

export function useAdminOrders() {
  const [orders] = useState(MOCK)
  return { orders, statusColors: STATUS_COLORS }
}
