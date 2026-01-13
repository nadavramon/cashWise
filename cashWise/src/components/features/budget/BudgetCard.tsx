import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { PieChart } from "react-native-gifted-charts";
import { CATEGORY_REPO } from "../../../data/categoryRepo";
import { PlannedBudgetItem } from "../../../types/budget";
import { t } from "../../../config/i18n";
import { useProfile } from "../../../context/ProfileContext";

interface BudgetCardProps {
  plannedBudgets: PlannedBudgetItem[];
  totalPlannedExpenses: number;
  totalIncome: number;
  currencySymbol: string;
}

const BudgetCard: React.FC<BudgetCardProps> = ({
  plannedBudgets,
  totalPlannedExpenses,
  totalIncome,
  currencySymbol,
}) => {
  const { profile } = useProfile();
  const language = profile?.language || "en";
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Chart Data derived from Planned Budgets
  const chartData = useMemo(() => {
    return plannedBudgets.map((item) => {
      const group = CATEGORY_REPO.find((g) => g.id === item.groupId);
      return {
        value: item.amount,
        color: group?.color || "#999",
        text: item.subCategoryLabel,
      };
    });
  }, [plannedBudgets]);

  return (
    <Animated.View
      layout={LinearTransition.springify().damping(15)}
      className="rounded-3xl p-4 overflow-hidden mb-6 bg-white/80 dark:bg-[#1e1e1e]/60"
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={isExpanded ? toggleExpand : undefined}
      >
        <View className="flex-row items-center justify-between">
          {/* Left: Chart */}
          <View className="w-20 h-20 items-center justify-center mr-4">
            <PieChart
              data={
                chartData.length > 0 ? chartData : [{ value: 1, color: "#ddd" }]
              }
              donut
              radius={40}
              innerRadius={30}
              semiCircle={false}
            />
          </View>

          {/* Right: Text Info */}
          <View className="flex-1 justify-center">
            <Text className="text-sm mb-1 text-[#666] dark:text-[#CCC]">
              {t("totalPlannedExpenses", language)}
            </Text>
            <Text className="text-2xl font-bold text-[#333] dark:text-white">
              {currencySymbol}
              {totalPlannedExpenses.toLocaleString()}
            </Text>
          </View>

          {/* Far Right: Expand Button (only visible when collapsed) */}
          {!isExpanded && (
            <TouchableOpacity onPress={toggleExpand} className="p-2">
              <Ionicons
                name="chevron-down"
                size={24}
                className="text-[#666] dark:text-[#CCC]" // Note: Ionicons doesn't accept className for color, handle via props
                color={useColorScheme() === "dark" ? "#CCC" : "#666"}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Expanded Content: List */}
        {isExpanded && (
          <View className="mt-4">
            <View className="h-[1px] bg-[rgba(150,150,150,0.2)] mb-4" />
            {plannedBudgets.map((item) => {
              const percentageOfIncome =
                totalIncome > 0
                  ? ((item.amount / totalIncome) * 100).toFixed(1)
                  : "0.0";

              const group = CATEGORY_REPO.find((g) => g.id === item.groupId);
              const color = group?.color || "#999";

              return (
                <View
                  key={item.id}
                  className="flex-row items-center justify-between mb-3"
                >
                  <View className="flex-row items-center">
                    <View
                      className="w-4 h-4 rounded-md mr-3"
                      style={{ backgroundColor: color }}
                    />
                    <Text className="text-base font-medium mr-2 text-[#333] dark:text-white">
                      {item.subCategoryLabel}
                    </Text>
                    <Text className="text-sm text-[#666] dark:text-[#CCC]">
                      {percentageOfIncome}%
                    </Text>
                  </View>
                  <Text className="text-base font-semibold text-[#333] dark:text-white">
                    {currencySymbol}
                    {item.amount.toLocaleString()}
                  </Text>
                </View>
              );
            })}
            {plannedBudgets.length === 0 && (
              <Text className="text-center mt-2.5 italic text-[#666] dark:text-[#CCC]">
                {t("noPlannedExpenses", language)}
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};



export default BudgetCard;
