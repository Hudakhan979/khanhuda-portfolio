import { useState, useEffect, useCallback } from 'react';
import { getMe, login as loginApi } from '../lib/api';

export function useAuth() {
  const [admin, setAdmin]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('portfolio_token');
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await getMe();
      setAdmin(data.admin);
    } catch {
      localStorage.removeItem('portfolio_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const login = async (email, password) => {
    setError(null);
    const { data } = await loginApi(email, password);
    localStorage.setItem('portfolio_token', data.token);
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('portfolio_token');
    setAdmin(null);
  };

  return { admin, loading, error, login, logout, isAuthenticated: !!admin };
}
