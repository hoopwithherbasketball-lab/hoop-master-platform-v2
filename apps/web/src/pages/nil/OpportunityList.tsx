import { useMemo, useState, type FormEvent } from 'react'
import { useNILOpportunities } from '@hoop-master/features/nil'
import { supabase } from '../../lib/supabase'
import { Edit3, Plus, Search, Target } from 'lucide-react'
import { toast } from 'sonner'
import NILLayout from '../../components/nil/NILLayout'
import {
  NILEmpty,
  NILError,
  NILLoading,
  NILStatus,
  nilButton,
} from '../../components/nil/NILStates'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../../components/ui/dialog'

const STATUSES = [
  'matched',
  'review',
  'negotiation',
  'active',
  'completed',
  'cancelled',
]
type Opportunity = ReturnType<
  typeof useNILOpportunities
>['opportunities'][number]
const initialForm = {
  athlete_name: '',
  brand: '',
  value: '0',
  status: 'matched',
}

export default function OpportunityList() {
  const { opportunities, loading, error, refetch } = useNILOpportunities()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [editing, setEditing] = useState<Opportunity | null>(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const visible = useMemo(
    () =>
      opportunities.filter(
        (o) =>
          (!filter || o.status === filter) &&
          `${o.athlete_name} ${o.brand}`
            .toLowerCase()
            .includes(search.toLowerCase())
      ),
    [opportunities, search, filter]
  )
  function showForm(opportunity?: Opportunity) {
    setEditing(opportunity ?? null)
    setForm(
      opportunity
        ? {
            athlete_name: opportunity.athlete_name,
            brand: opportunity.brand,
            value: String(opportunity.value_cents / 100),
            status: opportunity.status,
          }
        : initialForm
    )
    setSaveError('')
    setOpen(true)
  }
  async function save(event: FormEvent) {
    event.preventDefault()
    if (!form.brand.trim() || !form.athlete_name.trim()) {
      setSaveError('Enter a brand and athlete name.')
      return
    }
    const dollars = Number(form.value)
    if (!Number.isFinite(dollars) || dollars < 0) {
      setSaveError('Enter a valid opportunity value.')
      return
    }
    setSaving(true)
    setSaveError('')
    const payload = {
      athlete_name: form.athlete_name.trim(),
      brand: form.brand.trim(),
      value_cents: Math.round(dollars * 100),
      status: form.status,
    }
    try {
      const query = editing
        ? supabase
            .from('nil_opportunities')
            .update(payload)
            .eq('id', editing.id)
        : supabase.from('nil_opportunities').insert(payload)
      const result = await query.select('id').single()
      if (result.error || !result.data)
        throw new Error(
          'The opportunity was not saved. Please retry or check your account permissions.'
        )
      setOpen(false)
      toast.success(editing ? 'Opportunity updated' : 'Opportunity created')
      await refetch()
    } catch (e) {
      setSaveError(
        e instanceof Error ? e.message : 'Unable to save opportunity.'
      )
    } finally {
      setSaving(false)
    }
  }
  async function remove() {
    if (!deleteId) return
    setSaving(true)
    setSaveError('')
    try {
      const result = await supabase
        .from('nil_opportunities')
        .delete()
        .eq('id', deleteId)
        .select('id')
        .single()
      if (result.error || !result.data)
        throw new Error('The opportunity was not deleted. Please try again.')
      setDeleteId(null)
      toast.success('Opportunity deleted')
      await refetch()
    } catch (e) {
      setSaveError(
        e instanceof Error ? e.message : 'Unable to delete opportunity.'
      )
    } finally {
      setSaving(false)
    }
  }
  return (
    <NILLayout
      title="Opportunities"
      subtitle="Build your pipeline from first match to active partnership."
      action={
        <button onClick={() => showForm()} className={nilButton}>
          <Plus size={16} />
          New opportunity
        </button>
      }
    >
      <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[#111722] p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-3.5 text-slate-500"
          />
          <label htmlFor="opportunity-search" className="sr-only">
            Search opportunities
          </label>
          <input
            id="opportunity-search"
            className="input !pl-10"
            placeholder="Search by athlete or brand"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <label htmlFor="opportunity-status" className="sr-only">
          Filter opportunities by status
        </label>
        <select
          id="opportunity-status"
          className="input sm:!w-48"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All stages</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>
      {error ? (
        <NILError
          message="Opportunities could not be loaded."
          retry={() => void refetch()}
        />
      ) : loading ? (
        <NILLoading />
      ) : visible.length === 0 ? (
        <NILEmpty
          title={
            search || filter
              ? 'No matching opportunities.'
              : 'A new opportunity starts with a connection.'
          }
        >
          {search || filter ? (
            <button
              onClick={() => {
                setSearch('')
                setFilter('')
              }}
              className="text-blue-300"
            >
              Clear search and filters
            </button>
          ) : (
            <button onClick={() => showForm()} className="text-blue-300">
              Add your first opportunity →
            </button>
          )}
        </NILEmpty>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((o) => (
            <article
              key={o.id}
              className="rounded-2xl border border-white/10 bg-[#141c29] p-5"
            >
              <div className="flex justify-between">
                <span className="rounded-lg bg-blue-400/10 p-2.5 text-blue-300">
                  <Target size={20} />
                </span>
                <NILStatus status={o.status} />
              </div>
              <h2 className="mt-5 break-words font-sans text-lg font-semibold">
                {o.brand}
              </h2>
              <p className="mt-1 text-sm text-slate-400">{o.athlete_name}</p>
              <p className="mt-5 text-2xl font-semibold tabular-nums">
                {o.value}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Proposed opportunity value
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                <button
                  onClick={() => showForm(o)}
                  className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-xs font-semibold text-blue-300 hover:bg-white/5"
                >
                  <Edit3 size={14} />
                  Edit opportunity
                </button>
                <button
                  onClick={() => {
                    setDeleteId(o.id)
                    setSaveError('')
                  }}
                  className="rounded-lg px-2 py-1 text-xs text-slate-400 hover:text-rose-300"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!saving) setOpen(value)
        }}
      >
        <DialogContent className="max-h-[90dvh] w-[calc(100%_-_2rem)] overflow-y-auto rounded-xl border-white/10 bg-[#111722]">
          <DialogTitle className="font-sans">
            {editing ? 'Edit opportunity' : 'New opportunity'}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Record an athlete and brand opportunity directly in your NIL
            workspace.
          </DialogDescription>
          <form onSubmit={save} className="space-y-4">
            <fieldset disabled={saving} className="space-y-4">
              {[
                { id: 'athlete_name', label: 'Athlete name' },
                { id: 'brand', label: 'Brand' },
              ].map(({ id, label }) => (
                <div key={id}>
                  <label htmlFor={`opp-${id}`} className="label">
                    {label}
                  </label>
                  <input
                    id={`opp-${id}`}
                    required
                    maxLength={200}
                    className="input"
                    value={form[id as 'brand' | 'athlete_name']}
                    onChange={(e) => setForm({ ...form, [id]: e.target.value })}
                  />
                </div>
              ))}
              <div>
                <label htmlFor="opp-value" className="label">
                  Value (USD)
                </label>
                <input
                  id="opp-value"
                  required
                  type="number"
                  min="0"
                  max="21474836.47"
                  step="0.01"
                  className="input"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="opp-stage" className="label">
                  Stage
                </label>
                <select
                  id="opp-stage"
                  className="input"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </fieldset>
            {saveError && (
              <p role="alert" className="text-sm text-rose-300">
                {saveError}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-sm text-slate-400"
              >
                Cancel
              </button>
              <button disabled={saving} className={nilButton}>
                {saving ? 'Saving…' : 'Save opportunity'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!deleteId}
        onOpenChange={(value) => {
          if (!value && !saving) setDeleteId(null)
        }}
      >
        <DialogContent className="w-[calc(100%_-_2rem)] rounded-xl border-white/10 bg-[#111722]">
          <DialogTitle>Delete opportunity?</DialogTitle>
          <DialogDescription className="text-slate-400">
            This permanently removes the selected opportunity.
          </DialogDescription>
          {saveError && (
            <p role="alert" className="text-sm text-rose-300">
              {saveError}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <button
              disabled={saving}
              onClick={() => setDeleteId(null)}
              className="px-3 py-2 text-sm text-slate-400"
            >
              Cancel
            </button>
            <button
              disabled={saving}
              onClick={() => void remove()}
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold disabled:opacity-50"
            >
              {saving ? 'Deleting…' : 'Delete opportunity'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </NILLayout>
  )
}
