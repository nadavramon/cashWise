import React, { useEffect, useState } from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { ActivityIndicator, View, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import BottomTabs from "./src/navigation/BottomTabs";
import AuthStack from "./src/navigation/AuthStack";

import { getCurrentUser } from "aws-amplify/auth";
import AuthContext from "./src/context/AuthContext";
import {
  extractUserId,
  extractUserEmail,
  extractUsername,
} from "./src/utils/authUser";
import { TransactionsProvider } from "./src/context/TransactionsContext";
import { CategoriesProvider } from "./src/context/CategoriesContext";
import { ProfileProvider } from "./src/context/ProfileContext";
import { BudgetProvider } from "./src/context/BudgetContext";
import { AmplifyUser } from "./src/types/models";

// Import your wrapper
import GradientBackground from "./src/components/GradientBackground";

export default function App() {
  const [user, setUser] = useState<AmplifyUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // 1. Get the current scheme to sync Navigation text colors with your Gradient
  const scheme = useColorScheme();

  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkCurrentUser();
  }, []);

  // 2. Define a Navigation Theme that is transparent
  // This ensures screens don't have a white/black block covering your gradient
  const TransparentNavTheme = {
    ...(scheme === "dark" ? DarkTheme : DefaultTheme),
    colors: {
      ...(scheme === "dark" ? DarkTheme.colors : DefaultTheme.colors),
      background: "transparent", // CRITICAL: Lets the gradient show through
    },
  };

  if (checkingAuth) {
    // Optional: You can wrap this in GradientBackground too if you want
    return (
      <GradientBackground>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator
            size="large"
            color={scheme === "dark" ? "#fff" : "#007CBE"}
          />
        </View>
      </GradientBackground>
    );
  }

  const userId = extractUserId(user);
  const email = extractUserEmail(user);
  const username = extractUsername(user);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* 3. Wrap the whole app in the Gradient */}
      <GradientBackground>
        <AuthContext.Provider
          value={{ user, userId, username, email, setUser }}
        >
          <ProfileProvider>
            <CategoriesProvider>
              <TransactionsProvider>
                <BudgetProvider>
                  {/* 4. Pass the transparent theme to NavigationContainer */}
                  <NavigationContainer theme={TransparentNavTheme}>
                    {user ? <BottomTabs /> : <AuthStack />}
                  </NavigationContainer>
                </BudgetProvider>
              </TransactionsProvider>
            </CategoriesProvider>
          </ProfileProvider>
        </AuthContext.Provider>
      </GradientBackground>
    </GestureHandlerRootView>
  );
}
