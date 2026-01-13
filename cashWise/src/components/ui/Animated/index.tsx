import React, { useEffect } from "react";
import { ViewStyle, StyleProp } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  interpolate,
  Extrapolation,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideInUp,
  SlideInLeft,
  SlideInRight,
  SlideOutDown,
  SlideOutUp,
  ZoomIn,
  ZoomOut,
  Layout,
  LinearTransition,
} from "react-native-reanimated";
import { DURATION, EASING, STAGGER } from "../../../config/motion";

// ============================================
// FadeIn Component - Simple opacity animation
// ============================================

interface FadeInViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Wrapper that fades in its children on mount
 *
 * @example
 * <FadeInView delay={100}>
 *   <Text>Hello</Text>
 * </FadeInView>
 */
export function FadeInView({
  children,
  delay = 0,
  duration = DURATION.normal,
  style,
}: FadeInViewProps) {
  return (
    <Animated.View
      entering={FadeIn.delay(delay)
        .duration(duration)
        .easing(EASING.decelerate)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

// ============================================
// SlideIn Components - Directional slides
// ============================================

interface SlideInViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

export function SlideInFromBottom({
  children,
  delay = 0,
  duration = DURATION.moderate,
  style,
}: SlideInViewProps) {
  return (
    <Animated.View
      entering={SlideInDown.delay(delay)
        .duration(duration)
        .easing(EASING.decelerate)}
      exiting={SlideOutDown.duration(DURATION.normal)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

export function SlideInFromTop({
  children,
  delay = 0,
  duration = DURATION.moderate,
  style,
}: SlideInViewProps) {
  return (
    <Animated.View
      entering={SlideInUp.delay(delay)
        .duration(duration)
        .easing(EASING.decelerate)}
      exiting={SlideOutUp.duration(DURATION.normal)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

export function SlideInFromLeft({
  children,
  delay = 0,
  duration = DURATION.moderate,
  style,
}: SlideInViewProps) {
  return (
    <Animated.View
      entering={SlideInLeft.delay(delay)
        .duration(duration)
        .easing(EASING.decelerate)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

export function SlideInFromRight({
  children,
  delay = 0,
  duration = DURATION.moderate,
  style,
}: SlideInViewProps) {
  return (
    <Animated.View
      entering={SlideInRight.delay(delay)
        .duration(duration)
        .easing(EASING.decelerate)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

// ============================================
// FadeUp Component - Fade + Slide from below
// ============================================

interface FadeUpViewProps {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Fades in while sliding up from below
 * The most common and delightful entrance animation
 *
 * @example
 * <FadeUpView delay={index * 50}>
 *   <Card>...</Card>
 * </FadeUpView>
 */
export function FadeUpView({
  children,
  delay = 0,
  distance = 24,
  style,
}: FadeUpViewProps) {
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

  const animatedStyle = useAnimatedStyle(() => ({
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

  return (
    <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
  );
}

// ============================================
// ScaleIn Component - Zoom entrance
// ============================================

interface ScaleInViewProps {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

export function ScaleInView({ children, delay = 0, style }: ScaleInViewProps) {
  return (
    <Animated.View
      entering={ZoomIn.delay(delay)
        .duration(DURATION.moderate)
        .springify()
        .damping(15)}
      exiting={ZoomOut.duration(DURATION.quick)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

// ============================================
// AnimatedItem - For lists with layout animations
// ============================================

interface AnimatedItemProps {
  children: React.ReactNode;
  index?: number;
  staggerDelay?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * List item with staggered entrance and layout animation
 * Use this for items in FlatList/ScrollView
 *
 * @example
 * {items.map((item, index) => (
 *   <AnimatedItem key={item.id} index={index}>
 *     <ItemCard {...item} />
 *   </AnimatedItem>
 * ))}
 */
export function AnimatedItem({
  children,
  index = 0,
  staggerDelay = STAGGER.default,
  style,
}: AnimatedItemProps) {
  const delay = index * staggerDelay;

  return (
    <Animated.View
      entering={FadeIn.delay(delay)
        .duration(DURATION.normal)
        .easing(EASING.decelerate)}
      exiting={FadeOut.duration(DURATION.quick)}
      layout={LinearTransition.springify().damping(15)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

// ============================================
// PageEntrance - Orchestrated page load animation
// ============================================

interface PageEntranceProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Wrapper for entire screen content with orchestrated entrance
 * Creates a polished, cohesive page load experience
 *
 * @example
 * function DashboardScreen() {
 *   return (
 *     <PageEntrance>
 *       <Header />
 *       <Content />
 *     </PageEntrance>
 *   );
 * }
 */
export function PageEntrance({ children, style }: PageEntranceProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: DURATION.slow,
      easing: EASING.decelerate,
    });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        translateY: interpolate(
          progress.value,
          [0, 1],
          [10, 0],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}

// ============================================
// LayoutAnimatedView - For size/position changes
// ============================================

interface LayoutAnimatedViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * View that animates layout changes automatically
 * Great for expandable sections, reordering, etc.
 */
export function LayoutAnimatedView({
  children,
  style,
}: LayoutAnimatedViewProps) {
  return (
    <Animated.View layout={Layout.springify().damping(15)} style={style}>
      {children}
    </Animated.View>
  );
}

// ============================================
// Re-export Reanimated's built-in animations
// ============================================

export {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideInUp,
  SlideInLeft,
  SlideInRight,
  SlideOutDown,
  SlideOutUp,
  ZoomIn,
  ZoomOut,
  Layout,
  LinearTransition,
};
