import { useState, useEffect } from 'react';
import { supabase } from '@hoop-master/supabase';
import type { Page, PageBlock } from './types';

export function usePageBuilder(slug?: string) {
  const [page, setPage] = useState<Page | null>(null);
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      const { data: pageData } = await supabase
        .from('page_builder_pages')
        .select('*')
        .eq('slug', slug)
        .single();

      if (pageData) {
        setPage(pageData as Page);
        const { data: blockData } = await supabase
          .from('page_builder_blocks')
          .select('*')
          .eq('page_id', pageData.id)
          .order('order_index', { ascending: true });
        
        if (blockData) {
          setBlocks(blockData as PageBlock[]);
        }
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  return { page, blocks, loading };
}
