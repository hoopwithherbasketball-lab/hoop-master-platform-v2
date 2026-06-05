export type PageStatus = 'draft' | 'published' | 'archived'

export type PageAudience = 'public' | 'players' | 'coaches' | 'admins'

export type PageBlockType =
  | 'hero'
  | 'richText'
  | 'featureGrid'
  | 'stats'
  | 'cta'
  | 'mediaEmbed'
  | 'leadCapture'

export interface PageTheme {
  accent: 'blue' | 'orange' | 'gold' | 'navy'
  surface: 'dark' | 'light'
}

export interface BasePageBlock {
  id: string
  type: PageBlockType
  eyebrow?: string
  title?: string
  body?: string
}

export interface HeroBlock extends BasePageBlock {
  type: 'hero'
  primaryAction?: PageAction
  secondaryAction?: PageAction
}

export interface RichTextBlock extends BasePageBlock {
  type: 'richText'
  content: string
}

export interface FeatureGridBlock extends BasePageBlock {
  type: 'featureGrid'
  items: Array<{
    title: string
    body: string
    icon?: string
  }>
}

export interface StatsBlock extends BasePageBlock {
  type: 'stats'
  stats: Array<{
    label: string
    value: string
    helper?: string
  }>
}

export interface CtaBlock extends BasePageBlock {
  type: 'cta'
  action: PageAction
}

export interface MediaEmbedBlock extends BasePageBlock {
  type: 'mediaEmbed'
  provider: 'youtube' | 'vimeo' | 'hwh-tv' | 'external'
  embedUrl: string
  caption?: string
}

export interface LeadCaptureBlock extends BasePageBlock {
  type: 'leadCapture'
  formName: string
  fields: Array<'name' | 'email' | 'phone' | 'athleteName' | 'graduationYear' | 'message'>
  submitLabel: string
}

export type PageBlock =
  | HeroBlock
  | RichTextBlock
  | FeatureGridBlock
  | StatsBlock
  | CtaBlock
  | MediaEmbedBlock
  | LeadCaptureBlock

export interface PageAction {
  label: string
  href: string
}

export interface PageSeo {
  title: string
  description: string
  noIndex?: boolean
}

export interface PageDefinition {
  id: string
  slug: string
  title: string
  status: PageStatus
  audience: PageAudience
  theme: PageTheme
  seo: PageSeo
  blocks: PageBlock[]
  updatedAt: string
  updatedBy: string
}

export interface PageValidationIssue {
  path: string
  message: string
  severity: 'error' | 'warning'
}

export interface PagePublishChecklistItem {
  id: string
  label: string
  passed: boolean
  helper: string
}
