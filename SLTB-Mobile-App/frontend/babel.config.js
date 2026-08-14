module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // ─────────────────────────────────────────────────────────────────
      // Module Resolver — enables absolute imports across the project.
      // Usage: import MyComponent from '@components/common/MyComponent'
      // ─────────────────────────────────────────────────────────────────
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@assets':     './src/assets',
            '@components': './src/components',
            '@layouts':    './src/layouts',
            '@navigation': './src/navigation',
            '@screens':    './src/screens',
            '@services':   './src/services',
            '@hooks':      './src/hooks',
            '@theme':      './src/theme',
            '@constants':  './src/constants',
            '@helpers':    './src/helpers',
            '@utils':      './src/utils',
            '@types':      './src/types',
            '@styles':     './src/styles',
            '@config':     './src/config',
            '@contexts':   './src/contexts',
            '@providers':  './src/providers',
            '@store':      './src/store',
            '@mock':       './src/mock',
            '@dummy':      './src/dummy',
          },
        },
      ],
      // ─────────────────────────────────────────────────────────────────
      // React Native Reanimated — must be listed LAST
      // Phase 4: Uncomment when animations/gestures are needed.
      // Disabled in Phase 3 to avoid react-native-worklets version conflict.
      // ─────────────────────────────────────────────────────────────────
      // 'react-native-reanimated/plugin',
    ],
  };
};
