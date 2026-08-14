import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from './useAuth';

let globalReportSocket = null;

export const useReportSocket = (activeTab, onRefreshCallback) => {
  const { user } = useAuth();
  const [socketStatus, setSocketStatus] = useState('offline'); // 'live' | 'reconnecting' | 'offline'
  const callbackRef = useRef(onRefreshCallback);
  const debounceTimerRef = useRef(null);
  const activeTabRef = useRef(activeTab);

  useEffect(() => {
    callbackRef.current = onRefreshCallback;
  }, [onRefreshCallback]);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  const userId = user?.user_id || user?.userId;

  useEffect(() => {
    if (!userId) return;

    if (!globalReportSocket) {
      const backendUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';
      globalReportSocket = io(backendUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000
      });
    }

    const socket = globalReportSocket;

    const handleConnect = () => {
      setSocketStatus('live');
      socket.emit('join_sltb_admin');
      if (callbackRef.current) {
        callbackRef.current();
      }
    };

    const handleDisconnect = () => {
      setSocketStatus('offline');
    };

    const handleReconnectAttempt = () => {
      setSocketStatus('reconnecting');
    };

    const handleConnectError = () => {
      setSocketStatus('offline');
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.io.on('reconnect_attempt', handleReconnectAttempt);
    socket.on('connect_error', handleConnectError);

    if (socket.connected) {
      setSocketStatus('live');
      socket.emit('join_sltb_admin');
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

    const tabEventMap = {
      buses: ['bus_registered', 'bus_updated', 'bus_deactivated', 'bus_summary_updated'],
      routes: ['route_registered', 'route_updated', 'route_deactivated', 'route_summary_updated'],
      drivers: ['driver_registered', 'driver_updated', 'driver_deactivated', 'driver_summary_updated'],
      'assignment-history': ['bus_assignment_updated', 'assignment_history_created'],
      'sensors-alerts': ['bus_alert_created', 'bus_alert_updated']
    };

    const relevantEvents = tabEventMap[activeTab] || [];

    relevantEvents.forEach((evt) => {
      socket.off(evt, triggerDebouncedRefresh);
      socket.on(evt, triggerDebouncedRefresh);
    });

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.io.off('reconnect_attempt', handleReconnectAttempt);
      socket.off('connect_error', handleConnectError);

      relevantEvents.forEach((evt) => {
        socket.off(evt, triggerDebouncedRefresh);
      });
    };
  }, [userId, activeTab]);

  // Fallback Polling (45s) when socket is disconnected
  useEffect(() => {
    if (socketStatus === 'live') return;

    const pollInterval = setInterval(() => {
      if (callbackRef.current) {
        callbackRef.current();
      }
    }, 45000);

    return () => clearInterval(pollInterval);
  }, [socketStatus]);

  return { socketStatus };
};

export default useReportSocket;
