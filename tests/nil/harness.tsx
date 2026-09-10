import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import NILProposalForm from '../../apps/web/src/pages/nil/NILProposalForm'
import NILOverview from '../../apps/web/src/pages/nil/NILOverview'
import OpportunityList from '../../apps/web/src/pages/nil/OpportunityList'
import { useNILProposals } from '../../apps/web/src/pages/nil/useNILProposals'
import { AuthContext } from '../../packages/features/src/crm/contexts/AuthContextValue'
import { ProtectedRoute } from '../../packages/features/src/crm/components/ProtectedRoute'

export function ProposalHarness({ onClose }: { onClose: () => void }) {
  const { save } = useNILProposals(0, '')
  return (
    <MemoryRouter>
      <NILProposalForm proposal={null} onClose={onClose} onSave={save} />
    </MemoryRouter>
  )
}
export function OverviewHarness() {
  return (
    <MemoryRouter>
      <NILOverview />
    </MemoryRouter>
  )
}
export function OpportunityHarness() {
  return (
    <MemoryRouter>
      <OpportunityList />
    </MemoryRouter>
  )
}
export function GuardHarness({
  authenticated,
  admin,
}: {
  authenticated: boolean
  admin: boolean
}) {
  const auth = {
    user: authenticated ? { id: 'test-user' } : null,
    session: null,
    roles: [],
    loading: false,
    hasRole: () => admin,
    refreshRoles: async () => {},
    signIn: async () => ({ error: null }),
    signUp: async () => ({ error: null }),
    signOut: async () => {},
  }
  return (
    <MemoryRouter>
      <AuthContext.Provider
        value={auth as React.ContextType<typeof AuthContext>}
      >
        <ProtectedRoute role="admin">
          <p>Authorized NIL content</p>
        </ProtectedRoute>
      </AuthContext.Provider>
    </MemoryRouter>
  )
}
