import { useFonts as useExpoFonts } from "expo-font";
import {
  Fraunces_300Light,
  Fraunces_400Regular,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
  Fraunces_900Black,
  Fraunces_300Light_Italic,
  Fraunces_400Regular_Italic,
  Fraunces_500Medium_Italic,
  Fraunces_600SemiBold_Italic,
  Fraunces_700Bold_Italic,
} from "@expo-google-fonts/fraunces";
import {
  PlusJakartaSans_200ExtraLight,
  PlusJakartaSans_300Light,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  PlusJakartaSans_200ExtraLight_Italic,
  PlusJakartaSans_300Light_Italic,
  PlusJakartaSans_400Regular_Italic,
  PlusJakartaSans_500Medium_Italic,
  PlusJakartaSans_600SemiBold_Italic,
  PlusJakartaSans_700Bold_Italic,
  PlusJakartaSans_800ExtraBold_Italic,
} from "@expo-google-fonts/plus-jakarta-sans";

/**
 * Custom hook to load all app fonts
 *
 * Font pairing:
 * - Fraunces: Distinctive display serif for headings
 * - Plus Jakarta Sans: Refined body sans-serif for content
 *
 * @returns [fontsLoaded, fontError] tuple
 */
export function useFonts(): [boolean, Error | null] {
  const [fontsLoaded, fontError] = useExpoFonts({
    // Fraunces - Display font (serif with character)
    Fraunces_300Light,
    Fraunces_400Regular,
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    Fraunces_900Black,
    Fraunces_300Light_Italic,
    Fraunces_400Regular_Italic,
    Fraunces_500Medium_Italic,
    Fraunces_600SemiBold_Italic,
    Fraunces_700Bold_Italic,
    // Plus Jakarta Sans - Body font (refined sans-serif)
    PlusJakartaSans_200ExtraLight,
    PlusJakartaSans_300Light,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    PlusJakartaSans_200ExtraLight_Italic,
    PlusJakartaSans_300Light_Italic,
    PlusJakartaSans_400Regular_Italic,
    PlusJakartaSans_500Medium_Italic,
    PlusJakartaSans_600SemiBold_Italic,
    PlusJakartaSans_700Bold_Italic,
    PlusJakartaSans_800ExtraBold_Italic,
  });

  return [fontsLoaded, fontError];
}
