import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, setCsrfToken } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api('/api/me')
      .then((payload) => {
        if (!active) return;
        setCsrfToken(payload.data.csrf);
        setAdmin(payload.data.admin);
      })
      .catch(() => {
        if (active) setAdmin(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function login(email, password) {
    const payload = await api('/api/login', {
      method: 'POST',
      body: { email, password },
    });
    setCsrfToken(payload.data.csrf);
    setAdmin(payload.data.admin);
    return payload.data.admin;
  }

  async function logout() {
    try {
      await api('/api/logout', { method: 'POST' });
    } finally {
      setCsrfToken('');
      setAdmin(null);
    }
  }

  const value = useMemo(() => ({ admin, loading, login, logout }), [admin, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth harus dipakai di dalam AuthProvider.');
  return value;
}
