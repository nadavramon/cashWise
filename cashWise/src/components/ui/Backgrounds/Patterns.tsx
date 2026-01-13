import React from "react";
import { StyleSheet, View, ViewStyle, StyleProp, Dimensions } from "react-native";
import {
  Canvas,
  Path,
  Skia,
  Group,
  BlurMask,
  Circle,
  Line,
  vec,
  LinearGradient,
  Rect,
} from "@shopify/react-native-skia";
import { useTheme } from "../../../hooks/useTheme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// ============================================
// Dot Grid Pattern
// ============================================

interface DotGridProps {
  /** Spacing between dots */
  spacing?: number;
  /** Dot size */
  dotSize?: number;
  /** Dot color */
  color?: string;
  /** Opacity */
  opacity?: number;
  /** Container style */
  style?: StyleProp<ViewStyle>;
}

/**
 * Subtle dot grid pattern background
 */
export function DotGrid({
  spacing = 24,
  dotSize = 2,
  color,
  opacity = 0.15,
  style,
}: DotGridProps) {
  const { isDark } = useTheme();
  const dotColor = color || (isDark ? "#FFFFFF" : "#000000");

  const dots = React.useMemo(() => {
    const result: { x: number; y: number }[] = [];
    const cols = Math.ceil(SCREEN_WIDTH / spacing);
    const rows = Math.ceil(SCREEN_HEIGHT / spacing);

    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        result.push({ x: i * spacing, y: j * spacing });
      }
    }
    return result;
  }, [spacing]);

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      <Canvas style={styles.canvas}>
        <Group opacity={opacity}>
          {dots.map((dot, index) => (
            <Circle key={index} cx={dot.x} cy={dot.y} r={dotSize} color={dotColor} />
          ))}
        </Group>
      </Canvas>
    </View>
  );
}

// ============================================
// Grid Lines Pattern
// ============================================

interface GridLinesProps {
  /** Spacing between lines */
  spacing?: number;
  /** Line thickness */
  strokeWidth?: number;
  /** Line color */
  color?: string;
  /** Opacity */
  opacity?: number;
  /** Show horizontal lines */
  horizontal?: boolean;
  /** Show vertical lines */
  vertical?: boolean;
  /** Container style */
  style?: StyleProp<ViewStyle>;
}

/**
 * Grid lines pattern background
 */
export function GridLines({
  spacing = 40,
  strokeWidth = 1,
  color,
  opacity = 0.08,
  horizontal = true,
  vertical = true,
  style,
}: GridLinesProps) {
  const { isDark } = useTheme();
  const lineColor = color || (isDark ? "#FFFFFF" : "#000000");

  const lines = React.useMemo(() => {
    const result: { start: { x: number; y: number }; end: { x: number; y: number } }[] = [];

    if (horizontal) {
      const rows = Math.ceil(SCREEN_HEIGHT / spacing);
      for (let i = 0; i <= rows; i++) {
        result.push({
          start: { x: 0, y: i * spacing },
          end: { x: SCREEN_WIDTH, y: i * spacing },
        });
      }
    }

    if (vertical) {
      const cols = Math.ceil(SCREEN_WIDTH / spacing);
      for (let i = 0; i <= cols; i++) {
        result.push({
          start: { x: i * spacing, y: 0 },
          end: { x: i * spacing, y: SCREEN_HEIGHT },
        });
      }
    }

    return result;
  }, [spacing, horizontal, vertical]);

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      <Canvas style={styles.canvas}>
        <Group opacity={opacity}>
          {lines.map((line, index) => (
            <Line
              key={index}
              p1={vec(line.start.x, line.start.y)}
              p2={vec(line.end.x, line.end.y)}
              color={lineColor}
              strokeWidth={strokeWidth}
            />
          ))}
        </Group>
      </Canvas>
    </View>
  );
}

// ============================================
// Diagonal Lines Pattern
// ============================================

