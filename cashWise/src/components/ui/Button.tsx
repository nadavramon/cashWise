import React from "react";
import {
  View,
  ViewStyle,
  StyleProp,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { ButtonText, ButtonTextLarge, ButtonTextSmall } from "./Typography";
import { RADIUS, SHADOWS } from "../../config/visuals";
import { SPRING } from "../../config/motion";

// ============================================
// Button Component - Reusable styled button
// ============================================

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "glass";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  /** Button style variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Full width button */
  fullWidth?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Left icon component */
  leftIcon?: React.ReactNode;
  /** Right icon component */
  rightIcon?: React.ReactNode;
  /** Custom background color (overrides variant) */
  backgroundColor?: string;
  /** Custom text color */
  textColor?: string;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** onPress handler */
  onPress?: () => void;
}

/**
 * Reusable button component with variants, sizes, and animations
 *
 * @example
 * <Button variant="primary" size="lg" onPress={handleSubmit}>
 *   Save Changes
 * </Button>
 *
 * <Button variant="outline" leftIcon={<Ionicons name="add" />}>
 *   Add Item
 * </Button>
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  backgroundColor,
  textColor,
  style,
  onPress,
}: ButtonProps) {
  const { isDark, colors } = useTheme();
  const scale = useSharedValue(1);

  // Size configurations
  const sizeConfig = {
    sm: { paddingH: 12, paddingV: 8, borderRadius: RADIUS.lg, gap: 6 },
    md: { paddingH: 20, paddingV: 12, borderRadius: RADIUS.xl, gap: 8 },
    lg: { paddingH: 28, paddingV: 16, borderRadius: RADIUS["2xl"], gap: 10 },
  };

  // Variant configurations
  const getVariantStyles = (): {
    bg: string;
    text: string;
    border?: string;
    useBlur?: boolean;
  } => {
    switch (variant) {
      case "primary":
        return {
          bg: backgroundColor || colors.primary,
          text: textColor || "#FFFFFF",
        };
      case "secondary":
        return {
          bg:
            backgroundColor ||
            (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"),
          text: textColor || colors.textPrimary,
        };
      case "outline":
        return {
          bg: "transparent",
          text: textColor || colors.primary,
          border: colors.primary,
        };
      case "ghost":
        return {
          bg: "transparent",
          text: textColor || colors.primary,
        };
      case "glass":
        return {
          bg: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
          text: textColor || colors.textPrimary,
          useBlur: true,
        };
      default:
        return {
          bg: colors.primary,
          text: "#FFFFFF",
        };
    }
  };

  const variantStyles = getVariantStyles();
  const config = sizeConfig[size];

  const handlePressIn = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(0.96, SPRING.stiff);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SPRING.stiff);
    if (!disabled && !loading && onPress) {
      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const containerStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: config.paddingH,
    paddingVertical: config.paddingV,
    borderRadius: config.borderRadius,
    backgroundColor: variantStyles.bg,
    borderWidth: variantStyles.border ? 1.5 : 0,
    borderColor: variantStyles.border,
    opacity: disabled ? 0.5 : 1,
    gap: config.gap,
    ...(fullWidth && { width: "100%" }),
    ...(variant === "primary" && !disabled && SHADOWS.md),
  };

  // Text component based on size
  const TextComponent =
    size === "lg"
      ? ButtonTextLarge
      : size === "sm"
        ? ButtonTextSmall
        : ButtonText;

  return (
    <Animated.View
      style={[animatedStyle, style]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
      onTouchCancel={() => (scale.value = withSpring(1, SPRING.stiff))}
    >
      {variantStyles.useBlur && Platform.OS === "ios" ? (
        <BlurView
          style={[containerStyle, { overflow: "hidden" }]}
          intensity={40}
          tint={isDark ? "dark" : "light"}
        >
          {loading ? (
            <ActivityIndicator size="small" color={variantStyles.text} />
          ) : (
            <>
              {leftIcon}
              <TextComponent color={variantStyles.text}>{children}</TextComponent>
              {rightIcon}
            </>
          )}
        </BlurView>
      ) : (
        <View style={containerStyle}>
          {loading ? (
            <ActivityIndicator size="small" color={variantStyles.text} />
          ) : (
            <>
              {leftIcon}
              <TextComponent color={variantStyles.text}>{children}</TextComponent>
              {rightIcon}
            </>
          )}
        </View>
      )}
    </Animated.View>
  );
}

// ============================================
// Gradient Button - Primary button with gradient
// ============================================

interface GradientButtonProps extends Omit<
  ButtonProps,
  "variant" | "backgroundColor"
> {
  /** Gradient colors */
  colors?: readonly [string, string, ...string[]];
}

