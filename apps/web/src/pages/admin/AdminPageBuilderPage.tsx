import { useEffect, useMemo, useState } from 'react'
import { PageBuilder } from '@hoop-master/features'
import DashboardLayout from '../../components/layout/DashboardLayout'
import PageRenderer from '../../components/page-builder/PageRenderer'
import { Eye, FileJson, Globe, LayoutTemplate, Plus, Save, ShieldCheck, Wand2 } from 'lucide-react'

type PageDefinition = PageBuilder.PageDefinition
type PageBlock = PageBuilder.PageBlock

const defaultEditorEmail = 'admin@hoopwithher.local'

function loadStoredPages(): PageDefinition[] {
  if (typeof window === 'undefined') return [PageBuilder.createSamplePage(defaultEditorEmail)]

  try {
    const raw = window.localStorage.getItem(PageBuilder.PAGE_BUILDER_STORAGE_KEY)
    if (!raw) return [PageBuilder.createSamplePage(defaultEditorEmail)]
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [PageBuilder.createSamplePage(defaultEditorEmail)]
  } catch (error) {
    console.warn('Unable to load page builder pages:', error)
    return [PageBuilder.createSamplePage(defaultEditorEmail)]
  }
}

function persistPages(pages: PageDefinition[]) {
  window.localStorage.setItem(PageBuilder.PAGE_BUILDER_STORAGE_KEY, JSON.stringify(pages))
}

function safeParseBlocks(value: string): { blocks: PageBlock[]; error?: string } {
  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return { blocks: [], error: 'Blocks JSON must be an array.' }
    return { blocks: parsed as PageBlock[] }
  } catch (error) {
    return { blocks: [], error: error instanceof Error ? error.message : 'Invalid JSON.' }
  }
}

