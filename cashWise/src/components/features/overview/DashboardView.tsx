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

interface DashboardViewProps {
    totals: { income: number; expenses: number };
    billingCycle: { label: string; start: string; end: string };
    chartData: any;
    chartConfig: any;
    dailySpendingMap: Record<string, number>;
    allDates: string[];
    onDayPress: (date: string) => void;
    themeColor: string;
    formatAmount: (amount: number) => string;
    hideZeroPoints: number[];
    chartWidthPx: number;
    chartHeightPx: number;
    cumulativeSpending: number[];
    visibleCycleDates: string[];
    getPointPosition: (index: number) => { x: number; y: number };
    datasetValues: number[];
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
    totals,
    billingCycle,
    chartData,
    chartConfig,
    dailySpendingMap,
    allDates,
    onDayPress,
    themeColor,
    formatAmount,
    hideZeroPoints,
    chartWidthPx,
    chartHeightPx,
    cumulativeSpending,
    visibleCycleDates,
    getPointPosition,
    datasetValues
}) => {
    const isDarkMode = useColorScheme() === 'dark';
    const textColor = isDarkMode ? '#FFFFFF' : '#333333';
    const subTextColor = isDarkMode ? '#CCCCCC' : '#666666';
    const cardBg = isDarkMode ? 'rgba(30, 30, 30, 0.8)' : '#FFFFFF';
    const cardBorder = isDarkMode ? 'rgba(255,255,255,0.1)' : '#ddd';

    const { width } = Dimensions.get('window');
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const dynamicCardStyle = [styles.card, { backgroundColor: cardBg, borderColor: cardBorder }];

    // Calendar Layout Constants
    const GAP = 8;
    const TOTAL_PADDING = 24; // 12 padding left + 12 padding right from card
    const availableWidth = width - 32 - TOTAL_PADDING; // Screen width - Screen Padding - Card Padding
    const itemWidth = Math.floor((availableWidth - (GAP * 6)) / 7);

    // Tooltip Logic
    const showTooltip =
        selectedIndex !== null &&
        selectedIndex >= 0 &&
        selectedIndex < datasetValues.length;

    const tooltipIndex = showTooltip ? selectedIndex! : null;
    const tooltipDate =
        tooltipIndex !== null ? visibleCycleDates[tooltipIndex] : undefined;
    const tooltipDayLabel = tooltipDate
        ? (() => {
            const date = new Date(`${tooltipDate}T00:00:00`);
            const weekday = date.toLocaleDateString(undefined, {
                weekday: 'short',
            });
            const dd = `${date.getDate()}`.padStart(2, '0');
            const mm = `${date.getMonth() + 1}`.padStart(2, '0');
            return `${weekday}, ${dd}/${mm}`;
        })()
        : '';

    const tooltipSpent =
        tooltipIndex !== null ? cumulativeSpending[tooltipIndex] ?? 0 : 0;

    const tooltipPos =
        tooltipIndex !== null ? getPointPosition(tooltipIndex) : null;
    const tooltipWidth = 140;
    const tooltipHeight = 64;

    const clamp = (value: number, min: number, max: number) => {
        if (Number.isNaN(value)) return min;
        return Math.min(Math.max(value, min), max);
    };

    const tooltipLeft =
        tooltipPos !== null
            ? clamp(tooltipPos.x - tooltipWidth / 2, 0, chartWidthPx - tooltipWidth)
            : 0;
    const tooltipTop =
        tooltipPos !== null
            ? clamp(tooltipPos.y - tooltipHeight - 8, 0, chartHeightPx - tooltipHeight)
            : 0;

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
                        {lastPointPos && (
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
                        const dayNum = parseInt(date.slice(8, 10), 10); // Removes leading zero
                        const hasSpending = (dailySpendingMap[date] ?? 0) > 0;

                        // Future date check
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const cellDate = new Date(date);
                        cellDate.setHours(0, 0, 0, 0);
                        const isFuture = cellDate > today;

                        // Need to handle gaps in the grid for correct wrapping
                        // We'll use marginRight except for the last item in a row
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
                                        backgroundColor: isDarkMode ? 'rgba(2, 195, 189, 0.15)' : '#E0F7FA', // Subtle background
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
