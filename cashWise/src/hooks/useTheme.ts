import { useColorScheme } from "react-native";
import { COLORS, type ThemeColors, type ColorScheme } from "../config/colors";

/**
 * Hook to access the current theme colors
 *
 * Returns the complete color palette for the current color scheme (light/dark),
 * plus utility functions for common color operations.
 *
 * @example
 * const { colors, isDark, scheme } = useTheme();
 *
 * <View style={{ backgroundColor: colors.surface }}>
 *   <Text style={{ color: colors.textPrimary }}>Hello</Text>
 *   <Text style={{ color: colors.income }}>+$100</Text>
 *   <Text style={{ color: colors.expense }}>-$50</Text>
 * </View>
 */
export function useTheme() {
  const systemScheme = useColorScheme();
  const scheme: ColorScheme = systemScheme === "dark" ? "dark" : "light";
  const colors = COLORS[scheme];

  return {
    /** Current color scheme: 'light' or 'dark' */
    scheme,

    /** Whether the current scheme is dark mode */
    isDark: scheme === "dark",

    /** Whether the current scheme is light mode */
    isLight: scheme === "light",

    /** All theme colors for the current scheme */
    colors,

    /** Access to the raw color palette (all scales) */
    palette: COLORS.palette,

    /** Semantic colors (success, warning, error, info) */
    semantic: COLORS.semantic,

    /**
     * Get a color value with optional opacity
     * @param color - The color value
     * @param opacity - Opacity from 0 to 1
     */
    withOpacity: (color: string, opacity: number): string => {
      // Handle hex colors
      if (color.startsWith("#")) {
        const hex = color.slice(1);
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
      // Handle rgba colors - replace the alpha
      if (color.startsWith("rgba")) {
        return color.replace(/[\d.]+\)$/, `${opacity})`);
      }
      return color;
    },

    /**
     * Get contrasting text color for a background
     * Returns white or dark text based on background luminance
     */
    getContrastText: (backgroundColor: string): string => {
      // Simple luminance calculation for hex colors
      if (backgroundColor.startsWith("#")) {
        const hex = backgroundColor.slice(1);
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? colors.textPrimary : "#FFFFFF";
      }
      return colors.textPrimary;
    },

    /**
     * Get color for financial amount based on value
     * Positive = income (green), Negative = expense (red), Zero = neutral
     */
    getAmountColor: (amount: number): string => {
      if (amount > 0) return colors.income;
      if (amount < 0) return colors.expense;
      return colors.neutral;
    },
  };
}

/**
 * Get static colors without hook (for StyleSheet.create outside components)
 * Note: This won't react to theme changes - prefer useTheme() in components
 */
export function getStaticColors(scheme: ColorScheme): ThemeColors {
  return COLORS[scheme];
}

export type { ThemeColors, ColorScheme };
