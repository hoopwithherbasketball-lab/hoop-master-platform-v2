 
export interface Page {
  id: string;
  slug: string;
  title: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export type BlockType = 'hero' | 'text' | 'features' | 'cta' | 'media';

export interface DBPageBlock {
  id: string;
  page_id: string;
  type: BlockType;
  order_index: number;
  content_json: Record<string, unknown>;
  settings_json: Record<string, unknown>;
}

export interface HeroBlockContent {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export interface TextBlockContent {
  text: string;
  heading?: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface FeaturesBlockContent {
  title?: string;
  features: FeatureItem[];
}

export type PageStatus = 'draft' | 'published' | 'archived'

export type PageAudience = 'public' | 'players' | 'coaches' | 'admins'

export type PageBlockType =
  | 'hero'
  | 'text'
  | 'features'
  | 'cta'
  | 'media'

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

export interface TextBlock extends BasePageBlock {
  type: 'text'
  content: string
}

export interface FeaturesBlock extends BasePageBlock {
  type: 'features'
  items: Array<{
    title: string
    body: string
    icon?: string
  }>
}

export interface CtaBlock extends BasePageBlock {
  type: 'cta'
  action: PageAction
}

export interface MediaBlock extends BasePageBlock {
  type: 'media'
  provider: 'youtube' | 'vimeo' | 'hwh-tv' | 'external'
  embedUrl: string
  caption?: string
}

export type PageBlock =
  | HeroBlock
  | TextBlock
  | FeaturesBlock
  | CtaBlock
  | MediaBlock

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
