import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from './useAuth';

let globalSocket = null;

export const useProfileSocket = (onProfileUpdatedCallback, onThemeUpdatedCallback) => {
  const { user, updateCurrentUserProfile } = useAuth();
  
  const userRef = useRef(user);
  const updateProfileRef = useRef(updateCurrentUserProfile);
  const profileCallbackRef = useRef(onProfileUpdatedCallback);
  const themeCallbackRef = useRef(onThemeUpdatedCallback);

  useEffect(() => {
    userRef.current = user;
    updateProfileRef.current = updateCurrentUserProfile;
    profileCallbackRef.current = onProfileUpdatedCallback;
    themeCallbackRef.current = onThemeUpdatedCallback;
  }, [user, updateCurrentUserProfile, onProfileUpdatedCallback, onThemeUpdatedCallback]);

  const userId = user?.user_id || user?.userId;

  useEffect(() => {
    if (!userId) return;

    if (!globalSocket) {
      const backendUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';
      globalSocket = io(backendUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000
      });
      globalSocket.emit('join_sltb_admin');
    }

    const handleProfileUpdate = (updatedProfile) => {
      const currentUser = userRef.current;
      const currentUserId = currentUser?.user_id || currentUser?.userId;

      if (updatedProfile && (updatedProfile.userId === currentUserId || updatedProfile.user_id === currentUserId)) {
        if (updateProfileRef.current) {
          updateProfileRef.current(updatedProfile);
        }
        if (profileCallbackRef.current) {
          profileCallbackRef.current(updatedProfile);
        }
      }
    };

    const handleThemeUpdate = (themeData) => {
      const currentUser = userRef.current;
      const currentUserId = currentUser?.user_id || currentUser?.userId;

      if (themeData && (themeData.userId === currentUserId || themeData.user_id === currentUserId)) {
        const newTheme = themeData.themePreference || themeData.theme_preference;
        if (themeCallbackRef.current && newTheme) {
          themeCallbackRef.current(newTheme);
        }
      }
    };

    globalSocket.off('profile_updated', handleProfileUpdate);
    globalSocket.on('profile_updated', handleProfileUpdate);

    globalSocket.off('theme_updated', handleThemeUpdate);
    globalSocket.on('theme_updated', handleThemeUpdate);

    return () => {
      if (globalSocket) {
        globalSocket.off('profile_updated', handleProfileUpdate);
        globalSocket.off('theme_updated', handleThemeUpdate);
      }
    };
  }, [userId]);

  return globalSocket;
};

export default useProfileSocket;