/**
 * Primary button with gradient background
 */
export function GradientButton({
  children,
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  textColor = "#FFFFFF",
  style,
  colors,
  onPress,
}: GradientButtonProps) {
  const { isDark, colors: themeColors } = useTheme();
  const scale = useSharedValue(1);

  const defaultColors = isDark
    ? (["#02C3BD", "#4E148C"] as const)
    : (["#007CBE", "#00A3E0"] as const);

  const gradientColors = colors || defaultColors;

  const sizeConfig = {
    sm: { paddingH: 12, paddingV: 8, borderRadius: RADIUS.lg, gap: 6 },
    md: { paddingH: 20, paddingV: 12, borderRadius: RADIUS.xl, gap: 8 },
    lg: { paddingH: 28, paddingV: 16, borderRadius: RADIUS["2xl"], gap: 10 },
  };

  const config = sizeConfig[size];

  const handlePressIn = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(0.96, SPRING.stiff);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SPRING.stiff);
    if (!disabled && !loading && onPress) {
      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const TextComponent =
    size === "lg"
      ? ButtonTextLarge
      : size === "sm"
        ? ButtonTextSmall
        : ButtonText;

  return (
    <Animated.View
      style={[
        animatedStyle,
        { opacity: disabled ? 0.5 : 1 },
        fullWidth && { width: "100%" },
        style,
      ]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
      onTouchCancel={() => (scale.value = withSpring(1, SPRING.stiff))}
    >
      <LinearGradient
        colors={[...gradientColors]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: config.paddingH,
            paddingVertical: config.paddingV,
            borderRadius: config.borderRadius,
            gap: config.gap,
          },
          !disabled && SHADOWS.md,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={textColor} />
        ) : (
          <>
            {leftIcon}
            <TextComponent color={textColor}>{children}</TextComponent>
            {rightIcon}
          </>
        )}
      </LinearGradient>
    </Animated.View>
  );
}

// ============================================
// Icon Button - Circular icon-only button
// ============================================

interface IconButtonProps {
  /** Icon component */
  icon: React.ReactNode;
  /** Button size */
  size?: number;
  /** Background color */
  backgroundColor?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** onPress handler */
  onPress?: () => void;
}

/**
 * Circular icon button (like FAB or toolbar buttons)
 */
export function IconButton({
  icon,
  size = 48,
  backgroundColor,
  disabled = false,
  style,
  onPress,
}: IconButtonProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const bgColor = backgroundColor || colors.primary;

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.9, SPRING.stiff);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SPRING.stiff);
    if (!disabled && onPress) {
      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[animatedStyle, style]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
      onTouchCancel={() => (scale.value = withSpring(1, SPRING.stiff))}
    >
      <View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: bgColor,
            alignItems: "center",
            justifyContent: "center",
            opacity: disabled ? 0.5 : 1,
          },
          SHADOWS.md,
        ]}
      >
        {icon}
      </View>
    </Animated.View>
  );
}

// ============================================
// FAB - Floating Action Button
// ============================================

interface FABProps {
  /** Icon component */
  icon: React.ReactNode;
  /** Background color */
  backgroundColor?: string;
  /** Position */
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** onPress handler */
  onPress?: () => void;
}

/**
 * Floating Action Button - positioned absolutely
 */
export function FAB({
  icon,
  backgroundColor,
  position = "bottom-right",
  style,
  onPress,
}: FABProps) {
  const { colors } = useTheme();

  const positionStyle: ViewStyle = {
    position: "absolute",
    bottom: 24,
    ...(position === "bottom-right" && { right: 24 }),
    ...(position === "bottom-left" && { left: 24 }),
    ...(position === "bottom-center" && { left: "50%", marginLeft: -28 }),
    zIndex: 100,
  };

  return (
    <View style={[positionStyle, style]}>
      <IconButton
        icon={icon}
        size={56}
        backgroundColor={backgroundColor || colors.primary}
        onPress={onPress}
      />
    </View>
  );
}
