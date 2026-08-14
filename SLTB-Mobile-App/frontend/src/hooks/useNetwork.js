/**
 * useNetwork — Network Connectivity Hook
 * ─────────────────────────────────────────────────────────────────
 * Monitors device network state using expo-network.
 *
 * Returns:
 *   isConnected   — Whether the device has any network connection
 *   isInternetReachable — Whether internet (not just LAN) is reachable
 *   networkType   — 'wifi' | 'cellular' | 'none' | 'unknown'
 *
 * Usage:
 *   import { useNetwork } from '@hooks';
 *   const { isConnected } = useNetwork();
 *   if (!isConnected) return <NetworkError />;
 */

import { useState, useEffect } from 'react';
import * as Network from 'expo-network';

const useNetwork = () => {
  const [networkState, setNetworkState] = useState({
    isConnected: true,
    isInternetReachable: true,
    networkType: 'unknown',
  });

  useEffect(() => {
    let isMounted = true;

    const checkNetwork = async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        if (isMounted) {
          setNetworkState({
            isConnected:         state.isConnected ?? true,
            isInternetReachable: state.isInternetReachable ?? true,
            networkType:         state.type ?? 'unknown',
          });
        }
      } catch (_err) {
        // Assume connected on error (fail open)
      }
    };

    checkNetwork();

    // Poll every 10 seconds (expo-network has no subscription API)
    const interval = setInterval(checkNetwork, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return networkState;
};

export default useNetwork;
