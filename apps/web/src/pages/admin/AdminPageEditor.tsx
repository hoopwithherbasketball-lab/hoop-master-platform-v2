import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageShell } from '@hoop-master/ui';
import { PageBuilder } from '@hoop-master/features';
import { supabase } from '@hoop-master/supabase';

export default function AdminPageEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { usePageBuilder } = PageBuilder;
  const { page, blocks: initialBlocks, loading } = usePageBuilder(slug);
  
  const [blocks, setBlocks] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialBlocks) setBlocks(initialBlocks);
  }, [initialBlocks]);

  if (loading) return <PageShell title="Loading..." description="Loading page editor"><p>Loading page...</p></PageShell>;

  const handleAddBlock = () => {
    const newBlock = {
      id: crypto.randomUUID(),
      page_id: page?.id,
      type: 'text',
      order_index: blocks.length,
      content_json: { text: 'New text block' },
      settings_json: {}
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleSave = async () => {
    if (!page) return;
    setSaving(true);
    try {
      // Upsert blocks (in a real app, handle deletes as well)
      for (const block of blocks) {
        if (block.id.includes('-')) { // Simplistic check if it's a UUID (new block)
          await supabase.from('page_builder_blocks').upsert(block);
        }
      }
      alert('Saved successfully!');
    } catch (e) {
      console.error(e);
      alert('Error saving blocks.');
    }
    setSaving(false);
  };

  return (
    <PageShell title={`Edit Page: ${page?.title || slug}`} description={`Managing blocks for ${slug}`}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 bg-white p-4 rounded shadow border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Blocks Editor</h2>
            <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
              {saving ? 'Saving...' : 'Save All'}
            </button>
          </div>
          {blocks.map((block, idx) => (
            <div key={block.id} className="p-3 mb-2 border rounded bg-gray-50 hover:bg-gray-100 cursor-pointer">
              <span className="font-semibold">{block.type.toUpperCase()} Block</span>
              <div className="text-sm text-gray-500">Order: {block.order_index}</div>
            </div>
          ))}
          <button onClick={handleAddBlock} className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded border border-gray-300">
            + Add Block
          </button>
        </div>
        <div className="w-full md:w-2/3 bg-gray-50 rounded shadow border border-gray-200 min-h-[500px] flex items-center justify-center p-8">
          <p className="text-gray-400">Live preview engine coming soon...</p>
        </div>
      </div>
    </PageShell>
  );
}
