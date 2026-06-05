import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ExternalLink } from 'lucide-react';

export default function PartnerPortalIntegration() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from('nil_companies')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (data) {
          setPartners(data);
        }
      } catch (e) {
        console.error('Failed to load partners', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <DashboardLayout variant="admin" title="Partner Portal Integration" subtitle="Manage external brand partners onboarding via the HWH Partner Portal.">
      <div className="mb-6 flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div>
          <h3 className="text-lg font-bold text-blue-900">Partner Portal is Active</h3>
          <p className="text-sm text-blue-700">External partners can sign up at the dedicated portal url.</p>
        </div>
        <a 
          href="http://localhost:3002" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm font-medium transition-colors"
        >
          Open Partner Portal <ExternalLink size={16} />
        </a>
      </div>

      <div className="card bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Onboarded Partners</h2>
        </div>
        {loading ? (
          <div className="p-6 text-gray-500">Loading partners...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {partners.map(p => (
                <tr key={p.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{p.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{p.industry || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">View Details</button>
                  </td>
                </tr>
              ))}
              {partners.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No partners found. Direct brands to the Partner Portal to sign up.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
