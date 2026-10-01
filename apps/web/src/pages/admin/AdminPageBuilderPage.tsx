import { useEffect, useMemo, useState } from 'react'
import { PageBuilder } from '@hoop-master/features'
import { supabase } from '@hoop-master/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'
import PageRenderer from '../../components/page-builder/PageRenderer'
import { Eye, FileJson, Globe, LayoutTemplate, Plus, Save, ShieldCheck, Wand2 } from 'lucide-react'

type PageDefinition = PageBuilder.PageDefinition
type PageBlock = PageBuilder.PageBlock

const defaultEditorEmail = 'admin@hoopwithher.local'

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
  const [pages, setPages] = useState<PageDefinition[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const selectedPage = pages.find(page => page.id === selectedId)
  const [draft, setDraft] = useState<PageDefinition | null>(null)
  const [blocksJson, setBlocksJson] = useState('[]')
  const [jsonError, setJsonError] = useState<string | undefined>()
  const [savedAt, setSavedAt] = useState<string | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPages() {
      const { data: pageData } = await supabase.from('page_builder_pages').select('*').order('created_at', { ascending: false })
      if (!pageData || pageData.length === 0) {
        setPages([PageBuilder.createSamplePage(defaultEditorEmail)])
        setSelectedId('page-elite-ready-camp')
      } else {
        // Hydrate pages with blocks
        const fullPages = await Promise.all(pageData.map(async p => {
          const { data: blocksData } = await supabase.from('page_builder_blocks').select('*').eq('page_id', p.id).order('order_index', { ascending: true })
          const blocks = blocksData?.map(b => ({
            ...b.content_json,
            id: b.id,
            type: b.type,
          })) as PageBlock[] || []

          return {
            id: p.id,
            slug: p.slug,
            title: p.title,
            status: p.status as PageBuilder.PageStatus,
            blocks,
            updatedAt: p.updated_at,
            updatedBy: defaultEditorEmail,
          }
        }))
        setPages(fullPages)
        setSelectedId(fullPages[0].id)
      }
      setLoading(false)
    }
    loadPages()
  }, [])

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

  const previewPage = useMemo<PageDefinition | null>(() => {
    if (!draft) return null
    const { blocks } = safeParseBlocks(blocksJson)
    return { ...draft, blocks: blocks.length ? blocks : draft.blocks }
  }, [blocksJson, draft])

  const checklist = useMemo(() => previewPage ? PageBuilder.getPublishChecklist(previewPage) : [], [previewPage])
  const canPublish = checklist.every(item => item.passed) && !jsonError

  function updateDraft(update: Partial<PageDefinition>) {
    setDraft(current => current ? ({ ...current, ...update, updatedAt: new Date().toISOString() }) : null)
  }

  async function saveDraft(nextStatus?: PageBuilder.PageStatus) {
    if (!draft) return
    const status = nextStatus || draft.status
    const { blocks, error } = safeParseBlocks(blocksJson)
    setJsonError(error)
    if (error) return

    const nextPage: PageDefinition = {
      ...draft,
      status,
      blocks,
      updatedAt: new Date().toISOString(),
      updatedBy: defaultEditorEmail,
    }

    // Supabase upsert
    const { error: pageError } = await supabase.from('page_builder_pages').upsert({
      id: nextPage.id,
      slug: nextPage.slug,
      title: nextPage.title,
      status: nextPage.status,
      updated_at: nextPage.updatedAt,
    })

    if (!pageError) {
      // Re-insert blocks
      await supabase.from('page_builder_blocks').delete().eq('page_id', nextPage.id)
      if (blocks.length > 0) {
        await supabase.from('page_builder_blocks').insert(blocks.map((b, i) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, type, ...content } = b
          return {
            id: b.id.startsWith('block') ? undefined : b.id, // Supabase generates UUIDs
            page_id: nextPage.id,
            type: b.type,
            order_index: i,
            content_json: content,
          }
        }))
      }

      const nextPages = pages.map(page => page.id === nextPage.id ? nextPage : page)
      if (!pages.find(p => p.id === nextPage.id)) nextPages.push(nextPage)
      
      setPages(nextPages)
      setDraft(nextPage)
      setSavedAt(new Date().toLocaleTimeString())
    } else {
      console.error(pageError)
    }
  }

  function addPage() {
    const sample = PageBuilder.createSamplePage(defaultEditorEmail)
    const nextPage: PageDefinition = {
      ...sample,
      id: crypto.randomUUID(),
      slug: `new-page-${pages.length + 1}`,
      title: `New Page ${pages.length + 1}`,
      status: 'draft',
      blocks: [],
      updatedAt: new Date().toISOString(),
    }
    const nextPages = [...pages, nextPage]
    setPages(nextPages)
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

  if (loading) return <div>Loading...</div>
  if (!draft || !previewPage) return null

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
              <p className="text-xs text-slate-500">Edit block content directly.</p>
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
            <div className="max-h-[900px] overflow-auto bg-white">
              <PageRenderer page={previewPage} preview />
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}
