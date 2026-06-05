import React, { useState } from 'react';

const BlockRenderer = ({ block, onRemove }) => {
  return (
    <div className="relative group border border-gray-200 rounded p-4 mb-4 bg-white hover:border-blue-500 transition-colors">
      <button 
        onClick={() => onRemove(block.id)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-100 text-red-600 px-2 py-1 text-xs rounded"
      >
        Remove
      </button>

      {block.type === 'hero' && (
        <div className="text-center p-8 bg-gray-50 rounded">
          <h1 className="text-3xl font-bold mb-2">{block.content.title || 'Proposal Title'}</h1>
          <p className="text-gray-600">{block.content.subtitle || 'A tailored NIL sponsorship opportunity'}</p>
        </div>
      )}

      {block.type === 'text' && (
        <div className="prose max-w-none">
          <p>{block.content.text || 'This is a text block where you can write out the terms, details, or a personalized message to the sponsor.'}</p>
        </div>
      )}

      {block.type === 'features' && (
        <div>
          <h3 className="text-xl font-bold mb-4">Sponsorship Perks</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Social Media Post (Instagram/TikTok)</li>
            <li>In-person Appearance</li>
            <li>Logo on gear/apparel</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default function ProposalBuilder() {
  const [blocks, setBlocks] = useState([]);

  const addBlock = (type) => {
    const newBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: {}
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Palette */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
        <h2 className="text-lg font-bold mb-6">Proposal Blocks</h2>
        
        <div className="space-y-3">
          <button 
            onClick={() => addBlock('hero')}
            className="w-full text-left px-4 py-3 bg-gray-50 border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <span className="font-semibold block">Hero Section</span>
            <span className="text-xs text-gray-500">Title & Subtitle</span>
          </button>

          <button 
            onClick={() => addBlock('text')}
            className="w-full text-left px-4 py-3 bg-gray-50 border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <span className="font-semibold block">Text Block</span>
            <span className="text-xs text-gray-500">Paragraphs & Details</span>
          </button>

          <button 
            onClick={() => addBlock('features')}
            className="w-full text-left px-4 py-3 bg-gray-50 border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <span className="font-semibold block">Features List</span>
            <span className="text-xs text-gray-500">Bullet points of perks</span>
          </button>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-200">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
            Save Proposal
          </button>
        </div>
      </div>

      {/* Editor Canvas */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {blocks.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-500">
              <p className="text-lg mb-2">Your proposal is empty</p>
              <p className="text-sm">Click a block on the left to start building your proposal.</p>
            </div>
          ) : (
            <div className="space-y-4 shadow-lg bg-white p-8 min-h-[800px]">
              {blocks.map(block => (
                <BlockRenderer key={block.id} block={block} onRemove={removeBlock} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
