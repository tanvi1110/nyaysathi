import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSession, signOut as clientSignOut } from "./authClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [afterAuth, setAfterAuth] = useState(null);

  useEffect(() => {
    setSession(getSession());
  }, []);

  const refresh = useCallback(() => {
    setSession(getSession());
  }, []);

  const requireAuth = useCallback((fn) => {
    const s = getSession();
    if (s?.user) {
      fn?.();
      return true;
    }
    setAfterAuth(() => fn || null);
    setAuthModalOpen(true);
    return false;
  }, []);

  const onAuthed = useCallback(() => {
    refresh();
    setAuthModalOpen(false);
    setTimeout(() => {
      if (afterAuth) afterAuth();
      setAfterAuth(null);
    }, 0);
  }, [afterAuth, refresh]);

  const signOut = useCallback(() => {
    clientSignOut();
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      isAuthed: Boolean(session?.user),
      requireAuth,
      authModalOpen,
      setAuthModalOpen,
      onAuthed,
      signOut,
      refresh,
    }),
    [authModalOpen, onAuthed, refresh, requireAuth, session, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

