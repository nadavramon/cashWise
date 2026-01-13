import React from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { ActivityIndicator, View, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { TransactionsProvider } from "./src/context/TransactionsContext";
import { CategoriesProvider } from "./src/context/CategoriesContext";
import { ProfileProvider } from "./src/context/ProfileContext";
import { BudgetProvider } from "./src/context/BudgetContext";

import BottomTabs from "./src/navigation/BottomTabs";
import AuthStack from "./src/navigation/AuthStack";



// Import your wrapper
import { GradientBackground } from "./src/components/ui";

import { AuthProvider, useAuth } from "./src/context/AuthContext";
// ... imports

// Internal component to handle conditional rendering based on auth state
const AppContent = () => {
  const { user, checkingAuth } = useAuth();
  const scheme = useColorScheme();

  const TransparentNavTheme = {
    ...(scheme === "dark" ? DarkTheme : DefaultTheme),
    colors: {
      ...(scheme === "dark" ? DarkTheme.colors : DefaultTheme.colors),
      background: "transparent",
    },
  };

  if (checkingAuth) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator
          size="large"
          color={scheme === "dark" ? "#fff" : "#007CBE"}
        />
      </View>
    );
  }

  return (
    <NavigationContainer theme={TransparentNavTheme}>
      {user ? <BottomTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GradientBackground>
        <AuthProvider>
          <ProfileProvider>
            <CategoriesProvider>
              <TransactionsProvider>
                <BudgetProvider>
                  <AppContent />
                </BudgetProvider>
              </TransactionsProvider>
            </CategoriesProvider>
          </ProfileProvider>
        </AuthProvider>
      </GradientBackground>
    </GestureHandlerRootView>
  );
}
