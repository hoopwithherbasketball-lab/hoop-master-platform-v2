import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarDays,
  FileText,
  ListTodo,
  Plus,
  RefreshCw,
  Target,
  Users,
} from 'lucide-react'
import NILLayout from '../../components/nil/NILLayout'
import {
  NILEmpty,
  NILError,
  NILLoading,
  NILStatus,
  nilButton,
} from '../../components/nil/NILStates'
import useNILOverview from './useNILOverview'

const actions = [
  {
    title: 'Build your athlete roster',
    description: 'Review profiles, visibility, and readiness.',
    to: '/nil/athletes',
    icon: Users,
  },
  {
    title: 'Find your next brand',
    description: 'Organize contacts and start a conversation.',
    to: '/nil/companies',
    icon: Building2,
  },
  {
    title: 'Shape a partnership',
    description: 'Turn an idea into a proposal in the Hub.',
    to: '/nil/proposals?new=1',
    icon: FileText,
  },
]

export default function NILOverview() {
  const { data, loading, error, refresh } = useNILOverview()
  const metrics = [
    {
      label: 'Athlete roster',
      value: data?.athletes,
      note: 'Opted into NIL',
      icon: Users,
      to: '/nil/athletes',
    },
    {
      label: 'Brand network',
      value: data?.brands,
      note: 'Brands in your workspace',
      icon: Building2,
      to: '/nil/companies',
    },
    {
      label: 'Active opportunities',
      value: data?.activeDeals,
      note: 'Active or accepted',
      icon: Target,
      to: '/nil/opportunities',
    },
    {
      label: 'Open tasks',
      value: data?.openTasks,
      note: 'To do and in progress',
      icon: ListTodo,
      to: '/nil/tasks',
    },
  ]
  return (
    <NILLayout
      title="Make opportunity happen."
      subtitle="Your athletes, brands, and next moves. All in one place."
      action={
        <Link className={nilButton} to="/nil/proposals?new=1">
          <Plus size={16} />
          Create proposal
        </Link>
      }
    >
      <section className="relative overflow-hidden rounded-2xl border border-blue-400/20 bg-[#102656] p-6 sm:p-8">
        <div className="relative max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-[.2em] text-blue-200">
            Name. Image. Likeness.
          </span>
          <h2 className="mt-3 font-sans text-2xl font-bold tracking-tight sm:text-3xl">
            More than a deal.
            <br />
            <span className="text-blue-200">A platform for what’s next.</span>
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-blue-100/80">
            Connect athlete potential with the right brands. Develop
            opportunities, prepare proposals, and keep every follow-up moving.
          </p>
          <Link
            to="/nil/opportunities"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white hover:underline"
          >
            Explore your opportunities <ArrowRight size={16} />
          </Link>
        </div>
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-12 hidden h-80 w-80 rounded-full border-[32px] border-white/5 sm:block"
        />
      </section>
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-sm font-semibold">Workspace snapshot</h2>
        <button
          onClick={() => void refresh()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-50"
        >
          <RefreshCw
            size={13}
            className={loading ? 'animate-spin motion-reduce:animate-none' : ''}
          />
          Refresh
        </button>
      </div>
      {error && <NILError message={error} retry={() => void refresh()} />}
      {loading ? (
        <NILLoading />
      ) : (
        !error && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map(({ label, value, note, icon: Icon, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="group rounded-2xl border border-white/10 bg-[#141c29] p-5 transition-colors hover:border-blue-400/40"
                >
                  <div className="flex justify-between text-slate-400">
                    <Icon size={19} />
                    <ArrowUpRight
                      size={15}
                      className="group-hover:text-white"
                    />
                  </div>
                  <p className="mt-5 text-3xl font-semibold tracking-tight">
                    {value?.toLocaleString() ?? '—'}
                  </p>
                  <p className="mt-1 text-sm font-medium">{label}</p>
                  <p className="mt-2 text-xs text-slate-400">{note}</p>
                </Link>
              ))}
            </div>
            <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              <section className="min-w-0 rounded-2xl border border-white/10 bg-[#111722] p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-sans text-base font-semibold">
                      Latest opportunities
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      Your five most recent opportunities
                    </p>
                  </div>
                  <Link
                    to="/nil/opportunities"
                    className="shrink-0 text-xs font-semibold text-blue-300 hover:underline"
                  >
                    View all <span aria-hidden="true">↗</span>
                  </Link>
                </div>
                {data?.opportunities.length ? (
                  <div className="divide-y divide-white/5">
                    {data.opportunities.map((o) => (
                      <Link
                        key={o.id}
                        to="/nil/opportunities"
                        className="flex flex-wrap items-center justify-between gap-3 rounded-lg py-4 hover:bg-white/[.02]"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-bold text-blue-200">
                            {(o.brand || o.title || 'N')
                              .slice(0, 2)
                              .toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">
                              {o.brand || o.title || 'Untitled opportunity'}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {o.athlete_name || 'Athlete not assigned'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm tabular-nums">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              maximumFractionDigits: 0,
                            }).format((o.value_cents ?? 0) / 100)}
                          </span>
                          <NILStatus status={o.status} />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <NILEmpty title="Your next partnership starts here.">
                    Add an opportunity to track its progress.
                    <Link
                      to="/nil/opportunities"
                      className="mt-4 block font-semibold text-blue-300"
                    >
                      Create an opportunity →
                    </Link>
                  </NILEmpty>
                )}
              </section>
              <section className="rounded-2xl border border-white/10 bg-[#111722] p-5 sm:p-6">
                <div className="mb-5 flex justify-between">
                  <div>
                    <h2 className="font-sans text-base font-semibold">
                      Next up
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      Open tasks, ordered by due date
                    </p>
                  </div>
                  <CalendarDays size={18} className="text-brand-orange" />
                </div>
                {data?.tasks.length ? (
                  <div className="space-y-3">
                    {data.tasks.map((task) => (
                      <Link
                        key={task.id}
                        to="/nil/tasks"
                        className="flex gap-3 rounded-xl border border-white/5 p-3 hover:bg-white/5"
                      >
                        <ListTodo
                          size={17}
                          className="mt-1 shrink-0 text-slate-400"
                        />
                        <div>
                          <p className="text-sm font-medium">{task.title}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {task.due_date
                              ? new Date(
                                  `${task.due_date}T12:00:00`
                                ).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : 'No due date'}{' '}
                            · {task.status.replace(/_/g, ' ')}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <NILEmpty title="Room for your next move.">
                    Add a follow-up or partnership task.
                  </NILEmpty>
                )}
                <Link
                  to="/nil/tasks"
                  className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-blue-300"
                >
                  Open task board <ArrowRight size={14} />
                </Link>
              </section>
            </div>
          </>
        )
      )}
      <section>
        <h2 className="mb-4 font-sans text-sm font-semibold">
          Move your NIL program forward
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {actions.map(({ title, description, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-xl border border-white/10 p-5 transition-colors hover:bg-white/5"
            >
              <Icon size={20} className="mb-4 text-brand-orange" />
              <p className="flex items-center justify-between gap-2 text-sm font-semibold">
                {title}
                <ArrowUpRight
                  size={15}
                  className="shrink-0 text-slate-500 group-hover:text-white"
                />
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                {description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </NILLayout>
  )
}
