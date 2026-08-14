module.exports = {
  root: true,
  env: {
    browser: false,
    es2021: true,
    'react-native/react-native': true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-native/all',
  ],
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', 'react-native'],
  rules: {
    // ─── React ────────────────────────────────────────────────────
    'react/react-in-jsx-scope': 'off',          // Not needed for React 17+
    'react/prop-types': 'warn',                  // Warn on missing PropTypes
    'react/display-name': 'off',

    // ─── React Hooks ──────────────────────────────────────────────
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // ─── React Native ─────────────────────────────────────────────
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'off',     // Handled by theme
    'react-native/no-raw-text': 'off',
    'react-native/sort-styles': 'off',

    // ─── General ──────────────────────────────────────────────────
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',
    'no-var': 'error',
    'eqeqeq': ['error', 'always'],
  },
  settings: {
    react: { version: 'detect' },
  },
  ignorePatterns: ['node_modules/', 'babel.config.js', '.eslintrc.js'],
};
