import React, { useEffect, useState, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@hoop-master/supabase';
import type { UserRole } from '@hoop-master/types';
import { AuthContext } from './AuthContextValue.js';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadRoles(userId: string) {
    try {
      const { data, error } = await supabase.rpc('get_my_roles');
      if (error) { console.error('loadRoles rpc error:', error.message, error); setRoles([]); return; }
      console.log('loadRoles raw data:', JSON.stringify(data), 'typeof:', typeof data, 'isArray:', Array.isArray(data));
      if (data && Array.isArray(data)) {
        setRoles(data as UserRole[]);
        console.log('loadRoles setRoles to:', JSON.stringify(data));
      } else {
        console.warn('loadRoles unexpected data format:', data);
        setRoles([]);
      }
    } catch (e) {
      console.error('loadRoles caught exception:', e);
      setRoles([]);
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadRoles(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadRoles(session.user.id);
      } else {
        setRoles([]);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  }

  async function signUp(email: string, password: string, role: UserRole) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return { error };

    if (data.user) {
      const { error: roleError } = await supabase.from('user_roles').insert({
        user_id: data.user.id,
        role,
      });

      if (roleError) {
        console.error('Failed to assign role:', roleError);
        return { error: roleError };
      }
    }

    return { error: null };
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
    setUser(null);
    setSession(null);
    setRoles([]);
    setLoading(false);
  }

  const hasRole = (role: UserRole) => roles.includes(role);

  async function refreshRoles() {
    if (user) {
      await loadRoles(user.id);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        roles,
        loading,
        signIn,
        signUp,
        signOut,
        hasRole,
        refreshRoles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
