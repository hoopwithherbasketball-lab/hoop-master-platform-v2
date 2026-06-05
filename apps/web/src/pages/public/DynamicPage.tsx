import React from 'react';
import { useParams } from 'react-router-dom';
import { PageBuilder } from '@hoop-master/features';
import { Blocks } from '@hoop-master/ui';

export default function DynamicPage() {
  const { slug } = useParams();
  const { usePageBuilder } = PageBuilder;
  const { page, blocks, loading } = usePageBuilder(slug);

  if (loading) return <div>Loading...</div>;
  if (!page) return <div>Page not found</div>;

  return (
    <div className="dynamic-page">
      {blocks.map(block => (
        <Blocks.BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}
