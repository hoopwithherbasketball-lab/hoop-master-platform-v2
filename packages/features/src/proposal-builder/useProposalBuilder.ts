import { useState, useEffect } from 'react';
import { supabase } from '@hoop-master/supabase';
import { ProposalWithBlocks, ProposalBlock } from './types';

export function useProposalBuilder(proposalId?: string) {
  const [proposal, setProposal] = useState<ProposalWithBlocks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProposal = async () => {
    setLoading(true);
    setError(null);
    try {
      if (proposalId === 'new' || !proposalId) {
        setProposal({
          id: 'new',
          title: 'New NIL Proposal',
          athlete_id: null,
          company_id: null,
          status: 'draft',
          amount: 0,
          blocks: []
        });
        return;
      }

      const { data, error: supaError } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', proposalId)
        .single();

      if (supaError) throw new Error(supaError.message);

      const pkg = data.package_details || {};
      setProposal({
        id: data.id,
        title: pkg.title || 'Untitled Proposal',
        athlete_id: pkg.athlete_id || null,
        company_id: pkg.company_id || null,
        status: data.status.toLowerCase() as any,
        amount: pkg.amount || 0,
        blocks: pkg.blocks || []
      });
    } catch (e: any) {
      console.error('useProposalBuilder error:', e);
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposal();
  }, [proposalId]);

  const saveBlocks = async (blocks: ProposalBlock[]) => {
    if (!proposal) return;
    
    // Update local state immediately for UI responsiveness
    const updatedProposal = { ...proposal, blocks };
    setProposal(updatedProposal);

    // Save to supabase
    if (proposal.id !== 'new') {
      try {
        const package_details = {
          title: proposal.title,
          athlete_id: proposal.athlete_id,
          company_id: proposal.company_id,
          amount: proposal.amount,
          blocks: blocks
        };
        const { error: supaError } = await supabase
          .from('proposals')
          .update({ package_details })
          .eq('id', proposal.id);

        if (supaError) {
          console.error('Failed to save blocks:', supaError);
          // Revert on error
          setProposal(proposal);
          throw new Error(supaError.message);
        }
      } catch (e: any) {
        console.error('useProposalBuilder saveBlocks:', e);
      }
    }
  };

  const saveFullProposal = async (updates: Partial<ProposalWithBlocks>) => {
    if (!proposal) return;
    
    const updatedProposal = { ...proposal, ...updates };
    setProposal(updatedProposal as ProposalWithBlocks);

    try {
      const package_details = {
        title: updatedProposal.title,
        athlete_id: updatedProposal.athlete_id,
        company_id: updatedProposal.company_id,
        amount: updatedProposal.amount,
        blocks: updatedProposal.blocks
      };
      
      let res;
      if (proposal.id === 'new') {
        res = await supabase.from('proposals').insert([{
          status: updatedProposal.status === 'draft' ? 'Draft' : 'Sent',
          package_details
        }]).select('id').single();
      } else {
        res = await supabase.from('proposals').update({
          status: updatedProposal.status === 'draft' ? 'Draft' : 'Sent',
          package_details
        }).eq('id', proposal.id).select('id').single();
      }

      if (res.error) throw new Error(res.error.message);
      
      if (proposal.id === 'new' && res.data) {
        setProposal({ ...updatedProposal, id: res.data.id } as ProposalWithBlocks);
      }
      return { success: true, id: res.data?.id };
    } catch (e: any) {
      console.error('saveFullProposal error:', e);
      return { success: false, error: e.message };
    }
  };

  return { proposal, loading, error, saveBlocks, saveFullProposal, refetch: fetchProposal };
}
