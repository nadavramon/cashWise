import React from "react";
import { View, Text, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { LinearTransition } from "react-native-reanimated";
import { COLORS } from "../../../config/colors";
import { TopCategory } from "../../../hooks/useBudgetInsights";

interface TopCategoriesCardProps {
  categories: TopCategory[];
  currencySymbol: string;
}

const TopCategoriesCard: React.FC<TopCategoriesCardProps> = ({
  categories,
  currencySymbol,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const textPrimary = isDark
    ? COLORS.dark.textPrimary
    : COLORS.light.textPrimary;
  const textSecondary = isDark
    ? COLORS.dark.textSecondary
    : COLORS.light.textSecondary;

  if (categories.length === 0) {
    return (
      <Animated.View
        layout={LinearTransition.springify().damping(15)}
        className="rounded-3xl p-5 mb-4 bg-white/80 dark:bg-[#1e1e1e]/60"
      >
        <Text className="text-base font-semibold mb-4" style={{ color: textPrimary }}>
          Top Spending Categories
        </Text>
        <View className="items-center py-6">
          <Ionicons name="pie-chart-outline" size={32} color={textSecondary} />
          <Text className="text-sm mt-2" style={{ color: textSecondary }}>
            No spending data yet
          </Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      layout={LinearTransition.springify().damping(15)}
      className="rounded-3xl p-5 mb-4 bg-white/80 dark:bg-[#1e1e1e]/60"
    >
      {/* Header */}
      <Text className="text-base font-semibold mb-4" style={{ color: textPrimary }}>
        Top Spending Categories
      </Text>

      {/* Category List */}
      {categories.map((category, index) => (
        <View
          key={category.categoryId}
          className={`flex-row items-center py-3 ${
            index < categories.length - 1
              ? "border-b border-gray-200 dark:border-gray-700"
              : ""
          }`}
        >
          {/* Rank Number */}
          <View
            className="w-6 h-6 rounded-full items-center justify-center mr-3"
            style={{
              backgroundColor: isDark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
            }}
          >
            <Text className="text-xs font-bold" style={{ color: textSecondary }}>
              {index + 1}
            </Text>
          </View>

          {/* Category Icon */}
          <View
            className="w-8 h-8 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: `${category.groupColor}20` }}
          >
            <Ionicons
              name={category.icon as any}
              size={16}
              color={category.groupColor}
            />
          </View>

          {/* Category Name */}
          <View className="flex-1">
            <Text
              className="text-sm font-medium"
              style={{ color: textPrimary }}
              numberOfLines={1}
            >
              {category.categoryLabel}
            </Text>
            <Text className="text-xs" style={{ color: textSecondary }}>
              {category.percentage.toFixed(1)}% of total
            </Text>
          </View>

          {/* Amount */}
          <Text className="text-sm font-semibold" style={{ color: textPrimary }}>
            {currencySymbol}
            {category.amount.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </Text>
        </View>
      ))}
    </Animated.View>
  );
};

export default TopCategoriesCard;
