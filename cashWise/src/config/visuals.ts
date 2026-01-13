import { Platform, ViewStyle } from "react-native";

/**
 * CashWise Visual Effects System
 *
 * Design Philosophy:
 * - CREATE ATMOSPHERE: Depth and texture over flat solid colors
 * - LAYER WITH PURPOSE: Transparencies and overlays for visual hierarchy
 * - DRAMATIC SHADOWS: Bold shadows that anchor elements, not timid ones
 * - SUBTLE TEXTURE: Noise and grain add premium, tactile feel
 */

// ============================================
// Shadow Presets - Dramatic, purposeful shadows
// ============================================

/**
 * Shadow presets for different elevation levels
 * Each shadow is tuned for visual impact, not subtlety
 */
export const SHADOWS = {
  /** No shadow - flat elements */
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  /** Subtle lift - for hover states, minor cards */
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  /** Standard card shadow - most UI cards */
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },

  /** Elevated elements - modals, dropdowns */
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },

  /** Dramatic lift - hero cards, floating actions */
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },

  /** Maximum drama - splash elements, feature highlights */
  "2xl": {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 16,
  },

  /** Colored shadow - primary brand color glow */
  glow: {
    shadowColor: "#007CBE",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },

  /** Teal glow - dark mode accent */
  glowTeal: {
    shadowColor: "#02C3BD",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },

  /** Success glow - positive actions */
  glowSuccess: {
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },

  /** Error glow - destructive actions */
  glowError: {
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },

  /** Inner shadow simulation (using negative margins) */
  inner: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 0, // Inner shadows don't use elevation
  },
} as const;

// ============================================
// Blur Presets
// ============================================

export const BLUR = {
  /** Light blur - subtle background softening */
  light: {
    intensity: 20,
    tint: "light" as const,
  },

  /** Regular blur - standard glass effect */
  regular: {
    intensity: 50,
    tint: "default" as const,
  },

  /** Heavy blur - strong frosted glass */
  heavy: {
    intensity: 80,
    tint: "dark" as const,
  },

  /** Chromatic blur - premium glass with color shift */
  chromatic: {
    intensity: 60,
    tint: "chromatic" as const,
  },
} as const;

// ============================================
// Glass Morphism Presets
// ============================================

export const GLASS = {
  /** Light glass - subtle frosted effect */
  light: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    backdropBlur: 20,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 1,
  },

  /** Regular glass - balanced transparency */
  regular: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    backdropBlur: 40,
    borderColor: "rgba(255, 255, 255, 0.25)",
    borderWidth: 1,
  },

  /** Dark glass - for dark mode */
  dark: {
    backgroundColor: "rgba(30, 30, 30, 0.6)",
    backdropBlur: 40,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
  },

  /** Premium dark - richer dark mode glass */
  premiumDark: {
    backgroundColor: "rgba(20, 20, 20, 0.75)",
    backdropBlur: 60,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
  },

  /** Frosted - heavy frosted glass */
  frosted: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    backdropBlur: 80,
    borderColor: "rgba(255, 255, 255, 0.4)",
    borderWidth: 1.5,
  },

  /** Tinted blue - brand-colored glass */
  tintedBlue: {
    backgroundColor: "rgba(0, 124, 190, 0.15)",
    backdropBlur: 40,
    borderColor: "rgba(0, 124, 190, 0.2)",
    borderWidth: 1,
  },

  /** Tinted teal - dark mode brand glass */
  tintedTeal: {
    backgroundColor: "rgba(2, 195, 189, 0.15)",
    backdropBlur: 40,
    borderColor: "rgba(2, 195, 189, 0.2)",
    borderWidth: 1,
  },
} as const;

// ============================================
// Gradient Presets
// ============================================

