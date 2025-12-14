import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  useColorScheme,
  Dimensions,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";

import { useOverviewCycle } from "../../../context/CycleContext";
import { useProfile } from "../../../context/ProfileContext";
import { useCategories } from "../../../context/CategoriesContext";
import { computePeriodTotals } from "../../../utils/overview";
import { getCurrencySymbol } from "../../../utils/currency";

interface SpendingViewProps {
  themeColor: string;
}

const SpendingView: React.FC<SpendingViewProps> = ({ themeColor }) => {
  const isDarkMode = useColorScheme() === "dark";
  const textColor = isDarkMode ? "#FFFFFF" : "#333333";
  const subTextColor = isDarkMode ? "#CCCCCC" : "#666666";
  const cardBg = isDarkMode ? "rgba(30, 30, 30, 0.8)" : "#FFFFFF";
  const cardBorder = isDarkMode ? "rgba(255,255,255,0.1)" : "#ddd";

  const { width } = Dimensions.get("window");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // --- State ---
  const [filter, setFilter] = useState<"EXPENSES" | "INCOME" | "SAVINGS">(
    "EXPENSES",
  );

  // --- Context ---
  const { transactions } = useOverviewCycle();
  const { profile } = useProfile();
  const { categories } = useCategories();

  const currencySymbol = getCurrencySymbol(profile?.currency);
  const formatAmount = (amount: number) =>
    `${currencySymbol}${amount.toFixed(2)}`;
  const cycleBudget = 5000; // Hardcoded for now, as in OverviewScreen

  // --- Data Derivation ---
  const totals = React.useMemo(
    () => computePeriodTotals(transactions),
    [transactions],
  );

  // Breakdown Logic (Pie + List)
  // Filter transactions
  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((t) => {
      if (filter === "EXPENSES") return t.type === "expense";
      if (filter === "INCOME") return t.type === "income";
      // Savings todo
      return false;
    });
  }, [transactions, filter]);

  const totalAmount = React.useMemo(() => {
    return filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  // Group by Category
  const spendingChartData = React.useMemo(() => {
    const map = new Map<string, number>();
    filteredTransactions.forEach((t) => {
      map.set(t.categoryId, (map.get(t.categoryId) || 0) + t.amount);
    });

    // Convert to array
    const result = Array.from(map.entries()).map(([catId, amount]) => {
      const cat = categories.find((c) => c.id === catId);
      return {
        name: cat?.name ?? "Uncategorized",
        total: amount,
        color: cat?.color ?? "#999",
        legendFontColor: subTextColor,
        legendFontSize: 12,
        categoryId: catId,
      };
    });

    // Sort DESC
    return result.sort((a, b) => b.total - a.total);
  }, [filteredTransactions, categories, subTextColor]);

  const pieData = React.useMemo(() => {
    return spendingChartData.map((item) => ({
      name: item.name,
      population: item.total,
      color: item.color,
      legendFontColor: item.legendFontColor,
      legendFontSize: item.legendFontSize,
    }));
  }, [spendingChartData]);

  const chartConfig = React.useMemo(
    () => ({
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Only for pie labels?
    }),
    [],
  );

  const dynamicCardStyle = [
    styles.card,
    { backgroundColor: cardBg, borderColor: cardBorder },
  ];

  // Render... uses local variables now.
  // Need to pass themeColor to render.
  // The existing JSX uses 'totals', 'cycleBudget', 'filter', 'spendingChartData', 'pieData', 'totalAmount'.
  // These are now all local.

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={dynamicCardStyle}>
        <Text style={[styles.cardTitle, { color: textColor }]}>Summary</Text>
        <View style={styles.totalsRow}>
          <View style={styles.totalCol}>
            <Text style={[styles.totalLabel, { color: subTextColor }]}>
              Income
            </Text>
            <Text style={[styles.totalValue, styles.incomeText]}>
              {formatAmount(totals.income)}
            </Text>
          </View>
          <View style={styles.totalCol}>
            <Text style={[styles.totalLabel, { color: subTextColor }]}>
              Expenses
            </Text>
            <Text style={[styles.totalValue, styles.expenseText]}>
              {formatAmount(totals.expenses)}
            </Text>
          </View>
          <View style={styles.totalCol}>
            <Text style={[styles.totalLabel, { color: subTextColor }]}>
              Left
            </Text>
            <Text style={[styles.totalValue, { color: textColor }]}>
              {formatAmount(cycleBudget - totals.expenses)}
            </Text>
          </View>
        </View>
      </View>

      <View style={dynamicCardStyle}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.05)"
                : "#f8f9fa",
            },
          ]}
          onPress={() => setShowFilterMenu(true)}
        >
          <Text style={[styles.filterButtonText, { color: textColor }]}>
            {filter.charAt(0) + filter.slice(1).toLowerCase()}
          </Text>
          <Ionicons name="chevron-down" size={16} color={themeColor} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showFilterMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFilterMenu(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowFilterMenu(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.menuContainer,
                  { backgroundColor: isDarkMode ? "#2a2a2a" : "#fff" },
                ]}
              >
                <View style={styles.menuBlur}>
                  {["EXPENSES", "INCOME", "SAVINGS"].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.menuItem,
                        filter === option && {
                          backgroundColor: isDarkMode
                            ? "rgba(2, 195, 189, 0.1)"
                            : "#f0f9ff",
                        },
                      ]}
                      onPress={() => {
                        setFilter(option as any);
                        setShowFilterMenu(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.menuItemText,
                          { color: textColor },
                          filter === option && {
                            color: themeColor,
                            fontWeight: "600",
                          },
                        ]}
                      >
                        {option.charAt(0) + option.slice(1).toLowerCase()}
                      </Text>
                      {filter === option && (
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color={themeColor}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <View style={styles.chartContainer}>
        {pieData.length > 0 ? (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <PieChart
              data={pieData}
              width={width - 48}
              height={220}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              center={[width / 4, 0]}
              absolute={false}
              hasLegend={false}
            />
            <View
              style={[
                styles.doughnutHole,
                { backgroundColor: isDarkMode ? "#1a1a1a" : "#fff" },
              ]}
            >
              <Text style={[styles.doughnutTotal, { color: textColor }]}>
                {formatAmount(totalAmount)}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.emptyText}>
            No {filter.toLowerCase()} in this period
          </Text>
        )}
      </View>

      <View style={styles.breakdownList}>
        {spendingChartData.map((item) => (
          <View
            key={item.categoryId}
            style={[styles.breakdownItem, { borderBottomColor: cardBorder }]}
          >
            <View style={styles.breakdownLeft}>
              <View
                style={[styles.breakdownDot, { backgroundColor: item.color }]}
              />
              <Text style={[styles.breakdownName, { color: textColor }]}>
                {item.name}
              </Text>
            </View>
            <Text style={[styles.breakdownAmount, { color: textColor }]}>
              {formatAmount(item.total)}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  card: {
    borderRadius: 24,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  totalCol: {
    flex: 1,
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  incomeText: {
    color: "#4CD964",
  },
  expenseText: {
    color: "#FF3B30",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    width: 250,
    borderRadius: 16,
    overflow: "hidden",
  },
  menuBlur: {
    padding: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 8,
  },
  menuItemText: {
    fontSize: 16,
  },
  chartContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  doughnutHole: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  doughnutTotal: {
    fontSize: 20,
    fontWeight: "700",
  },
  emptyText: {
    color: "#999",
    fontStyle: "italic",
    marginTop: 20,
  },
  breakdownList: {
    marginTop: 16,
  },
  breakdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  breakdownLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  breakdownDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  breakdownName: {
    fontSize: 16,
  },
  breakdownAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SpendingView;
