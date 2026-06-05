import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function ProposalBuilderOverview() {
  return (
    <DashboardLayout variant="admin" title="Proposal Builder" subtitle="Create and manage dynamic NIL sponsorship proposals.">
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden w-full h-[800px]">
        <iframe 
          src="https://proposal-editor-hub.preview.emergentagent.com/?utm_source=share" 
          title="Proposal Builder"
          className="w-full h-full border-0"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </DashboardLayout>
  );
}
