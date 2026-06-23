import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.data.user);
      setProfile(data.data.profile);
      setPermissions(data.data.permissions);
    } catch {
      localStorage.removeItem('token');
      setUser(null);
      setProfile(null);
      setPermissions(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.data.token);
    setUser(data.data.user);
    await loadUser();
    return data.data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('token', data.data.token);
    setUser(data.data.user);
    await loadUser();
    return data.data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setProfile(null);
    setPermissions(null);
  };

  const hasPermission = useCallback((key) => {
    if (!permissions?.permissions) return false;
    const p = permissions.permissions.find((x) => x.key === key);
    return p?.granted === true;
  }, [permissions]);

  const refreshPermissions = async () => {
    const { data } = await api.get('/auth/permissions');
    setPermissions(data.data);
  };

  return (
    <AuthContext.Provider value={{
      user, profile, permissions, loading, login, register, logout, loadUser, hasPermission, refreshPermissions,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function getDashboardPath(role) {
  const map = { patient: '/patient', doctor: '/doctor', pharmacist: '/pharmacist', admin: '/admin' };
  return map[role] || '/';
}
