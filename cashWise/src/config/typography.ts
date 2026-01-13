/**
 * Typography Configuration
 *
 * Font pairing strategy:
 * - Display: Fraunces - A distinctive, elegant variable serif with optical sizing
 *   and quirky character. Perfect for headlines that need to make a statement.
 * - Body: Plus Jakarta Sans - A refined geometric sans-serif with excellent
 *   legibility and a modern, professional feel. Great for financial data.
 */

// Font family constants for use throughout the app
export const FONT_FAMILIES = {
  // Display font - Fraunces (serif with character)
  display: {
    light: "Fraunces_300Light",
    regular: "Fraunces_400Regular",
    medium: "Fraunces_500Medium",
    semibold: "Fraunces_600SemiBold",
    bold: "Fraunces_700Bold",
    black: "Fraunces_900Black",
    // Italic variants
    lightItalic: "Fraunces_300Light_Italic",
    italic: "Fraunces_400Regular_Italic",
    mediumItalic: "Fraunces_500Medium_Italic",
    semiboldItalic: "Fraunces_600SemiBold_Italic",
    boldItalic: "Fraunces_700Bold_Italic",
  },
  // Body font - Plus Jakarta Sans (refined sans-serif)
  body: {
    extralight: "PlusJakartaSans_200ExtraLight",
    light: "PlusJakartaSans_300Light",
    regular: "PlusJakartaSans_400Regular",
    medium: "PlusJakartaSans_500Medium",
    semibold: "PlusJakartaSans_600SemiBold",
    bold: "PlusJakartaSans_700Bold",
    extrabold: "PlusJakartaSans_800ExtraBold",
    // Italic variants
    extralightItalic: "PlusJakartaSans_200ExtraLight_Italic",
    lightItalic: "PlusJakartaSans_300Light_Italic",
    italic: "PlusJakartaSans_400Regular_Italic",
    mediumItalic: "PlusJakartaSans_500Medium_Italic",
    semiboldItalic: "PlusJakartaSans_600SemiBold_Italic",
    boldItalic: "PlusJakartaSans_700Bold_Italic",
    extraboldItalic: "PlusJakartaSans_800ExtraBold_Italic",
  },
} as const;

// Type scale following a modular scale (1.25 ratio)
export const FONT_SIZES = {
  "2xs": 10,
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 48,
  "6xl": 60,
} as const;

// Line heights optimized for readability
export const LINE_HEIGHTS = {
  none: 1,
  tight: 1.2,
  snug: 1.35,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

// Letter spacing for fine-tuning
export const LETTER_SPACING = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.5,
  wider: 1,
  widest: 2,
} as const;

/**
 * Typography presets for common use cases
 * Each preset defines a complete text style including font, size, weight, and spacing
 */
