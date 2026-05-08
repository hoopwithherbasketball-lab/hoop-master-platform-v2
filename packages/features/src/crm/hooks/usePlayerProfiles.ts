import { useEffect, useState } from 'react';
import { supabase } from '@hoop-master/supabase';
import type { Database } from '@hoop-master/types';

type PlayerProfile = Database['public']['Tables']['player_profiles']['Row'];

export const usePlayerProfiles = () => {
  const [profiles, setProfiles] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('player_profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProfiles(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();

    // Subscribe to changes
    const channel = supabase
      .channel('player_profiles_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'player_profiles' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProfiles(prev => [payload.new as PlayerProfile, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setProfiles(prev =>
              prev.map(profile =>
                profile.id === payload.new.id ? (payload.new as PlayerProfile) : profile
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setProfiles(prev => prev.filter(profile => profile.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { profiles, loading, error };
};