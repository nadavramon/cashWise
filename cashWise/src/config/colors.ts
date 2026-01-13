/**
 * CashWise Color System
 *
 * Design Philosophy:
 * - DOMINANT colors that command attention, not timid pastels
 * - SHARP accents that create visual hierarchy and guide the eye
 * - BOLD contrasts between surfaces for depth and clarity
 * - INTENTIONAL color choices - every color earns its place
 *
 * Color Architecture:
 * - Primary: The dominant brand color (70% of colored UI)
 * - Accent: Sharp, vibrant color for CTAs and highlights (20%)
 * - Semantic: Success, warning, error states (10%)
 */

// ============================================
// Core Brand Palette
// ============================================

/**
 * Primary Blue Scale - Deep, confident, trustworthy
 * Used for: Headers, navigation, primary actions
 */
const BLUE = {
  50: "#E6F3FA",
  100: "#CCE7F5",
  200: "#99CFEB",
  300: "#66B7E1",
  400: "#339FD7",
  500: "#007CBE", // Primary - dominant brand blue
  600: "#006398",
  700: "#004A72",
  800: "#00324C",
  900: "#001926",
} as const;

/**
 * Teal Scale - Electric, modern, fresh
 * Used for: Dark mode primary, success states, positive values
 */
const TEAL = {
  50: "#E6FAF9",
  100: "#CCF5F3",
  200: "#99EBE8",
  300: "#66E1DC",
  400: "#33D7D1",
  500: "#02C3BD", // Primary for dark mode
  600: "#029C97",
  700: "#017571",
  800: "#014E4C",
  900: "#002726",
} as const;

/**
 * Purple Scale - Bold, premium, distinctive
 * Used for: Accent in dark mode, special features, pro badges
 */
const PURPLE = {
  50: "#F0E8F7",
  100: "#E1D1EF",
  200: "#C3A3DF",
  300: "#A575CF",
  400: "#8747BF",
  500: "#4E148C", // Accent - sharp and intentional
  600: "#3E1070",
  700: "#2F0C54",
  800: "#1F0838",
  900: "#10041C",
} as const;

/**
 * Gold/Amber Scale - Warm accent for highlights
 * Used for: Premium features, achievements, income
 */
const GOLD = {
  50: "#FFFBEB",
  100: "#FFF7AE", // Light mode secondary
  200: "#FFED70",
  300: "#FFE033",
  400: "#FFD000",
  500: "#E6B800",
  600: "#CC9F00",
  700: "#997700",
  800: "#665000",
  900: "#332800",
} as const;

// ============================================
// Semantic Colors
// ============================================

const SEMANTIC = {
  success: {
    light: "#10B981", // Emerald - for positive amounts, confirmations
    dark: "#34D399",
    muted: "#D1FAE5",
  },
  warning: {
    light: "#F59E0B", // Amber - for budget alerts
    dark: "#FBBF24",
    muted: "#FEF3C7",
  },
  error: {
    light: "#EF4444", // Red - for expenses, errors, deletions
    dark: "#F87171",
    muted: "#FEE2E2",
  },
  info: {
    light: "#3B82F6", // Blue - for tips, info states
    dark: "#60A5FA",
    muted: "#DBEAFE",
  },
} as const;

// ============================================
// Neutral Scale - Carefully crafted grays
// ============================================

/**
 * Neutral grays with subtle warm undertone
 * Avoids the cold, sterile feel of pure grays
 */
const NEUTRAL = {
  0: "#FFFFFF",
  50: "#FAFAFA",
  100: "#F5F5F4",
  200: "#E7E5E4",
  300: "#D6D3D1",
  400: "#A8A29E",
  500: "#78716C",
  600: "#57534E",
  700: "#44403C",
  800: "#292524",
  900: "#1C1917",
  950: "#0C0A09",
  1000: "#000000",
} as const;

// ============================================
// Theme Configuration
// ============================================

