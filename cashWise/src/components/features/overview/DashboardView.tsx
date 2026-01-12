import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useOverviewCycle } from "../../../context/CycleContext";
import { useProfile } from "../../../context/ProfileContext";
import { useBudget } from "../../../context/BudgetContext";
import {
  groupDailySpending,
  computePeriodTotals,
  buildDateRangeArray,
} from "../../../utils/overview";
import { getCurrencySymbol } from "../../../utils/currency";

interface DashboardViewProps {
  onDayPress: (date: string) => void;
  themeColor: string;
}

// Helper for formatted data
interface ChartItem {
  value?: number;
  label?: string;
  date: string; // Custom prop for tooltip
  hideDataPoint?: boolean;
  customDataPoint?: () => React.JSX.Element;
  labelTextStyle?: any;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  onDayPress,
  themeColor,
}) => {
  const isDarkMode = useColorScheme() === "dark";
  const textColor = isDarkMode ? "#FFFFFF" : "#333333";
  const subTextColor = isDarkMode ? "#CCCCCC" : "#666666";
  const cardBg = isDarkMode ? "rgba(30, 30, 30, 0.8)" : "#FFFFFF";
  const cardBorder = isDarkMode ? "rgba(255,255,255,0.1)" : "#ddd";

  const { width } = Dimensions.get("window");

  // --- Context & Data Derivation ---
  const { transactions, start, endExclusive } = useOverviewCycle();
  const { profile } = useProfile();
  const { budget, draft } = useBudget();
  const currencySymbol = getCurrencySymbol(profile?.currency);

  const formatAmount = (amount: number) =>
    `${currencySymbol}${amount.toFixed(2)}`;

  // Totals
  const totals = React.useMemo(
    () => computePeriodTotals(transactions),
    [transactions],
  );

  // Billing Cycle Label
  const isoString = (dateObj: Date) => {
    const year = dateObj.getFullYear();
    const month = `${dateObj.getMonth() + 1}`.padStart(2, "0");
    const day = `${dateObj.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const billingCycle = React.useMemo(() => {
    if (!start || !endExclusive) return { label: "", start: "", end: "" };
    const startDate = new Date(start);
    const endDate = new Date(endExclusive);
    endDate.setDate(endDate.getDate() - 1);
    const format = (d: Date) =>
      `${d.getDate()} ${d
        .toLocaleDateString("en-US", { month: "short" })
        .toUpperCase()}`;
    const label = `${format(startDate)} - ${format(endDate)}`;
    return { start, end: endExclusive, label };
  }, [start, endExclusive]);

  // Calendar Dates
  const allDates = React.useMemo(() => {
    if (!billingCycle.start || !billingCycle.end) return [];
    const endD = new Date(billingCycle.end);
    endD.setDate(endD.getDate() - 1);
    return buildDateRangeArray(billingCycle.start, isoString(endD));
  }, [billingCycle]);

  const dailySpendingMap = React.useMemo(
    () => groupDailySpending(transactions),
    [transactions],
  );

  const todayIso = isoString(new Date());
  const currentIndex = React.useMemo(() => {
    let index = -1;
    allDates.forEach((date, i) => {
      if (date <= todayIso) {
        index = i;
      }
    });
    return index;
  }, [allDates, todayIso]);

  // Preparing Data for Gifted Charts
  const chartData: ChartItem[] = React.useMemo(() => {
    if (!billingCycle.start) return [];
    const lastIndex = allDates.length - 1;

    return allDates.map((date, index) => {
      const dayStr = date.slice(8, 10);
      const isFuture = currentIndex === -1 || index > currentIndex;
      const isCurrent = index === currentIndex;
      const value = isFuture ? undefined : dailySpendingMap[date] ?? 0;
      const showLabel = index % 5 === 0 || index === lastIndex;

      return {
        value,
        label: showLabel ? `${parseInt(dayStr, 10)}` : "",
        date: date, // Pass full date for tooltip
        hideDataPoint: !isCurrent,
        customDataPoint: isCurrent
          ? () => (
            <View style={styles.currentDotWrapper}>
              <View
                style={[
                  styles.currentDotGlow,
                  { backgroundColor: themeColor, shadowColor: themeColor },
                ]}
              />
              <View
                style={[
                  styles.currentDotCore,
                  {
                    backgroundColor: themeColor,
                    borderColor: isDarkMode ? "#1A1A1A" : "#FFFFFF",
                  },
                ]}
              />
            </View>
          )
          : undefined,
        labelTextStyle: { color: subTextColor, fontSize: 10 },
      };
    });
  }, [
    allDates,
    billingCycle.start,
    currentIndex,
    dailySpendingMap,
    isDarkMode,
    subTextColor,
    themeColor,
  ]);

  const maxDataValue = Math.max(
    ...chartData.map((d) => (typeof d.value === "number" ? d.value : 0)),
    0,
  );
  // Add some headroom
  const maxValue = maxDataValue > 0 ? maxDataValue * 1.2 : 100;
  const mostNegativeValue = maxDataValue > 0 ? -maxDataValue * 0.05 : 0;
  const noOfSectionsBelowXAxis = mostNegativeValue < 0 ? 1 : 0;

  // --- Layout ---
  const dynamicCardStyle = [
    styles.card,
    { backgroundColor: cardBg, borderColor: cardBorder },
  ];

  const GAP = 10;
  const [calendarContentWidth, setCalendarContentWidth] = useState(
    Math.max(width - 48, 0),
  );
  const itemWidth = Math.floor(
    Math.max(calendarContentWidth - GAP * 6, 0) / 7,
  );

  const [chartWidth, setChartWidth] = useState(0);
  const [pointerState, setPointerState] = useState<{
    index: number;
    x: number;
  } | null>(null);

  // --- Layout Constants ---
  const chartHeight = 180;
  const tooltipHeight = 48;
  const resolvedChartWidth = chartWidth || Math.max(width - 64, 0);
  const tooltipWidth = Math.min(240, resolvedChartWidth);

  // Fix clipping: Add spacing so line thickness doesn't get cut off at edges
  const initialSpacing = 8;
  const endSpacing = 8;

  const budgetTotal = budget?.totalBudget ?? draft.totalBudget ?? 0;

  const totalCalendarRows = Math.ceil(allDates.length / 7);

  const formatPointerDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
    const month = d.toLocaleDateString("en-US", { month: "short" });
    return `${weekday}, ${d.getDate()} ${month}`;
  };

  const activeItem =
    pointerState && chartData[pointerState.index]
      ? chartData[pointerState.index]
      : null;
  const showTooltip =
    !!activeItem &&
    typeof activeItem.value === "number" &&
    pointerState !== null &&
    pointerState.index <= currentIndex;
  const tooltipLeft = pointerState
    ? Math.min(
      Math.max(pointerState.x - tooltipWidth / 2, 0),
      Math.max(resolvedChartWidth - tooltipWidth, 0),
    )
    : 0;

  const pointerConfig = React.useMemo(() => ({
    pointerStripHeight: chartHeight,
    pointerStripColor: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
    pointerStripWidth: 1,
    pointerColor: themeColor,
    radius: 4,
    activatePointersOnLongPress: false,
    activatePointersInstantlyOnTouch: true,
    resetPointerIndexOnRelease: true,
    autoAdjustPointerLabelPosition: false,
    pointerStripUptoDataPoint: true,
    pointerComponent: () => (
      <View
        style={[
          styles.pointerDot,
          {
            backgroundColor: themeColor,
            borderColor: isDarkMode ? "#1A1A1A" : "#FFFFFF",
            borderWidth: 1,
          },
        ]}
      />
    ),
    onPointerLeave: () => {
      setPointerState(null);
    },
  }), [chartHeight, isDarkMode, themeColor]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Sparkline Card */}
      <View style={[dynamicCardStyle, styles.chartCard]}>
        <Text style={[styles.chartTitle, { color: subTextColor }]}>
          Spent : {billingCycle.label}
        </Text>
        <Text style={[styles.chartValue, { color: textColor }]}>
          {formatAmount(totals.expenses)}
        </Text>
        <View
          style={[
            styles.chartDivider,
            { borderColor: isDarkMode ? "rgba(255,255,255,0.12)" : "#E3E3E3" },
          ]}
        />

        {/* Sparkline Chart */}
        <View
          style={[styles.chartContainer, { paddingTop: tooltipHeight }]}
          onLayout={(event) => {
            const nextWidth = Math.floor(event.nativeEvent.layout.width);
            if (nextWidth > 0 && nextWidth !== chartWidth) {
              setChartWidth(nextWidth);
            }
          }}
        >
          <View
            pointerEvents="none"
            style={[styles.tooltipArea, { height: tooltipHeight }]}
          >
            {showTooltip && activeItem ? (
              <View
                style={[
                  styles.tooltipCard,
                  {
                    left: tooltipLeft,
                    width: tooltipWidth,
                    backgroundColor: isDarkMode ? "#2A2A2A" : "#1f1f1f",
                  },
                ]}
              >
                <Text style={styles.tooltipDate}>
                  {formatPointerDate(activeItem.date)}
                </Text>
                <Text style={styles.tooltipValue}>
                  {formatAmount(activeItem.value ?? 0)}
                </Text>
                <View style={styles.tooltipLegendRow}>
                  <View style={[styles.tooltipLegendItem, { marginRight: 12 }]}>
                    <View
                      style={[
                        styles.tooltipDot,
                        { backgroundColor: themeColor },
                      ]}
                    />
                    <Text style={styles.tooltipLegendValue}>
                      {formatAmount(totals.expenses)}
                    </Text>
                  </View>
                  <View style={styles.tooltipLegendItem}>
                    <View
                      style={[
                        styles.tooltipDot,
                        { backgroundColor: "#7A7A7A" },
                      ]}
                    />
                    <Text style={styles.tooltipLegendValue}>
                      {formatAmount(budgetTotal)}
                    </Text>
                  </View>
                </View>
              </View>
            ) : null}
          </View>

          {chartData.length > 0 ? (
            <LineChart
              data={chartData}
              height={chartHeight}
              width={resolvedChartWidth}
              adjustToWidth={true}

              // Spacing fixes for sparkline
              initialSpacing={initialSpacing}
              endSpacing={endSpacing}

              color={themeColor}
              thickness={3}

              curved
              isAnimated
              hideRules
              hideYAxisText
              yAxisLabelWidth={0}
              xAxisThickness={0.5}
              yAxisThickness={0}
              xAxisLabelsHeight={20}
              xAxisLabelsAtBottom
              xAxisLabelsVerticalShift={6}
              xAxisColor={
                isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"
              }
              xAxisLabelTextStyle={{ color: subTextColor, fontSize: 12 }}
              xAxisTextNumberOfLines={1}
              labelsExtraHeight={28}

              mostNegativeValue={mostNegativeValue}
              noOfSectionsBelowXAxis={noOfSectionsBelowXAxis}
              maxValue={maxValue}
              endIndex={currentIndex >= 0 ? currentIndex : 0}

              showDataPointsForMissingValues={false}
              interpolateMissingValues={false}
              extrapolateMissingValues={false}
              dataPointsRadius={0}

              getPointerProps={({ pointerIndex, pointerX }: { pointerIndex: number; pointerX: number }) => {
                if (pointerIndex < 0 || pointerIndex > currentIndex) {
                  setPointerState(null);
                  return;
                }
                setPointerState({ index: pointerIndex, x: pointerX });
              }}

              // Interaction
              pointerConfig={pointerConfig}
            />
          ) : (
            <Text style={{ fontSize: 10, color: subTextColor }}>No Data</Text>
          )}
        </View>

        <View style={styles.chartLegendRow}>
          <View style={styles.chartLegendItem}>
            <View style={[styles.legendDot, { backgroundColor: themeColor }]} />
            <Text style={[styles.chartLegendText, { color: subTextColor }]}>
              This period
            </Text>
          </View>
          <View style={styles.chartLegendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#7A7A7A" }]} />
            <Text style={[styles.chartLegendText, { color: subTextColor }]}>
              Budget
            </Text>
          </View>
        </View>
      </View>

      {/* Calendar Card */}
      <View style={[dynamicCardStyle, styles.calendarCard]}>
        <Text style={[styles.cardTitle, { color: textColor }]}>Calendar</Text>
        <View
          style={styles.calendarContent}
          onLayout={(event) => {
            const nextWidth = Math.floor(event.nativeEvent.layout.width);
            if (nextWidth > 0 && nextWidth !== calendarContentWidth) {
              setCalendarContentWidth(nextWidth);
            }
          }}
        >
          {/* Days Header */}
          <View style={styles.calendarHeaderRow}>
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
              <View
                key={i}
                style={[
                  styles.dayHeaderCell,
                  { width: itemWidth, marginRight: i === 6 ? 0 : GAP },
                ]}
              >
                <Text style={[styles.dayHeaderText, { color: subTextColor }]}>
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {/* Days Grid */}
          <View style={styles.calendarGrid}>
            {allDates.map((date, index) => {
              const dayNum = parseInt(date.slice(8, 10), 10);
              const hasSpending = (dailySpendingMap[date] ?? 0) > 0;
              const rowIndex = Math.floor(index / 7);
              const isLastRow = rowIndex === totalCalendarRows - 1;

              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const cellDate = new Date(date);
              cellDate.setHours(0, 0, 0, 0);
              const isFuture = cellDate > today;
              const isLastInRow = (index + 1) % 7 === 0;

              return (
                <TouchableOpacity
                  key={date}
                  disabled={isFuture}
                  style={[
                    styles.dayCell,
                    {
                      width: itemWidth,
                      marginRight: isLastInRow ? 0 : GAP,
                      marginBottom: isLastRow ? 0 : GAP,
                      borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "#eee",
                      opacity: isFuture ? 0.3 : 1,
                    },
                    hasSpending &&
                    !isFuture && {
                      backgroundColor: isDarkMode
                        ? "rgba(2, 195, 189, 0.15)"
                        : "#E0F7FA",
                      borderColor: themeColor,
                    },
                  ]}
                  onPress={() => onDayPress(date)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      { color: textColor },
                      hasSpending &&
                      !isFuture && { fontWeight: "700", color: themeColor },
                    ]}
                  >
                    {dayNum}
                  </Text>
                  {hasSpending && !isFuture && (
                    <View
                      style={[
                        styles.transactionDot,
                        { backgroundColor: themeColor },
                      ]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
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
    padding: 24, // Consistent large padding
    marginBottom: 16,
    borderWidth: 1,
    minHeight: 200, // Enforce minimum height for consistency
    justifyContent: 'space-between',
  },
  chartCard: {
    paddingBottom: 20,
    minHeight: 320,
    justifyContent: "flex-start",
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  chartValue: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
  chartDivider: {
    borderBottomWidth: 1,
    borderStyle: "dashed",
    marginBottom: 12,
  },
  chartContainer: {
    width: "100%",
    paddingBottom: 12,
    position: "relative",
  },
  tooltipArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  tooltipCard: {
    position: "absolute",
    top: 0,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  tooltipDate: {
    fontSize: 11,
    color: "#CFCFCF",
    marginBottom: 4,
  },
  tooltipValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  tooltipLegendRow: {
    flexDirection: "row",
  },
  tooltipLegendItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tooltipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  tooltipLegendValue: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  chartLegendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  chartLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  chartLegendText: {
    fontSize: 12,
    fontWeight: "500",
  },
  pointerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  currentDotWrapper: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  currentDotGlow: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 9,
    opacity: 0.25,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  currentDotCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
  },
  calendarCard: {
    padding: 20,
    paddingBottom: 16,
    minHeight: 0,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarContent: {
    width: "100%",
  },
  calendarHeaderRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  dayHeaderCell: {
    alignItems: "center",
    justifyContent: "center",
    height: 30,
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: "600",
  },
  dayCell: {
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  dayText: {
    fontSize: 14,
  },
  transactionDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: "absolute",
    bottom: 6,
  },
});

export default DashboardView;
