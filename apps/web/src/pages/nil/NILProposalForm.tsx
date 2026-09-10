import { useEffect, useState, type FormEvent } from 'react'
import { FileText, Save } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../../components/ui/dialog'
import { nilButton } from '../../components/nil/NILStates'
import {
  emptyProposal,
  proposalStatuses,
  type NILProposal,
  type NILProposalDetails,
  type ProposalStatus,
} from './useNILProposals'

interface Props {
  proposal: NILProposal | null
  onClose: () => void
  onSave: (
    details: NILProposalDetails,
    status: ProposalStatus,
    id?: string
  ) => Promise<string>
}
interface Brand {
  id: string
  name: string
}

export default function NILProposalForm({ proposal, onClose, onSave }: Props) {
  const [details, setDetails] = useState<NILProposalDetails>(() => ({
    ...emptyProposal,
    ...proposal?.package_details,
  }))
  const [status, setStatus] = useState<ProposalStatus>(
    proposal?.status ?? 'Draft'
  )
  const [brands, setBrands] = useState<Brand[]>([])
  const [brandError, setBrandError] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    async function loadBrands() {
      try {
        const result = await supabase
          .from('nil_companies')
          .select('id,name')
          .order('name')
        if (!active) return
        if (result.error) setBrandError(true)
        else setBrands(result.data ?? [])
      } catch {
        if (active) setBrandError(true)
      }
    }
    void loadBrands()
    return () => {
      active = false
    }
  }, [])
  const update = <K extends keyof NILProposalDetails>(
    key: K,
    value: NILProposalDetails[K]
  ) => setDetails((previous) => ({ ...previous, [key]: value }))
  async function submit(event: FormEvent) {
    event.preventDefault()
    if (
      !details.title.trim() ||
      !details.recipient.trim() ||
      !details.deliverables.trim()
    ) {
      setError('Add a title, recipient, and deliverables before saving.')
      return
    }
    if (!Number.isFinite(details.amount) || details.amount < 0) {
      setError('Enter a valid, non-negative proposal value.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSave(
        {
          ...details,
          title: details.title.trim(),
          recipient: details.recipient.trim(),
          amount: Math.round(details.amount * 100) / 100,
        },
        status,
        proposal?.id
      )
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to save the proposal.')
    } finally {
      setSaving(false)
    }
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !saving) onClose()
      }}
    >
      <DialogContent className="max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-4xl overflow-y-auto rounded-2xl border-white/10 bg-[#111722] text-slate-100">
        <div>
          <DialogTitle className="font-sans text-xl">
            {proposal ? 'Edit proposal' : 'Create a proposal'}
          </DialogTitle>
          <DialogDescription className="mt-2 text-slate-400">
            Define the partnership, prepare your offer, and save it to your NIL
            workspace.
          </DialogDescription>
        </div>
        <form onSubmit={submit} className="space-y-5">
          <fieldset
            disabled={saving}
            className="grid min-w-0 gap-6 md:grid-cols-[1.2fr_1fr]"
          >
            <div className="min-w-0 space-y-4">
              <div>
                <label className="label" htmlFor="nil-title">
                  Proposal title
                </label>
                <input
                  id="nil-title"
                  required
                  maxLength={160}
                  autoFocus
                  className="input"
                  placeholder="Summer athlete ambassador partnership"
                  value={details.title}
                  onChange={(e) => update('title', e.target.value)}
                />
              </div>
              <div>
                <label className="label" htmlFor="nil-brand">
                  Brand from your network{' '}
                  <span className="text-slate-500">· optional</span>
                </label>
                <select
                  id="nil-brand"
                  className="input"
                  value={details.company_id ?? ''}
                  onChange={(e) => {
                    const brand = brands.find((b) => b.id === e.target.value)
                    setDetails((previous) => ({
                      ...previous,
                      company_id: brand?.id ?? null,
                      recipient: brand?.name ?? previous.recipient,
                    }))
                  }}
                >
                  <option value="">Enter a recipient directly</option>
                  {details.company_id &&
                    !brands.some((b) => b.id === details.company_id) && (
                      <option value={details.company_id}>
                        {details.recipient} (saved brand)
                      </option>
                    )}
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {brandError && (
                  <p role="status" className="mt-2 text-xs text-amber-200">
                    Your brand list is unavailable. You can still enter a
                    recipient and save your proposal.
                  </p>
                )}
              </div>
              <div>
                <label className="label" htmlFor="nil-recipient">
                  Recipient / organization
                </label>
                <input
                  id="nil-recipient"
                  required
                  maxLength={200}
                  className="input"
                  placeholder="Brand or organization name"
                  value={details.recipient}
                  onChange={(e) => update('recipient', e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="nil-athlete">
                    Athlete <span className="text-slate-500">· optional</span>
                  </label>
                  <input
                    id="nil-athlete"
                    maxLength={160}
                    className="input"
                    placeholder="Athlete name"
                    value={details.athlete_name}
                    onChange={(e) => update('athlete_name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label" htmlFor="nil-amount">
                    Proposed value (USD)
                  </label>
                  <input
                    id="nil-amount"
                    type="number"
                    min="0"
                    max="100000000"
                    step="0.01"
                    required
                    className="input"
                    value={details.amount}
                    onChange={(e) => update('amount', e.target.valueAsNumber)}
                  />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="nil-deliverables">
                  Deliverables
                </label>
                <textarea
                  id="nil-deliverables"
                  required
                  maxLength={10000}
                  rows={4}
                  className="input"
                  placeholder="Outline the content, appearances, timeline, and expectations."
                  value={details.deliverables}
                  onChange={(e) => update('deliverables', e.target.value)}
                />
              </div>
              <div>
                <label className="label" htmlFor="nil-notes">
                  Internal notes{' '}
                  <span className="text-slate-500">· optional</span>
                </label>
                <textarea
                  id="nil-notes"
                  maxLength={10000}
                  rows={2}
                  className="input"
                  placeholder="Follow-up details for your team"
                  value={details.notes}
                  onChange={(e) => update('notes', e.target.value)}
                />
              </div>
              {proposal && (
                <div>
                  <label className="label" htmlFor="nil-proposal-status">
                    Recorded status
                  </label>
                  <select
                    id="nil-proposal-status"
                    className="input"
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as ProposalStatus)
                    }
                  >
                    {proposalStatuses.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-slate-400">
                    Status tracks activity you record. Saving does not send a
                    message or publish the proposal.
                  </p>
                </div>
              )}
            </div>
            <aside className="min-w-0 self-start rounded-xl border border-white/10 bg-[#0c1018] p-5">
              <div className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-slate-400">
                <FileText size={14} />
                Proposal preview
              </div>
              <p className="text-xs font-bold text-brand-orange">
                HOOP WITH HER · NIL
              </p>
              <h3 className="mt-4 break-words font-sans text-2xl font-bold">
                {details.title || 'Your next partnership'}
              </h3>
              <p className="mt-3 break-words text-sm text-slate-400">
                Prepared for{' '}
                <span className="text-white">
                  {details.recipient || 'your brand partner'}
                </span>
              </p>
              {details.athlete_name && (
                <p className="mt-2 break-words text-sm text-slate-400">
                  Athlete: {details.athlete_name}
                </p>
              )}
              <div className="my-6 border-y border-white/10 py-4">
                <p className="text-xs text-slate-400">Proposed investment</p>
                <p className="mt-1 break-words text-2xl font-semibold">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(
                    Number.isFinite(details.amount) ? details.amount : 0
                  )}
                </p>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Deliverables
              </p>
              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-300">
                {details.deliverables ||
                  'Your partnership outline will appear here as you write.'}
              </p>
              <p className="mt-8 text-xs leading-relaxed text-slate-500">
                Proposal outline for discussion. Final terms and required
                approvals are handled separately.
              </p>
            </aside>
          </fieldset>
          {error && (
            <p
              role="alert"
              className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200"
            >
              {error}
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-slate-400 hover:bg-white/5"
            >
              Cancel
            </button>
            <button type="submit" disabled={saving} className={nilButton}>
              <Save size={16} />
              {saving ? 'Saving…' : proposal ? 'Save changes' : 'Save draft'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
