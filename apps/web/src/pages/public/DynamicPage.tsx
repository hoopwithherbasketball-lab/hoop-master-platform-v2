import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@hoop-master/supabase';
import { PageBuilder } from '@hoop-master/features';

export default function DynamicPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { usePageBuilder } = PageBuilder;
  const { page, blocks, loading } = usePageBuilder(slug);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!page || page.status !== 'published') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">404 - Page Not Found</h1>
        <button onClick={() => navigate('/')} className="text-orange-500 hover:underline">
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full bg-white">
      {blocks.map((block, idx) => {
        // Simple rendering baseline
        if (block.type === 'text') {
          return (
            <section key={block.id} className="py-12 px-6 max-w-4xl mx-auto w-full">
              {block.content_json?.heading && <h2 className="text-3xl font-bold mb-6">{block.content_json.heading}</h2>}
              <div className="prose prose-lg" dangerouslySetInnerHTML={{ __html: block.content_json?.text || '' }} />
            </section>
          );
        }
        if (block.type === 'hero') {
          return (
            <section key={block.id} className="w-full bg-slate-900 text-white py-24 px-6 text-center" style={{ backgroundImage: `url(${block.content_json?.backgroundImage})`, backgroundSize: 'cover' }}>
              <div className="max-w-4xl mx-auto bg-black/50 p-8 rounded-xl backdrop-blur-sm">
                <h1 className="text-5xl font-black uppercase tracking-tight mb-4">{block.content_json?.title}</h1>
                {block.content_json?.subtitle && <p className="text-xl text-slate-300 mb-8">{block.content_json.subtitle}</p>}
                {block.content_json?.ctaText && (
                  <a href={block.content_json?.ctaUrl || '#'} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full">
                    {block.content_json.ctaText}
                  </a>
                )}
              </div>
            </section>
          );
        }
        return <div key={block.id} className="py-8 px-6 text-center text-slate-400">Unsupported block type: {block.type}</div>;
      })}
    </div>
  );
}
