import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageBuilder } from '@hoop-master/features'
import PageRenderer from '../../components/page-builder/PageRenderer'

function getPages(): PageBuilder.PageDefinition[] {
  if (typeof window === 'undefined') return [PageBuilder.createSamplePage()]

  try {
    const raw = window.localStorage.getItem(PageBuilder.PAGE_BUILDER_STORAGE_KEY)
    if (!raw) return [PageBuilder.createSamplePage()]
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : [PageBuilder.createSamplePage()]
  } catch (error) {
    console.warn('Unable to load dynamic page preview:', error)
    return [PageBuilder.createSamplePage()]
  }
}

export default function DynamicPagePreview() {
  const { slug } = useParams()
  const pages = useMemo(() => getPages(), [])
  const page = pages.find(item => item.slug === slug) ?? pages.find(item => item.slug === 'elite-ready-camp') ?? pages[0]

  if (!page) {
    return (
      <div className="min-h-screen bg-navy-950 px-4 py-24 text-center text-white">
        <h1 className="font-display text-4xl font-black">Page not found</h1>
        <p className="mt-4 text-slate-400">Create this slug in the admin page builder first.</p>
        <Link to="/admin/page-builder" className="mt-8 inline-flex rounded-full bg-brand-orange px-5 py-3 text-sm font-bold text-white">Open Page Builder</Link>
      </div>
    )
  }

  return <PageRenderer page={page} preview={page.status !== 'published'} />
}
