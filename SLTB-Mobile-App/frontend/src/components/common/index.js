/**
 * Common Components — Barrel Export
 * ─────────────────────────────────────────────────────────────────
 * Central export for all common/shared UI components.
 * Import from '@components/common' or via the components barrel.
 *
 * Usage:
 *   import { ErrorBoundary, LoadingOverlay, EmptyState } from '@components/common';
 */

export { default as ErrorBoundary }  from './ErrorBoundary';
export { default as LoadingOverlay } from './LoadingOverlay';
export { default as EmptyState }     from './EmptyState';
export { default as NetworkError }   from './NetworkError';

// Phase 3+: Uncomment as components are built
// export { default as Button }         from './Button';
// export { default as Input }          from './Input';
// export { default as Card }           from './Card';
// export { default as Badge }          from './Badge';
// export { default as Avatar }         from './Avatar';
// export { default as Divider }        from './Divider';