export const GRADIENTS = {
  /** Primary brand gradient - Light mode */
  primary: {
    colors: ["#007CBE", "#339FD7", "#66B7E1"] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  /** Primary brand gradient - Dark mode */
  primaryDark: {
    colors: ["#02C3BD", "#33D7D1", "#66E1DC"] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  /** Accent gradient - warm gold tones */
  accent: {
    colors: ["#FFD000", "#FFE033", "#FFED70"] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  /** Accent gradient - purple for dark mode */
  accentDark: {
    colors: ["#4E148C", "#8747BF", "#A575CF"] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  /** Sunset - warm, inviting */
  sunset: {
    colors: ["#FF6B6B", "#FFA07A", "#FFD93D"] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  /** Ocean - cool, calm */
  ocean: {
    colors: ["#667EEA", "#64B5F6", "#4DD0E1"] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  /** Aurora - mystical, premium */
  aurora: {
    colors: ["#02C3BD", "#4E148C", "#007CBE"] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  /** Mesh-style radial - for background atmosphere */
  meshLight: {
    colors: [
      "rgba(0, 124, 190, 0.3)",
      "rgba(255, 208, 0, 0.2)",
      "transparent",
    ] as const,
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },

  /** Mesh-style dark - dark mode atmosphere */
  meshDark: {
    colors: [
      "rgba(2, 195, 189, 0.3)",
      "rgba(78, 20, 140, 0.2)",
      "transparent",
    ] as const,
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },

  /** Surface gradient - subtle surface variation */
  surface: {
    colors: ["rgba(255,255,255,0.05)", "transparent"] as const,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },

  /** Success gradient */
  success: {
    colors: ["#10B981", "#34D399"] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  /** Error gradient */
  error: {
    colors: ["#EF4444", "#F87171"] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
} as const;

// ============================================
// Border Radius Presets
// ============================================

export const RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 20,
  "3xl": 24,
  "4xl": 32,
  "5xl": 40,
  full: 9999,
} as const;

// ============================================
// Opacity Presets
// ============================================

export const OPACITY = {
  0: 0,
  5: 0.05,
  10: 0.1,
  15: 0.15,
  20: 0.2,
  25: 0.25,
  30: 0.3,
  40: 0.4,
  50: 0.5,
  60: 0.6,
  70: 0.7,
  75: 0.75,
  80: 0.8,
  90: 0.9,
  95: 0.95,
  100: 1,
} as const;

// ============================================
// Noise/Grain Presets
// ============================================

export const NOISE = {
  /** Subtle grain - barely perceptible texture */
  subtle: {
    opacity: 0.03,
    frequency: 0.8,
  },

  /** Light grain - gentle texture */
  light: {
    opacity: 0.05,
    frequency: 0.7,
  },

  /** Medium grain - visible but not distracting */
  medium: {
    opacity: 0.08,
    frequency: 0.6,
  },

  /** Heavy grain - film-like texture */
  heavy: {
    opacity: 0.12,
    frequency: 0.5,
  },

  /** Dramatic grain - bold, stylized */
  dramatic: {
    opacity: 0.18,
    frequency: 0.4,
  },
} as const;

// ============================================
// Card Style Presets
// ============================================

export const CARD_STYLES = {
  /** Flat card - no elevation, minimal styling */
  flat: {
    borderRadius: RADIUS["2xl"],
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    ...SHADOWS.none,
  } as ViewStyle,

  /** Subtle card - light elevation */
  subtle: {
    borderRadius: RADIUS["2xl"],
    backgroundColor: "#FFFFFF",
    ...SHADOWS.sm,
  } as ViewStyle,

  /** Elevated card - standard card with shadow */
  elevated: {
    borderRadius: RADIUS["3xl"],
    backgroundColor: "#FFFFFF",
    ...SHADOWS.md,
  } as ViewStyle,

  /** Floating card - prominent shadow */
  floating: {
    borderRadius: RADIUS["3xl"],
    backgroundColor: "#FFFFFF",
    ...SHADOWS.lg,
  } as ViewStyle,

  /** Hero card - maximum presence */
  hero: {
    borderRadius: RADIUS["4xl"],
    backgroundColor: "#FFFFFF",
    ...SHADOWS.xl,
  } as ViewStyle,

  /** Glass card - frosted glass effect */
  glass: {
    borderRadius: RADIUS["3xl"],
    backgroundColor: GLASS.regular.backgroundColor,
    borderWidth: GLASS.regular.borderWidth,
    borderColor: GLASS.regular.borderColor,
    overflow: "hidden" as const,
  } as ViewStyle,

  /** Glass card dark - dark mode glass */
  glassDark: {
    borderRadius: RADIUS["3xl"],
    backgroundColor: GLASS.dark.backgroundColor,
    borderWidth: GLASS.dark.borderWidth,
    borderColor: GLASS.dark.borderColor,
    overflow: "hidden" as const,
  } as ViewStyle,
} as const;

// ============================================
// Utility Functions
// ============================================

/**
 * Get shadow style for current platform
 * Android uses elevation, iOS uses shadow properties
 */
export function getShadow(preset: keyof typeof SHADOWS): ViewStyle {
  const shadow = SHADOWS[preset];
  if (Platform.OS === "android") {
    return { elevation: shadow.elevation };
  }
  return shadow;
}

/**
 * Create a custom colored glow shadow
 */
export function createGlow(
  color: string,
  intensity: "subtle" | "medium" | "strong" = "medium"
): ViewStyle {
  const config = {
    subtle: { opacity: 0.2, radius: 12 },
    medium: { opacity: 0.35, radius: 20 },
    strong: { opacity: 0.5, radius: 28 },
  };

  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: config[intensity].opacity,
    shadowRadius: config[intensity].radius,
    elevation: 8,
  };
}

/**
 * Create glass morphism style
 */
export function createGlass(
  isDark: boolean,
  opacity: number = 0.5
): ViewStyle {
  return {
    backgroundColor: isDark
      ? `rgba(30, 30, 30, ${opacity})`
      : `rgba(255, 255, 255, ${opacity})`,
    borderWidth: 1,
    borderColor: isDark
      ? `rgba(255, 255, 255, ${opacity * 0.2})`
      : `rgba(255, 255, 255, ${opacity * 0.6})`,
    borderRadius: RADIUS["3xl"],
    overflow: "hidden",
  };
}

// ============================================
// Type Exports
// ============================================

export type ShadowPreset = keyof typeof SHADOWS;
export type BlurPreset = keyof typeof BLUR;
export type GlassPreset = keyof typeof GLASS;
export type GradientPreset = keyof typeof GRADIENTS;
export type RadiusPreset = keyof typeof RADIUS;
export type NoisePreset = keyof typeof NOISE;
export type CardStylePreset = keyof typeof CARD_STYLES;
