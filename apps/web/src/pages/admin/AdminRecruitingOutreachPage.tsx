import { useMemo, useState } from 'react'
import {
  getMissingTemplateTokens,
  getTemplateTokens,
  recruitingEmailTemplates,
  recruitingPersonalizationFields,
  recruitingScenarios,
  recruitingStages,
  renderRecruitingTemplate,
  type RecruitingEmailTemplate,
  type RecruitingScenarioId,
  type RecruitingStageId,
} from '@hoop-master/features/recruiting'
import {
  BookOpen,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  Copy,
  Mail,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import DashboardLayout from '../../components/layout/DashboardLayout'

type StageFilter = RecruitingStageId | 'all'
type ScenarioFilter = RecruitingScenarioId | 'all'

const sampleValues: Record<string, string> = {
  athlete_first_name: 'Maya',
  athlete_full_name: 'Maya Johnson',
  grad_year: '2028',
  position: 'PG / SG',
  height: `5'9"`,
  school_name: 'Central High School',
  club_team: 'HOOP WITH HER Select',
  gpa: '3.7',
  academic_interest: 'sports medicine',
  coach_name: 'Coach Taylor',
  program_name: 'North State University',
  fit_reason: 'your transition style and strong kinesiology program',
  profile_url: 'https://profiles.hoopwithher.com/maya-johnson',
  highlight_url: 'https://film.hoopwithher.com/maya-highlights',
  full_game_url: 'https://film.hoopwithher.com/maya-full-game',
  schedule_url: 'https://profiles.hoopwithher.com/maya-johnson/schedule',
  event_name: 'Fall Open Run',
  event_date: 'October 12',
  event_location: 'HOOP WITH HER Training Center',
  court_number: 'Court 2',
  event_result: '12 points, 6 assists, and strong on-ball defense',
  new_update: 'a new highlight reel and updated spring schedule',
  next_action: 'review the target list by Friday',
  staff_name: 'Jordan Smith',
}

const audienceLabels: Record<RecruitingEmailTemplate['audience'], string> = {
  athlete: 'Athlete',
  family: 'Athlete + Family',
  college_coach: 'College Coach',
  internal_staff: 'Internal Staff',
}

export default function AdminRecruitingOutreachPage() {
  const [stageFilter, setStageFilter] = useState<StageFilter>('all')
  const [scenarioFilter, setScenarioFilter] = useState<ScenarioFilter>('all')
  const [query, setQuery] = useState('')
  const [selectedTemplateId, setSelectedTemplateId] = useState(recruitingEmailTemplates[0].id)
  const [selectedVariantId, setSelectedVariantId] = useState(recruitingEmailTemplates[0].variants[0].id)
  const [values, setValues] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState<'subject' | 'body' | 'draft' | null>(null)

  const filteredTemplates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return recruitingEmailTemplates.filter(template => {
      const stageMatches = stageFilter === 'all' || template.stage === stageFilter
      const scenarioMatches = scenarioFilter === 'all' || template.scenarios.includes(scenarioFilter)
      const queryMatches = !normalizedQuery || [
        template.title,
        template.description,
        template.trigger,
        template.goal,
        template.cadence,
        ...template.variants.flatMap(variant => [variant.label, variant.whenToUse]),
      ].some(value => value.toLowerCase().includes(normalizedQuery))
      return stageMatches && scenarioMatches && queryMatches
    })
  }, [query, scenarioFilter, stageFilter])

  const selectedTemplate = recruitingEmailTemplates.find(template => template.id === selectedTemplateId)
    ?? filteredTemplates[0]
    ?? recruitingEmailTemplates[0]
  const selectedVariant = selectedTemplate.variants.find(variant => variant.id === selectedVariantId)
    ?? selectedTemplate.variants[0]

  const fields = useMemo(() => {
    const tokens = new Set(getTemplateTokens({ ...selectedTemplate, variants: [selectedVariant] }))
    return recruitingPersonalizationFields.filter(field => tokens.has(field.token))
  }, [selectedTemplate, selectedVariant])

  const renderedSubject = renderRecruitingTemplate(selectedVariant.subject, values)
  const renderedBody = renderRecruitingTemplate(selectedVariant.body, values)
  const missingTokens = getMissingTemplateTokens(`${selectedVariant.subject}\n${selectedVariant.body}`, values)

  const selectTemplate = (template: RecruitingEmailTemplate) => {
    setSelectedTemplateId(template.id)
    setSelectedVariantId(template.variants[0].id)
  }

  const setStage = (stage: StageFilter) => {
    setStageFilter(stage)
    const next = recruitingEmailTemplates.find(template => stage === 'all' || template.stage === stage)
    if (next) selectTemplate(next)
  }

  const copyText = async (kind: 'subject' | 'body' | 'draft', text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(kind)
      toast.success(kind === 'draft' ? 'Draft copied for review' : `${kind === 'subject' ? 'Subject' : 'Body'} copied`)
      window.setTimeout(() => setCopied(current => current === kind ? null : current), 1800)
    } catch {
      toast.error('Copy failed. Select the text and copy it manually.')
    }
  }

  const fillSample = () => setValues(previous => ({ ...sampleValues, ...previous }))
  const resetPersonalization = () => setValues({})

  return (
    <DashboardLayout
      variant="admin"
      title="Recruiting Outreach Center"
      subtitle="Build consistent, personalized recruiting communication for every stage and scenario."
      action={(
        <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300">
          <ShieldCheck size={15} /> Review-only workspace
        </div>
      )}
    >
      <div className="mx-auto max-w-[1600px] space-y-6">
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Template library summary">
          <SummaryCard icon={<BookOpen size={18} />} label="Workflow stages" value={String(recruitingStages.length)} detail="Launch through close-out" />
          <SummaryCard icon={<Mail size={18} />} label="Core templates" value={String(recruitingEmailTemplates.length)} detail="Family and coach communication" />
          <SummaryCard icon={<Sparkles size={18} />} label="Message variations" value={String(recruitingEmailTemplates.reduce((total, template) => total + template.variants.length, 0))} detail="Role, event, and response scenarios" />
          <SummaryCard icon={<ShieldCheck size={18} />} label="Delivery mode" value="Draft" detail="Copy only; no automatic sending" />
        </section>

        <section className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4">
          <div className="flex items-start gap-3">
            <CircleAlert size={18} className="mt-0.5 shrink-0 text-amber-300" />
            <div>
              <h2 className="text-sm font-semibold text-amber-100">Staff and family review is required</h2>
              <p className="mt-1 text-xs leading-5 text-amber-100/70">
                This workspace creates drafts only. Verify every claim, link, coach name, event detail, and recipient before using a message. Never paste private evaluation notes or parent contact information into coach outreach.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-navy-800 p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-white">Recruiting sequence</h2>
              <p className="mt-1 text-sm text-slate-400">Choose a stage to narrow the library and keep the communication cadence clear.</p>
            </div>
            <button
              type="button"
              onClick={() => setStage('all')}
              className={`self-start rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${stageFilter === 'all' ? 'bg-[#0134BD] text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
            >
              View all stages
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            {recruitingStages.map(stage => {
              const active = stageFilter === stage.id
              return (
                <button
                  type="button"
                  key={stage.id}
                  onClick={() => setStage(stage.id)}
                  className={`group rounded-xl border p-3 text-left transition-colors ${active ? 'border-[#4f7cff] bg-[#0134BD]/25' : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'}`}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${active ? 'bg-[#0134BD] text-white' : 'bg-white/10 text-slate-300'}`}>{stage.order}</span>
                    <ChevronRight size={14} className={active ? 'text-blue-300' : 'text-slate-600 group-hover:text-slate-400'} />
                  </div>
                  <p className="text-xs font-semibold text-white">{stage.shortLabel}</p>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-500">{stage.description}</p>
                </button>
              )
            })}
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(280px,0.8fr)_minmax(420px,1.25fr)_minmax(380px,1fr)]">
          <section className="min-w-0 rounded-2xl border border-white/10 bg-navy-800" aria-labelledby="template-library-heading">
            <div className="border-b border-white/10 p-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={17} className="text-blue-300" />
                <h2 id="template-library-heading" className="font-semibold text-white">Template library</h2>
              </div>
              <div className="relative mt-3">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="Search templates..."
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#4f7cff]"
                />
              </div>
              <select
                value={scenarioFilter}
                onChange={event => setScenarioFilter(event.target.value as ScenarioFilter)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-[#101a35] px-3 py-2.5 text-sm text-white outline-none focus:border-[#4f7cff]"
                aria-label="Filter by scenario"
              >
                <option value="all">All scenarios</option>
                {recruitingScenarios.map(scenario => <option key={scenario.id} value={scenario.id}>{scenario.label}</option>)}
              </select>
            </div>
            <div className="max-h-[720px] space-y-2 overflow-y-auto p-3">
              {filteredTemplates.map(template => {
                const stage = recruitingStages.find(item => item.id === template.stage)
                const selected = template.id === selectedTemplate.id
                return (
                  <button
                    type="button"
                    key={template.id}
                    onClick={() => selectTemplate(template)}
                    className={`w-full rounded-xl border p-3 text-left transition-colors ${selected ? 'border-[#4f7cff] bg-[#0134BD]/20' : 'border-white/10 bg-white/[0.025] hover:bg-white/[0.06]'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-300">{stage?.shortLabel}</p>
                        <h3 className="mt-1 text-sm font-semibold text-white">{template.title}</h3>
                      </div>
                      <span className="shrink-0 rounded-full bg-white/10 px-2 py-1 text-[10px] font-medium text-slate-300">{template.variants.length} {template.variants.length === 1 ? 'version' : 'versions'}</span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-400">{template.description}</p>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500"><Clock3 size={12} /> {template.cadence}</div>
                  </button>
                )
              })}
              {filteredTemplates.length === 0 && (
                <div className="rounded-xl border border-dashed border-white/10 px-4 py-10 text-center">
                  <Search size={22} className="mx-auto text-slate-600" />
                  <p className="mt-2 text-sm font-medium text-slate-300">No templates match</p>
                  <button type="button" onClick={() => { setQuery(''); setScenarioFilter('all'); setStageFilter('all') }} className="mt-3 text-xs font-semibold text-blue-300 hover:text-blue-200">Clear filters</button>
                </div>
              )}
            </div>
          </section>

          <section className="min-w-0 space-y-4" aria-labelledby="personalize-heading">
            <div className="rounded-2xl border border-white/10 bg-navy-800 p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-300">{audienceLabels[selectedTemplate.audience]}</p>
              <h2 id="personalize-heading" className="mt-1 font-display text-xl font-bold text-white">{selectedTemplate.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{selectedTemplate.description}</p>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <InfoItem label="Trigger" value={selectedTemplate.trigger} />
                <InfoItem label="Goal" value={selectedTemplate.goal} />
              </dl>
            </div>

            <div className="rounded-2xl border border-white/10 bg-navy-800 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-white">Choose a variation</h3>
                  <p className="mt-1 text-xs text-slate-500">Select the version that matches the current recruiting scenario.</p>
                </div>
                <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-slate-400">{selectedTemplate.variants.length} available</span>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {selectedTemplate.variants.map(variant => (
                  <button
                    type="button"
                    key={variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`rounded-xl border p-3 text-left transition-colors ${selectedVariant.id === variant.id ? 'border-[#4f7cff] bg-[#0134BD]/20' : 'border-white/10 bg-white/[0.025] hover:bg-white/[0.06]'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${selectedVariant.id === variant.id ? 'border-blue-300 bg-[#0134BD]' : 'border-slate-600'}`}>
                        {selectedVariant.id === variant.id && <Check size={10} className="text-white" />}
                      </span>
                      <span className="text-xs font-semibold text-white">{variant.label}</span>
                    </div>
                    <p className="mt-2 text-[11px] leading-4 text-slate-500">{variant.whenToUse}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-navy-800 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-white">Personalize the draft</h3>
                  <p className="mt-1 text-xs text-slate-500">Only fields used by this variation are shown.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={fillSample} className="rounded-lg bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10">Use sample</button>
                  <button type="button" onClick={resetPersonalization} className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10"><RotateCcw size={12} /> Clear</button>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {fields.map(field => (
                  <label key={field.token} className={field.token === 'fit_reason' || field.token === 'new_update' || field.token === 'next_action' || field.token === 'event_result' ? 'sm:col-span-2' : ''}>
                    <span className="mb-1.5 block text-xs font-medium text-slate-300">{field.label}</span>
                    <input
                      value={values[field.token] ?? ''}
                      onChange={event => setValues(previous => ({ ...previous, [field.token]: event.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#4f7cff]"
                    />
                  </label>
                ))}
              </div>
            </div>
          </section>

          <aside className="min-w-0 xl:sticky xl:top-20 xl:self-start" aria-labelledby="draft-preview-heading">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-navy-800">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
                <div>
                  <h2 id="draft-preview-heading" className="font-semibold text-white">Draft preview</h2>
                  <p className="mt-0.5 text-[11px] text-slate-500">Review placeholders before copying.</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyText('draft', `Subject: ${renderedSubject}\n\n${renderedBody}`)}
                  className="flex items-center gap-1.5 rounded-lg bg-[#0134BD] px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  {copied === 'draft' ? <Check size={14} /> : <Copy size={14} />}
                  {copied === 'draft' ? 'Copied' : 'Copy draft'}
                </button>
              </div>

              {missingTokens.length > 0 ? (
                <div className="border-b border-amber-400/20 bg-amber-500/10 px-5 py-3 text-xs text-amber-100/80">
                  <span className="font-semibold text-amber-100">{missingTokens.length} placeholder{missingTokens.length === 1 ? '' : 's'} remaining.</span> Fill the highlighted fields or replace bracketed text after copying.
                </div>
              ) : (
                <div className="flex items-center gap-2 border-b border-emerald-400/20 bg-emerald-500/10 px-5 py-3 text-xs text-emerald-200">
                  <Check size={13} /> All personalization fields are complete.
                </div>
              )}

              <div className="space-y-5 p-5">
                <div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Subject</span>
                    <button type="button" onClick={() => copyText('subject', renderedSubject)} className="flex items-center gap-1 text-[11px] font-semibold text-blue-300 hover:text-blue-200">
                      {copied === 'subject' ? <Check size={11} /> : <Copy size={11} />} Copy
                    </button>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm font-semibold leading-6 text-white">{renderedSubject}</div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Email body</span>
                    <button type="button" onClick={() => copyText('body', renderedBody)} className="flex items-center gap-1 text-[11px] font-semibold text-blue-300 hover:text-blue-200">
                      {copied === 'body' ? <Check size={11} /> : <Copy size={11} />} Copy
                    </button>
                  </div>
                  <div className="max-h-[520px] overflow-y-auto whitespace-pre-wrap rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-slate-200">{renderedBody}</div>
                </div>
              </div>

              <div className="border-t border-white/10 bg-white/[0.025] px-5 py-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300"><ShieldCheck size={14} className="text-emerald-300" /> Pre-send quality check</div>
                <ul className="mt-2 space-y-1 text-[11px] leading-5 text-slate-500">
                  <li>• Athlete and family approved the message.</li>
                  <li>• Claims, links, schedule, and recipient were verified.</li>
                  <li>• No private family contact or evaluation notes are included.</li>
                  <li>• The message adds value and respects the cadence.</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  )
}

function SummaryCard({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-navy-800 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-slate-500">{label}</p>
          <p className="mt-1 font-display text-2xl font-bold text-white">{value}</p>
        </div>
        <span className="rounded-lg bg-[#0134BD]/20 p-2 text-blue-300">{icon}</span>
      </div>
      <p className="mt-2 text-xs text-slate-500">{detail}</p>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
      <dt className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-500">{label}</dt>
      <dd className="mt-1 text-xs leading-5 text-slate-300">{value}</dd>
    </div>
  )
}
