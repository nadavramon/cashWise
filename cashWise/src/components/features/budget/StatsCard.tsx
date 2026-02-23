import React from "react";
import { View, Text, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { LinearTransition } from "react-native-reanimated";
import { COLORS } from "../../../config/colors";

interface StatItemProps {
  label: string;
  value: string;
  subValue?: string;
  icon: string;
  iconColor: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  subValue,
  icon,
  iconColor,
  trend,
  trendValue,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const textPrimary = isDark
    ? COLORS.dark.textPrimary
    : COLORS.light.textPrimary;
  const textSecondary = isDark
    ? COLORS.dark.textSecondary
    : COLORS.light.textSecondary;

  const getTrendColor = () => {
    if (!trend) return textSecondary;
    if (trend === "up") return isDark ? COLORS.dark.error : COLORS.light.error;
    if (trend === "down")
      return isDark ? COLORS.dark.success : COLORS.light.success;
    return textSecondary;
  };

  const getTrendIcon = () => {
    if (trend === "up") return "arrow-up";
    if (trend === "down") return "arrow-down";
    return "remove";
  };

  return (
    <View
      className="flex-1 p-4 rounded-2xl mr-3 last:mr-0"
      style={{
        backgroundColor: isDark
          ? "rgba(255,255,255,0.05)"
          : "rgba(0,0,0,0.03)",
      }}
    >
      {/* Icon */}
      <View
        className="w-10 h-10 rounded-full items-center justify-center mb-3"
        style={{ backgroundColor: `${iconColor}20` }}
      >
        <Ionicons name={icon as any} size={20} color={iconColor} />
      </View>

      {/* Label */}
      <Text className="text-xs mb-1" style={{ color: textSecondary }}>
        {label}
      </Text>

      {/* Value */}
      <Text className="text-lg font-bold" style={{ color: textPrimary }}>
        {value}
      </Text>

      {/* Sub Value or Trend */}
      {(subValue || trendValue) && (
        <View className="flex-row items-center mt-1">
          {trend && (
            <Ionicons
              name={getTrendIcon() as any}
              size={12}
              color={getTrendColor()}
              style={{ marginRight: 2 }}
            />
          )}
          <Text className="text-xs" style={{ color: getTrendColor() }}>
            {trendValue || subValue}
          </Text>
        </View>
      )}
    </View>
  );
};

interface StatsCardProps {
  savingsRate: number;
  averageDailySpend: number;
  monthOverMonthChange: number;
  cycleIncome: number;
  cycleExpenses: number;
  currencySymbol: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  savingsRate,
  averageDailySpend,
  monthOverMonthChange,
  cycleIncome,
  cycleExpenses,
  currencySymbol,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const textPrimary = isDark
    ? COLORS.dark.textPrimary
    : COLORS.light.textPrimary;
  const successColor = isDark ? COLORS.dark.success : COLORS.light.success;
  const warningColor = isDark ? COLORS.dark.warning : COLORS.light.warning;
  const themeColor = isDark ? COLORS.dark.primary : COLORS.light.primary;

  // Determine savings rate color
  const getSavingsColor = () => {
    if (savingsRate >= 20) return successColor;
    if (savingsRate >= 10) return warningColor;
    return isDark ? COLORS.dark.error : COLORS.light.error;
  };

  // Format currency
  const formatAmount = (amount: number): string => {
    if (amount >= 1000) {
      return `${currencySymbol}${(amount / 1000).toFixed(1)}k`;
    }
    return `${currencySymbol}${amount.toFixed(0)}`;
  };

  // Determine month over month trend
  const momTrend: "up" | "down" | "neutral" =
    monthOverMonthChange > 1
      ? "up"
      : monthOverMonthChange < -1
        ? "down"
        : "neutral";

  return (
    <Animated.View
      layout={LinearTransition.springify().damping(15)}
      className="rounded-3xl p-5 mb-4 bg-white/80 dark:bg-[#1e1e1e]/60"
    >
      {/* Header */}
      <Text className="text-base font-semibold mb-4" style={{ color: textPrimary }}>
        Key Stats
      </Text>

      {/* Stats Grid - Row 1 */}
      <View className="flex-row mb-3">
        <StatItem
          label="Savings Rate"
          value={`${savingsRate >= 0 ? savingsRate.toFixed(0) : 0}%`}
          subValue={savingsRate >= 20 ? "Great!" : savingsRate >= 10 ? "Good" : "Needs work"}
          icon="trending-up"
          iconColor={getSavingsColor()}
        />
        <StatItem
          label="Daily Average"
          value={formatAmount(averageDailySpend)}
          subValue="per day"
          icon="calendar"
          iconColor={themeColor}
        />
      </View>

      {/* Stats Grid - Row 2 */}
      <View className="flex-row">
        <StatItem
          label="This Cycle"
          value={formatAmount(cycleExpenses)}
          subValue={`of ${formatAmount(cycleIncome)} income`}
          icon="wallet"
          iconColor={isDark ? COLORS.dark.expense : COLORS.light.expense}
        />
        <StatItem
          label="vs Last Month"
          value={`${monthOverMonthChange >= 0 ? "+" : ""}${monthOverMonthChange.toFixed(0)}%`}
          trend={momTrend}
          trendValue={
            momTrend === "up"
              ? "Spending more"
              : momTrend === "down"
                ? "Spending less"
                : "About the same"
          }
          icon="stats-chart"
          iconColor={
            momTrend === "down"
              ? successColor
              : momTrend === "up"
                ? (isDark ? COLORS.dark.error : COLORS.light.error)
                : textPrimary
          }
        />
      </View>
    </Animated.View>
  );
};

export default StatsCard;
