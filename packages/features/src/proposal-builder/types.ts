export interface ProposalBlock {
  id: string;
  type: 'text' | 'hero' | 'features' | 'pricing';
  content: any;
  order: number;
}

export interface Proposal {
  id: string;
  athlete_id: string | null;
  company_id: string | null;
  title: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  amount: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProposalWithBlocks extends Proposal {
  blocks: ProposalBlock[];
}
