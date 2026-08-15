import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authService } from '../services/authService';
import { getActiveModule } from '../utils/roleRouter';
import { LogoutConfirmModal } from '../components/common/LogoutConfirmModal';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Logout confirmation modal states
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState(null);

  const activeModule = useMemo(() => {
    return user ? getActiveModule(user.role_name) : null;
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    const initializeAuth = async () => {
      const token = localStorage.getItem('sltb_auth_token');
      if (token) {
        try {
          const res = await authService.checkSession();
          if (isMounted) {
            if (res.success && res.data.user) {
              setUser(res.data.user);
            } else {
              setUser(null);
            }
          }
        } catch (e) {
          console.error('Session restoration failed', e);
          if (isMounted) setUser(null);
        }
      }
      if (isMounted) setLoading(false);
    };

    initializeAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (identifier, password, rememberMe) => {
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
  }, []);

  // Direct programmatic logout (used e.g. after password reset)
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsLogoutConfirmOpen(false);
      setIsLoggingOut(false);
      setLogoutError(null);
    }
  }, []);

  // Open confirmation modal
  const requestLogout = useCallback(() => {
    setLogoutError(null);
    setIsLogoutConfirmOpen(true);
  }, []);

  // Cancel logout (close modal, keep everything unchanged)
  const cancelLogout = useCallback(() => {
    if (!isLoggingOut) {
      setIsLogoutConfirmOpen(false);
      setLogoutError(null);
    }
  }, [isLoggingOut]);

  // Confirm logout (execute teardown with loading state)
  const confirmLogout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      await authService.logout();
      setUser(null);
      setIsLogoutConfirmOpen(false);
    } catch (err) {
      console.error('Logout error:', err);
      // Even if server request fails, authService clears local storage; ensure client state is cleared
      setUser(null);
      setIsLogoutConfirmOpen(false);
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut]);

  const updateCurrentUserProfile = useCallback((updatedProfile) => {
    if (!updatedProfile) return;
    setUser((prevUser) => {
      if (!prevUser) return prevUser;
      const nextUser = {
        ...prevUser,
        email: updatedProfile.emailAddress ?? updatedProfile.email ?? prevUser.email,
        profile_image: updatedProfile.profileImage ?? updatedProfile.profile_image ?? prevUser.profile_image,
        updatedAt: updatedProfile.updatedAt ?? updatedProfile.updated_at ?? prevUser.updatedAt,
        sltb_profile: {
          ...(prevUser.sltb_profile || {}),
          full_name: updatedProfile.fullName ?? updatedProfile.full_name ?? prevUser.sltb_profile?.full_name,
          employee_id: updatedProfile.employeeId ?? updatedProfile.employee_id ?? prevUser.sltb_profile?.employee_id,
          department: updatedProfile.department ?? prevUser.sltb_profile?.department,
          designation: updatedProfile.designation ?? prevUser.sltb_profile?.designation,
          phone: updatedProfile.phone ?? prevUser.sltb_profile?.phone,
          joined_date: updatedProfile.joinedDate ?? updatedProfile.joined_date ?? prevUser.sltb_profile?.joined_date
        }
      };
      try {
        localStorage.setItem('sltb_user_data', JSON.stringify(nextUser));
      } catch (e) {
        console.warn('Failed to sync local storage user data', e);
      }
      return nextUser;
    });
  }, []);

  const contextValue = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    activeModule,
    loading,
    login,
    logout,
    requestLogout,
    cancelLogout,
    confirmLogout,
    isLogoutConfirmOpen,
    isLoggingOut,
    updateCurrentUserProfile
  }), [
    user, 
    activeModule, 
    loading, 
    login, 
    logout, 
    requestLogout, 
    cancelLogout, 
    confirmLogout, 
    isLogoutConfirmOpen, 
    isLoggingOut, 
    updateCurrentUserProfile
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      <LogoutConfirmModal
        isOpen={isLogoutConfirmOpen}
        isLoggingOut={isLoggingOut}
        errorMessage={logoutError}
        onCancel={cancelLogout}
        onConfirm={confirmLogout}
      />
    </AuthContext.Provider>
  );
};

