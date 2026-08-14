# Assets — Icons

This directory contains all icon assets for the SLTB Mobile App.

## Icon Categories

| Category | Description |
|----------|-------------|
| App Icons | iOS/Android launcher icons |
| Navigation | Bottom tab bar icons |
| Action Icons | Button and action icons |
| Status Icons | Alert severity, status indicators |
| Feature Icons | Feature-specific icons |

## Icon Library
The app uses **@expo/vector-icons** (MaterialCommunityIcons, Ionicons)
for most UI icons. This directory is for custom SVG/PNG icon assets only.

## Formats
- SVG (preferred — scalable)
- PNG (fallback — 24px, 48px, 96px variants)

## Naming Convention
```
ic_{category}_{name}.svg
Examples:
  ic_nav_dashboard.svg
  ic_nav_alerts.svg
  ic_status_critical.svg
  ic_action_acknowledge.svg
```
