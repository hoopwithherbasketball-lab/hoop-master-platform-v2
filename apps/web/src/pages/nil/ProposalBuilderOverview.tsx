import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function ProposalBuilderOverview() {
  const partnerPortalUrl = (import.meta as any).env.VITE_PARTNER_PORTAL_URL || 'http://localhost:3002';

  return (
    <DashboardLayout variant="admin" title="Proposal Builder" subtitle="Create and manage dynamic NIL sponsorship proposals.">
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden w-full h-[800px]">
        <iframe 
          src={`${partnerPortalUrl}/proposals/builder`} 
          title="Proposal Builder"
          className="w-full h-full border-0"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </DashboardLayout>
  );
}
