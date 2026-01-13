import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../hooks/useTheme";

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * Full-screen gradient background that adapts to light/dark mode
 *
 * Light mode: Bold blue → warm gold (confident, trustworthy)
 * Dark mode: Electric teal → deep purple (modern, premium)
 */
export default function GradientBackground({
  children,
  style,
}: GradientBackgroundProps) {
  const { colors, isDark } = useTheme();

  return (
    <LinearGradient
      colors={colors.gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, style]}
    >
      {/* StatusBar: 'light' = white icons (for dark backgrounds) */}
      <StatusBar style={isDark ? "light" : "light"} />
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
