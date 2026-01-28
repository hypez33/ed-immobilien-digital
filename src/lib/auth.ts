export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  issuedAt: number;
}

const SESSION_KEY = 'ed_admin_session';
const ADMIN_USER = (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env.VITE_ADMIN_USER;
const ADMIN_PASSWORD_HASH =
  (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env.VITE_ADMIN_PASSWORD_HASH;

const hashString = async (value: string) => {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

export const getStoredSession = (): AuthSession | null => {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
};

export const storeSession = (session: AuthSession) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearSession = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(SESSION_KEY);
};

export const verifyCredentials = async (identifier: string, password: string) => {
  if (!ADMIN_USER || !ADMIN_PASSWORD_HASH) {
    console.warn(
      '[Admin Auth] VITE_ADMIN_USER and/or VITE_ADMIN_PASSWORD_HASH are not set. Admin login is disabled.'
    );
    return { ok: false, error: 'Admin-Zugang ist nicht konfiguriert.' } as const;
  }

  const normalized = identifier.trim().toLowerCase();
  const hash = await hashString(password);

  if (normalized !== ADMIN_USER.toLowerCase() || hash !== ADMIN_PASSWORD_HASH) {
    return { ok: false, error: 'E-Mail/Benutzername oder Passwort ist falsch.' } as const;
  }

  return { ok: true } as const;
};

export const createSession = (identifier: string): AuthSession => {
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`;
  return {
    token: id,
    issuedAt: Date.now(),
    user: {
      id,
      email: identifier.trim().toLowerCase(),
      name: 'Admin',
    },
  };
};
