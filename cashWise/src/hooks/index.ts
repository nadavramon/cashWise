// Custom hooks for CashWise

export { useFonts } from "./useFonts";
export { useTheme, getStaticColors } from "./useTheme";
export type { ThemeColors, ColorScheme } from "./useTheme";

// Animation hooks
export {
  useFadeIn,
  useFadeUp,
  useScaleUp,
  usePressAnimation,
  usePopAnimation,
  useShakeAnimation,
  useEntranceAnimation,
  useScrollAnimation,
  useParallax,
  useCountAnimation,
} from "./useAnimations";

// Budget hooks
export { useBudgetProgress } from "./useBudgetProgress";
export type {
  CategoryProgress,
  BudgetProgressResult,
} from "./useBudgetProgress";

export { useBudgetInsights } from "./useBudgetInsights";
export type {
  MonthlyData,
  TopCategory,
  BudgetInsightsResult,
} from "./useBudgetInsights";
