import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageShell } from '@hoop-master/ui';
import { PageBuilder } from '@hoop-master/features';

export default function AdminPageEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { usePageBuilder } = PageBuilder;
  const { page, blocks, loading } = usePageBuilder(slug);

  if (loading) return <PageShell title="Loading..." description="Loading page editor"><p>Loading page...</p></PageShell>;

  return (
    <PageShell title={`Edit Page: ${page?.title || slug}`} description={`Managing blocks for ${slug}`}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 bg-white p-4 rounded shadow border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Blocks Editor</h2>
          {blocks.map((block, idx) => (
            <div key={block.id} className="p-3 mb-2 border rounded bg-gray-50 hover:bg-gray-100 cursor-pointer">
              <span className="font-semibold">{block.type.toUpperCase()} Block</span>
              <div className="text-sm text-gray-500">Order: {block.order_index}</div>
            </div>
          ))}
          <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded border border-gray-300">
            + Add Block
          </button>
        </div>
        <div className="w-full md:w-2/3 bg-gray-50 rounded shadow border border-gray-200 min-h-[500px] flex items-center justify-center p-8">
          <p className="text-gray-400">Live preview will be rendered here...</p>
        </div>
      </div>
    </PageShell>
  );
}
