import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageShell, Blocks } from '@hoop-master/ui';
import { PageBuilder } from '@hoop-master/features';
import { supabase } from '@hoop-master/supabase';

// Helper component to edit a block's content as JSON
function BlockEditorCard({ block, onUpdate, onRemove, onMoveUp, onMoveDown, isFirst, isLast }: any) {
  const [jsonStr, setJsonStr] = useState(JSON.stringify(block.content_json || {}, null, 2));
  const [error, setError] = useState('');

  // Update the local state when the prop changes (e.g., from order change or load)
  useEffect(() => {
    setJsonStr(JSON.stringify(block.content_json || {}, null, 2));
  }, [block.content_json]);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setJsonStr(val);
    try {
      const parsed = JSON.parse(val);
      setError('');
      onUpdate(block.id, { ...block, content_json: parsed });
    } catch (err) {
      setError('Invalid JSON');
    }
  };

  return (
    <div className="p-4 mb-4 border rounded bg-white shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-gray-800">{block.type.toUpperCase()} Block</span>
        <div className="flex space-x-2">
          <button disabled={isFirst} onClick={() => onMoveUp(block.id)} className="text-gray-500 hover:text-blue-600 disabled:opacity-50">↑</button>
          <button disabled={isLast} onClick={() => onMoveDown(block.id)} className="text-gray-500 hover:text-blue-600 disabled:opacity-50">↓</button>
          <button onClick={() => onRemove(block.id)} className="text-red-500 hover:text-red-700 ml-2">Delete</button>
        </div>
      </div>
      <div className="text-sm text-gray-500 mb-2">Order: {block.order_index}</div>
      <textarea
        className={`w-full p-2 border font-mono text-xs h-32 rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
        value={jsonStr}
        onChange={handleJsonChange}
      />
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
}

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

  const handleAddBlock = (type: string) => {
    const newBlock = {
      id: crypto.randomUUID(),
      page_id: page?.id,
      type,
      order_index: blocks.length,
      content_json: type === 'hero' 
        ? { title: 'Hero Title', subtitle: 'Subtitle text', ctaText: 'Click Me', ctaUrl: '#' } 
        : type === 'features' 
        ? { title: 'Features', features: [{ title: 'Feature 1', description: 'Description', icon: '🌟' }] } 
        : { heading: 'Heading', text: '<p>New text block</p>' },
      settings_json: {}
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleUpdateBlock = (id: string, updatedBlock: any) => {
    setBlocks(blocks.map(b => b.id === id ? updatedBlock : b));
  };

  const handleRemoveBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id).map((b, i) => ({ ...b, order_index: i })));
  };

  const handleMoveUp = (id: string) => {
    const idx = blocks.findIndex(b => b.id === id);
    if (idx > 0) {
      const newBlocks = [...blocks];
      const temp = newBlocks[idx];
      newBlocks[idx] = newBlocks[idx - 1];
      newBlocks[idx - 1] = temp;
      setBlocks(newBlocks.map((b, i) => ({ ...b, order_index: i })));
    }
  };

  const handleMoveDown = (id: string) => {
    const idx = blocks.findIndex(b => b.id === id);
    if (idx < blocks.length - 1) {
      const newBlocks = [...blocks];
      const temp = newBlocks[idx];
      newBlocks[idx] = newBlocks[idx + 1];
      newBlocks[idx + 1] = temp;
      setBlocks(newBlocks.map((b, i) => ({ ...b, order_index: i })));
    }
  };

  const handleSave = async () => {
    if (!page) return;
    setSaving(true);
    try {
      // Basic sync: delete all and insert current state to ensure order and deletions match
      await supabase.from('page_builder_blocks').delete().eq('page_id', page.id);
      
      if (blocks.length > 0) {
        await supabase.from('page_builder_blocks').insert(blocks);
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
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="w-full xl:w-1/3 bg-gray-50 p-4 rounded shadow border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Blocks Editor</h2>
            <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded font-semibold text-sm">
              {saving ? 'Saving...' : 'Save All'}
            </button>
          </div>
          <div className="max-h-[700px] overflow-y-auto pr-2">
            {blocks.map((block, idx) => (
              <BlockEditorCard
                key={block.id}
                block={block}
                isFirst={idx === 0}
                isLast={idx === blocks.length - 1}
                onUpdate={handleUpdateBlock}
                onRemove={handleRemoveBlock}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
              />
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <button onClick={() => handleAddBlock('hero')} className="flex-1 bg-white hover:bg-gray-100 text-gray-800 py-2 px-3 text-sm rounded border border-gray-300 font-semibold">+ Hero</button>
            <button onClick={() => handleAddBlock('text')} className="flex-1 bg-white hover:bg-gray-100 text-gray-800 py-2 px-3 text-sm rounded border border-gray-300 font-semibold">+ Text</button>
            <button onClick={() => handleAddBlock('features')} className="flex-1 bg-white hover:bg-gray-100 text-gray-800 py-2 px-3 text-sm rounded border border-gray-300 font-semibold">+ Features</button>
          </div>
        </div>
        <div className="w-full xl:w-2/3 bg-white rounded shadow border border-gray-200 min-h-[700px] flex flex-col overflow-hidden">
          {blocks.length === 0 ? (
            <div className="flex items-center justify-center flex-1 text-gray-400">
              No blocks yet. Add a block to see the live preview.
            </div>
          ) : (
            <div className="w-full">
              {blocks.map(block => (
                <Blocks.BlockRenderer key={block.id} block={block} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
