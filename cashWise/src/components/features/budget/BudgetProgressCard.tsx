import React from "react";
import { View, Text, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PieChart } from "react-native-gifted-charts";
import { CategoryProgress } from "../../../hooks/useBudgetProgress";
import { COLORS } from "../../../config/colors";

interface BudgetProgressCardProps {
  progress: CategoryProgress;
  currencySymbol: string;
}

/**
 * Get progress color based on percentage:
 * - Green: < 50% (healthy)
 * - Amber: 50-80% (caution)
 * - Red: 80-100% (warning)
 * - Purple: > 100% (over budget)
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

const BudgetProgressCard: React.FC<BudgetProgressCardProps> = ({
  progress,
  currencySymbol,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const progressColor = getProgressColor(progress.percentage, isDark);
  const bgColor = isDark ? COLORS.dark.surface : COLORS.light.surface;
  const textPrimary = isDark
    ? COLORS.dark.textPrimary
    : COLORS.light.textPrimary;
  const textSecondary = isDark
    ? COLORS.dark.textSecondary
    : COLORS.light.textSecondary;

  // Pie chart data for circular progress
  // Show percentage used vs remaining
  const usedPercentage = Math.min(progress.percentage, 100);
  const remainingPercentage = Math.max(100 - usedPercentage, 0);

  const pieData = [
    { value: usedPercentage, color: progressColor },
    {
      value: remainingPercentage,
      color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
    },
  ];

  // If over budget, show full circle in progress color
  if (progress.isOverBudget) {
    pieData[0].value = 100;
    pieData[1].value = 0;
  }

  return (
    <View
      className="rounded-2xl p-4 mb-3"
      style={{ backgroundColor: isDark ? "rgba(255,255,255,0.05)" : bgColor }}
    >
      <View className="flex-row items-center">
        {/* Left: Circular Progress */}
        <View className="w-16 h-16 items-center justify-center mr-4">
          <PieChart
            data={pieData}
            donut
            radius={28}
            innerRadius={20}
            centerLabelComponent={() => (
              <View className="items-center justify-center">
                <Text
                  style={{ color: progressColor }}
                  className="text-xs font-bold"
                >
                  {progress.percentage > 999
                    ? "999+"
                    : `${Math.round(progress.percentage)}%`}
                </Text>
              </View>
            )}
          />
        </View>

        {/* Middle: Category Info */}
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <View
              className="w-6 h-6 rounded-full items-center justify-center mr-2"
              style={{ backgroundColor: `${progress.groupColor}20` }}
            >
              <Ionicons
                name={progress.icon as any}
                size={14}
                color={progress.groupColor}
              />
            </View>
            <Text
              className="text-base font-semibold flex-1"
              style={{ color: textPrimary }}
              numberOfLines={1}
            >
              {progress.categoryLabel}
            </Text>
          </View>

          {/* Spent / Budgeted */}
          <Text className="text-sm" style={{ color: textSecondary }}>
            {currencySymbol}
            {progress.spent.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}{" "}
            / {currencySymbol}
            {progress.budgeted.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </Text>
        </View>

        {/* Right: Remaining Amount */}
        <View className="items-end">
          <Text
            className="text-base font-bold"
            style={{
              color: progress.isOverBudget ? progressColor : textPrimary,
            }}
          >
            {progress.isOverBudget ? "-" : ""}
            {currencySymbol}
            {Math.abs(progress.remaining).toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </Text>
          <Text
            className="text-xs"
            style={{
              color: progress.isOverBudget ? progressColor : textSecondary,
            }}
          >
            {progress.isOverBudget ? "over budget" : "remaining"}
          </Text>
        </View>
      </View>

      {/* Over Budget Warning Badge */}
      {progress.isOverBudget && (
        <View
          className="flex-row items-center mt-3 px-3 py-2 rounded-lg"
          style={{ backgroundColor: `${progressColor}15` }}
        >
          <Ionicons name="warning" size={16} color={progressColor} />
          <Text className="text-xs ml-2 font-medium" style={{ color: progressColor }}>
            Over budget by {currencySymbol}
            {Math.abs(progress.remaining).toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </Text>
        </View>
      )}
    </View>
  );
};

export default BudgetProgressCard;
