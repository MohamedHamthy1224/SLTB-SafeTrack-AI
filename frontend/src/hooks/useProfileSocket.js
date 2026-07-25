import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from './useAuth';

let globalSocket = null;

export const useProfileSocket = (onProfileUpdatedCallback) => {
  const { user, updateCurrentUserProfile } = useAuth();
  
  const userRef = useRef(user);
  const updateProfileRef = useRef(updateCurrentUserProfile);
  const callbackRef = useRef(onProfileUpdatedCallback);

  useEffect(() => {
    userRef.current = user;
    updateProfileRef.current = updateCurrentUserProfile;
    callbackRef.current = onProfileUpdatedCallback;
  }, [user, updateCurrentUserProfile, onProfileUpdatedCallback]);

  const userId = user?.user_id || user?.userId;

  useEffect(() => {
    if (!userId) return;

    if (!globalSocket) {
      const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
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
        if (callbackRef.current) {
          callbackRef.current(updatedProfile);
        }
      }
    };

    globalSocket.off('profile_updated', handleProfileUpdate);
    globalSocket.on('profile_updated', handleProfileUpdate);

    return () => {
      if (globalSocket) {
        globalSocket.off('profile_updated', handleProfileUpdate);
      }
    };
  }, [userId]);

  return globalSocket;
};

export default useProfileSocket;
