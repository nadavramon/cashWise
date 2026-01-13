import { Easing } from "react-native-reanimated";

/**
 * CashWise Motion System
 *
 * Design Philosophy:
 * - HIGH-IMPACT MOMENTS: One well-orchestrated page load with staggered reveals
 *   creates more delight than scattered micro-interactions
 * - PURPOSEFUL MOTION: Every animation should guide attention or provide feedback
 * - PERFORMANCE FIRST: Use native driver, avoid layout thrashing
 * - CONSISTENCY: Shared timing/easing creates cohesive feel
 */

// ============================================
// Duration Presets (in milliseconds)
// ============================================

export const DURATION = {
  /** Instant feedback - button press, toggle (100ms) */
  instant: 100,

  /** Quick response - micro-interactions (150ms) */
  quick: 150,

  /** Standard transitions - most UI changes (250ms) */
  normal: 250,

  /** Deliberate motion - modals, page transitions (350ms) */
  moderate: 350,

  /** Emphasis motion - hero animations, reveals (500ms) */
  slow: 500,

  /** Dramatic entrance - splash, onboarding (700ms) */
  dramatic: 700,
} as const;

// ============================================
// Easing Curves
// ============================================

/**
 * Easing presets following Material Design 3 motion principles
 * with custom curves for distinctive character
 */
export const EASING = {
  /** Standard easing - for most movements */
  standard: Easing.bezier(0.2, 0, 0, 1),

  /** Decelerate - elements entering the screen */
  decelerate: Easing.bezier(0, 0, 0, 1),

  /** Accelerate - elements leaving the screen */
  accelerate: Easing.bezier(0.3, 0, 1, 1),

  /** Emphasized - for important/dramatic movements */
  emphasized: Easing.bezier(0.2, 0, 0, 1),

  /** Bounce - playful, attention-grabbing */
  bounce: Easing.bezier(0.34, 1.56, 0.64, 1),

  /** Sharp - snappy, precise interactions */
  sharp: Easing.bezier(0.4, 0, 0.2, 1),

  /** Smooth - gentle, relaxed motion */
  smooth: Easing.bezier(0.4, 0, 0.2, 1),

  /** Linear - constant speed (use sparingly) */
  linear: Easing.linear,
} as const;

// ============================================
// Spring Configurations
// ============================================

/**
 * Spring configs for natural, physics-based motion
 * These create more organic feeling animations
 */
export const SPRING = {
  /** Gentle - subtle movements, hover states */
  gentle: {
    damping: 20,
    stiffness: 150,
    mass: 1,
  },

  /** Default - balanced for most use cases */
  default: {
    damping: 15,
    stiffness: 180,
    mass: 1,
  },

  /** Bouncy - playful, attention-grabbing */
  bouncy: {
    damping: 10,
    stiffness: 200,
    mass: 0.8,
  },

  /** Stiff - quick, responsive feedback */
  stiff: {
    damping: 20,
    stiffness: 300,
    mass: 0.5,
  },

  /** Wobbly - exaggerated, fun */
  wobbly: {
    damping: 8,
    stiffness: 180,
    mass: 1,
  },
} as const;

// ============================================
// Stagger Configuration
// ============================================

/**
 * Stagger delays for list/grid animations
 * Creates the "wave" effect on page load
 */
export const STAGGER = {
  /** Fast stagger - dense lists (30ms between items) */
  fast: 30,

  /** Default stagger - standard lists (50ms) */
  default: 50,

  /** Slow stagger - hero content (80ms) */
  slow: 80,

  /** Dramatic stagger - onboarding, showcases (120ms) */
  dramatic: 120,
} as const;

// ============================================
// Transform Presets
// ============================================

/**
 * Common transform values for enter/exit animations
 */
export const TRANSFORMS = {
  /** Fade in from below */
  fadeUp: {
    initial: { opacity: 0, translateY: 20 },
    animate: { opacity: 1, translateY: 0 },
  },

  /** Fade in from above */
  fadeDown: {
    initial: { opacity: 0, translateY: -20 },
    animate: { opacity: 1, translateY: 0 },
  },

  /** Fade in from left */
  fadeLeft: {
    initial: { opacity: 0, translateX: -20 },
    animate: { opacity: 1, translateX: 0 },
  },

  /** Fade in from right */
  fadeRight: {
    initial: { opacity: 0, translateX: 20 },
    animate: { opacity: 1, translateX: 0 },
  },

  /** Scale up from center */
  scaleUp: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
  },

  /** Scale down from larger */
  scaleDown: {
    initial: { opacity: 0, scale: 1.1 },
    animate: { opacity: 1, scale: 1 },
  },

  /** Simple fade */
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
} as const;

// ============================================
// Press/Interaction Feedback
// ============================================

/**
 * Scale values for press states
 */
export const PRESS_SCALE = {
  /** Subtle - for large touch targets */
  subtle: 0.98,

  /** Default - standard buttons */
  default: 0.96,

  /** Strong - small buttons, icons */
  strong: 0.92,
} as const;

// ============================================
// Common Animation Configurations
// ============================================

/**
 * Pre-built animation configs for withTiming()
 */
export const TIMING_CONFIG = {
  instant: {
    duration: DURATION.instant,
    easing: EASING.sharp,
  },
  quick: {
    duration: DURATION.quick,
    easing: EASING.standard,
  },
  normal: {
    duration: DURATION.normal,
    easing: EASING.standard,
  },
  enter: {
    duration: DURATION.moderate,
    easing: EASING.decelerate,
  },
  exit: {
    duration: DURATION.normal,
    easing: EASING.accelerate,
  },
  emphasis: {
    duration: DURATION.slow,
    easing: EASING.emphasized,
  },
} as const;

// ============================================
// Type Exports
// ============================================

export type Duration = keyof typeof DURATION;
export type EasingType = keyof typeof EASING;
export type SpringType = keyof typeof SPRING;
export type StaggerType = keyof typeof STAGGER;
export type TransformType = keyof typeof TRANSFORMS;
