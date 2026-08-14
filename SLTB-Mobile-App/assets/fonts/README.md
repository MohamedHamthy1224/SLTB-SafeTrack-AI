# Assets — Fonts

This directory contains all custom font files for the SLTB Mobile App.

## Selected Fonts

| Font Family | Usage | Weights |
|-------------|-------|---------|
| **Inter** | Primary UI font | 400, 500, 600, 700 |
| **JetBrains Mono** | Badge numbers, codes | 400 |

## Download Sources

- Inter: https://fonts.google.com/specimen/Inter
- JetBrains Mono: https://fonts.google.com/specimen/JetBrains+Mono

## Required Files

```
fonts/
├── Inter-Regular.ttf
├── Inter-Medium.ttf
├── Inter-SemiBold.ttf
├── Inter-Bold.ttf
└── JetBrainsMono-Regular.ttf
```

## Loading Fonts in Expo

```js
import { useFonts } from 'expo-font';

const [fontsLoaded] = useFonts({
  'Inter-Regular':   require('@assets/fonts/Inter-Regular.ttf'),
  'Inter-Medium':    require('@assets/fonts/Inter-Medium.ttf'),
  'Inter-SemiBold':  require('@assets/fonts/Inter-SemiBold.ttf'),
  'Inter-Bold':      require('@assets/fonts/Inter-Bold.ttf'),
});
```

## Status

🚧 **Pending** — Font files to be downloaded and added before Phase 2.
