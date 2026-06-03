import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { ShieldCheck, Crown, Clock } from 'lucide-react'

interface MembershipRow {
  id: string
  user_id: string
  status: 'pending' | 'active' | 'suspended'
  tier: 'starter' | 'pro' | 'elite'
  approved_at: string | null
  expires_at: string | null
  notes: string
  created_at: string
}

export default function AdminCommunityMembershipsPage() {
  const [rows, setRows] = useState<MembershipRow[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const { data, error: queryError } = await supabase
          .from('community_memberships')
          .select('id, user_id, status, tier, approved_at, expires_at, notes, created_at')
          .order('created_at', { ascending: false })

        if (queryError) throw queryError
        setRows((data ?? []) as MembershipRow[])
      } catch (e) {
        console.error('AdminCommunityMembershipsPage load:', e)
        setError('Unable to load community memberships.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const counts = useMemo(() => ({
    active: rows.filter((r) => r.status === 'active').length,
    pending: rows.filter((r) => r.status === 'pending').length,
    suspended: rows.filter((r) => r.status === 'suspended').length,
  }), [rows])

  const updateStatus = async (row: MembershipRow, nextStatus: MembershipRow['status']) => {
    try {
      setSavingId(row.id)
      const payload = {
        status: nextStatus,
        approved_at: nextStatus === 'active' ? (row.approved_at || new Date().toISOString()) : row.approved_at,
      }

      const { error: updateError } = await supabase
        .from('community_memberships')
        .update(payload)
        .eq('id', row.id)

      if (updateError) throw updateError

      setRows((prev) => prev.map((item) => item.id === row.id ? { ...item, ...payload } : item))
    } catch (e) {
      console.error('updateStatus:', e)
      setError('Failed to update membership status.')
    } finally {
      setSavingId(null)
    }
  }

  const updateTier = async (row: MembershipRow, nextTier: MembershipRow['tier']) => {
    try {
      setSavingId(row.id)
      const { error: updateError } = await supabase
        .from('community_memberships')
        .update({ tier: nextTier })
        .eq('id', row.id)

      if (updateError) throw updateError
      setRows((prev) => prev.map((item) => item.id === row.id ? { ...item, tier: nextTier } : item))
    } catch (e) {
      console.error('updateTier:', e)
      setError('Failed to update tier.')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <DashboardLayout variant="admin" title="Community Memberships" subtitle="Approve, suspend, and tier premium member access">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-4" data-testid="admin-community-active-count-card">
          <p className="text-xs text-slate-400 mb-1">Active Members</p>
          <p className="text-2xl font-bold text-white flex items-center gap-2"><ShieldCheck size={18} className="text-green-400" />{counts.active}</p>
        </div>
        <div className="card p-4" data-testid="admin-community-pending-count-card">
          <p className="text-xs text-slate-400 mb-1">Pending Reviews</p>
          <p className="text-2xl font-bold text-white flex items-center gap-2"><Clock size={18} className="text-yellow-300" />{counts.pending}</p>
        </div>
        <div className="card p-4" data-testid="admin-community-suspended-count-card">
          <p className="text-xs text-slate-400 mb-1">Suspended</p>
          <p className="text-2xl font-bold text-white flex items-center gap-2"><Crown size={18} className="text-red-300" />{counts.suspended}</p>
        </div>
      </div>

      {error && <p className="text-red-300 mb-4" data-testid="admin-community-memberships-error-text">{error}</p>}

      {loading ? (
        <div className="animate-pulse space-y-3">{[1, 2, 3, 4].map((i) => <div key={i} className="card h-16" />)}</div>
      ) : (
        <div className="card overflow-hidden" data-testid="admin-community-memberships-table-wrapper">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Tier</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Created</th>
                <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-white/5">
                  <td className="px-4 py-3">
                    <p className="text-white font-medium" data-testid={`admin-community-membership-user-${row.id}`}>{row.user_id.slice(0, 8)}…</p>
                    <p className="text-xs text-slate-400">{row.id.slice(0, 8)}…</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${row.status === 'active' ? 'bg-green-500/20 text-green-300' : row.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'}`} data-testid={`admin-community-membership-status-${row.id}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={row.tier}
                      data-testid={`admin-community-membership-tier-select-${row.id}`}
                      onChange={(e) => updateTier(row, e.target.value as MembershipRow['tier'])}
                      disabled={savingId === row.id}
                      className="bg-transparent border border-white/10 rounded px-2 py-1 text-slate-200"
                    >
                      <option value="starter">starter</option>
                      <option value="pro">pro</option>
                      <option value="elite">elite</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{new Date(row.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      data-testid={`admin-community-approve-button-${row.id}`}
                      onClick={() => updateStatus(row, 'active')}
                      disabled={savingId === row.id}
                      className="px-3 py-1.5 rounded text-xs font-medium bg-green-600/30 text-green-200 hover:bg-green-600/40 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      data-testid={`admin-community-suspend-button-${row.id}`}
                      onClick={() => updateStatus(row, 'suspended')}
                      disabled={savingId === row.id}
                      className="px-3 py-1.5 rounded text-xs font-medium bg-red-600/30 text-red-200 hover:bg-red-600/40 disabled:opacity-50"
                    >
                      Suspend
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400" data-testid="admin-community-memberships-empty-text">
                    No community memberships found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}
