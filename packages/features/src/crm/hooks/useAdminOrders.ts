import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'

export interface ServiceOrderDisplay {
  id: string
  athlete: string
  athleteId: string
  service: string
  package: string
  status: string
  submitted: string
  due: string
  amount: number
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-500',
  active: 'bg-blue-100 text-blue-700',
  review: 'bg-amber-100 text-amber-700',
  in_review: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  new: 'bg-blue-500/20 text-blue-700',
  awaiting_intake: 'bg-amber-500/20 text-amber-700',
  needs_assets: 'bg-purple-500/20 text-purple-700',
  assigned: 'bg-indigo-500/20 text-indigo-400',
  in_progress: 'bg-blue-500/20 text-blue-400',
  awaiting_client_feedback: 'bg-yellow-500/20 text-yellow-400',
  complete: 'bg-green-500/20 text-green-400',
  archived: 'bg-gray-500/20 text-gray-400',
}

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return ''
  return iso.slice(0, 10)
}

export function useAdminOrders() {
  const [orders, setOrders] = useState<ServiceOrderDisplay[]>([])

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('service_orders')
        .select(`
          id,
          status,
          due_at,
          created_at,
          service_offer_id,
          player_profile_id,
          service_offers!inner(slug, name, category, price_cents),
          player_profiles!left(first_name, last_name)
        `)
        .order('created_at', { ascending: false })

      if (error) { console.error('useAdminOrders error:', error.message); return }
      if (!data) return

      const mapped: ServiceOrderDisplay[] = data.map((r: any) => {
        const offer = r.service_offers ?? {}
        const profile = r.player_profiles ?? {}
        const fullName = profile.first_name || profile.last_name
          ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim()
          : 'Unknown'
        return {
          id: r.id ? r.id.slice(0, 8) : '',
          athlete: fullName,
          athleteId: r.player_profile_id ?? '',
          service: offer.name ?? '',
          package: offer.category ?? '',
          status: r.status ?? 'new',
          submitted: fmtDate(r.created_at),
          due: fmtDate(r.due_at),
          amount: (offer.price_cents ?? 0) / 100,
        }
      })
      setOrders(mapped)
    }
    fetch()
  }, [])

  return { orders, statusColors: STATUS_COLORS }
}
