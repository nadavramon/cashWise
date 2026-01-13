import React from "react";
import { StyleSheet, useColorScheme, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { CASHWISE_COLORS } from "../../config/themes";

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function GradientBackground({
  children,
  style,
}: GradientBackgroundProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Select the correct gradient based on theme
  const colors = isDark
    ? CASHWISE_COLORS.dark.gradient
    : CASHWISE_COLORS.light.gradient;

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }} // Top Left
      end={{ x: 1, y: 1 }} // Bottom Right
      style={[styles.container, style]}
    >
      {/* StatusBar ensures the battery/wifi icons match the background.
        'light' makes text white (good for dark mode or dark-blue tops).
        'dark' makes text black.
      */}
      <StatusBar style={isDark ? "light" : "dark"} />
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
