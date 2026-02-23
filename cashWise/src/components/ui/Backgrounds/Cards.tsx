import React from "react";
import { View, ViewStyle, StyleProp } from "react-native";
import { useTheme } from "../../../hooks/useTheme";
import { RADIUS, SHADOWS } from "../../../config/visuals";

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
            borderWidth: 1,
            borderColor: darkShadow,
        }
        : {
            backgroundColor: baseColor,
            borderRadius,
            shadowColor: darkShadow,
            shadowOffset: { width: 6, height: 6 },
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 8,
        };

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
    const bgColor = backgroundColor || colors.surface;
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
