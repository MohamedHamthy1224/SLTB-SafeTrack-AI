# Frontend Assets

This directory contains all static asset files used by the React Native application.

## Structure

```
assets/
├── images/        # PNG, JPG image files used in the app
├── fonts/         # Custom font files (TTF, OTF)
└── icons/         # App icon files for iOS and Android
```

## Placeholder Files

During development, place the following required Expo assets here:

| File | Purpose |
|------|---------|
| `icon.png` | App icon (1024×1024 PNG) |
| `splash.png` | Splash screen (1242×2436 PNG) |
| `adaptive-icon.png` | Android adaptive icon (1024×1024 PNG) |
| `favicon.png` | Web favicon (32×32 PNG) |
| `notification-icon.png` | Push notification icon |

## Usage

Reference these assets in `app.json` or import them directly in your components:

```js
import logo from '@assets/images/logo.png';
```