export default function AdminPageBuilderPage() {
  const [pages, setPages] = useState<PageDefinition[]>(() => loadStoredPages())
  const [selectedId, setSelectedId] = useState(() => pages[0]?.id ?? '')
  const selectedPage = pages.find(page => page.id === selectedId) ?? pages[0]
  const [draft, setDraft] = useState<PageDefinition>(selectedPage)
  const [blocksJson, setBlocksJson] = useState(() => JSON.stringify(selectedPage?.blocks ?? [], null, 2))
  const [jsonError, setJsonError] = useState<string | undefined>()
  const [savedAt, setSavedAt] = useState<string | undefined>()

  useEffect(() => {
    if (!selectedPage) return
    setDraft(selectedPage)
    setBlocksJson(JSON.stringify(selectedPage.blocks, null, 2))
    setJsonError(undefined)
  }, [selectedPage?.id])

  const validationIssues = useMemo(() => {
    if (!draft) return []
    const { blocks, error } = safeParseBlocks(blocksJson)
    if (error) return [{ path: 'blocks', message: error, severity: 'error' as const }]
    return PageBuilder.validatePageDefinition({ ...draft, blocks })
  }, [blocksJson, draft])

  const previewPage = useMemo<PageDefinition>(() => {
    const { blocks } = safeParseBlocks(blocksJson)
    return { ...draft, blocks: blocks.length ? blocks : draft.blocks }
  }, [blocksJson, draft])

  const checklist = useMemo(() => PageBuilder.getPublishChecklist(previewPage), [previewPage])
  const canPublish = checklist.every(item => item.passed) && !jsonError

  function updateDraft(update: Partial<PageDefinition>) {
    setDraft(current => ({ ...current, ...update, updatedAt: new Date().toISOString() }))
  }

  function saveDraft(nextStatus: PageDefinition['status'] = draft.status) {
    const { blocks, error } = safeParseBlocks(blocksJson)
    setJsonError(error)
    if (error) return

    const nextPage: PageDefinition = {
      ...draft,
      status: nextStatus,
      blocks,
      updatedAt: new Date().toISOString(),
      updatedBy: defaultEditorEmail,
    }
    const nextPages = pages.map(page => page.id === nextPage.id ? nextPage : page)
    setPages(nextPages)
    setDraft(nextPage)
    persistPages(nextPages)
    setSavedAt(new Date().toLocaleTimeString())
  }

  function addPage() {
    const sample = PageBuilder.createSamplePage(defaultEditorEmail)
    const nextPage: PageDefinition = {
      ...sample,
      id: `page-${Date.now().toString(36)}`,
      slug: `new-page-${pages.length + 1}`,
      title: `New Page ${pages.length + 1}`,
      status: 'draft',
      seo: {
        title: `New Page ${pages.length + 1} | Hoop With Her`,
        description: 'Draft page created in the Hoop With Her page builder. Update this description before publishing.',
      },
      blocks: [],
      updatedAt: new Date().toISOString(),
    }
    const nextPages = [...pages, nextPage]
    setPages(nextPages)
    persistPages(nextPages)
    setSelectedId(nextPage.id)
  }

  function addBlock(template: PageBlock) {
    const { blocks, error } = safeParseBlocks(blocksJson)
    if (error) {
      setJsonError(error)
      return
    }
    const nextBlocks = [...blocks, PageBuilder.cloneBlockTemplate(template)]
    setBlocksJson(JSON.stringify(nextBlocks, null, 2))
    setJsonError(undefined)
  }

  function resetSample() {
    const sample = PageBuilder.createSamplePage(defaultEditorEmail)
    setPages([sample])
    persistPages([sample])
    setSelectedId(sample.id)
    setSavedAt(new Date().toLocaleTimeString())
  }

  if (!draft) return null

  return (
    <DashboardLayout
      variant="admin"
      title="Page Builder"
      subtitle="Create validated campaign, event, and resource pages from reusable blocks."
      action={
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={addPage} className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15">
            <Plus size={16} /> New page
          </button>
          <button type="button" onClick={() => saveDraft()} className="inline-flex items-center gap-2 rounded-lg bg-royal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-royal-500">
            <Save size={16} /> Save draft
          </button>
          <button type="button" onClick={() => saveDraft('published')} disabled={!canPublish} className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-3 py-2 text-sm font-semibold text-white hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50">
            <Globe size={16} /> Publish
          </button>
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-white/10 bg-navy-800 p-5">
            <div className="mb-4 flex items-center gap-2 text-white">
              <LayoutTemplate size={18} className="text-brand-orange" />
              <h2 className="font-semibold">Page settings</h2>
            </div>
            <div className="space-y-4">
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Page</span>
                <select value={selectedId} onChange={event => setSelectedId(event.target.value)} className="w-full rounded-xl border border-white/10 bg-navy-900 px-3 py-2 text-white">
                  {pages.map(page => <option key={page.id} value={page.id}>{page.title}</option>)}
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Title</span>
                <input value={draft.title} onChange={event => updateDraft({ title: event.target.value })} className="w-full rounded-xl border border-white/10 bg-navy-900 px-3 py-2 text-white" />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Slug</span>
                <input value={draft.slug} onChange={event => updateDraft({ slug: PageBuilder.normalizeSlug(event.target.value) })} className="w-full rounded-xl border border-white/10 bg-navy-900 px-3 py-2 text-white" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Audience</span>
                  <select value={draft.audience} onChange={event => updateDraft({ audience: event.target.value as PageDefinition['audience'] })} className="w-full rounded-xl border border-white/10 bg-navy-900 px-3 py-2 text-white">
                    <option value="public">Public</option>
                    <option value="players">Players</option>
                    <option value="coaches">Coaches</option>
                    <option value="admins">Admins</option>
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Accent</span>
                  <select value={draft.theme.accent} onChange={event => updateDraft({ theme: { ...draft.theme, accent: event.target.value as PageDefinition['theme']['accent'] } })} className="w-full rounded-xl border border-white/10 bg-navy-900 px-3 py-2 text-white">
                    <option value="orange">Orange</option>
                    <option value="blue">Blue</option>
                    <option value="gold">Gold</option>
                    <option value="navy">Navy</option>
                  </select>
                </label>
              </div>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">SEO title</span>
                <input value={draft.seo.title} onChange={event => updateDraft({ seo: { ...draft.seo, title: event.target.value } })} className="w-full rounded-xl border border-white/10 bg-navy-900 px-3 py-2 text-white" />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">SEO description</span>
                <textarea value={draft.seo.description} onChange={event => updateDraft({ seo: { ...draft.seo, description: event.target.value } })} rows={3} className="w-full rounded-xl border border-white/10 bg-navy-900 px-3 py-2 text-white" />
              </label>
              <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-xs text-slate-400">
                <span>Status: <strong className="capitalize text-white">{draft.status}</strong></span>
                <a href={`/p/${draft.slug}`} className="font-semibold text-brand-orange hover:text-orange-300">Open public preview</a>
              </div>
              {savedAt && <p className="text-xs text-green-400">Saved at {savedAt}</p>}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-navy-800 p-5">
            <div className="mb-4 flex items-center gap-2 text-white">
              <Wand2 size={18} className="text-brand-gold" />
              <h2 className="font-semibold">Block palette</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PageBuilder.blockTemplates.map(template => (
                <button key={template.id} type="button" onClick={() => addBlock(template)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm font-semibold text-white hover:bg-white/10">
                  {PageBuilder.blockTypeLabels[template.type]}
                </button>
              ))}
            </div>
            <button type="button" onClick={resetSample} className="mt-3 w-full rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/5">Reset sample content</button>
          </section>

          <section className="rounded-2xl border border-white/10 bg-navy-800 p-5">
            <div className="mb-4 flex items-center gap-2 text-white">
              <ShieldCheck size={18} className="text-green-400" />
              <h2 className="font-semibold">Publish checklist</h2>
            </div>
            <div className="space-y-3">
              {checklist.map(item => (
                <div key={item.id} className="flex gap-3 rounded-xl bg-white/5 p-3">
                  <span className={item.passed ? 'text-green-400' : 'text-amber-400'}>{item.passed ? '●' : '○'}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.helper}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-2xl border border-white/10 bg-navy-800 p-5">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 text-white">
                <FileJson size={18} className="text-royal-300" />
                <h2 className="font-semibold">Blocks JSON</h2>
              </div>
              <p className="text-xs text-slate-500">MVP editor stores drafts locally until Supabase persistence is connected.</p>
            </div>
            <textarea value={blocksJson} onChange={event => setBlocksJson(event.target.value)} rows={20} spellCheck={false} className="w-full rounded-2xl border border-white/10 bg-navy-950 p-4 font-mono text-xs leading-5 text-slate-200 outline-none focus:border-brand-orange" />
            <div className="mt-4 space-y-2">
              {validationIssues.length === 0 ? (
                <p className="rounded-xl bg-green-500/10 px-3 py-2 text-sm text-green-300">No validation issues.</p>
              ) : validationIssues.map(issue => (
                <p key={`${issue.path}-${issue.message}`} className={`rounded-xl px-3 py-2 text-sm ${issue.severity === 'error' ? 'bg-red-500/10 text-red-300' : 'bg-amber-500/10 text-amber-300'}`}>
                  <strong>{issue.path}</strong>: {issue.message}
                </p>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-white/10 bg-navy-900">
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3 text-white">
              <Eye size={18} className="text-brand-orange" />
              <h2 className="font-semibold">Live preview</h2>
            </div>
            <div className="max-h-[900px] overflow-auto">
              <PageRenderer page={previewPage} preview />
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}