interface DiagonalLinesProps {
  /** Spacing between lines */
  spacing?: number;
  /** Line thickness */
  strokeWidth?: number;
  /** Line color */
  color?: string;
  /** Opacity */
  opacity?: number;
  /** Direction: 'left' (\\) or 'right' (/) */
  direction?: "left" | "right";
  /** Container style */
  style?: StyleProp<ViewStyle>;
}

/**
 * Diagonal lines pattern background
 */
export function DiagonalLines({
  spacing = 20,
  strokeWidth = 1,
  color,
  opacity = 0.06,
  direction = "right",
  style,
}: DiagonalLinesProps) {
  const { isDark } = useTheme();
  const lineColor = color || (isDark ? "#FFFFFF" : "#000000");

  const path = React.useMemo(() => {
    const p = Skia.Path.Make();
    const diagonal = Math.sqrt(SCREEN_WIDTH ** 2 + SCREEN_HEIGHT ** 2);
    const count = Math.ceil(diagonal / spacing) * 2;

    for (let i = -count; i <= count; i++) {
      const offset = i * spacing;

      if (direction === "right") {
        p.moveTo(offset, 0);
        p.lineTo(offset + SCREEN_HEIGHT, SCREEN_HEIGHT);
      } else {
        p.moveTo(SCREEN_WIDTH - offset, 0);
        p.lineTo(SCREEN_WIDTH - offset - SCREEN_HEIGHT, SCREEN_HEIGHT);
      }
    }

    return p;
  }, [spacing, direction]);

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      <Canvas style={styles.canvas}>
        <Path
          path={path}
          color={lineColor}
          style="stroke"
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      </Canvas>
    </View>
  );
}

// ============================================
// Hexagon Pattern
// ============================================

interface HexagonPatternProps {
  /** Size of each hexagon */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Color */
  color?: string;
  /** Opacity */
  opacity?: number;
  /** Container style */
  style?: StyleProp<ViewStyle>;
}

/**
 * Honeycomb/hexagon pattern background
 */
export function HexagonPattern({
  size = 40,
  strokeWidth = 1,
  color,
  opacity = 0.08,
  style,
}: HexagonPatternProps) {
  const { isDark } = useTheme();
  const hexColor = color || (isDark ? "#FFFFFF" : "#000000");

  const hexPath = React.useMemo(() => {
    const p = Skia.Path.Make();
    const h = size * Math.sqrt(3);
    const w = size * 2;

    const cols = Math.ceil(SCREEN_WIDTH / (w * 0.75)) + 1;
    const rows = Math.ceil(SCREEN_HEIGHT / h) + 1;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const offsetX = col * w * 0.75;
        const offsetY = row * h + (col % 2 === 1 ? h / 2 : 0);

        // Draw hexagon
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const nextAngle = (Math.PI / 3) * (i + 1) - Math.PI / 6;
          const x1 = offsetX + size * Math.cos(angle);
          const y1 = offsetY + size * Math.sin(angle);
          const x2 = offsetX + size * Math.cos(nextAngle);
          const y2 = offsetY + size * Math.sin(nextAngle);

          if (i === 0) {
            p.moveTo(x1, y1);
          }
          p.lineTo(x2, y2);
        }
      }
    }

    return p;
  }, [size]);

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      <Canvas style={styles.canvas}>
        <Path
          path={hexPath}
          color={hexColor}
          style="stroke"
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      </Canvas>
    </View>
  );
}

// ============================================
// Concentric Circles Pattern
// ============================================

interface ConcentricCirclesProps {
  /** Center X position (0-1) */
  centerX?: number;
  /** Center Y position (0-1) */
  centerY?: number;
  /** Spacing between circles */
  spacing?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Color */
  color?: string;
  /** Opacity */
  opacity?: number;
  /** Container style */
  style?: StyleProp<ViewStyle>;
}

/**
 * Concentric circles pattern radiating from a point
 */
