import React from "react";
import { View, Text, ActivityIndicator, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBudgetProgress } from "../../../hooks/useBudgetProgress";
import { COLORS } from "../../../config/colors";
import OverallProgressCard from "./OverallProgressCard";
import BudgetProgressCard from "./BudgetProgressCard";

interface RemainingViewProps {
  currencySymbol: string;
}

const RemainingView: React.FC<RemainingViewProps> = ({ currencySymbol }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const {
    categories,
    totalBudgeted,
    totalSpent,
    totalRemaining,
    overallPercentage,
    loading,
    error,
  } = useBudgetProgress();

  const textPrimary = isDark
    ? COLORS.dark.textPrimary
    : COLORS.light.textPrimary;
  const textSecondary = isDark
    ? COLORS.dark.textSecondary
    : COLORS.light.textSecondary;
  const themeColor = isDark ? COLORS.dark.primary : COLORS.light.primary;

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <ActivityIndicator size="large" color={themeColor} />
        <Text className="mt-4 text-sm" style={{ color: textSecondary }}>
          Loading budget progress...
        </Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Ionicons name="alert-circle-outline" size={48} color={textSecondary} />
        <Text className="mt-4 text-base" style={{ color: textPrimary }}>
          Failed to load budget
        </Text>
        <Text className="mt-2 text-sm" style={{ color: textSecondary }}>
          {error}
        </Text>
      </View>
    );
  }

  // Empty state - no budgets set
  if (categories.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <View
          className="w-20 h-20 rounded-full items-center justify-center mb-4"
          style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }}
        >
          <Ionicons name="wallet-outline" size={40} color={textSecondary} />
        </View>
        <Text className="text-lg font-semibold mb-2" style={{ color: textPrimary }}>
          No budgets set
        </Text>
        <Text className="text-sm text-center px-8" style={{ color: textSecondary }}>
          Set category budgets in the Plan tab to track your spending progress here.
        </Text>
      </View>
    );
  }

  return (
    <View>
      {/* Overall Progress Card */}
      <OverallProgressCard
        totalBudgeted={totalBudgeted}
        totalSpent={totalSpent}
        totalRemaining={totalRemaining}
        overallPercentage={overallPercentage}
        currencySymbol={currencySymbol}
      />

      {/* Category Section Header */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-base font-semibold" style={{ color: textPrimary }}>
          By Category
        </Text>
        <Text className="text-sm" style={{ color: textSecondary }}>
          {categories.length} {categories.length === 1 ? "category" : "categories"}
        </Text>
      </View>

      {/* Category Progress Cards */}
      {categories.map((progress) => (
        <BudgetProgressCard
          key={progress.categoryCode}
          progress={progress}
          currencySymbol={currencySymbol}
        />
      ))}
    </View>
  );
};

export default RemainingView;