export const COLORS = {
  // Raw palette access
  palette: {
    blue: BLUE,
    teal: TEAL,
    purple: PURPLE,
    gold: GOLD,
    neutral: NEUTRAL,
  },

  // Semantic colors
  semantic: SEMANTIC,

  /**
   * Light Theme - Bold blue dominance with gold accents
   *
   * Visual hierarchy:
   * - Deep blue commands attention in headers/nav
   * - Clean white surfaces for content clarity
   * - Gold accents punctuate key actions
   */
  light: {
    // Brand
    primary: BLUE[500],
    primaryHover: BLUE[600],
    primaryPressed: BLUE[700],
    primaryMuted: BLUE[100],

    accent: GOLD[400],
    accentHover: GOLD[500],
    accentMuted: GOLD[100],

    // Surfaces - clean hierarchy
    background: NEUTRAL[100],
    surface: NEUTRAL[0],
    surfaceElevated: NEUTRAL[0],
    surfacePressed: NEUTRAL[200],

    // Text - sharp contrast
    textPrimary: NEUTRAL[900],
    textSecondary: NEUTRAL[600],
    textTertiary: NEUTRAL[500],
    textDisabled: NEUTRAL[400],
    textOnPrimary: NEUTRAL[0],
    textOnAccent: NEUTRAL[900],

    // Borders
    border: NEUTRAL[200],
    borderFocused: BLUE[500],
    divider: NEUTRAL[200],

    // Semantic
    success: SEMANTIC.success.light,
    successMuted: SEMANTIC.success.muted,
    warning: SEMANTIC.warning.light,
    warningMuted: SEMANTIC.warning.muted,
    error: SEMANTIC.error.light,
    errorMuted: SEMANTIC.error.muted,
    info: SEMANTIC.info.light,
    infoMuted: SEMANTIC.info.muted,

    // Financial specific
    income: SEMANTIC.success.light,
    expense: SEMANTIC.error.light,
    neutral: NEUTRAL[500],

    // Gradients
    gradientStart: BLUE[500],
    gradientEnd: GOLD[100],
    gradientColors: [BLUE[500], GOLD[100]] as const,

    // Shadows (for elevated surfaces)
    shadow: "rgba(0, 0, 0, 0.08)",
    shadowStrong: "rgba(0, 0, 0, 0.16)",
  },

  /**
   * Dark Theme - Rich black with electric teal dominance
   *
   * Visual hierarchy:
   * - True black background for OLED screens
   * - Vibrant teal creates energy and modernity
   * - Purple accents add premium feel
   */
  dark: {
    // Brand
    primary: TEAL[500],
    primaryHover: TEAL[400],
    primaryPressed: TEAL[600],
    primaryMuted: TEAL[900],

    accent: PURPLE[500],
    accentHover: PURPLE[400],
    accentMuted: PURPLE[900],

    // Surfaces - true black with subtle elevation
    background: NEUTRAL[1000],
    surface: NEUTRAL[900],
    surfaceElevated: NEUTRAL[800],
    surfacePressed: NEUTRAL[700],

    // Text - crisp white hierarchy
    textPrimary: NEUTRAL[50],
    textSecondary: NEUTRAL[400],
    textTertiary: NEUTRAL[500],
    textDisabled: NEUTRAL[600],
    textOnPrimary: NEUTRAL[900],
    textOnAccent: NEUTRAL[0],

    // Borders
    border: NEUTRAL[800],
    borderFocused: TEAL[500],
    divider: NEUTRAL[800],

    // Semantic
    success: SEMANTIC.success.dark,
    successMuted: "rgba(16, 185, 129, 0.15)",
    warning: SEMANTIC.warning.dark,
    warningMuted: "rgba(245, 158, 11, 0.15)",
    error: SEMANTIC.error.dark,
    errorMuted: "rgba(239, 68, 68, 0.15)",
    info: SEMANTIC.info.dark,
    infoMuted: "rgba(59, 130, 246, 0.15)",

    // Financial specific
    income: SEMANTIC.success.dark,
    expense: SEMANTIC.error.dark,
    neutral: NEUTRAL[500],

    // Gradients
    gradientStart: TEAL[500],
    gradientEnd: PURPLE[500],
    gradientColors: [TEAL[500], PURPLE[500]] as const,

    // Shadows (glows in dark mode)
    shadow: "rgba(0, 0, 0, 0.4)",
    shadowStrong: "rgba(0, 0, 0, 0.6)",
  },
} as const;

// ============================================
// Type Exports
// ============================================

export type ColorScheme = "light" | "dark";
export type SemanticColor = keyof typeof SEMANTIC;

/** Theme color interface - shared structure for light and dark modes */
export interface ThemeColors {
  // Brand
  primary: string;
  primaryHover: string;
  primaryPressed: string;
  primaryMuted: string;
  accent: string;
  accentHover: string;
  accentMuted: string;

  // Surfaces
  background: string;
  surface: string;
  surfaceElevated: string;
  surfacePressed: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textDisabled: string;
  textOnPrimary: string;
  textOnAccent: string;

  // Borders
  border: string;
  borderFocused: string;
  divider: string;

  // Semantic
  success: string;
  successMuted: string;
  warning: string;
  warningMuted: string;
  error: string;
  errorMuted: string;
  info: string;
  infoMuted: string;

  // Financial
  income: string;
  expense: string;
  neutral: string;

  // Gradients
  gradientStart: string;
  gradientEnd: string;
  gradientColors: readonly [string, string];

  // Shadows
  shadow: string;
  shadowStrong: string;
}

// Helper to get color by scheme
export function getColors(scheme: ColorScheme): ThemeColors {
  return COLORS[scheme];
}

// ============================================
// Legacy Compatibility (for gradual migration)
// ============================================

export const CASHWISE_COLORS = {
  light: {
    primary: COLORS.light.primary,
    secondary: GOLD[100],
    gradient: COLORS.light.gradientColors,
    text: COLORS.light.textOnPrimary,
    background: COLORS.light.background,
    card: COLORS.light.surface,
  },
  dark: {
    primary: COLORS.dark.primary,
    secondary: PURPLE[500],
    gradient: COLORS.dark.gradientColors,
    text: COLORS.dark.textPrimary,
    background: COLORS.dark.background,
    card: COLORS.dark.surface,
  },
} as const;
