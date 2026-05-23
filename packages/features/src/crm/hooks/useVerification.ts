export interface VerificationStatus {
  verified: boolean
  badge: 'none' | 'starter' | 'development' | 'elite'
  packageName: string
  verifiedDate: string | null
}

export function useVerification() {
  const status: VerificationStatus = {
    verified: true,
    badge: 'elite',
    packageName: 'Elite Track',
    verifiedDate: '2026-03-15',
  }
  return status
}
