/**
 * Hooks — Barrel Export
 * ─────────────────────────────────────────────────────────────────
 * Central export for all custom React hooks.
 * Import from '@hooks' anywhere in the app.
 *
 * Usage:
 *   import { useAuth, useTheme, useNetwork } from '@hooks';
 */

export { default as useAuth }    from './useAuth';
export { default as useTheme }   from './useTheme';
export { default as useNetwork } from './useNetwork';

// Phase 3+: Uncomment as hooks are built
// export { default as useAlerts }       from './useAlerts';
// export { default as useProfile }      from './useProfile';
// export { default as useDebounce }     from './useDebounce';
// export { default as usePagination }   from './usePagination';
// export { default as useForm }         from './useFormHelper';
