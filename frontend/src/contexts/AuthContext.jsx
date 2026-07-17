import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('sltb_auth_token');
      if (token) {
        try {
          const res = await authService.checkSession();
          if (res.success && res.data.user) {
            setUser(res.data.user);
          } else {
            setUser(null);
          }
        } catch (e) {
          console.error('Session restoration failed', e);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (identifier, password, rememberMe) => {
    const res = await authService.login(identifier, password);
    if (res.success && res.data) {
      localStorage.setItem('sltb_auth_token', res.data.token);
      localStorage.setItem('sltb_user_data', JSON.stringify(res.data.user));
      if (rememberMe) {
        localStorage.setItem('sltb_remembered_user', identifier);
      } else {
        localStorage.removeItem('sltb_remembered_user');
      }
      setUser(res.data.user);
    }
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
