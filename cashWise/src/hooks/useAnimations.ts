import { useEffect, useCallback } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  runOnJS,
  interpolate,
  Extrapolation,
  SharedValue,
} from "react-native-reanimated";
import {
  DURATION,
  EASING,
  SPRING,
  TIMING_CONFIG,
  PRESS_SCALE,
  type SpringType,
} from "../config/motion";

/**
 * Hook for fade-in animation on mount
 *
 * @param delay - Optional delay before animation starts
 * @param duration - Animation duration
 * @returns Animated style to spread onto Animated.View
 *
 * @example
 * const fadeStyle = useFadeIn(100);
 * <Animated.View style={fadeStyle}>...</Animated.View>
 */
export function useFadeIn(delay = 0, duration = DURATION.normal) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration, easing: EASING.decelerate }),
    );
  }, [delay, duration, opacity]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
}

/**
 * Hook for fade-up animation (fade + slide from below)
 *
 * @param delay - Optional delay before animation starts
 * @param distance - How far to travel (default 20)
 * @returns Animated style
 *
 * @example
 * const style = useFadeUp(index * 50); // stagger by index
 */
export function useFadeUp(delay = 0, distance = 20) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, {
        duration: DURATION.moderate,
        easing: EASING.decelerate,
      }),
    );
  }, [delay, progress]);

  return useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        translateY: interpolate(
          progress.value,
          [0, 1],
          [distance, 0],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));
}

/**
 * Hook for scale-up animation (fade + scale from smaller)
 *
 * @param delay - Optional delay
 * @param initialScale - Starting scale (default 0.9)
 */
export function useScaleUp(delay = 0, initialScale = 0.9) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(delay, withSpring(1, SPRING.default));
  }, [delay, progress]);

  return useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        scale: interpolate(
          progress.value,
          [0, 1],
          [initialScale, 1],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));
}

/**
 * Hook for press/tap feedback animation
 *
 * @param scaleType - How much to scale down on press
 * @returns Object with animated style, pressIn, and pressOut handlers
 *
 * @example
 * const { pressStyle, onPressIn, onPressOut } = usePressAnimation();
 * <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
 *   <Animated.View style={pressStyle}>...</Animated.View>
 * </Pressable>
 */
export function usePressAnimation(
  scaleType: keyof typeof PRESS_SCALE = "default",
) {
  const scale = useSharedValue(1);
  const targetScale = PRESS_SCALE[scaleType];

  const onPressIn = useCallback(() => {
    scale.value = withTiming(targetScale, TIMING_CONFIG.instant);
  }, [scale, targetScale]);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING.stiff);
  }, [scale]);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { pressStyle, onPressIn, onPressOut, scale };
}

/**
 * Hook for a "pop" attention animation
 * Useful for highlighting new items or changes
 *
 * @returns Object with trigger function and animated style
 */
export function usePopAnimation() {
  const scale = useSharedValue(1);

  const trigger = useCallback(() => {
    scale.value = withSequence(
      withTiming(1.1, { duration: DURATION.instant }),
      withSpring(1, SPRING.bouncy),
    );
  }, [scale]);

  const popStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { popStyle, trigger };
}

/**
 * Hook for shake animation (error feedback)
 */
export function useShakeAnimation() {
  const translateX = useSharedValue(0);

  const trigger = useCallback(() => {
    translateX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );
  }, [translateX]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return { shakeStyle, trigger };
}

/**
 * Hook for entrance animation that can be triggered manually
 *
 * @param type - Type of entrance animation
 * @param springConfig - Spring configuration to use
 */
export function useEntranceAnimation(
  type: "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "scale" = "fadeUp",
  springConfig: SpringType = "default",
) {
  const progress = useSharedValue(0);

  const enter = useCallback(() => {
    progress.value = withSpring(1, SPRING[springConfig]);
  }, [progress, springConfig]);

  const exit = useCallback(
    (onComplete?: () => void) => {
      progress.value = withTiming(
        0,
        TIMING_CONFIG.exit,
        onComplete
          ? (finished) => {
              if (finished) runOnJS(onComplete)();
            }
          : undefined,
      );
    },
    [progress],
  );

  const reset = useCallback(() => {
    progress.value = 0;
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = progress.value;

    switch (type) {
      case "fadeUp":
        return {
          opacity,
          transform: [
            { translateY: interpolate(progress.value, [0, 1], [30, 0]) },
          ],
        };
      case "fadeDown":
        return {
          opacity,
          transform: [
            { translateY: interpolate(progress.value, [0, 1], [-30, 0]) },
          ],
        };
      case "fadeLeft":
        return {
          opacity,
          transform: [
            { translateX: interpolate(progress.value, [0, 1], [-30, 0]) },
          ],
        };
      case "fadeRight":
        return {
          opacity,
          transform: [
            { translateX: interpolate(progress.value, [0, 1], [30, 0]) },
          ],
        };
      case "scale":
      default:
        return {
          opacity,
          transform: [{ scale: interpolate(progress.value, [0, 1], [0.8, 1]) }],
        };
    }
  });

  return { animatedStyle, enter, exit, reset, progress };
}

/**
 * Hook for scroll-based animations
 * Returns interpolated value based on scroll position
 *
 * @param scrollY - Shared value of scroll position
 * @param inputRange - Scroll positions to interpolate between
 * @param outputRange - Output values
 */
export function useScrollAnimation(
  scrollY: SharedValue<number>,
  inputRange: number[],
  outputRange: number[],
) {
  return useAnimatedStyle(() => {
    const value = interpolate(
      scrollY.value,
      inputRange,
      outputRange,
      Extrapolation.CLAMP,
    );
    return { opacity: value };
  });
}

/**
 * Hook for parallax scroll effect
 */
export function useParallax(scrollY: SharedValue<number>, speed = 0.5) {
  return useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value * speed }],
  }));
}

/**
 * Hook for counting/number animation
 * Animates from one number to another
 */
export function useCountAnimation(
  targetValue: number,
  duration = DURATION.slow,
) {
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(targetValue, {
      duration,
      easing: EASING.standard,
    });
  }, [targetValue, duration, animatedValue]);

  return animatedValue;
}
