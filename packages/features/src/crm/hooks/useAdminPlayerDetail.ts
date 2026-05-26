import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'
import type { Database } from '@hoop-master/types'

type PlayerProfile = Database['public']['Tables']['player_profiles']['Row']

export interface AdminPlayerDetail {
  id: string
  name: string
  email: string
  position: string
  gradClass: string
  school: string
  city: string
  state: string
  height: string
  gpa: string
  package: string
  status: 'active' | 'inactive' | 'suspended'
  joined: string
  evalCount: number
  connectionCount: number
  lastActive: string
}

export function useAdminPlayerDetail(id: string) {
  const [detail, setDetail] = useState<AdminPlayerDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const fetch = async () => {
      try {
        const [profileRes, evalCountRes, connCountRes, orderRes] = await Promise.all([
          supabase.from('player_profiles').select('*').eq('id', id).single(),
          supabase.from('audit_results').select('id', { count: 'exact', head: true }).eq('audit_submission_id', id),
          supabase.from('coach_saved_players').select('id', { count: 'exact', head: true }).eq('player_profile_id', id),
          supabase.from('service_orders').select('service_offers!inner(name)').eq('player_profile_id', id).maybeSingle(),
        ])

        if (profileRes.error) { console.error('useAdminPlayerDetail error:', profileRes.error.message); return }
        const p = profileRes.data as PlayerProfile

        const packageName = (orderRes.data as any)?.service_offers?.name ?? 'None'

        setDetail({
          id: p.id,
          name: `${p.first_name} ${p.last_name}`.trim() || 'Unknown',
          email: '',
          position: p.position ?? '',
          gradClass: p.class_year ? String(p.class_year) : '',
          school: p.school_name ?? '',
          city: p.city ?? '',
          state: p.state ?? '',
          height: p.height ?? '',
          gpa: p.gpa != null ? String(p.gpa) : '',
          package: packageName,
          status: 'active',
          joined: p.created_at ? p.created_at.slice(0, 10) : '',
          evalCount: evalCountRes.count ?? 0,
          connectionCount: connCountRes.count ?? 0,
          lastActive: p.updated_at ? p.updated_at.slice(0, 10) : '',
        })
      } catch (e) { console.error('useAdminPlayerDetail exception:', e) }
      setLoading(false)
    }
    fetch()
  }, [id])

  return { detail: detail ?? { id: '', name: 'Loading...', email: '', position: '', gradClass: '', school: '', city: '', state: '', height: '', gpa: '', package: '', status: 'active' as const, joined: '', evalCount: 0, connectionCount: 0, lastActive: '' }, loading }
}
