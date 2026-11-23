import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, setUnauthorizedHandler, token } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(Boolean(token.get()));

  const logout = useCallback(() => {
    token.set(null);
    setAdmin(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
    if (!token.get()) return;
    api
      .me()
      .then(setAdmin)
      .catch(logout)
      .finally(() => setChecking(false));
  }, [logout]);

  const login = async (email, password) => {
    const { token: t, admin: a } = await api.login(email, password);
    token.set(t);
    setAdmin(a);
  };

  return (
    <AuthContext.Provider value={{ admin, checking, login, logout, isSuper: admin?.role === 'superadmin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
