import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowUpRight, FileText, Plus } from 'lucide-react'
import { toast } from 'sonner'
import NILLayout from '../../components/nil/NILLayout'
import {
  NILEmpty,
  NILError,
  NILLoading,
  NILStatus,
  nilButton,
} from '../../components/nil/NILStates'
import NILProposalForm from './NILProposalForm'
import {
  proposalStatuses,
  useNILProposals,
  type NILProposal,
  type NILProposalDetails,
  type ProposalStatus,
} from './useNILProposals'

export default function NILProposals() {
  const [params, setParams] = useSearchParams()
  const [editing, setEditing] = useState<NILProposal | null>(null)
  const [page, setPage] = useState(0)
  const [status, setStatus] = useState('')
  const { proposals, total, loading, error, refetch, save, pageSize } =
    useNILProposals(page, status)
  const creating = params.get('new') === '1'
  function close() {
    setEditing(null)
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        next.delete('new')
        return next
      },
      { replace: true }
    )
  }
  async function handleSave(
    details: NILProposalDetails,
    status: ProposalStatus,
    id?: string
  ) {
    const savedId = await save(details, status, id)
    setPage(0)
    setStatus('')
    toast.success(id ? 'Proposal updated' : 'Draft saved to your NIL workspace')
    return savedId
  }
  return (
    <NILLayout
      title="Proposals"
      subtitle="Turn a partnership idea into a clear offer. Create a draft for any brand or organization."
      action={
        <button onClick={() => setParams({ new: '1' })} className={nilButton}>
          <Plus size={16} />
          Create proposal
        </button>
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#111722] p-4">
        <div>
          <p className="text-sm font-semibold">Your NIL proposals</p>
          <p className="mt-1 text-xs text-slate-400">
            Drafts and partnership activity managed in the Hub
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="proposal-filter" className="sr-only">
            Filter proposal status
          </label>
          <select
            id="proposal-filter"
            className="input !w-auto"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(0)
            }}
          >
            <option value="">All statuses</option>
            {proposalStatuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <Link
            to="/nil/proposals/advanced"
            className="inline-flex items-center gap-1 text-xs text-blue-300 hover:underline"
          >
            Template studio & earlier proposals <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
      {error ? (
        <NILError message={error} retry={() => void refetch()} />
      ) : loading ? (
        <NILLoading />
      ) : proposals.length === 0 ? (
        <NILEmpty
          title={
            status
              ? 'No proposals with this status.'
              : 'Start with an idea. Make it an offer.'
          }
        >
          {status
            ? 'Choose another status to see more proposals.'
            : 'Enter a recipient, outline the deliverables, and save your first draft.'}
          <div className="mt-5">
            <button
              onClick={() => (status ? setStatus('') : setParams({ new: '1' }))}
              className={nilButton}
            >
              {status ? 'Clear filter' : 'Create your first proposal'}
            </button>
          </div>
        </NILEmpty>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {proposals.map((proposal) => (
              <article
                key={proposal.id}
                className="flex min-w-0 flex-col rounded-2xl border border-white/10 bg-[#141c29] p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-white/5 p-2.5 text-blue-300">
                    <FileText size={20} />
                  </span>
                  <NILStatus status={proposal.status} />
                </div>
                <h2 className="mt-5 break-words font-sans text-lg font-semibold">
                  {proposal.package_details.title}
                </h2>
                <p className="mt-1 break-words text-sm text-slate-400">
                  {proposal.package_details.recipient}
                </p>
                {proposal.package_details.athlete_name && (
                  <p className="mt-2 text-xs text-blue-200">
                    {proposal.package_details.athlete_name}
                  </p>
                )}
                <p className="my-5 line-clamp-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-400">
                  {proposal.package_details.deliverables}
                </p>
                <div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-white/10 pt-4">
                  <div>
                    <p className="text-xl font-semibold">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(proposal.package_details.amount)}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Created{' '}
                      {new Date(proposal.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold hover:bg-white/5"
                    onClick={() => setEditing(proposal)}
                  >
                    Open proposal
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-400">
            <p>
              {page * pageSize + 1}–{Math.min((page + 1) * pageSize, total)} of{' '}
              {total} proposals
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="rounded-lg border border-white/10 px-4 py-2 disabled:opacity-30"
              >
                Previous
              </button>
              <button
                disabled={(page + 1) * pageSize >= total}
                onClick={() => setPage(page + 1)}
                className="rounded-lg border border-white/10 px-4 py-2 disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
      {(creating || editing) && (
        <NILProposalForm
          key={editing?.id ?? 'new'}
          proposal={editing}
          onClose={close}
          onSave={handleSave}
        />
      )}
    </NILLayout>
  )
}
