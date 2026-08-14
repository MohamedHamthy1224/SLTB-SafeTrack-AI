/**
 * QueryProvider
 * ─────────────────────────────────────────────────────────────────
 * Configures TanStack React Query for the entire application.
 *
 * Configuration:
 *   - staleTime: 5 minutes (data considered fresh)
 *   - gcTime: 10 minutes (garbage-collect unused cache)
 *   - retry: 2 times on failure
 *   - refetchOnWindowFocus: false (mobile doesn't have "window focus")
 *   - refetchOnReconnect: true (refetch when network reconnects)
 *
 * Usage:
 *   All hooks using useQuery / useMutation / useInfiniteQuery
 *   will automatically use this configuration.
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ─────────────────────────────────────────────────────────────────
// Query Client Configuration
// ─────────────────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:            5 * 60 * 1000,   // 5 minutes
      gcTime:               10 * 60 * 1000,  // 10 minutes (formerly cacheTime)
      retry:                2,
      retryDelay:           (attempt) => Math.min(1000 * 2 ** attempt, 30000),
      refetchOnWindowFocus: false,            // No-op on mobile but explicit
      refetchOnReconnect:   true,
      refetchOnMount:       true,
    },
    mutations: {
      retry: 0,                               // Don't retry mutations
    },
  },
});

/**
 * QueryProvider
 * Wrap the app with QueryClientProvider.
 */
const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export { queryClient };
export default QueryProvider;
