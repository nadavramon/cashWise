import React from "react";
import {
  View,
  ViewStyle,
  StyleProp,
  StyleSheet,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../../hooks/useTheme";
import { GLASS, RADIUS, SHADOWS, type GlassPreset } from "../../../config/visuals";

// ============================================
// Glass Card - Frosted glass effect card
// ============================================

interface GlassCardProps {
  children: React.ReactNode;
  /** Glass preset style */
  preset?: GlassPreset;
  /** Blur intensity (10-100) */
  blurIntensity?: number;
  /** Border radius */
  borderRadius?: number;
  /** Add decorative border highlight */
  withBorder?: boolean;
  /** Add subtle inner glow */
  withGlow?: boolean;
  /** Padding inside the card */
  padding?: number;
  /** Container style */
  style?: StyleProp<ViewStyle>;
}

/**
 * A frosted glass card with blur effect
 * Automatically adapts to light/dark mode
 *
 * @example
 * <GlassCard preset="regular" withBorder>
 *   <Text>Content on glass</Text>
 * </GlassCard>
 */
export function GlassCard({
  children,
  preset,
  blurIntensity = 40,
  borderRadius = RADIUS["3xl"],
  withBorder = true,
  withGlow = false,
  padding = 16,
  style,
}: GlassCardProps) {
  const { isDark } = useTheme();

  // Determine glass config
  const defaultPreset = isDark ? "dark" : "regular";
  const glassConfig = GLASS[preset || defaultPreset];

  // Use BlurView on iOS for true blur, fallback on Android
  const useNativeBlur = Platform.OS === "ios";

  const containerStyle: ViewStyle = {
    borderRadius,
    overflow: "hidden",
    ...(withGlow && (isDark ? SHADOWS.glowTeal : SHADOWS.glow)),
  };

  const innerStyle: ViewStyle = {
    padding,
    borderRadius,
    borderWidth: withBorder ? glassConfig.borderWidth : 0,
    borderColor: withBorder ? glassConfig.borderColor : "transparent",
  };

  if (useNativeBlur) {
    return (
      <View style={[containerStyle, style]}>
        <BlurView
          intensity={blurIntensity}
          tint={isDark ? "dark" : "light"}
          style={[styles.blur, innerStyle]}
        >
          {/* Overlay for additional tinting */}
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: glassConfig.backgroundColor },
            ]}
          />
          <View style={styles.content}>{children}</View>
        </BlurView>
      </View>
    );
  }

  // Android fallback - no blur, just transparency
  return (
    <View
      style={[
        containerStyle,
        innerStyle,
        { backgroundColor: glassConfig.backgroundColor },
        style,
      ]}
    >
      {children}
    </View>
  );
}

// ============================================
// Gradient Glass Card - Glass with gradient tint
// ============================================

interface GradientGlassCardProps {
  children: React.ReactNode;
  /** Gradient colors */
  colors?: readonly [string, string, ...string[]];
  /** Gradient opacity */
  gradientOpacity?: number;
  /** Blur intensity */
  blurIntensity?: number;
  /** Border radius */
  borderRadius?: number;
  /** Padding */
  padding?: number;
  /** Container style */
  style?: StyleProp<ViewStyle>;
}

/**
 * Glass card with a gradient tint overlay
 */
export function GradientGlassCard({
  children,
  colors,
  gradientOpacity = 0.2,
  blurIntensity = 40,
  borderRadius = RADIUS["3xl"],
  padding = 16,
  style,
}: GradientGlassCardProps) {
  const { isDark, colors: themeColors } = useTheme();

  const defaultColors = isDark
    ? (["rgba(2, 195, 189, 0.3)", "rgba(78, 20, 140, 0.2)"] as const)
    : (["rgba(0, 124, 190, 0.2)", "rgba(255, 208, 0, 0.15)"] as const);

  const gradientColors = colors || defaultColors;
  const useNativeBlur = Platform.OS === "ios";

  return (
    <View style={[{ borderRadius, overflow: "hidden" }, style]}>
      {useNativeBlur ? (
        <BlurView
          intensity={blurIntensity}
          tint={isDark ? "dark" : "light"}
          style={[styles.blur, { borderRadius }]}
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, { opacity: gradientOpacity }]}
          />
          <View style={[styles.content, { padding }]}>{children}</View>
        </BlurView>
      ) : (
        <View
          style={{
            backgroundColor: isDark
              ? "rgba(30, 30, 30, 0.7)"
              : "rgba(255, 255, 255, 0.7)",
            borderRadius,
          }}
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, { opacity: gradientOpacity }]}
          />
          <View style={{ padding }}>{children}</View>
        </View>
      )}
    </View>
  );
}

// ============================================
// Neumorphic Card - Soft 3D pressed effect
// ============================================

interface NeumorphicCardProps {
  children: React.ReactNode;
  /** Whether the card appears pressed/inset */
  pressed?: boolean;
  /** Border radius */
  borderRadius?: number;
  /** Padding */
  padding?: number;
  /** Container style */
  style?: StyleProp<ViewStyle>;
}

/**
 * Neumorphic (soft UI) card with 3D depth effect
 */
export function NeumorphicCard({
  children,
  pressed = false,
  borderRadius = RADIUS["3xl"],
  padding = 20,
  style,
}: NeumorphicCardProps) {
  const { isDark } = useTheme();

  const baseColor = isDark ? "#1a1a1a" : "#e8e8e8";
  const lightShadow = isDark ? "#2a2a2a" : "#ffffff";
  const darkShadow = isDark ? "#0a0a0a" : "#c8c8c8";

  const outerStyle: ViewStyle = pressed
    ? {
        backgroundColor: baseColor,
        borderRadius,
        // Inner shadow simulation
        borderWidth: 1,
        borderColor: darkShadow,
      }
    : {
        backgroundColor: baseColor,
        borderRadius,
        // Outer shadows for raised effect
        shadowColor: darkShadow,
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 8,
      };

  // Secondary shadow layer for neumorphic effect
  const secondaryShadowStyle: ViewStyle = pressed
    ? {}
    : {
        shadowColor: lightShadow,
        shadowOffset: { width: -6, height: -6 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
      };

  return (
    <View style={[outerStyle, secondaryShadowStyle, { padding }, style]}>
      {children}
    </View>
  );
}

// ============================================
// Elevated Card - Simple elevated card
// ============================================

interface ElevatedCardProps {
  children: React.ReactNode;
  /** Elevation level */
  elevation?: "sm" | "md" | "lg" | "xl" | "2xl";
  /** Border radius */
  borderRadius?: number;
  /** Background color */
  backgroundColor?: string;
  /** Padding */
  padding?: number;
  /** Container style */
  style?: StyleProp<ViewStyle>;
}

/**
 * Simple elevated card with configurable shadow
 */
export function ElevatedCard({
  children,
  elevation = "md",
  borderRadius = RADIUS["3xl"],
  backgroundColor,
  padding = 16,
  style,
}: ElevatedCardProps) {
  const { isDark, colors } = useTheme();
  const bgColor = backgroundColor || (isDark ? colors.surface : colors.surface);
  const shadow = SHADOWS[elevation];

  return (
    <View
      style={[
        {
          backgroundColor: bgColor,
          borderRadius,
          padding,
          ...shadow,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  blur: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
