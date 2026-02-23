import React from "react";
import { View, Text, ActivityIndicator, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBudgetInsights } from "../../../hooks/useBudgetInsights";
import { COLORS } from "../../../config/colors";
import TrendChart from "./TrendChart";
import TopCategoriesCard from "./TopCategoriesCard";
import StatsCard from "./StatsCard";

interface InsightsViewProps {
  currencySymbol: string;
}

const InsightsView: React.FC<InsightsViewProps> = ({ currencySymbol }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const {
    monthlyTrend,
    topCategories,
    savingsRate,
    averageDailySpend,
    monthOverMonthChange,
    cycleIncome,
    cycleExpenses,
    loading,
    error,
  } = useBudgetInsights();

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
          Loading insights...
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
          Failed to load insights
        </Text>
        <Text className="mt-2 text-sm" style={{ color: textSecondary }}>
          {error}
        </Text>
      </View>
    );
  }

  // Empty state - no data
  const hasData = monthlyTrend.some((m) => m.income > 0 || m.expenses > 0);
  if (!hasData) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <View
          className="w-20 h-20 rounded-full items-center justify-center mb-4"
          style={{
            backgroundColor: isDark
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.05)",
          }}
        >
          <Ionicons name="analytics-outline" size={40} color={textSecondary} />
        </View>
        <Text
          className="text-lg font-semibold mb-2"
          style={{ color: textPrimary }}
        >
          No insights yet
        </Text>
        <Text
          className="text-sm text-center px-8"
          style={{ color: textSecondary }}
        >
          Start tracking your income and expenses to see spending trends and insights here.
        </Text>
      </View>
    );
  }

  return (
    <View>
      {/* Trend Chart - 6 Month Income vs Expenses */}
      <TrendChart
        monthlyTrend={monthlyTrend}
        currencySymbol={currencySymbol}
      />

      {/* Key Stats */}
      <StatsCard
        savingsRate={savingsRate}
        averageDailySpend={averageDailySpend}
        monthOverMonthChange={monthOverMonthChange}
        cycleIncome={cycleIncome}
        cycleExpenses={cycleExpenses}
        currencySymbol={currencySymbol}
      />

      {/* Top Spending Categories */}
      <TopCategoriesCard
        categories={topCategories}
        currencySymbol={currencySymbol}
      />
    </View>
  );
};

export default InsightsView;
