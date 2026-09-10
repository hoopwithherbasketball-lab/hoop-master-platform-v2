import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '@hoop-master/ui';
import { supabase } from '@hoop-master/supabase';

export default function AdminPageNew() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const { data, error } = await supabase
      .from('page_builder_pages')
      .insert({ title, slug, status: 'draft' })
      .select()
      .single();

    setSaving(false);
    
    if (error) {
      alert('Error creating page. Slug might already exist.');
      console.error(error);
    } else if (data) {
      navigate(`/admin/pages/${data.slug}`);
    }
  };

  return (
    <PageShell title="Create New Page" description="Create a new dynamic page">
      <div className="max-w-md bg-white p-6 rounded shadow border border-gray-200">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
            <input 
              required
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded" 
              placeholder="e.g. About Us"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
            <input 
              required
              type="text" 
              value={slug} 
              onChange={e => setSlug(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded" 
              placeholder="e.g. about-us"
            />
          </div>
          <button 
            type="submit" 
            disabled={saving} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            {saving ? 'Creating...' : 'Create Page'}
          </button>
        </form>
      </div>
    </PageShell>
  );
}
