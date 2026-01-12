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
  const isDark = useColorScheme() === "dark";
  const [isExpanded, setIsExpanded] = useState(false);

  const textColor = isDark ? "#FFFFFF" : "#333333";
  const subTextColor = isDark ? "#CCCCCC" : "#666666";
  const cardBg = isDark ? "rgba(30, 30, 30, 0.6)" : "rgba(255, 255, 255, 0.8)";

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
  }, [plannedBudgets, textColor]);

  return (
    <Animated.View
      layout={LinearTransition.springify().damping(15)}
      style={[styles.card, { backgroundColor: cardBg }]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={isExpanded ? toggleExpand : undefined}
      >
        <View style={styles.cardHeader}>
          {/* Left: Chart */}
          <View style={styles.chartContainer}>
            <PieChart
              data={
                chartData.length > 0
                  ? chartData
                  : [{ value: 1, color: "#ddd" }]
              }
              donut
              radius={40}
              innerRadius={30}
              semiCircle={false}
            />
          </View>

          {/* Right: Text Info */}
          <View style={styles.cardInfo}>
            <Text style={[styles.cardLabel, { color: subTextColor }]}>
              {t("totalPlannedExpenses", language)}
            </Text>
            <Text style={[styles.cardAmount, { color: textColor }]}>
              {currencySymbol}
              {totalPlannedExpenses.toLocaleString()}
            </Text>
          </View>

          {/* Far Right: Expand Button (only visible when collapsed) */}
          {!isExpanded && (
            <TouchableOpacity onPress={toggleExpand} style={styles.expandButton}>
              <Ionicons name="chevron-down" size={24} color={subTextColor} />
            </TouchableOpacity>
          )}
        </View>

        {/* Expanded Content: List */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.divider} />
            {plannedBudgets.map((item) => {
              const percentageOfIncome =
                totalIncome > 0
                  ? ((item.amount / totalIncome) * 100).toFixed(1)
                  : "0.0";

              const group = CATEGORY_REPO.find((g) => g.id === item.groupId);
              const color = group?.color || "#999";

              return (
                <View key={item.id} style={styles.listItem}>
                  <View style={styles.listItemLeft}>
                    <View style={[styles.colorDot, { backgroundColor: color }]} />
                    <Text style={[styles.itemName, { color: textColor }]}>
                      {item.subCategoryLabel}
                    </Text>
                    <Text
                      style={[styles.itemPercentage, { color: subTextColor }]}
                    >
                      {percentageOfIncome}%
                    </Text>
                  </View>
                  <Text style={[styles.itemAmount, { color: textColor }]}>
                    {currencySymbol}
                    {item.amount.toLocaleString()}
                  </Text>
                </View>
              );
            })}
            {plannedBudgets.length === 0 && (
              <Text style={[styles.noDataText, { color: subTextColor }]}>
                {t("noPlannedExpenses", language)}
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 16,
    overflow: "hidden",
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chartContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
    justifyContent: "center",
  },
  cardLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  cardAmount: {
    fontSize: 24,
    fontWeight: "700",
  },
  expandButton: {
    padding: 8,
  },
  expandedContent: {
    marginTop: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(150, 150, 150, 0.2)",
    marginBottom: 16,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 6,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 8,
  },
  itemPercentage: {
    fontSize: 14,
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  noDataText: {
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },
});

export default BudgetCard;
