import type { PageBlock, PageDefinition, PagePublishChecklistItem, PageValidationIssue } from './types.js'

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const PAGE_BUILDER_STORAGE_KEY = 'hwh.pageBuilder.pages.v1'

export const blockTypeLabels: Record<PageBlock['type'], string> = {
  hero: 'Hero',
  text: 'Text',
  features: 'Features',
  cta: 'Call to action',
  media: 'Media',
}

export function createBlockId(prefix = 'block') {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`
}

export function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function validatePageDefinition(page: PageDefinition): PageValidationIssue[] {
  const issues: PageValidationIssue[] = []

  if (!page.title.trim()) {
    issues.push({ path: 'title', message: 'Page title is required.', severity: 'error' })
  }

  if (!SLUG_PATTERN.test(page.slug)) {
    issues.push({ path: 'slug', message: 'Slug must use lowercase letters, numbers, and hyphens only.', severity: 'error' })
  }

  if (page.blocks.length === 0) {
    issues.push({ path: 'blocks', message: 'Add at least one content block.', severity: 'error' })
  }

  page.blocks.forEach((block, index) => {
    const path = `blocks[${index}]`
    if (!block.id.trim()) {
      issues.push({ path: `${path}.id`, message: 'Block id is required.', severity: 'error' })
    }

    if (block.type !== 'media' && !block.title?.trim()) {
      issues.push({ path: `${path}.title`, message: `${blockTypeLabels[block.type]} block should include a title.`, severity: 'warning' })
    }

    if (block.type === 'features' && block.items.length === 0) {
      issues.push({ path: `${path}.items`, message: 'Feature grid requires at least one item.', severity: 'error' })
    }

    if (block.type === 'media' && !block.embedUrl.trim()) {
      issues.push({ path: `${path}.embedUrl`, message: 'Media embed URL is required.', severity: 'error' })
    }
  })

  return issues
}

export function getPublishChecklist(page: PageDefinition): PagePublishChecklistItem[] {
  const issues = validatePageDefinition(page)
  const errorCount = issues.filter(issue => issue.severity === 'error').length
  const hasHero = page.blocks.some(block => block.type === 'hero')
  const hasConversion = page.blocks.some(block => block.type === 'cta')

  return [
    {
      id: 'no-errors',
      label: 'No blocking validation errors',
      passed: errorCount === 0,
      helper: errorCount === 0 ? 'Page can be published.' : `${errorCount} blocking issue${errorCount === 1 ? '' : 's'} remaining.`,
    },
    {
      id: 'hero-present',
      label: 'Hero block included',
      passed: hasHero,
      helper: hasHero ? 'Landing page has a clear opening section.' : 'Add a hero block for clarity.',
    },
    {
      id: 'conversion-path',
      label: 'Conversion path included',
      passed: hasConversion,
      helper: hasConversion ? 'Visitors have a next action.' : 'Add a CTA or lead capture block.',
    },
  ]
}

export function createSamplePage(updatedBy = 'admin@hoopwithher.local'): PageDefinition {
  return {
    id: 'page-elite-ready-camp',
    slug: 'elite-ready-camp',
    title: 'Elite Ready Camp',
    status: 'draft',
    updatedAt: new Date().toISOString(),
    updatedBy,
    blocks: [
      {
        id: 'hero-elite-ready',
        type: 'hero',
        eyebrow: 'Hoop With Her camps',
        title: 'Build a stronger player profile before the next live period.',
        body: 'Create a polished, measurable camp page with schedule details, player outcomes, and a direct registration path without asking engineering for every update.',
        primaryAction: { label: 'Register interest', href: '#lead-capture' },
        secondaryAction: { label: 'View services', href: '/services' },
      },
      {
        id: 'features-camp',
        type: 'features',
        eyebrow: 'What admins can publish',
        title: 'Reusable blocks for public MVP pages',
        body: 'Start with approved sections, validate content quality, then preview the exact page families will see.',
        items: [
          { title: 'Hero and CTA sections', body: 'Launch campaign pages with clear positioning and next actions.' },
          { title: 'Outcome metrics', body: 'Show program results without one-off design work.' },
          { title: 'Lead capture briefs', body: 'Define form intent and required fields for future persistence.' },
        ],
      },
    ],
  }
}

export const blockTemplates: PageBlock[] = [
  {
    id: 'template-hero',
    type: 'hero',
    eyebrow: 'Campaign eyebrow',
    title: 'Headline that explains the offer',
    body: 'Short supporting copy that tells families or coaches why this page matters.',
    primaryAction: { label: 'Primary action', href: '/contact' },
    secondaryAction: { label: 'Secondary action', href: '/services' },
  },
  {
    id: 'template-rich-text',
    type: 'text',
    title: 'Content section',
    content: 'Use this block for program details, eligibility requirements, schedule notes, or partner context.',
  },
  {
    id: 'template-feature-grid',
    type: 'features',
    title: 'Feature grid title',
    body: 'Group related benefits or requirements into cards.',
    items: [
      { title: 'First feature', body: 'Explain the first value point.' },
      { title: 'Second feature', body: 'Explain the second value point.' },
    ],
  },
  {
    id: 'template-cta',
    type: 'cta',
    title: 'Ready to get started?',
    body: 'Close the page with a clear next action.',
    action: { label: 'Contact Hoop With Her', href: '/contact' },
  },
  {
    id: 'template-media',
    type: 'media',
    title: 'Featured media',
    provider: 'hwh-tv',
    embedUrl: '/watch',
    caption: 'Link to a Hoop With Her TV channel, highlight reel, or external embed.',
  },
]

export function cloneBlockTemplate(template: PageBlock): PageBlock {
  return {
    ...structuredClone(template),
    id: createBlockId(template.type),
  } as PageBlock
}
