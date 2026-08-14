/**
 * SLTB SafeTrack AI — Design System Tokens
 * ═══════════════════════════════════════════════════════════════════
 * Single source of truth for all visual design decisions.
 * Includes both Dark Mode system tokens and Light Portal theme tokens.
 */

// ─────────────────────────────────────────────────────────────────
// COLOR PALETTE
// ─────────────────────────────────────────────────────────────────
export const Colors = {
  // ── Portal Theme (Light / Operations Portal) ──────────────────────
  orangePrimary:    '#F26522',    // Primary Brand Orange (Login Button, Icons, Accents)
  orangeDark:       '#D85213',    // Pressed / Active Orange state
  orangeLight:      '#FFF0EA',    // Light Orange tint background
  portalBg:         '#F8F9FA',    // Clean Light Portal Background
  cardBg:           '#FFFFFF',    // Pure White Card Background
  
  // ── Text Colors (Portal) ─────────────────────────────────────────
  textDark:         '#111827',    // Primary Headings (Officer Login)
  textBody:         '#4B5563',    // Subtitles & Body text
  textLabel:        '#374151',    // Input Labels (OFFICER EMAIL, PASSWORD)
  textSubtle:       '#6B7280',    // Secondary Header / Footer Text
  textMutedLight:   '#9CA3AF',    // Version / Small Footer Text
  textPlaceholder:  '#9CA3AF',    // Input Placeholder Text

  // ── Input & Border Colors ─────────────────────────────────────────
  inputBg:          '#FFFFFF',    // Input field background
  inputBorder:      '#E5E7EB',    // Default input border
  inputBorderFocus: '#F26522',    // Focused input border (Orange)
  inputBorderError: '#EF4444',    // Error input border (Red)
  cardBorderTop:    '#F26522',    // Accent line on top of Card

  // ── Brand (Legacy / Police Blue) ──────────────────────────────────
  primary:          '#1E40AF',    // Police Blue
  primaryLight:     '#3B82F6',
  primaryDark:      '#1E3A8A',

  // ── Accent ──────────────────────────────────────────────────────
  accent:           '#F26522',    // SLTB Amber / Orange
  accentLight:      '#FCD34D',
  accentDark:       '#D97706',

  // ── Semantic ────────────────────────────────────────────────────
  success:          '#10B981',
  successLight:     '#D1FAE5',
  warning:          '#F59E0B',
  warningLight:     '#FEF3C7',
  error:            '#EF4444',
  errorLight:       '#FEE2E2',
  info:             '#3B82F6',
  infoLight:        '#DBEAFE',

  // ── Alert Severity ──────────────────────────────────────────────
  critical:         '#DC2626',
  criticalBg:       'rgba(220, 38, 38, 0.12)',
  high:             '#EA580C',
  highBg:           'rgba(234, 88, 12, 0.12)',
  medium:           '#D97706',
  mediumBg:         'rgba(217, 119, 6, 0.12)',
  low:              '#16A34A',
  lowBg:            'rgba(22, 163, 74, 0.12)',

  // ── Surface ─────────────────────────────────────────────────────
  background:       '#F8F9FA',    // Default background
  surface:          '#FFFFFF',    // Card/surface background
  surfaceAlt:       '#F3F4F6',    // Alternate surface
  surfaceElevated:  '#FFFFFF',    // Elevated surface (modals)
  border:           '#E5E7EB',    // Subtle border
  borderLight:      '#F3F4F6',    // Slightly lighter border

  // ── Text ────────────────────────────────────────────────────────
  textPrimary:      '#111827',    // Primary readable text
  textSecondary:    '#4B5563',    // Secondary/label text
  textMuted:        '#9CA3AF',    // Disabled / placeholder text
  textInverse:      '#FFFFFF',    // Text on dark/colored backgrounds
  textLink:         '#F26522',    // Interactive text links (Orange)

  // ── Misc ────────────────────────────────────────────────────────
  white:            '#FFFFFF',
  black:            '#000000',
  transparent:      'transparent',
  overlay:          'rgba(0, 0, 0, 0.5)',
  overlayLight:     'rgba(0, 0, 0, 0.2)',

  // ── Tab Bar ─────────────────────────────────────────────────────
  tabBar:           '#FFFFFF',
  tabBarBorder:     '#E5E7EB',
  tabActive:        '#F26522',
  tabInactive:      '#9CA3AF',
};

