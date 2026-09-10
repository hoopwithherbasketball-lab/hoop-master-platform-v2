export type ProposalStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

export interface ProposalBlock {
  id: string;
  type: 'text' | 'hero' | 'features' | 'pricing';
  content: Record<string, unknown>;
  order: number;
}

export interface Proposal {
  id: string;
  athlete_id: string | null;
  company_id: string | null;
  title: string;
  status: ProposalStatus;
  amount: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProposalWithBlocks extends Proposal {
  blocks: ProposalBlock[];
}
