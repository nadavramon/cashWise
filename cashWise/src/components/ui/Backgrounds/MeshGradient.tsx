import React from "react";
import { StyleSheet, View, ViewStyle, StyleProp, Dimensions } from "react-native";
import {
  Canvas,
  RadialGradient,
  Rect,
  vec,
  BlurMask,
  Group,
  Circle,
} from "@shopify/react-native-skia";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "../../../hooks/useTheme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// ============================================
// Mesh Gradient Background
// ============================================

interface MeshGradientProps {
  /** Color blobs for the mesh */
  colors?: string[];
  /** Animation speed (0 = static) */
  speed?: number;
  /** Blur amount for soft blending */
  blur?: number;
  /** Container style */
  style?: StyleProp<ViewStyle>;
}

/**
 * Creates a beautiful mesh gradient background with multiple
 * overlapping radial gradients that blend together
 *
 * @example
 * <MeshGradient colors={['#007CBE', '#FFD000', '#02C3BD']} />
 */
export function MeshGradient({
  colors,
  speed = 0,
  blur = 80,
  style,
}: MeshGradientProps) {
  const { isDark } = useTheme();

  // Default colors based on theme
  const defaultColors = isDark
    ? ["#02C3BD", "#4E148C", "#007CBE", "#02C3BD"]
    : ["#007CBE", "#FFD000", "#339FD7", "#FFF7AE"];

  const meshColors = colors || defaultColors;

  // Animated positions for floating effect
  const offset1 = useSharedValue(0);
  const offset2 = useSharedValue(0);

  React.useEffect(() => {
    if (speed > 0) {
      offset1.value = withRepeat(
        withSequence(
          withTiming(20, { duration: 4000 / speed, easing: Easing.inOut(Easing.ease) }),
          withTiming(-20, { duration: 4000 / speed, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      offset2.value = withRepeat(
        withSequence(
          withTiming(-15, { duration: 3000 / speed, easing: Easing.inOut(Easing.ease) }),
          withTiming(15, { duration: 3000 / speed, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }
  }, [speed, offset1, offset2]);

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      <Canvas style={styles.canvas}>
        <Group>
          <BlurMask blur={blur} style="normal" />

          {/* Top-left blob */}
          <Circle cx={SCREEN_WIDTH * 0.2} cy={SCREEN_HEIGHT * 0.15} r={SCREEN_WIDTH * 0.5}>
            <RadialGradient
              c={vec(SCREEN_WIDTH * 0.2, SCREEN_HEIGHT * 0.15)}
              r={SCREEN_WIDTH * 0.5}
              colors={[meshColors[0], "transparent"]}
            />
          </Circle>

          {/* Top-right blob */}
          <Circle cx={SCREEN_WIDTH * 0.85} cy={SCREEN_HEIGHT * 0.25} r={SCREEN_WIDTH * 0.45}>
            <RadialGradient
              c={vec(SCREEN_WIDTH * 0.85, SCREEN_HEIGHT * 0.25)}
              r={SCREEN_WIDTH * 0.45}
              colors={[meshColors[1], "transparent"]}
            />
          </Circle>

          {/* Center blob */}
          <Circle cx={SCREEN_WIDTH * 0.5} cy={SCREEN_HEIGHT * 0.5} r={SCREEN_WIDTH * 0.6}>
            <RadialGradient
              c={vec(SCREEN_WIDTH * 0.5, SCREEN_HEIGHT * 0.5)}
              r={SCREEN_WIDTH * 0.6}
              colors={[meshColors[2] || meshColors[0], "transparent"]}
            />
          </Circle>

          {/* Bottom blob */}
          <Circle cx={SCREEN_WIDTH * 0.3} cy={SCREEN_HEIGHT * 0.85} r={SCREEN_WIDTH * 0.55}>
            <RadialGradient
              c={vec(SCREEN_WIDTH * 0.3, SCREEN_HEIGHT * 0.85)}
              r={SCREEN_WIDTH * 0.55}
              colors={[meshColors[3] || meshColors[1], "transparent"]}
            />
          </Circle>
        </Group>
      </Canvas>
    </View>
  );
}

// ============================================
// Atmospheric Orbs - Floating gradient orbs
// ============================================

interface AtmosphericOrbsProps {
  /** Number of orbs */
  count?: number;
  /** Base color for orbs */
  color?: string;
  /** Orb size multiplier */
  size?: number;
  /** Container style */
  style?: StyleProp<ViewStyle>;
}

/**
 * Creates floating, blurred orbs for atmospheric depth
 */
export function AtmosphericOrbs({
  count = 3,
  color,
  size = 1,
  style,
}: AtmosphericOrbsProps) {
  const { isDark, colors: themeColors } = useTheme();
  const orbColor = color || (isDark ? themeColors.primary : themeColors.primary);

  // Generate random-ish positions for orbs
  const orbs = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: (SCREEN_WIDTH * (0.2 + (i * 0.3))) % SCREEN_WIDTH,
      y: (SCREEN_HEIGHT * (0.15 + (i * 0.25))) % SCREEN_HEIGHT,
      r: SCREEN_WIDTH * (0.3 + (i * 0.1)) * size,
      opacity: 0.15 - (i * 0.03),
    }));
  }, [count, size]);

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      <Canvas style={styles.canvas}>
        <Group>
          <BlurMask blur={60} style="normal" />
          {orbs.map((orb, index) => (
            <Circle key={index} cx={orb.x} cy={orb.y} r={orb.r}>
              <RadialGradient
                c={vec(orb.x, orb.y)}
                r={orb.r}
                colors={[
                  `${orbColor}${Math.round(orb.opacity * 255).toString(16).padStart(2, "0")}`,
                  "transparent",
                ]}
              />
            </Circle>
          ))}
        </Group>
      </Canvas>
    </View>
  );
}

// ============================================
// Spotlight Effect - Dramatic lighting
// ============================================

interface SpotlightProps {
  /** Position as percentage (0-1) */
  x?: number;
  y?: number;
  /** Spotlight color */
  color?: string;
  /** Intensity (0-1) */
  intensity?: number;
  /** Size as percentage of screen */
  size?: number;
  /** Container style */
  style?: StyleProp<ViewStyle>;
}

/**
 * Creates a spotlight effect for dramatic emphasis
 */
export function Spotlight({
  x = 0.5,
  y = 0.3,
  color = "#FFFFFF",
  intensity = 0.15,
  size = 0.8,
  style,
}: SpotlightProps) {
  const posX = SCREEN_WIDTH * x;
  const posY = SCREEN_HEIGHT * y;
  const radius = Math.max(SCREEN_WIDTH, SCREEN_HEIGHT) * size;

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      <Canvas style={styles.canvas}>
        <Group>
          <BlurMask blur={100} style="normal" />
          <Circle cx={posX} cy={posY} r={radius}>
            <RadialGradient
              c={vec(posX, posY)}
              r={radius}
              colors={[
                `${color}${Math.round(intensity * 255).toString(16).padStart(2, "0")}`,
                "transparent",
              ]}
            />
          </Circle>
        </Group>
      </Canvas>
    </View>
  );
}

// ============================================
// Vignette Effect - Edge darkening
// ============================================

interface VignetteProps {
  /** Vignette intensity (0-1) */
  intensity?: number;
  /** Color of vignette (usually dark) */
  color?: string;
  /** Container style */
  style?: StyleProp<ViewStyle>;
}

/**
 * Creates a vignette (darkened edges) effect
 */
export function Vignette({
  intensity = 0.3,
  color = "#000000",
  style,
}: VignetteProps) {
  const centerX = SCREEN_WIDTH / 2;
  const centerY = SCREEN_HEIGHT / 2;
  const radius = Math.max(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.8;

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      <Canvas style={styles.canvas}>
        <Rect x={0} y={0} width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
          <RadialGradient
            c={vec(centerX, centerY)}
            r={radius}
            colors={[
              "transparent",
              `${color}${Math.round(intensity * 255).toString(16).padStart(2, "0")}`,
            ]}
          />
        </Rect>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  canvas: {
    flex: 1,
  },
});
