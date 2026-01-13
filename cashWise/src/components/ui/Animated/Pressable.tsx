import React, { useCallback } from "react";
import {
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
  ViewStyle,
  StyleProp,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import { DURATION, EASING, SPRING, PRESS_SCALE } from "../../../config/motion";

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable);

// ============================================
// ScalePressable - Press with scale feedback
// ============================================

interface ScalePressableProps extends Omit<RNPressableProps, "style"> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scaleAmount?: keyof typeof PRESS_SCALE;
  disabled?: boolean;
}

/**
 * Pressable with satisfying scale-down feedback
 *
 * @example
 * <ScalePressable onPress={handlePress} scaleAmount="default">
 *   <Card>...</Card>
 * </ScalePressable>
 */
export function ScalePressable({
  children,
  style,
  scaleAmount = "default",
  disabled = false,
  onPressIn,
  onPressOut,
  ...props
}: ScalePressableProps) {
  const scale = useSharedValue(1);
  const targetScale = PRESS_SCALE[scaleAmount];

  const handlePressIn = useCallback(
    (e: Parameters<NonNullable<typeof onPressIn>>[0]) => {
      if (!disabled) {
        scale.value = withTiming(targetScale, {
          duration: DURATION.instant,
          easing: EASING.sharp,
        });
      }
      onPressIn?.(e);
    },
    [disabled, scale, targetScale, onPressIn],
  );

  const handlePressOut = useCallback(
    (e: Parameters<NonNullable<typeof onPressOut>>[0]) => {
      scale.value = withSpring(1, SPRING.stiff);
      onPressOut?.(e);
    },
    [scale, onPressOut],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.5 : 1,
  }));

  return (
    <AnimatedPressable
      {...props}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, style]}
    >
      {children}
    </AnimatedPressable>
  );
}

// ============================================
// BouncePressable - Bouncy press feedback
// ============================================

interface BouncePressableProps extends Omit<RNPressableProps, "style"> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Pressable with playful bounce effect
 * Great for fun, engaging interactions
 */
export function BouncePressable({
  children,
  style,
  onPressIn,
  onPressOut,
  ...props
}: BouncePressableProps) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(
    (e: Parameters<NonNullable<typeof onPressIn>>[0]) => {
      scale.value = withTiming(0.92, {
        duration: DURATION.instant,
        easing: EASING.sharp,
      });
      onPressIn?.(e);
    },
    [scale, onPressIn],
  );

  const handlePressOut = useCallback(
    (e: Parameters<NonNullable<typeof onPressOut>>[0]) => {
      scale.value = withSpring(1, SPRING.bouncy);
      onPressOut?.(e);
    },
    [scale, onPressOut],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      {...props}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, style]}
    >
      {children}
    </AnimatedPressable>
  );
}

// ============================================
// HighlightPressable - Opacity highlight on press
// ============================================

interface HighlightPressableProps extends Omit<RNPressableProps, "style"> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  highlightOpacity?: number;
}

/**
 * Pressable that dims on press (traditional touch feedback)
 */
export function HighlightPressable({
  children,
  style,
  highlightOpacity = 0.7,
  onPressIn,
  onPressOut,
  ...props
}: HighlightPressableProps) {
  const opacity = useSharedValue(1);

  const handlePressIn = useCallback(
    (e: Parameters<NonNullable<typeof onPressIn>>[0]) => {
      opacity.value = withTiming(highlightOpacity, {
        duration: DURATION.instant,
      });
      onPressIn?.(e);
    },
    [opacity, highlightOpacity, onPressIn],
  );

  const handlePressOut = useCallback(
    (e: Parameters<NonNullable<typeof onPressOut>>[0]) => {
      opacity.value = withTiming(1, { duration: DURATION.quick });
      onPressOut?.(e);
    },
    [opacity, onPressOut],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <AnimatedPressable
      {...props}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, style]}
    >
      {children}
    </AnimatedPressable>
  );
}

// ============================================
// RipplePressable - Material-style ripple effect
// ============================================

interface RipplePressableProps extends Omit<RNPressableProps, "style"> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Pressable with scale + opacity combo (Material-inspired)
 */
export function RipplePressable({
  children,
  style,
  onPressIn,
  onPressOut,
  ...props
}: RipplePressableProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = useCallback(
    (e: Parameters<NonNullable<typeof onPressIn>>[0]) => {
      scale.value = withTiming(0.97, { duration: DURATION.instant });
      opacity.value = withTiming(0.85, { duration: DURATION.instant });
      onPressIn?.(e);
    },
    [scale, opacity, onPressIn],
  );

  const handlePressOut = useCallback(
    (e: Parameters<NonNullable<typeof onPressOut>>[0]) => {
      scale.value = withSpring(1, SPRING.default);
      opacity.value = withTiming(1, { duration: DURATION.quick });
      onPressOut?.(e);
    },
    [scale, opacity, onPressOut],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedPressable
      {...props}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, style]}
    >
      {children}
    </AnimatedPressable>
  );
}

// ============================================
// PulseButton - Attention-grabbing pulse
// ============================================

interface PulseButtonProps extends Omit<RNPressableProps, "style"> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Whether to continuously pulse */
  pulse?: boolean;
}

/**
 * Button that pulses to attract attention
 * Use sparingly for primary CTAs
 */
export function PulseButton({
  children,
  style,
  pulse = false,
  onPress,
  onPressIn,
  onPressOut,
  ...props
}: PulseButtonProps) {
  const scale = useSharedValue(1);

  // Continuous pulse effect
  React.useEffect(() => {
    if (!pulse) return;

    const pulseAnimation = () => {
      scale.value = withSequence(
        withTiming(1.03, { duration: 800, easing: EASING.smooth }),
        withTiming(1, { duration: 800, easing: EASING.smooth }),
      );
    };

    pulseAnimation();
    const interval = setInterval(pulseAnimation, 1600);

    return () => clearInterval(interval);
  }, [pulse, scale]);

  const handlePressIn = useCallback(
    (e: Parameters<NonNullable<typeof onPressIn>>[0]) => {
      scale.value = withTiming(0.95, {
        duration: DURATION.instant,
        easing: EASING.sharp,
      });
      onPressIn?.(e);
    },
    [scale, onPressIn],
  );

  const handlePressOut = useCallback(
    (e: Parameters<NonNullable<typeof onPressOut>>[0]) => {
      scale.value = withSpring(1, SPRING.bouncy);
      onPressOut?.(e);
    },
    [scale, onPressOut],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      {...props}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, style]}
    >
      {children}
    </AnimatedPressable>
  );
}
