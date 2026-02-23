import React, { useMemo } from "react";
import { View, Text, useColorScheme } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../config/colors";
import { useBudget } from "../../../context/BudgetContext";

interface OverallProgressCardProps {
  totalBudgeted: number;
  totalSpent: number;
  totalRemaining: number;
  overallPercentage: number;
  currencySymbol: string;
}

/**
 * Get progress color based on percentage
 */
function getProgressColor(percentage: number, isDark: boolean): string {
  if (percentage <= 50) {
    return isDark ? COLORS.dark.success : COLORS.light.success;
  }
  if (percentage <= 80) {
    return isDark ? COLORS.dark.warning : COLORS.light.warning;
  }
  if (percentage <= 100) {
    return isDark ? COLORS.dark.error : COLORS.light.error;
  }
  // Over budget - purple
  return isDark ? "#A855F7" : "#9333EA";
}

const OverallProgressCard: React.FC<OverallProgressCardProps> = ({
  totalBudgeted,
  totalSpent,
  totalRemaining,
  overallPercentage,
  currencySymbol,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { cycleStartDate, cycleEndExclusive } = useBudget();

  const progressColor = getProgressColor(overallPercentage, isDark);
  const isOverBudget = totalSpent > totalBudgeted;
  const progressWidth = Math.min(overallPercentage, 100);

  const textPrimary = isDark
    ? COLORS.dark.textPrimary
    : COLORS.light.textPrimary;
  const textSecondary = isDark
    ? COLORS.dark.textSecondary
    : COLORS.light.textSecondary;

  // Calculate days remaining in cycle
  const daysRemaining = useMemo(() => {
    if (!cycleEndExclusive) return null;
    const today = new Date();
    const endDate = new Date(cycleEndExclusive);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }, [cycleEndExclusive]);

  // Format cycle dates
  const cycleDateLabel = useMemo(() => {
    if (!cycleStartDate || !cycleEndExclusive) return "";
    const startDate = new Date(cycleStartDate);
    const endDate = new Date(cycleEndExclusive);
    endDate.setDate(endDate.getDate() - 1); // Convert exclusive to inclusive

    const format = (d: Date) =>
      `${d.getDate()} ${d.toLocaleDateString("en-US", { month: "short" })}`;
    return `${format(startDate)} - ${format(endDate)}`;
  }, [cycleStartDate, cycleEndExclusive]);

  return (
    <Animated.View
      layout={LinearTransition.springify().damping(15)}
      className="rounded-3xl p-5 mb-6 bg-white/80 dark:bg-[#1e1e1e]/60"
    >
      {/* Header: Cycle Date */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-sm font-medium" style={{ color: textSecondary }}>
          {cycleDateLabel}
        </Text>
        {daysRemaining !== null && (
          <View className="flex-row items-center">
            <Ionicons
              name="time-outline"
              size={14}
              color={textSecondary}
              style={{ marginRight: 4 }}
            />
            <Text className="text-sm" style={{ color: textSecondary }}>
              {daysRemaining} {daysRemaining === 1 ? "day" : "days"} left
            </Text>
          </View>
        )}
      </View>

      {/* Main Amount Display */}
      <View className="items-center mb-4">
        <Text className="text-sm mb-1" style={{ color: textSecondary }}>
          {isOverBudget ? "Over budget" : "Remaining"}
        </Text>
        <Text
          className="text-4xl font-bold"
          style={{ color: isOverBudget ? progressColor : textPrimary }}
        >
          {isOverBudget ? "-" : ""}
          {currencySymbol}
          {Math.abs(totalRemaining).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </Text>
        <Text className="text-sm mt-1" style={{ color: textSecondary }}>
          of {currencySymbol}
          {totalBudgeted.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}{" "}
          budgeted
        </Text>
      </View>

      {/* Progress Bar */}
      <View className="mb-3">
        <View
          className="h-3 rounded-full overflow-hidden"
          style={{
            backgroundColor: isDark
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.08)",
          }}
        >
          <View
            className="h-full rounded-full"
            style={{
              width: `${progressWidth}%`,
              backgroundColor: progressColor,
            }}
          />
        </View>
      </View>

      {/* Footer: Spent vs Budgeted */}
      <View className="flex-row justify-between">
        <View>
          <Text className="text-xs" style={{ color: textSecondary }}>
            Spent
          </Text>
          <Text className="text-base font-semibold" style={{ color: textPrimary }}>
            {currencySymbol}
            {totalSpent.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-xs" style={{ color: textSecondary }}>
            Used
          </Text>
          <Text
            className="text-base font-semibold"
            style={{ color: progressColor }}
          >
            {overallPercentage > 999
              ? "999+%"
              : `${Math.round(overallPercentage)}%`}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xs" style={{ color: textSecondary }}>
            Budgeted
          </Text>
          <Text className="text-base font-semibold" style={{ color: textPrimary }}>
            {currencySymbol}
            {totalBudgeted.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </Text>
        </View>
      </View>

      {/* Over Budget Warning */}
      {isOverBudget && (
        <View
          className="flex-row items-center mt-4 px-4 py-3 rounded-xl"
          style={{ backgroundColor: `${progressColor}15` }}
        >
          <Ionicons name="warning" size={20} color={progressColor} />
          <Text
            className="text-sm ml-3 font-medium flex-1"
            style={{ color: progressColor }}
          >
            You've exceeded your budget by {currencySymbol}
            {Math.abs(totalRemaining).toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

export default OverallProgressCard;
