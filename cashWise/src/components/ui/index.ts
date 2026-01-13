// UI Components - Purely presentational components that don't know about business logic
// These components only take props and render UI

export { default as GradientBackground } from "./GradientBackground";
export { default as NavigationHeader } from "./NavigationHeader";
export { default as ModeSwitcher } from "./ModeSwitcher";
export type { ModeOption } from "./ModeSwitcher";

// Typography Components - Custom fonts with distinctive character
export {
  Typography,
  // Display variants (Fraunces - distinctive serif)
  DisplayLarge,
  DisplayMedium,
  DisplaySmall,
  // Headings (Fraunces)
  H1,
  H2,
  H3,
  H4,
  // Body text (Plus Jakarta Sans - refined sans-serif)
  BodyLarge,
  Body,
  BodySmall,
  // Labels
  LabelLarge,
  Label,
  LabelSmall,
  // Financial amounts
  AmountLarge,
  AmountMedium,
  AmountSmall,
  // Captions & supporting
  Caption,
  Overline,
  // Buttons
  ButtonText,
  ButtonTextLarge,
  ButtonTextSmall,
  // Navigation
  NavLabel,
  // Raw text (just font family, no preset sizes)
  DisplayText,
  BodyText,
} from "./Typography";

// Animated Components - Motion system for delightful interactions
export {
  // Basic entrance animations
  FadeInView,
  FadeUpView,
  ScaleInView,
  SlideInFromBottom,
  SlideInFromTop,
  SlideInFromLeft,
  SlideInFromRight,
  // List/item animations
  AnimatedItem,
  LayoutAnimatedView,
  // Page orchestration
  PageEntrance,
  // Re-exported Reanimated presets
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideInUp,
  ZoomIn,
  ZoomOut,
  Layout,
  LinearTransition,
} from "./Animated";

// Staggered animations for lists and groups
export {
  StaggeredItem,
  StaggeredList,
  StaggeredChildren,
  AnimatedSection,
} from "./Animated/StaggeredList";

// Interactive pressable components
export {
  ScalePressable,
  BouncePressable,
  HighlightPressable,
  RipplePressable,
  PulseButton,
} from "./Animated/Pressable";
