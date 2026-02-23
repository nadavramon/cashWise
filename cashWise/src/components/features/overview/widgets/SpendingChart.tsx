import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import {
    ElevatedCard,
    Caption,
    Label,
    AmountLarge,
    Body,
} from "../../../ui";
import { useTheme } from "../../../../hooks/useTheme";
import { SHADOWS, RADIUS } from "../../../../config/visuals";
import { FONT_FAMILIES } from "../../../../config/typography";

interface ChartItem {
    value?: number;
    label?: string;
    date: string;
    hideDataPoint?: boolean;
    customDataPoint?: () => React.JSX.Element;
    labelTextStyle?: object;
}

interface SpendingChartProps {
    chartData: ChartItem[];
    totals: { expenses: number; income: number; net: number };
    budgetTotal: number;
    billingCycleLabel: string;
    themeColor: string;
    currentIndex: number;
    formatAmount: (amount: number) => string;
}

export const SpendingChart: React.FC<SpendingChartProps> = ({
    chartData,
    totals,
    budgetTotal,
    billingCycleLabel,
    themeColor,
    currentIndex,
    formatAmount,
}) => {
    const { colors, isDark } = useTheme();
    const { width } = Dimensions.get("window");

    // Layout State
    const [chartWidth, setChartWidth] = useState(0);
    const resolvedChartWidth = chartWidth || Math.max(width - 64, 0);
    const chartHeight = 160;
    const tooltipWidth = Math.min(240, resolvedChartWidth);
    const initialSpacing = 8;
    const endSpacing = 8;

    // Pointer State
    const [pointerState, setPointerState] = useState<{
        index: number;
        x: number;
    } | null>(null);

    // Derived Values
    const maxDataValue = Math.max(
        ...chartData.map((d) => (typeof d.value === "number" ? d.value : 0)),
        0
    );
    const maxValue = maxDataValue > 0 ? maxDataValue * 1.2 : 100;
    const mostNegativeValue = maxDataValue > 0 ? -maxDataValue * 0.05 : 0;
    const noOfSectionsBelowXAxis = mostNegativeValue < 0 ? 1 : 0;

    // Tooltip Logic
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
            Math.max(resolvedChartWidth - tooltipWidth, 0)
        )
        : 0;

    const formatPointerDate = (dateStr: string) => {
        const d = new Date(dateStr);
        const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
        const month = d.toLocaleDateString("en-US", { month: "short" });
        return `${weekday}, ${d.getDate()} ${month}`;
    };

    // Pointer Config
    const pointerConfig = {
        pointerStripHeight: chartHeight,
        pointerStripColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
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
                style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: themeColor,
                    borderColor: isDark ? colors.surface : "#FFFFFF",
                    borderWidth: 1,
                }}
            />
        ),
        onPointerLeave: () => setPointerState(null),
    };

    return (
        <ElevatedCard
            padding={24}
            borderRadius={RADIUS["4xl"]}
            style={styles.chartCard}
        >
            <View style={styles.chartHeader}>
                <Caption color={colors.textSecondary}>
                    Spent · {billingCycleLabel}
                </Caption>
                <AmountLarge color={colors.textPrimary}>
                    {formatAmount(totals.expenses)}
                </AmountLarge>
            </View>

            <View
                style={[
                    styles.chartDivider,
                    { borderColor: colors.divider },
                ]}
            />

            {/* Chart Section */}
            <View style={styles.chartSection}>
                {/* Tooltip Row */}
                <View style={styles.tooltipRow}>
                    {showTooltip && activeItem ? (
                        <View
                            style={[
                                styles.tooltipCard,
                                {
                                    left: tooltipLeft,
                                    width: tooltipWidth,
                                    backgroundColor: isDark
                                        ? colors.surfaceElevated
                                        : "#1f1f1f",
                                    ...SHADOWS.lg,
                                },
                            ]}
                        >
                            <Caption style={styles.tooltipDate} color="#CFCFCF">
                                {formatPointerDate(activeItem.date)}
                            </Caption>
                            <Label style={styles.tooltipValue} color="#FFFFFF">
                                {formatAmount(activeItem.value ?? 0)}
                            </Label>
                            <View style={styles.tooltipLegendRow}>
                                <View style={styles.tooltipLegendItem}>
                                    <View
                                        style={[
                                            styles.tooltipDot,
                                            { backgroundColor: themeColor },
                                        ]}
                                    />
                                    <Caption color="#FFFFFF">
                                        {formatAmount(totals.expenses)}
                                    </Caption>
                                </View>
                                <View style={styles.tooltipLegendItem}>
                                    <View
                                        style={[
                                            styles.tooltipDot,
                                            { backgroundColor: "#7A7A7A" },
                                        ]}
                                    />
                                    <Caption color="#FFFFFF">
                                        {formatAmount(budgetTotal)}
                                    </Caption>
                                </View>
                            </View>
                        </View>
                    ) : null}
                </View>

                {/* Chart Area */}
                <View
                    style={styles.chartArea}
                    onLayout={(event) => {
                        const nextWidth = Math.floor(event.nativeEvent.layout.width);
                        if (nextWidth > 0 && nextWidth !== chartWidth) {
                            setChartWidth(nextWidth);
                        }
                    }}
                >
                    {chartData.length > 0 ? (
                        <LineChart
                            data={chartData}
                            height={chartHeight}
                            width={resolvedChartWidth}
                            adjustToWidth={true}
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
                            xAxisColor={colors.divider}
                            xAxisLabelTextStyle={{
                                color: colors.textTertiary,
                                fontSize: 11,
                                fontFamily: FONT_FAMILIES.body.medium,
                            }}
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
                            getPointerProps={({
                                pointerIndex,
                                pointerX,
                            }: {
                                pointerIndex: number;
                                pointerX: number;
                            }) => {
                                if (pointerIndex < 0 || pointerIndex > currentIndex) {
                                    setPointerState(null);
                                    return;
                                }
                                setPointerState({ index: pointerIndex, x: pointerX });
                            }}
                            pointerConfig={pointerConfig}
                        />
                    ) : (
                        <Body color={colors.textTertiary}>No Data</Body>
                    )}
                </View>
            </View>

            {/* Legend */}
            <View style={styles.chartLegendRow}>
                <View style={styles.chartLegendItem}>
                    <View
                        style={[styles.legendDot, { backgroundColor: themeColor }]}
                    />
                    <Caption color={colors.textSecondary}>This period</Caption>
                </View>
                <View style={styles.chartLegendItem}>
                    <View
                        style={[styles.legendDot, { backgroundColor: "#7A7A7A" }]}
                    />
                    <Caption color={colors.textSecondary}>Budget</Caption>
                </View>
            </View>
        </ElevatedCard>
    );
};

const styles = StyleSheet.create({
    chartCard: {
        marginBottom: 16,
        paddingTop: 32,
        paddingBottom: 24, // Slightly reduced bottom padding to keep it tight
    },
    chartHeader: {
        marginBottom: 4,   // Reduced from 8
    },
    chartDivider: {
        borderBottomWidth: 1,
        borderStyle: "dashed",
        marginBottom: 0,   // Reduced from 4 to 0
    },
    chartSection: {
        width: "100%",
        overflow: "hidden",
    },
    tooltipRow: {
        height: 56,
        position: "relative",
        marginBottom: 0,
    },
    chartArea: {
        width: "100%",
        marginBottom: 0,
    },
    tooltipCard: {
        position: "absolute",
        top: 0,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: RADIUS.xl,
    },
    tooltipDate: {
        marginBottom: 2,
    },
    tooltipValue: {
        marginBottom: 6,
    },
    tooltipLegendRow: {
        flexDirection: "row",
        gap: 16,
    },
    tooltipLegendItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    tooltipDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    chartLegendRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,      // Reduced from 8 to 4
        gap: 16,
    },
    chartLegendItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});
