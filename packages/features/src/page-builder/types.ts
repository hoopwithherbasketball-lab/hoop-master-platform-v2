export interface Page {
  id: string;
  slug: string;
  title: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export type BlockType = 'hero' | 'text' | 'features' | 'cta' | 'media';

export interface PageBlock {
  id: string;
  page_id: string;
  type: BlockType;
  order_index: number;
  content_json: any;
  settings_json: any;
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
