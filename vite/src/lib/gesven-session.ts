export type GesvenSession = {
  userId: number;
  email: string;
  nombreCompleto: string;
  isMock: boolean;
};

const STORAGE_KEY = 'gesven.session';

const defaultSession: GesvenSession = {
  userId: 1,
  email: 'sistema@gesven.mx',
  nombreCompleto: 'Usuario Sistema',
  isMock: true,
};

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getGesvenSession(): GesvenSession | null {
  if (!isBrowser()) {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    const maybe = parsed as Partial<GesvenSession>;
    if (typeof maybe.userId !== 'number') {
      return null;
    }

    return {
      userId: maybe.userId,
      email: typeof maybe.email === 'string' ? maybe.email : defaultSession.email,
      nombreCompleto:
        typeof maybe.nombreCompleto === 'string'
          ? maybe.nombreCompleto
          : defaultSession.nombreCompleto,
      isMock: typeof maybe.isMock === 'boolean' ? maybe.isMock : true,
    };
  } catch {
    return null;
  }
}

export function setGesvenSession(session: GesvenSession | null): void {
  if (!isBrowser()) {
    return;
  }

  if (session === null) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function ensureDefaultGesvenSession(): GesvenSession {
  const existing = getGesvenSession();
  if (existing) {
    return existing;
  }

  setGesvenSession(defaultSession);
  return defaultSession;
}

export function getCurrentUserId(): number | null {
  return getGesvenSession()?.userId ?? null;
}
