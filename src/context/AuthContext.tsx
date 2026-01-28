import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AuthSession, AuthUser, clearSession, createSession, getStoredSession, storeSession, verifyCredentials } from '@/lib/auth';

interface AuthContextValue {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => getStoredSession());
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (identifier: string, password: string) => {
    setLoading(true);
    const result = await verifyCredentials(identifier, password);
    if (!result.ok) {
      setLoading(false);
      return result;
    }
    const nextSession = createSession(identifier);
    storeSession(nextSession);
    setSession(nextSession);
    setLoading(false);
    return { ok: true } as const;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user: session?.user ?? null,
    session,
    loading,
    login,
    logout,
  }), [session, loading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
