import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from './useAuth';

let globalDashboardSocket = null;

export const useDashboardSocket = (onRefreshCallback) => {
  const { user } = useAuth();
  const callbackRef = useRef(onRefreshCallback);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    callbackRef.current = onRefreshCallback;
  }, [onRefreshCallback]);

  const userId = user?.user_id || user?.userId;

  useEffect(() => {
    if (!userId) return;

    if (!globalDashboardSocket) {
      const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
      globalDashboardSocket = io(backendUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000
      });
      globalDashboardSocket.emit('join_sltb_admin');
    }

    const triggerDebouncedRefresh = () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        if (callbackRef.current) {
          callbackRef.current();
        }
      }, 500);
    };

    const events = [
      'dashboard_summary_updated',
      'bus_registered',
      'bus_updated',
      'bus_deactivated',
      'route_registered',
      'route_updated',
      'route_deactivated',
      'driver_registered',
      'driver_updated',
      'driver_deactivated'
    ];

    events.forEach((evt) => {
      globalDashboardSocket.off(evt, triggerDebouncedRefresh);
      globalDashboardSocket.on(evt, triggerDebouncedRefresh);
    });

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (globalDashboardSocket) {
        events.forEach((evt) => {
          globalDashboardSocket.off(evt, triggerDebouncedRefresh);
        });
      }
    };
  }, [userId]);

  return globalDashboardSocket;
};

export default useDashboardSocket;
