import React from 'react';
import { HeroBlock } from './HeroBlock';
import { TextContentBlock } from './TextContentBlock';
import { FeaturesBlock } from './FeaturesBlock';

interface BlockRendererProps {
  block: {
    type: string;
    content_json: any;
  };
}

export function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case 'hero':
      return <HeroBlock content={block.content_json} />;
    case 'text':
      return <TextContentBlock content={block.content_json} />;
    case 'features':
      return <FeaturesBlock content={block.content_json} />;
    default:
      return <div className="p-4 border border-dashed border-gray-300">Unsupported block type: {block.type}</div>;
  }
}
