import { useState, useEffect } from 'react';
import { ProposalWithBlocks, ProposalBlock } from './types';

// Mock hook since Supabase doesn't have the table yet in production
export function useProposalBuilder(proposalId?: string) {
  const [proposal, setProposal] = useState<ProposalWithBlocks | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate fetch delay
    setTimeout(() => {
      if (proposalId === 'new') {
        setProposal({
          id: 'new',
          title: 'New NIL Proposal',
          athlete_id: null,
          company_id: null,
          status: 'draft',
          amount: 0,
          blocks: []
        });
      } else {
        setProposal({
          id: proposalId || 'mock-id',
          title: 'Sample Nike Proposal',
          athlete_id: 'athlete-1',
          company_id: 'company-1',
          status: 'draft',
          amount: 5000,
          blocks: [
            { id: 'b1', type: 'hero', content: { title: 'Nike x HoopWithHer', subtitle: 'A winning partnership.' }, order: 0 },
            { id: 'b2', type: 'text', content: { text: 'We propose a 6-month social media campaign.' }, order: 1 }
          ]
        });
      }
      setLoading(false);
    }, 500);
  }, [proposalId]);

  const saveBlocks = async (blocks: ProposalBlock[]) => {
    // In real app, persist to supabase
    setProposal(prev => prev ? { ...prev, blocks } : null);
  };

  return { proposal, loading, saveBlocks };
}
