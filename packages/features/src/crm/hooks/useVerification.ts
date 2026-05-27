import { useEffect, useState } from 'react'
import { supabase } from '@hoop-master/supabase'
import { useAuth } from '../contexts/AuthContextValue.js'

export interface VerificationStatus {
  verified: boolean
  badge: 'none' | 'starter' | 'development' | 'elite'
  packageName: string
  verifiedDate: string | null
}

const PACKAGE_MAP: Record<string, { badge: VerificationStatus['badge']; name: string }> = {
  free: { badge: 'starter', name: 'Free Preview' },
  starter: { badge: 'starter', name: 'Starter' },
  development: { badge: 'development', name: 'Development' },
  elite_track: { badge: 'elite', name: 'Elite Track' },
}

export function useVerification() {
  const { user } = useAuth()
  const [status, setStatus] = useState<VerificationStatus>({ verified: false, badge: 'none', packageName: '', verifiedDate: null })

  useEffect(() => {
    if (!user) { setStatus({ verified: false, badge: 'none', packageName: '', verifiedDate: null }); return }

    supabase.from('intake_submissions').select('package_selected, created_at').eq('auth_user_id', user.id).order('created_at', { ascending: false }).limit(1).then(({ data }) => {
      if (data && data.length > 0) {
        const pkg = PACKAGE_MAP[data[0].package_selected] || PACKAGE_MAP.free
        setStatus({ verified: true, badge: pkg.badge, packageName: pkg.name, verifiedDate: new Date(data[0].created_at).toISOString().split('T')[0] })
      } else {
        setStatus({ verified: false, badge: 'none', packageName: '', verifiedDate: null })
      }
    })
  }, [user])

  return status
}
