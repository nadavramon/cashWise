import React, { useEffect, useCallback } from "react";
import {
  FlatList,
  FlatListProps,
  ViewStyle,
  StyleProp,
  ListRenderItemInfo,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSpring,
  interpolate,
  Extrapolation,
  LinearTransition,
} from "react-native-reanimated";
import { DURATION, EASING, SPRING, STAGGER } from "../../../config/motion";

// ============================================
// StaggeredItem - Individual animated list item
// ============================================

interface StaggeredItemProps {
  children: React.ReactNode;
  index: number;
  staggerDelay?: number;
  animationType?: "fadeUp" | "fadeIn" | "scaleUp" | "slideIn";
  style?: StyleProp<ViewStyle>;
}

/**
 * Individual item with staggered entrance animation
 */
export function StaggeredItem({
  children,
  index,
  staggerDelay = STAGGER.default,
  animationType = "fadeUp",
  style,
}: StaggeredItemProps) {
  const progress = useSharedValue(0);
  const delay = index * staggerDelay;

  useEffect(() => {
    progress.value = withDelay(delay, withSpring(1, SPRING.default));
  }, [delay, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = progress.value;

    switch (animationType) {
      case "fadeUp":
        return {
          opacity,
          transform: [
            {
              translateY: interpolate(
                progress.value,
                [0, 1],
                [30, 0],
                Extrapolation.CLAMP,
              ),
            },
          ],
        };

      case "scaleUp":
        return {
          opacity,
          transform: [
            {
              scale: interpolate(
                progress.value,
                [0, 1],
                [0.85, 1],
                Extrapolation.CLAMP,
              ),
            },
          ],
        };

      case "slideIn":
        return {
          opacity,
          transform: [
            {
              translateX: interpolate(
                progress.value,
                [0, 1],
                [-50, 0],
                Extrapolation.CLAMP,
              ),
            },
          ],
        };

      case "fadeIn":
      default:
        return { opacity };
    }
  });

  return (
    <Animated.View
      style={[animatedStyle, style]}
      layout={LinearTransition.springify().damping(15)}
    >
      {children}
    </Animated.View>
  );
}

// ============================================
// StaggeredList - FlatList with staggered animation
// ============================================

interface StaggeredListProps<T> extends Omit<FlatListProps<T>, "renderItem"> {
  renderItem: (info: ListRenderItemInfo<T>) => React.ReactNode;
  staggerDelay?: number;
  animationType?: "fadeUp" | "fadeIn" | "scaleUp" | "slideIn";
  itemStyle?: StyleProp<ViewStyle>;
}

/**
 * FlatList with automatic staggered entrance animations
 *
 * @example
 * <StaggeredList
 *   data={transactions}
 *   renderItem={({ item }) => <TransactionCard {...item} />}
 *   keyExtractor={(item) => item.id}
 *   staggerDelay={50}
 *   animationType="fadeUp"
 * />
 */
export function StaggeredList<T>({
  renderItem,
  staggerDelay = STAGGER.default,
  animationType = "fadeUp",
  itemStyle,
  ...flatListProps
}: StaggeredListProps<T>) {
  const wrappedRenderItem = useCallback(
    (info: ListRenderItemInfo<T>) => (
      <StaggeredItem
        index={info.index}
        staggerDelay={staggerDelay}
        animationType={animationType}
        style={itemStyle}
      >
        {renderItem(info)}
      </StaggeredItem>
    ),
    [renderItem, staggerDelay, animationType, itemStyle],
  );

  return <FlatList {...flatListProps} renderItem={wrappedRenderItem} />;
}

// ============================================
// StaggeredChildren - Stagger non-list children
// ============================================

interface StaggeredChildrenProps {
  children: React.ReactNode;
  staggerDelay?: number;
  animationType?: "fadeUp" | "fadeIn" | "scaleUp";
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * Automatically staggers animation of direct children
 * Great for card grids, button groups, etc.
 *
 * @example
 * <StaggeredChildren staggerDelay={80}>
 *   <StatCard title="Income" value={income} />
 *   <StatCard title="Expenses" value={expenses} />
 *   <StatCard title="Balance" value={balance} />
 * </StaggeredChildren>
 */
export function StaggeredChildren({
  children,
  staggerDelay = STAGGER.default,
  animationType = "fadeUp",
  containerStyle,
}: StaggeredChildrenProps) {
  const childrenArray = React.Children.toArray(children);

  return (
    <Animated.View style={containerStyle}>
      {childrenArray.map((child, index) => (
        <StaggeredItem
          key={index}
          index={index}
          staggerDelay={staggerDelay}
          animationType={animationType}
        >
          {child}
        </StaggeredItem>
      ))}
    </Animated.View>
  );
}

// ============================================
// AnimatedSection - Page section with reveal
// ============================================

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Section wrapper for orchestrated page reveals
 * Use to break up page content into animated chunks
 *
 * @example
 * <PageEntrance>
 *   <AnimatedSection delay={0}>
 *     <Header />
 *   </AnimatedSection>
 *   <AnimatedSection delay={100}>
 *     <QuickStats />
 *   </AnimatedSection>
 *   <AnimatedSection delay={200}>
 *     <RecentTransactions />
 *   </AnimatedSection>
 * </PageEntrance>
 */
export function AnimatedSection({
  children,
  delay = 0,
  style,
}: AnimatedSectionProps) {
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
          [20, 0],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
  );
}
