# Assets — Sounds

This directory contains audio asset files for the mobile app.

## Usage
- Alert notification sounds
- Success/error feedback tones
- UI interaction sounds (optional)

## Planned Sound Files

| File | Usage | Trigger |
|------|-------|---------|
| `alert_critical.mp3` | Critical alert notification | FCM push (critical priority) |
| `alert_new.mp3` | New alert notification | FCM push (standard) |
| `success.mp3` | Action success feedback | Alert acknowledged/resolved |
| `error.mp3` | Error feedback | API/validation errors |

## Format Requirements
- MP3 or WAV format
- Max 2 seconds duration for notification sounds
- Max 500KB file size

## Notes
- Notification sounds are configured in `app.json` under the `expo-notifications` plugin
- Custom sounds require native build (not Expo Go)

## Status

🚧 **Pending** — Sound files to be added during notification implementation phase.
