import React, { useMemo } from "react";
import { StyleSheet, View, ViewStyle, StyleProp } from "react-native";
import {
  Canvas,
  Rect,
  Shader,
  Skia,
  Fill,
  vec,
} from "@shopify/react-native-skia";
import { NOISE, type NoisePreset } from "../../../config/visuals";

// ============================================
// Noise/Grain Shader - Creates film-like texture
// ============================================

const noiseShaderSource = Skia.RuntimeEffect.Make(`
  uniform float2 iResolution;
  uniform float iTime;
  uniform float uOpacity;
  uniform float uFrequency;

  // Hash function for pseudo-random noise
  float hash(float2 p) {
    float3 p3 = fract(float3(p.xyx) * 0.13);
    p3 += dot(p3, p3.yzx + 3.333);
    return fract((p3.x + p3.y) * p3.z);
  }

  // 2D noise function
  float noise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);

    // Smooth interpolation
    float2 u = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + float2(1.0, 0.0));
    float c = hash(i + float2(0.0, 1.0));
    float d = hash(i + float2(1.0, 1.0));

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  half4 main(float2 fragCoord) {
    float2 uv = fragCoord / iResolution;

    // Scale for grain frequency
    float scale = iResolution.x * uFrequency;

    // Generate noise with time variation for subtle movement
    float n = noise(uv * scale + iTime * 0.5);

    // Convert to grayscale grain
    float grain = (n - 0.5) * 2.0;

    // Apply opacity
    float alpha = abs(grain) * uOpacity;

    return half4(grain > 0.0 ? 1.0 : 0.0, grain > 0.0 ? 1.0 : 0.0, grain > 0.0 ? 1.0 : 0.0, alpha);
  }
`)!;

interface NoiseOverlayProps {
  /** Preset noise configuration */
  preset?: NoisePreset;
  /** Custom opacity (0-1) */
  opacity?: number;
  /** Custom frequency (0-1, lower = larger grain) */
  frequency?: number;
  /** Whether to animate the noise */
  animated?: boolean;
  /** Container style */
  style?: StyleProp<ViewStyle>;
}

/**
 * Film grain / noise overlay component
 * Adds texture and atmosphere to backgrounds
 *
 * @example
 * <View style={{ flex: 1 }}>
 *   <Content />
 *   <NoiseOverlay preset="subtle" />
 * </View>
 */
export function NoiseOverlay({
  preset = "subtle",
  opacity: customOpacity,
  frequency: customFrequency,
  animated = false,
  style,
}: NoiseOverlayProps) {
  const config = NOISE[preset];
  const finalOpacity = customOpacity ?? config.opacity;
  const finalFrequency = customFrequency ?? config.frequency;

  // Time value for animation
  const [time, setTime] = React.useState(0);

  React.useEffect(() => {
    if (!animated) return;

    const interval = setInterval(() => {
      setTime((t) => t + 0.016); // ~60fps
    }, 16);

    return () => clearInterval(interval);
  }, [animated]);

  const uniforms = useMemo(
    () => ({
      iResolution: vec(400, 800), // Will be overridden by canvas size
      iTime: time,
      uOpacity: finalOpacity,
      uFrequency: finalFrequency,
    }),
    [time, finalOpacity, finalFrequency]
  );

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      <Canvas style={styles.canvas}>
        <Fill>
          <Shader source={noiseShaderSource} uniforms={uniforms} />
        </Fill>
      </Canvas>
    </View>
  );
}

// ============================================
// Simple Static Noise (lighter weight)
// ============================================

interface StaticNoiseProps {
  opacity?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Lightweight static noise overlay using a pattern
 * Use this when Skia noise is too heavy
 */
export function StaticNoise({ opacity = 0.03, style }: StaticNoiseProps) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: `rgba(128, 128, 128, ${opacity})`,
          // Using a subtle pattern via opacity variation
        },
        style,
      ]}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  canvas: {
    flex: 1,
  },
});