export function ConcentricCircles({
  centerX = 0.5,
  centerY = 0.3,
  spacing = 40,
  strokeWidth = 1,
  color,
  opacity = 0.06,
  style,
}: ConcentricCirclesProps) {
  const { isDark } = useTheme();
  const circleColor = color || (isDark ? "#FFFFFF" : "#000000");

  const cx = SCREEN_WIDTH * centerX;
  const cy = SCREEN_HEIGHT * centerY;
  const maxRadius = Math.max(SCREEN_WIDTH, SCREEN_HEIGHT) * 1.5;
  const count = Math.ceil(maxRadius / spacing);

  const circles = Array.from({ length: count }, (_, i) => ({
    r: (i + 1) * spacing,
  }));

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      <Canvas style={styles.canvas}>
        <Group opacity={opacity}>
          {circles.map((circle, index) => (
            <Circle
              key={index}
              cx={cx}
              cy={cy}
              r={circle.r}
              color={circleColor}
              style="stroke"
              strokeWidth={strokeWidth}
            />
          ))}
        </Group>
      </Canvas>
    </View>
  );
}

// ============================================
// Wave Lines Pattern
// ============================================

interface WaveLinesProps {
  /** Wave amplitude */
  amplitude?: number;
  /** Wave frequency */
  frequency?: number;
  /** Spacing between waves */
  spacing?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Color */
  color?: string;
  /** Opacity */
  opacity?: number;
  /** Container style */
  style?: StyleProp<ViewStyle>;
}

/**
 * Wavy lines pattern background
 */
export function WaveLines({
  amplitude = 15,
  frequency = 0.02,
  spacing = 30,
  strokeWidth = 1,
  color,
  opacity = 0.08,
  style,
}: WaveLinesProps) {
  const { isDark } = useTheme();
  const lineColor = color || (isDark ? "#FFFFFF" : "#000000");

  const wavePath = React.useMemo(() => {
    const p = Skia.Path.Make();
    const rows = Math.ceil(SCREEN_HEIGHT / spacing) + 1;

    for (let row = 0; row < rows; row++) {
      const baseY = row * spacing;

      p.moveTo(0, baseY);

      for (let x = 0; x <= SCREEN_WIDTH; x += 5) {
        const y = baseY + Math.sin(x * frequency) * amplitude;
        p.lineTo(x, y);
      }
    }

    return p;
  }, [amplitude, frequency, spacing]);

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      <Canvas style={styles.canvas}>
        <Path
          path={wavePath}
          color={lineColor}
          style="stroke"
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      </Canvas>
    </View>
  );
}

// ============================================
// Decorative Border
// ============================================

interface DecorativeBorderProps {
  children: React.ReactNode;
  /** Border thickness */
  thickness?: number;
  /** Border radius */
  borderRadius?: number;
  /** Gradient colors for border */
  colors?: readonly [string, string, ...string[]];
  /** Container style */
  style?: StyleProp<ViewStyle>;
}

/**
 * Decorative gradient border around content
 */
export function DecorativeBorder({
  children,
  thickness = 2,
  borderRadius = 24,
  colors,
  style,
}: DecorativeBorderProps) {
  const { isDark } = useTheme();
  const defaultColors = isDark
    ? (["#02C3BD", "#4E148C"] as const)
    : (["#007CBE", "#FFD000"] as const);
  const borderColors = colors || defaultColors;

  return (
    <View style={[{ borderRadius, overflow: "hidden" }, style]}>
      <Canvas style={{ position: "absolute", width: "100%", height: "100%" }}>
        <Rect x={0} y={0} width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(SCREEN_WIDTH, SCREEN_HEIGHT)}
            colors={borderColors}
          />
        </Rect>
      </Canvas>
      <View
        style={{
          margin: thickness,
          borderRadius: borderRadius - thickness,
          overflow: "hidden",
          flex: 1,
        }}
      >
        {children}
      </View>
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
