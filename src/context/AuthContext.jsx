import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const TOKEN_KEY = 'wealthedge_token';
const USER_KEY  = 'wealthedge_user';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user,  setUser]  = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const t = localStorage.getItem(TOKEN_KEY);
      const u = localStorage.getItem(USER_KEY);
      if (t) setToken(t);
      if (u) setUser(JSON.parse(u));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    try { token ? localStorage.setItem(TOKEN_KEY, token)
               : localStorage.removeItem(TOKEN_KEY); } catch {}
  }, [token]);

  useEffect(() => {
    try { user ? localStorage.setItem(USER_KEY, JSON.stringify(user))
              : localStorage.removeItem(USER_KEY); } catch {}
  }, [user]);

  async function login(email, password) {
    const { data } = await axios.post('/api/auth/login', { email, password });
    if (!data?.token || !data?.user) throw new Error('Invalid response');
    setToken(data.token); setUser(data.user);
    return data;
  }

  async function register(email, password) {
    const { data } = await axios.post('/api/auth/register', { email, password });
    if (!data?.token || !data?.user) throw new Error('Invalid response');
    setToken(data.token); setUser(data.user);
    return data;
  }

  function logout() { setToken(null); setUser(null); }

  const value = useMemo(() => ({ token, user, hydrated, login, register, logout }), [token, user, hydrated]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
