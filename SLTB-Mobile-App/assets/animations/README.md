# Assets — Animations

This directory contains animation asset files.

## Subdirectories

### lottie/
Lottie animation files (.json) exported from Adobe After Effects or LottieFiles.

Planned Lottie animations:
- `loading_spinner.json` — General loading state
- `success_checkmark.json` — Success feedback animation
- `alert_pulse.json` — Critical alert pulsing animation
- `empty_state_alerts.json` — Empty alerts list illustration
- `empty_state_history.json` — Empty history illustration
- `offline.json` — No connection state

## Usage

```js
import LottieView from 'lottie-react-native';

<LottieView
  source={require('@assets/animations/lottie/loading_spinner.json')}
  autoPlay
  loop
  style={{ width: 100, height: 100 }}
/>
```

## Sources
- LottieFiles: https://lottiefiles.com
- Custom animations can be created in Adobe After Effects + Bodymovin plugin

## Status

🚧 **Pending** — Lottie files to be sourced during UI development phase.
