import React, { useEffect, useState } from 'react';
import { supabase } from '@hoop-master/supabase';
import { PageShell, PageSection } from '@hoop-master/ui';
import { Link } from 'react-router-dom';

export default function AdminPageBuilder() {
  const [pages, setPages] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('page_builder_pages').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setPages(data);
    });
  }, []);

  return (
    <PageShell title="Page Builder" description="Manage dynamic pages and landing pages">
      <PageSection title="All Pages">
        <div className="mb-4">
          <Link to="/admin/pages/new" className="bg-blue-600 text-white px-4 py-2 rounded">
            Create New Page
          </Link>
        </div>
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pages.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{p.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{p.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/admin/pages/${p.slug}`} className="text-blue-600 hover:text-blue-900">Edit</Link>
                  </td>
                </tr>
              ))}
              {pages.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No pages found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </PageSection>
    </PageShell>
  );
}