export const TYPOGRAPHY_PRESETS = {
  // Display styles - Use Fraunces for impact
  displayLarge: {
    fontFamily: FONT_FAMILIES.display.bold,
    fontSize: FONT_SIZES["5xl"],
    lineHeight: LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACING.tight,
  },
  displayMedium: {
    fontFamily: FONT_FAMILIES.display.bold,
    fontSize: FONT_SIZES["4xl"],
    lineHeight: LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACING.tight,
  },
  displaySmall: {
    fontFamily: FONT_FAMILIES.display.semibold,
    fontSize: FONT_SIZES["3xl"],
    lineHeight: LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACING.normal,
  },

  // Heading styles - Fraunces for headlines
  h1: {
    fontFamily: FONT_FAMILIES.display.bold,
    fontSize: FONT_SIZES["3xl"],
    lineHeight: LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACING.tight,
  },
  h2: {
    fontFamily: FONT_FAMILIES.display.semibold,
    fontSize: FONT_SIZES["2xl"],
    lineHeight: LINE_HEIGHTS.snug,
    letterSpacing: LETTER_SPACING.normal,
  },
  h3: {
    fontFamily: FONT_FAMILIES.display.semibold,
    fontSize: FONT_SIZES.xl,
    lineHeight: LINE_HEIGHTS.snug,
    letterSpacing: LETTER_SPACING.normal,
  },
  h4: {
    fontFamily: FONT_FAMILIES.display.medium,
    fontSize: FONT_SIZES.lg,
    lineHeight: LINE_HEIGHTS.snug,
    letterSpacing: LETTER_SPACING.normal,
  },

  // Body styles - Plus Jakarta Sans for readability
  bodyLarge: {
    fontFamily: FONT_FAMILIES.body.regular,
    fontSize: FONT_SIZES.lg,
    lineHeight: LINE_HEIGHTS.relaxed,
    letterSpacing: LETTER_SPACING.normal,
  },
  bodyMedium: {
    fontFamily: FONT_FAMILIES.body.regular,
    fontSize: FONT_SIZES.base,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.normal,
  },
  bodySmall: {
    fontFamily: FONT_FAMILIES.body.regular,
    fontSize: FONT_SIZES.sm,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.normal,
  },

  // Label styles - Plus Jakarta Sans with more weight
  labelLarge: {
    fontFamily: FONT_FAMILIES.body.semibold,
    fontSize: FONT_SIZES.base,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.wide,
  },
  labelMedium: {
    fontFamily: FONT_FAMILIES.body.semibold,
    fontSize: FONT_SIZES.sm,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.wide,
  },
  labelSmall: {
    fontFamily: FONT_FAMILIES.body.medium,
    fontSize: FONT_SIZES.xs,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.wider,
  },

  // Financial/Data styles - Optimized for numbers
  amountLarge: {
    fontFamily: FONT_FAMILIES.body.bold,
    fontSize: FONT_SIZES["4xl"],
    lineHeight: LINE_HEIGHTS.none,
    letterSpacing: LETTER_SPACING.tight,
  },
  amountMedium: {
    fontFamily: FONT_FAMILIES.body.bold,
    fontSize: FONT_SIZES["2xl"],
    lineHeight: LINE_HEIGHTS.none,
    letterSpacing: LETTER_SPACING.tight,
  },
  amountSmall: {
    fontFamily: FONT_FAMILIES.body.semibold,
    fontSize: FONT_SIZES.lg,
    lineHeight: LINE_HEIGHTS.none,
    letterSpacing: LETTER_SPACING.normal,
  },

  // Caption/Supporting styles
  caption: {
    fontFamily: FONT_FAMILIES.body.regular,
    fontSize: FONT_SIZES.xs,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.wide,
  },
  overline: {
    fontFamily: FONT_FAMILIES.body.semibold,
    fontSize: FONT_SIZES["2xs"],
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.widest,
    textTransform: "uppercase" as const,
  },

  // Button styles
  buttonLarge: {
    fontFamily: FONT_FAMILIES.body.bold,
    fontSize: FONT_SIZES.base,
    lineHeight: LINE_HEIGHTS.none,
    letterSpacing: LETTER_SPACING.wide,
  },
  buttonMedium: {
    fontFamily: FONT_FAMILIES.body.semibold,
    fontSize: FONT_SIZES.sm,
    lineHeight: LINE_HEIGHTS.none,
    letterSpacing: LETTER_SPACING.wide,
  },
  buttonSmall: {
    fontFamily: FONT_FAMILIES.body.semibold,
    fontSize: FONT_SIZES.xs,
    lineHeight: LINE_HEIGHTS.none,
    letterSpacing: LETTER_SPACING.wide,
  },

  // Navigation styles
  navLabel: {
    fontFamily: FONT_FAMILIES.body.semibold,
    fontSize: FONT_SIZES["2xs"],
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.wide,
  },
} as const;

// Export types for TypeScript
export type FontFamily = keyof typeof FONT_FAMILIES;
export type FontSize = keyof typeof FONT_SIZES;
export type LineHeight = keyof typeof LINE_HEIGHTS;
export type LetterSpacing = keyof typeof LETTER_SPACING;
export type TypographyPreset = keyof typeof TYPOGRAPHY_PRESETS;
