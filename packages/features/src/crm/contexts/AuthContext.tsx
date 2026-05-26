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
  } catch {}
  return []
}

function saveRolesCache(roles: UserRole[]) {
  try { localStorage.setItem(ROLES_KEY, JSON.stringify(roles)) } catch {}
}

function clearRolesCache() {
  try { localStorage.removeItem(ROLES_KEY) } catch {}
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<UserRole[]>(loadCachedRoles);
  const [loading, setLoading] = useState(true);

  async function loadRoles(userId: string, isBackground = false) {
    if (isBackground) {
      supabase.from('user_roles').select('role').eq('user_id', userId).then(({ data, error }) => {
        if (error) { return }
        const activeRoles = (data ?? []).map(r => r.role as UserRole)
        console.log('loadRoles (bg) active roles:', activeRoles)
        setRoles(activeRoles)
        saveRolesCache(activeRoles)
      }, () => {})
      return
    }
    try {
      const { data, error } = await supabase.from('user_roles').select('role').eq('user_id', userId)
      if (error) { console.error('loadRoles select error:', error.message); setRoles(loadCachedRoles()); return }
      const activeRoles = (data ?? []).map(r => r.role as UserRole)
      console.log('loadRoles active roles:', activeRoles)
      setRoles(activeRoles)
      saveRolesCache(activeRoles)
    } catch (e) {
      console.error('loadRoles failed:', e)
      setRoles(loadCachedRoles())
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      const user = session?.user ?? null
      setUser(user);
      if (user) {
        const cached = loadCachedRoles()
        if (cached.length > 0) { setRoles(cached) }
        loadRoles(user.id, true)
      } else {
        clearRolesCache()
      }
      setLoading(false);
    }).catch(e => { console.error('getSession failed:', e); setLoading(false) });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        try { await loadRoles(session.user.id) } catch (e) { console.error('loadRoles exception:', e) }
      } else {
        setRoles([]);
        clearRolesCache()
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
