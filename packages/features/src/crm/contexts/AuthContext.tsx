import React, { useEffect, useState, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@hoop-master/supabase';
import type { UserRole } from '@hoop-master/types';
import { AuthContext } from './AuthContextValue.js';

const ROLES_KEY = 'elitegbb_roles'

interface AuthProviderProps {
  children: ReactNode;
}

function loadCachedRoles(): UserRole[] {
  try {
    const raw = localStorage.getItem(ROLES_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // Silently handle localStorage errors (may not be available)
  }
  return []
}

function saveRolesCache(roles: UserRole[]) {
  try { localStorage.setItem(ROLES_KEY, JSON.stringify(roles)) } catch {
    // Silently handle localStorage errors (may not be available)
  }
}

function clearRolesCache() {
  try { localStorage.removeItem(ROLES_KEY) } catch {
    // Silently handle localStorage errors (may not be available)
  }
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<UserRole[]>(loadCachedRoles);
  const [loading, setLoading] = useState(true);

  async function loadRoles(userId: string, email?: string) {
    try {
      const { data, error } = await Promise.race([
        supabase.from('user_roles').select('role').eq('user_id', userId),
        new Promise<{ data: null; error: { message: string } }>(
          (_, reject) => setTimeout(() => reject(new Error('loadRoles timed out')), 5000)
        ),
      ])
      if (error) { console.error('loadRoles select error:', error.message); fallbackRoles(); return }
      const activeRoles = (data ?? []).map(r => r.role as UserRole)
      setRoles(activeRoles)
      saveRolesCache(activeRoles)
    } catch (e) {
      console.error('loadRoles failed:', e)
      fallbackRoles()
    }
    function fallbackRoles() {
      const cached = loadCachedRoles()
      if (cached.length > 0) { setRoles(cached) }
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      let sess = initialSession
      if (sess) {
        try {
          const result = await Promise.race([
            supabase.auth.refreshSession(),
            new Promise<{ data: { session: Session | null }; error: { message: string } }>(
              (_, reject) => setTimeout(() => reject(new Error('refreshSession timed out')), 5000)
            ),
          ])
          sess = result.data.session ?? sess
        } catch (e) {
          console.warn('refreshSession failed/timed out, using cached session:', e)
        }
      }
      setSession(sess);
      setUser(sess?.user ?? null);
      setLoading(false);
      if (sess?.user) {
        await loadRoles(sess.user.id, sess.user.email)
      } else {
        clearRolesCache()
      }
    }).catch(e => { console.error('getSession failed:', e); setLoading(false) });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        loadRoles(session.user.id, session.user.email)
      } else {
        setRoles([]);
        clearRolesCache()
      }
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
    clearRolesCache()
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
