import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    useColorScheme,
    Dimensions,
    Animated,
    Easing
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useOverviewCycle } from '../../../context/CycleContext';
import { useProfile } from '../../../context/ProfileContext';
import { groupDailySpending, computePeriodTotals, buildDateRangeArray } from '../../../utils/overview';
import { getCurrencySymbol } from '../../../utils/currency';

interface DashboardViewProps {
    onDayPress: (date: string) => void;
    themeColor: string;
}

const GlowingDot = ({ color }: { color: string }) => {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(anim, {
                toValue: 1,
                duration: 2000,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            })
        ).start();
    }, [anim]);

    const scale = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 3],
    });

    const opacity = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.6, 0],
    });

    return (
        <View style={styles.dotContainer}>
            <Animated.View
                style={[
                    styles.halo,
                    {
                        backgroundColor: color,
                        opacity,
                        transform: [{ scale }],
                    },
                ]}
            />
            <View style={[styles.coreDot, { backgroundColor: color, shadowColor: color }]}>
                <View style={styles.innerWhiteDot} />
            </View>
        </View>
    );
};

const DashboardView: React.FC<DashboardViewProps> = ({
    onDayPress,
    themeColor
}) => {
    const isDarkMode = useColorScheme() === 'dark';
    const textColor = isDarkMode ? '#FFFFFF' : '#333333';
    const subTextColor = isDarkMode ? '#CCCCCC' : '#666666';
    const cardBg = isDarkMode ? 'rgba(30, 30, 30, 0.8)' : '#FFFFFF';
    const cardBorder = isDarkMode ? 'rgba(255,255,255,0.1)' : '#ddd';

    const { width } = Dimensions.get('window');
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    // --- Context & Data Derivation ---
    const { transactions, start, endExclusive } = useOverviewCycle();
    const { profile } = useProfile();
    const currencySymbol = getCurrencySymbol(profile?.currency);

    const formatAmount = (amount: number) => `${currencySymbol}${amount.toFixed(2)}`;

    // 1. Totals
    const totals = React.useMemo(() => computePeriodTotals(transactions), [transactions]);

    // 2. Billing Cycle Label
    const isoString = (dateObj: Date) => {
        const year = dateObj.getFullYear();
        const month = `${dateObj.getMonth() + 1}`.padStart(2, '0');
        const day = `${dateObj.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const billingCycle = React.useMemo(() => {
        if (!start || !endExclusive) return { label: '', start: '', end: '' };
        const startDate = new Date(start);
        const endDate = new Date(endExclusive);
        endDate.setDate(endDate.getDate() - 1); // Inclusive end

        const label = `${startDate.getDate()}/${(startDate.getMonth() + 1).toString().padStart(2, '0')} - ${endDate.getDate()}/${(endDate.getMonth() + 1).toString().padStart(2, '0')}`;
        return { start, end: endExclusive, label };
    }, [start, endExclusive]);

    // 3. Calendar Dates
    // Use helper to build array from start to INCLUSIVE end
    const allDates = React.useMemo(() => {
        if (!billingCycle.start || !billingCycle.end) return [];
        // To build full grid, we go from start to end-1 (exclusive in context means next month start)
        const endD = new Date(billingCycle.end);
        endD.setDate(endD.getDate() - 1);
        return buildDateRangeArray(billingCycle.start, isoString(endD));
    }, [billingCycle]);

    const dailySpendingMap = React.useMemo(() => groupDailySpending(transactions), [transactions]);

    const visibleCycleDates = React.useMemo(() => {
        const todayIso = isoString(new Date());
        if (billingCycle.end <= todayIso) return allDates; // Past cycle
        if (billingCycle.start > todayIso) return []; // Future cycle
        // Current cycle
        const filtered = allDates.filter((date) => date <= todayIso);
        return filtered.length > 0 ? filtered : [];
    }, [allDates, billingCycle]);

    // 4. Chart Data
    const chartData = React.useMemo(() => {
        return {
            labels: visibleCycleDates.map((date) => {
                const day = date.slice(8, 10);
                return ['05', '10', '15', '20', '25', '30'].includes(day) ? day : '';
            }),
            datasets: [
                {
                    data: visibleCycleDates.map((date) => dailySpendingMap[date] ?? 0),
                    color: () => themeColor,
                    strokeWidth: 2,
                },
            ],
        };
    }, [visibleCycleDates, dailySpendingMap, themeColor]);

    const chartConfig = React.useMemo(
        () => ({
            backgroundColor: 'transparent',
            backgroundGradientFrom: 'transparent',
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: 'transparent',
            backgroundGradientToOpacity: 0,
            decimalPlaces: 0,
            color: (opacity = 1) => isDarkMode ? `rgba(2, 195, 189, ${opacity})` : `rgba(0, 124, 190, ${opacity})`,
            labelColor: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, 1)` : `rgba(51, 51, 51, 1)`,
            propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: isDarkMode ? '#1e1e1e' : '#fff',
            },
            propsForBackgroundLines: {
                strokeDasharray: '',
                stroke: 'rgba(255,255,255,0.2)',
            },
            fillShadowGradientFrom: themeColor,
            fillShadowGradientTo: themeColor,
            fillShadowGradientFromOpacity: 0.2,
            fillShadowGradientToOpacity: 0,
        }),
        [isDarkMode, themeColor],
    );

    const datasetValues = chartData.datasets[0]?.data ?? [];
    const hideZeroPoints = React.useMemo(() => {
        return datasetValues.reduce<number[]>((acc, value, index) => {
            if (value === 0) acc.push(index);
            return acc;
        }, []);
    }, [datasetValues]);

    const cumulativeSpending = React.useMemo(() => {
        let running = 0;
        return visibleCycleDates.map((date) => {
            running += dailySpendingMap[date] ?? 0;
            return running;
        });
    }, [visibleCycleDates, dailySpendingMap]);

    // --- Layout ---
    const dynamicCardStyle = [styles.card, { backgroundColor: cardBg, borderColor: cardBorder }];
    const GAP = 8;
    const TOTAL_PADDING = 24;
    const availableWidth = width - 32 - TOTAL_PADDING;
    const itemWidth = Math.floor((availableWidth - (GAP * 6)) / 7);

    const chartWidthPx = Math.max(width - 64, 280);
    const chartHeightPx = 250;
    const chartPaddingHorizontal = 16;
    const chartPaddingVertical = 36;
    const effectiveHeight = 202; // Roughly calculated
    const maxChartValue = datasetValues.length > 0 ? Math.max(...datasetValues, 0) : 0;
    const safeMaxChartValue = maxChartValue > 0 ? maxChartValue : 1;

    const getPointPosition = (index: number) => {
        const effectiveWidth = Math.max(chartWidthPx - chartPaddingHorizontal * 2, 1);
        const pointSpacing = datasetValues.length > 1 ? effectiveWidth / (datasetValues.length - 1) : 0;

        const value = datasetValues[index] ?? 0;
        const ratio = safeMaxChartValue === 0 ? 0 : value / safeMaxChartValue;
        const x = chartPaddingHorizontal + pointSpacing * index;
        const y = chartHeightPx - chartPaddingVertical - ratio * effectiveHeight;
        return { x, y };
    };

    // Tooltip Logic
    const showTooltip = selectedIndex !== null && selectedIndex >= 0 && selectedIndex < datasetValues.length;
    const tooltipIndex = showTooltip ? selectedIndex! : null;
    const tooltipDate = tooltipIndex !== null ? visibleCycleDates[tooltipIndex] : undefined;
    const tooltipDayLabel = tooltipDate ? (() => {
        const date = new Date(`${tooltipDate}T00:00:00`);
        const weekday = date.toLocaleDateString(undefined, { weekday: 'short' });
        const dd = `${date.getDate()}`.padStart(2, '0');
        const mm = `${date.getMonth() + 1}`.padStart(2, '0');
        return `${weekday}, ${dd}/${mm}`;
    })() : '';
    const tooltipSpent = tooltipIndex !== null ? cumulativeSpending[tooltipIndex] ?? 0 : 0;
    const tooltipPos = tooltipIndex !== null ? getPointPosition(tooltipIndex) : null;
    const tooltipWidth = 140;
    const tooltipHeight = 64;

    const clamp = (value: number, min: number, max: number) => {
        if (Number.isNaN(value)) return min;
        return Math.min(Math.max(value, min), max);
    };
    const tooltipLeft = tooltipPos !== null ? clamp(tooltipPos.x - tooltipWidth / 2, 0, chartWidthPx - tooltipWidth) : 0;
    const tooltipTop = tooltipPos !== null ? clamp(tooltipPos.y - tooltipHeight - 8, 0, chartHeightPx - tooltipHeight) : 0;

    const lastPointIndex = datasetValues.length - 1;
    const lastPointPos = lastPointIndex >= 0 ? getPointPosition(lastPointIndex) : null;

    const handlePointPress = ({ index }: { index?: number }) => {
        if (typeof index === 'number') {
            setSelectedIndex((prev) => (prev === index ? null : index));
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Chart Card */}
            <View style={dynamicCardStyle}>
                <Text style={[styles.cardTitle, { color: textColor }]}>
                    Spent:{' '}
                    <Text style={[styles.cardSubtitleInline, { color: subTextColor }]}>
                        {billingCycle.label}
                    </Text>
                </Text>
                <Text style={styles.cardSubtitleAmount}>
                    {formatAmount(totals.expenses)}
                </Text>
                <TouchableWithoutFeedback onPress={() => setSelectedIndex(null)}>
                    <View
                        style={[
                            styles.graphContainer,
                            { width: chartWidthPx, height: chartHeightPx },
                        ]}
                    >
                        {datasetValues.length > 1 ? (
                            <LineChart
                                data={chartData}
                                width={chartWidthPx}
                                height={chartHeightPx}
                                chartConfig={chartConfig}
                                bezier
                                fromZero
                                withInnerLines={false}
                                withOuterLines={false}
                                withHorizontalLabels={false}
                                withVerticalLabels={true}
                                verticalLabelRotation={0}
                                hidePointsAtIndex={[...hideZeroPoints, lastPointIndex]}
                                onDataPointClick={handlePointPress}
                                style={{ ...styles.chart, paddingBottom: 20 }}
                            />
                        ) : (
                            <View style={{ width: chartWidthPx, height: chartHeightPx, alignItems: 'center', justifyContent: 'center' }}>
                                {datasetValues.length === 0 && (
                                    <Text style={{ color: subTextColor, marginTop: 80 }}>No data for this period</Text>
                                )}
                            </View>
                        )}
                        {lastPointPos && datasetValues.length > 0 && (
                            <View
                                style={{
                                    position: 'absolute',
                                    left: lastPointPos.x - 6,
                                    top: lastPointPos.y - 6,
                                }}
                            >
                                <GlowingDot color={themeColor} />
                            </View>
                        )}
                        <View pointerEvents="none" style={styles.graphOverlay}>
                            {showTooltip && tooltipPos && (
                                <View
                                    style={[
                                        styles.tooltip,
                                        {
                                            left: tooltipLeft,
                                            top: tooltipTop,
                                            opacity: showTooltip ? 1 : 0,
                                            backgroundColor: isDarkMode ? '#333' : '#1f1f1f',
                                        },
                                    ]}
                                >
                                    <Text style={styles.tooltipDay}>{tooltipDayLabel}</Text>
                                    <Text style={styles.tooltipAmount}>
                                        {formatAmount(tooltipSpent)}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.legendList}>
                    <View style={styles.legendItem}>
                        <View
                            style={[styles.legendDot, { backgroundColor: themeColor }]}
                        />
                        <Text style={[styles.legendText, { color: subTextColor }]}>This period</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View
                            style={[styles.legendDot, { backgroundColor: '#E0E0E0' }]}
                        />
                        <Text style={[styles.legendText, { color: subTextColor }]}>Budget</Text>
                    </View>
                </View>
            </View>

            {/* Calendar Card */}
            <View style={dynamicCardStyle}>
                <Text style={[styles.cardTitle, { color: textColor }]}>Calendar</Text>
                {/* Days Header */}
                <View style={[styles.calendarGrid, { marginBottom: 8 }]}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <View key={i} style={[styles.dayHeaderCell, { width: itemWidth, marginRight: i === 6 ? 0 : GAP }]}>
                            <Text style={[styles.dayHeaderText, { color: subTextColor }]}>{day}</Text>
                        </View>
                    ))}
                </View>

                {/* Days Grid */}
                <View style={styles.calendarGrid}>
                    {allDates.map((date, index) => {
                        const dayNum = parseInt(date.slice(8, 10), 10);
                        const hasSpending = (dailySpendingMap[date] ?? 0) > 0;

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
                                        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#eee',
                                        opacity: isFuture ? 0.3 : 1,
                                    },
                                    hasSpending && !isFuture && {
                                        backgroundColor: isDarkMode ? 'rgba(2, 195, 189, 0.15)' : '#E0F7FA',
                                        borderColor: themeColor,
                                    },
                                ]}
                                onPress={() => onDayPress(date)}
                            >
                                <Text style={[
                                    styles.dayText,
                                    { color: textColor },
                                    hasSpending && !isFuture && { fontWeight: '700', color: themeColor }
                                ]}>
                                    {dayNum}
                                </Text>
                                {hasSpending && !isFuture && (
                                    <View style={[styles.transactionDot, { backgroundColor: themeColor }]} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
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
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    cardSubtitleInline: {
        fontSize: 14,
        fontWeight: '400',
    },
    cardSubtitleAmount: {
        fontSize: 28,
        fontWeight: '700',
        color: '#02C3BD',
        marginBottom: 16,
    },
    cardSubtitle: {
        fontSize: 14,
        marginBottom: 16,
    },
    graphContainer: {
        position: 'relative',
        marginBottom: 8,
        alignItems: 'center',
    },
    chart: {
        borderRadius: 16,
    },
    graphOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    tooltip: {
        position: 'absolute',
        width: 140,
        height: 64,
        borderRadius: 12,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    tooltipDay: {
        color: '#ccc',
        fontSize: 12,
        marginBottom: 4,
    },
    tooltipAmount: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    legendList: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    legendText: {
        fontSize: 12,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: 8,
    },
    dayHeaderCell: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        height: 20,
    },
    dayHeaderText: {
        fontSize: 12,
        fontWeight: '600',
    },
    dayCell: {
        aspectRatio: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    dayText: {
        fontSize: 14,
    },
    dotContainer: {
        width: 12,
        height: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    halo: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    coreDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 5,
    },
    innerWhiteDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#fff',
    },
    transactionDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginTop: 2,
    },
});

export default DashboardView;