// ─────────────────────────────────────────────────────────────────
// TYPOGRAPHY
// ─────────────────────────────────────────────────────────────────
export const Typography = {
  fontFamily: {
    regular:    'System',
    medium:     'System',
    semiBold:   'System',
    bold:       'System',
    mono:       'System',
  },
  fontSize: {
    xs:     10,
    sm:     12,
    base:   14,
    md:     16,
    lg:     18,
    xl:     20,
    '2xl':  24,
    '3xl':  30,
    '4xl':  36,
    '5xl':  48,
  },
  fontWeight: {
    regular:  '400',
    medium:   '500',
    semiBold: '600',
    bold:     '700',
    extraBold:'800',
  },
  lineHeight: {
    tight:    1.2,
    snug:     1.375,
    normal:   1.5,
    relaxed:  1.625,
    loose:    2.0,
  },
  letterSpacing: {
    tight:    -0.5,
    normal:   0,
    wide:     0.5,
    wider:    1.0,
    widest:   2.0,
  },
};

// ─────────────────────────────────────────────────────────────────
// SPACING SCALE (pt / dp)
// ─────────────────────────────────────────────────────────────────
export const Spacing = {
  0:    0,
  1:    4,
  2:    8,
  3:    12,
  4:    16,
  5:    20,
  6:    24,
  7:    28,
  8:    32,
  10:   40,
  12:   48,
  16:   64,
  20:   80,
  xs:   4,
  sm:   8,
  md:   12,
  base: 16,
  lg:   20,
  xl:   24,
  '2xl':32,
  '3xl':48,
  '4xl':64,
};

// ─────────────────────────────────────────────────────────────────
// BORDER RADIUS
// ─────────────────────────────────────────────────────────────────
export const BorderRadius = {
  none:   0,
  xs:     4,
  sm:     6,
  md:     8,
  lg:     12,
  xl:     16,
  '2xl':  20,
  '3xl':  24,
  full:   9999,
};

// ─────────────────────────────────────────────────────────────────
// SHADOWS (cross-platform soft shadows)
// ─────────────────────────────────────────────────────────────────
export const Shadows = {
  none: {},
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
};

// ─────────────────────────────────────────────────────────────────
// ANIMATION DURATIONS (ms)
// ─────────────────────────────────────────────────────────────────
export const Animation = {
  instant:  0,
  fast:     150,
  normal:   250,
  slow:     400,
  verySlow: 600,
  spring: {
    gentle:  { damping: 20, stiffness: 150, mass: 1 },
    default: { damping: 18, stiffness: 200, mass: 1 },
    bouncy:  { damping: 12, stiffness: 280, mass: 1 },
  },
};

export const IconSize = {
  xs:   12,
  sm:   16,
  md:   20,
  base: 24,
  lg:   28,
  xl:   32,
  '2xl':40,
  '3xl':48,
};

export const PaperTheme = {
  dark: false,
  colors: {
    primary:          Colors.orangePrimary,
    onPrimary:        Colors.white,
    primaryContainer: Colors.orangeLight,
    secondary:        Colors.orangeDark,
    onSecondary:      Colors.white,
    background:       Colors.portalBg,
    surface:          Colors.cardBg,
    onSurface:        Colors.textDark,
    surfaceVariant:   Colors.portalBg,
    outline:          Colors.inputBorder,
    error:            Colors.error,
    onError:          Colors.white,
  },
};

const Theme = {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Animation,
  IconSize,
  PaperTheme,
};

export default Theme;
