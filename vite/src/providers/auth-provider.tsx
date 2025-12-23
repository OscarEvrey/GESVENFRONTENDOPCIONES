import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  ensureDefaultGesvenSession,
  getGesvenSession,
  setGesvenSession,
  type GesvenSession,
} from '@/lib/gesven-session';

export type AuthContextValue = {
  session: GesvenSession | null;
  isAuthenticated: boolean;
  setMockUser: (userId: number) => void;
  clearSession: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<GesvenSession | null>(() => getGesvenSession());

  useEffect(() => {
    // Al iniciar el frontend, simulamos una sesión activa con UsuarioId = 1.
    // En el futuro esto se reemplazará por Microsoft login/token.
    const ensured = ensureDefaultGesvenSession();
    setSession(ensured);
  }, []);

  const setMockUser = useCallback((userId: number) => {
    const current = getGesvenSession();
    const next: GesvenSession = {
      userId,
      email: current?.email ?? 'sistema@gesven.mx',
      nombreCompleto: current?.nombreCompleto ?? 'Usuario Sistema',
      isMock: true,
    };

    setGesvenSession(next);
    setSession(next);
  }, []);

  const clearSession = useCallback(() => {
    setGesvenSession(null);
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      session,
      isAuthenticated: session !== null,
      setMockUser,
      clearSession,
    };
  }, [clearSession, session, setMockUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
