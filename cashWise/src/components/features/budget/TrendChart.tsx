import React, { useState } from "react";
import { View, StyleSheet, Dimensions, useColorScheme } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import Animated, { LinearTransition } from "react-native-reanimated";
import { COLORS } from "../../../config/colors";
import { FONT_FAMILIES } from "../../../config/typography";
import { RADIUS } from "../../../config/visuals";
import { MonthlyData } from "../../../hooks/useBudgetInsights";

interface TrendChartProps {
  monthlyTrend: MonthlyData[];
  currencySymbol: string;
}

const TrendChart: React.FC<TrendChartProps> = ({
  monthlyTrend,
  currencySymbol,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { width } = Dimensions.get("window");

  const [chartWidth, setChartWidth] = useState(0);
  const resolvedChartWidth = chartWidth || Math.max(width - 64, 0);
  const chartHeight = 180;

  const textPrimary = isDark
    ? COLORS.dark.textPrimary
    : COLORS.light.textPrimary;
  const textSecondary = isDark
    ? COLORS.dark.textSecondary
    : COLORS.light.textSecondary;
  const incomeColor = isDark ? COLORS.dark.income : COLORS.light.income;
  const expenseColor = isDark ? COLORS.dark.expense : COLORS.light.expense;
  const dividerColor = isDark ? COLORS.dark.divider : COLORS.light.divider;

  // Prepare chart data for income line
  const incomeData = monthlyTrend.map((item) => ({
    value: item.income,
    label: item.month,
    dataPointText: "",
  }));

  // Prepare chart data for expenses line
  const expenseData = monthlyTrend.map((item) => ({
    value: item.expenses,
    label: "",
    dataPointText: "",
  }));

  // Calculate max value for proper scaling
  const allValues = monthlyTrend.flatMap((m) => [m.income, m.expenses]);
  const maxDataValue = Math.max(...allValues, 0);
  const maxValue = maxDataValue > 0 ? maxDataValue * 1.2 : 100;

  // Format amount for display
  const formatAmount = (amount: number): string => {
    if (amount >= 1000) {
      return `${currencySymbol}${(amount / 1000).toFixed(1)}k`;
    }
    return `${currencySymbol}${amount.toFixed(0)}`;
  };

  return (
    <Animated.View
      layout={LinearTransition.springify().damping(15)}
      className="rounded-3xl p-5 mb-4 bg-white/80 dark:bg-[#1e1e1e]/60"
    >
      {/* Header */}
      <View className="mb-4">
        <Animated.Text
          className="text-base font-semibold mb-1"
          style={{ color: textPrimary }}
        >
          Spending Trends
        </Animated.Text>
        <Animated.Text className="text-sm" style={{ color: textSecondary }}>
          Last 6 months
        </Animated.Text>
      </View>

      {/* Chart */}
      <View
        style={styles.chartArea}
        onLayout={(event) => {
          const nextWidth = Math.floor(event.nativeEvent.layout.width);
          if (nextWidth > 0 && nextWidth !== chartWidth) {
            setChartWidth(nextWidth);
          }
        }}
      >
        {monthlyTrend.length > 0 ? (
          <LineChart
            data={incomeData}
            data2={expenseData}
            height={chartHeight}
            width={resolvedChartWidth}
            adjustToWidth={true}
            initialSpacing={20}
            endSpacing={20}
            spacing={(resolvedChartWidth - 40) / Math.max(monthlyTrend.length - 1, 1)}
            color1={incomeColor}
            color2={expenseColor}
            thickness={3}
            thickness2={3}
            curved
            isAnimated
            animationDuration={800}
            hideRules
            hideYAxisText
            yAxisLabelWidth={0}
            xAxisThickness={0.5}
            yAxisThickness={0}
            xAxisLabelsHeight={24}
            xAxisColor={dividerColor}
            xAxisLabelTextStyle={{
              color: textSecondary,
              fontSize: 11,
              fontFamily: FONT_FAMILIES.body.medium,
            }}
            maxValue={maxValue}
            noOfSections={4}
            dataPointsRadius={4}
            dataPointsColor1={incomeColor}
            dataPointsColor2={expenseColor}
          />
        ) : (
          <View className="h-44 items-center justify-center">
            <Animated.Text style={{ color: textSecondary }}>
              No data available
            </Animated.Text>
          </View>
        )}
      </View>

      {/* Legend */}
      <View className="flex-row items-center justify-center mt-4 gap-6">
        <View className="flex-row items-center">
          <View
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: incomeColor }}
          />
          <Animated.Text className="text-sm" style={{ color: textSecondary }}>
            Income
          </Animated.Text>
        </View>
        <View className="flex-row items-center">
          <View
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: expenseColor }}
          />
          <Animated.Text className="text-sm" style={{ color: textSecondary }}>
            Expenses
          </Animated.Text>
        </View>
      </View>

      {/* Summary Row */}
      {monthlyTrend.length > 0 && (
        <View className="flex-row justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <View>
            <Animated.Text className="text-xs" style={{ color: textSecondary }}>
              Avg. Income
            </Animated.Text>
            <Animated.Text
              className="text-base font-semibold"
              style={{ color: incomeColor }}
            >
              {formatAmount(
                monthlyTrend.reduce((sum, m) => sum + m.income, 0) /
                  monthlyTrend.length
              )}
            </Animated.Text>
          </View>
          <View className="items-end">
            <Animated.Text className="text-xs" style={{ color: textSecondary }}>
              Avg. Expenses
            </Animated.Text>
            <Animated.Text
              className="text-base font-semibold"
              style={{ color: expenseColor }}
            >
              {formatAmount(
                monthlyTrend.reduce((sum, m) => sum + m.expenses, 0) /
                  monthlyTrend.length
              )}
            </Animated.Text>
          </View>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  chartArea: {
    width: "100%",
    overflow: "hidden",
  },
});

export default TrendChart;
