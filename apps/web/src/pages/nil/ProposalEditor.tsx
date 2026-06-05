import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageShell } from '@hoop-master/ui';
import { ProposalBuilder } from '@hoop-master/features';
import { Blocks } from '@hoop-master/ui';

export default function ProposalEditor() {
  const { id } = useParams<{ id: string }>();
  const { useProposalBuilder } = ProposalBuilder;
  const { proposal, loading, saveBlocks } = useProposalBuilder(id);
  const [editingBlocks, setEditingBlocks] = useState<any[]>([]);

  // Initialize state when proposal loads
  React.useEffect(() => {
    if (proposal && editingBlocks.length === 0) {
      setEditingBlocks(proposal.blocks);
    }
  }, [proposal]);

  const handleAddBlock = (type: any) => {
    const newBlock = {
      id: Math.random().toString(),
      type,
      content: type === 'hero' ? { title: 'New Hero', subtitle: 'Subtitle here' } : { text: 'New Text Block' },
      order: editingBlocks.length
    };
    setEditingBlocks([...editingBlocks, newBlock]);
  };

  const handleSave = async () => {
    await saveBlocks(editingBlocks);
    alert('Proposal saved!');
  };

  if (loading) return <PageShell title="Loading..." description="Loading proposal..."><p>Loading...</p></PageShell>;

  return (
    <PageShell title={`Edit Proposal: ${proposal?.title || 'New'}`} description="Drag and drop blocks to assemble your NIL Proposal">
      <div className="mb-4 flex justify-between items-center">
        <Link to="/nil/proposals" className="text-blue-600 hover:underline">&larr; Back to Proposals</Link>
        <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow font-medium">Save Proposal</button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Editor Controls */}
        <div className="w-full md:w-1/3 bg-white p-4 rounded shadow border border-gray-200 h-fit">
          <h2 className="text-xl font-bold mb-4">Add Blocks</h2>
          <div className="space-y-2">
            <button onClick={() => handleAddBlock('hero')} className="w-full text-left px-4 py-2 bg-gray-50 border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300">
              + Hero / Cover Page
            </button>
            <button onClick={() => handleAddBlock('text')} className="w-full text-left px-4 py-2 bg-gray-50 border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300">
              + Text / Terms
            </button>
            <button onClick={() => handleAddBlock('features')} className="w-full text-left px-4 py-2 bg-gray-50 border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300">
              + Sponsorship Perks
            </button>
          </div>
          
          <div className="mt-8 border-t pt-4">
            <h3 className="font-semibold text-gray-700 mb-2">Proposal Details</h3>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input type="text" className="w-full border-gray-300 rounded p-2 text-sm bg-gray-50 mb-3" value={proposal?.company_id || ''} disabled />
            
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
              {proposal?.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Live Preview Document */}
        <div className="w-full md:w-2/3 bg-white shadow-lg border border-gray-200 min-h-[800px] flex flex-col relative">
          <div className="bg-gray-100 border-b border-gray-200 p-2 text-center text-xs text-gray-500 font-mono uppercase tracking-widest">
            Proposal Document Preview
          </div>
          <div className="flex-1">
            {editingBlocks.length === 0 ? (
              <div className="p-12 text-center text-gray-400">No blocks added yet. Start by adding a Hero block.</div>
            ) : (
              editingBlocks.map((block) => (
                <div key={block.id} className="relative group border-b border-gray-100 hover:border-blue-400 transition-colors">
                  <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 bg-white shadow rounded border px-2 py-1 text-xs text-red-600 cursor-pointer z-10"
                       onClick={() => setEditingBlocks(editingBlocks.filter(b => b.id !== block.id))}>
                    Remove
                  </div>
                  <Blocks.BlockRenderer block={block} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
