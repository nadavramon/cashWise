import React from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
} from "react-native";
import { TYPOGRAPHY_PRESETS, FONT_FAMILIES } from "../../config/typography";

type TypographyVariant = keyof typeof TYPOGRAPHY_PRESETS;

interface TypographyProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: string;
  children: React.ReactNode;
}

/**
 * Base Typography component that applies preset styles
 */
export function Typography({
  variant = "bodyMedium",
  color,
  style,
  children,
  ...props
}: TypographyProps) {
  const presetStyle = TYPOGRAPHY_PRESETS[variant];

  return (
    <RNText
      style={[presetStyle, color ? { color } : undefined, style]}
      {...props}
    >
      {children}
    </RNText>
  );
}

// ============================================
// Display Components - Fraunces (distinctive serif)
// ============================================

interface TextComponentProps extends Omit<RNTextProps, "children"> {
  color?: string;
  children: React.ReactNode;
}

/**
 * Large display text for hero sections and splash screens
 */
export function DisplayLarge({
  children,
  style,
  ...props
}: TextComponentProps) {
  return (
    <Typography variant="displayLarge" style={style} {...props}>
      {children}
    </Typography>
  );
}

/**
 * Medium display text for page titles
 */
export function DisplayMedium({
  children,
  style,
  ...props
}: TextComponentProps) {
  return (
    <Typography variant="displayMedium" style={style} {...props}>
      {children}
    </Typography>
  );
}

/**
 * Small display text for section headers
 */
export function DisplaySmall({
  children,
  style,
  ...props
}: TextComponentProps) {
  return (
    <Typography variant="displaySmall" style={style} {...props}>
      {children}
    </Typography>
  );
}

// ============================================
// Heading Components - Fraunces
// ============================================

export function H1({ children, style, ...props }: TextComponentProps) {
  return (
    <Typography variant="h1" style={style} {...props}>
      {children}
    </Typography>
  );
}

export function H2({ children, style, ...props }: TextComponentProps) {
  return (
    <Typography variant="h2" style={style} {...props}>
      {children}
    </Typography>
  );
}

export function H3({ children, style, ...props }: TextComponentProps) {
  return (
    <Typography variant="h3" style={style} {...props}>
      {children}
    </Typography>
  );
}

export function H4({ children, style, ...props }: TextComponentProps) {
  return (
    <Typography variant="h4" style={style} {...props}>
      {children}
    </Typography>
  );
}

// ============================================
// Body Components - Plus Jakarta Sans
// ============================================

/**
 * Large body text for emphasized content
 */
export function BodyLarge({ children, style, ...props }: TextComponentProps) {
  return (
    <Typography variant="bodyLarge" style={style} {...props}>
      {children}
    </Typography>
  );
}

/**
 * Standard body text for paragraphs
 */
export function Body({ children, style, ...props }: TextComponentProps) {
  return (
    <Typography variant="bodyMedium" style={style} {...props}>
      {children}
    </Typography>
  );
}

/**
 * Small body text for secondary content
 */
export function BodySmall({ children, style, ...props }: TextComponentProps) {
  return (
    <Typography variant="bodySmall" style={style} {...props}>
      {children}
    </Typography>
  );
}

// ============================================
// Label Components - Plus Jakarta Sans (semibold)
// ============================================

export function LabelLarge({ children, style, ...props }: TextComponentProps) {
  return (
    <Typography variant="labelLarge" style={style} {...props}>
      {children}
    </Typography>
  );
}

export function Label({ children, style, ...props }: TextComponentProps) {
  return (
    <Typography variant="labelMedium" style={style} {...props}>
      {children}
    </Typography>
  );
}

export function LabelSmall({ children, style, ...props }: TextComponentProps) {
  return (
    <Typography variant="labelSmall" style={style} {...props}>
      {children}
    </Typography>
  );
}

// ============================================
// Financial/Amount Components - Optimized for numbers
// ============================================

/**
 * Large amount display for hero financial figures
 */
export function AmountLarge({ children, style, ...props }: TextComponentProps) {
  return (
    <Typography variant="amountLarge" style={style} {...props}>
      {children}
    </Typography>
  );
}

/**
 * Medium amount for card totals
 */
export function AmountMedium({
  children,
  style,
  ...props
}: TextComponentProps) {
  return (
    <Typography variant="amountMedium" style={style} {...props}>
      {children}
    </Typography>
  );
}

/**
 * Small amount for list items
 */
export function AmountSmall({ children, style, ...props }: TextComponentProps) {
  return (
    <Typography variant="amountSmall" style={style} {...props}>
      {children}
    </Typography>
  );
}

// ============================================
// Caption & Supporting Components
// ============================================

/**
 * Caption text for image captions, timestamps, etc.
 */
export function Caption({ children, style, ...props }: TextComponentProps) {
  return (
    <Typography variant="caption" style={style} {...props}>
      {children}
    </Typography>
  );
}

/**
 * Overline text - small uppercase labels
 */
export function Overline({ children, style, ...props }: TextComponentProps) {
  return (
    <Typography variant="overline" style={style} {...props}>
      {children}
    </Typography>
  );
}

// ============================================
// Button Text Components
// ============================================

export function ButtonText({ children, style, ...props }: TextComponentProps) {
  return (
    <Typography variant="buttonMedium" style={style} {...props}>
      {children}
    </Typography>
  );
}

export function ButtonTextLarge({
  children,
  style,
  ...props
}: TextComponentProps) {
  return (
    <Typography variant="buttonLarge" style={style} {...props}>
      {children}
    </Typography>
  );
}

export function ButtonTextSmall({
  children,
  style,
  ...props
}: TextComponentProps) {
  return (
    <Typography variant="buttonSmall" style={style} {...props}>
      {children}
    </Typography>
  );
}

// ============================================
// Navigation Components
// ============================================

export function NavLabel({ children, style, ...props }: TextComponentProps) {
  return (
    <Typography variant="navLabel" style={style} {...props}>
      {children}
    </Typography>
  );
}

// ============================================
// Utility: Raw styled text with just font family
// ============================================

const rawStyles = StyleSheet.create({
  displayRegular: { fontFamily: FONT_FAMILIES.display.regular },
  displayBold: { fontFamily: FONT_FAMILIES.display.bold },
  displaySemibold: { fontFamily: FONT_FAMILIES.display.semibold },
  bodyRegular: { fontFamily: FONT_FAMILIES.body.regular },
  bodyMedium: { fontFamily: FONT_FAMILIES.body.medium },
  bodySemibold: { fontFamily: FONT_FAMILIES.body.semibold },
  bodyBold: { fontFamily: FONT_FAMILIES.body.bold },
});

/**
 * Raw text components for when you need just the font family
 * without the full preset (for custom sizing via NativeWind classes)
 */
export function DisplayText({ children, style, ...props }: TextComponentProps) {
  return (
    <RNText style={[rawStyles.displayRegular, style]} {...props}>
      {children}
    </RNText>
  );
}

export function BodyText({ children, style, ...props }: TextComponentProps) {
  return (
    <RNText style={[rawStyles.bodyRegular, style]} {...props}>
      {children}
    </RNText>
  );
}
