// sessionStore — the one module that owns the auth session.
//
// Before this, token handling was smeared across api.ts (interceptor read
// `access`/`access_token`, refreshed, and wrote back), AuthContext (migration,
// expiry, writes) and a couple of pages — each repeating the dual key-name
// fallback and none agreeing on where the truth lived. Everything that touches
// the token now goes through here, so a refresh in the interceptor and a logout
// in the context read and write the same place.

const ACCESS = 'access';
const REFRESH = 'refresh';
// Legacy key names still read for backward compatibility with old sessions.
const LEGACY_ACCESS = 'access_token';
const LEGACY_REFRESH = 'refresh_token';

type Listener = () => void;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch {
      // A listener throwing must not stop the others.
    }
  });
}

export const sessionStore = {
  getAccess(): string | null {
    return sessionStorage.getItem(ACCESS) || sessionStorage.getItem(LEGACY_ACCESS);
  },

  getRefresh(): string | null {
    return sessionStorage.getItem(REFRESH) || sessionStorage.getItem(LEGACY_REFRESH);
  },

  setTokens(access: string, refresh?: string): void {
    sessionStorage.setItem(ACCESS, access);
    if (refresh) sessionStorage.setItem(REFRESH, refresh);
    emit();
  },

  // Used by the axios interceptor after a token refresh.
  setAccess(access: string): void {
    sessionStorage.setItem(ACCESS, access);
    emit();
  },

  clear(): void {
    [ACCESS, REFRESH, LEGACY_ACCESS, LEGACY_REFRESH, 'user'].forEach((k) => {
      sessionStorage.removeItem(k);
      localStorage.removeItem(k);
    });
    emit();
  },

  // One-time migration: old builds kept tokens in localStorage. Move them to
  // sessionStorage and clear localStorage of everything except the theme.
  migrateFromLocalStorage(): void {
    try {
      const theme = localStorage.getItem('theme');
      const accessLocal = localStorage.getItem(ACCESS) || localStorage.getItem(LEGACY_ACCESS);
      const refreshLocal = localStorage.getItem(REFRESH) || localStorage.getItem(LEGACY_REFRESH);
      if (accessLocal) sessionStorage.setItem(ACCESS, accessLocal);
      if (refreshLocal) sessionStorage.setItem(REFRESH, refreshLocal);
      Object.keys(localStorage).forEach((key) => {
        if (key !== 'theme') localStorage.removeItem(key);
      });
      if (theme) localStorage.setItem('theme', theme);
    } catch {
      // Ignore migration errors.
    }
  },

  // Subscribe to token changes; returns an unsubscribe function.
  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
