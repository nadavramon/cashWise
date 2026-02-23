import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import {
    ElevatedCard,
    H3,
    Caption,
    ScalePressable,
} from "../../../ui";
import { useTheme } from "../../../../hooks/useTheme";
import { RADIUS } from "../../../../config/visuals";
import { FONT_FAMILIES } from "../../../../config/typography";

interface SpendingCalendarProps {
    allDates: string[];
    dailySpendingMap: Record<string, number>;
    onDayPress: (date: string) => void;
    themeColor: string;
}

export const SpendingCalendar: React.FC<SpendingCalendarProps> = ({
    allDates,
    dailySpendingMap,
    onDayPress,
    themeColor,
}) => {
    const { colors, isDark } = useTheme();
    const { width } = Dimensions.get("window");

    // Layout State
    const GAP = 10;
    const [calendarContentWidth, setCalendarContentWidth] = useState(
        Math.max(width - 48, 0)
    );

    const itemWidth = Math.floor(
        Math.max(calendarContentWidth - GAP * 6, 0) / 7
    );

    const totalCalendarRows = Math.ceil(allDates.length / 7);

    return (
        <ElevatedCard
            padding={20}
            borderRadius={RADIUS["4xl"]}
            style={styles.calendarCard}
        >
            <H3 color={colors.textPrimary} style={styles.calendarTitle}>
                Calendar
            </H3>

            <View
                style={styles.calendarContent}
                onLayout={(event) => {
                    const nextWidth = Math.floor(event.nativeEvent.layout.width);
                    if (nextWidth > 0 && nextWidth !== calendarContentWidth) {
                        setCalendarContentWidth(nextWidth);
                    }
                }}
            >
                {/* Day Headers */}
                <View style={styles.calendarHeaderRow}>
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dayHeaderCell,
                                { width: itemWidth, marginRight: i === 6 ? 0 : GAP },
                            ]}
                        >
                            <Caption
                                color={colors.textTertiary}
                                style={styles.dayHeaderText}
                            >
                                {day}
                            </Caption>
                        </View>
                    ))}
                </View>

                {/* Calendar Grid */}
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
                            <ScalePressable
                                key={date}
                                disabled={isFuture}
                                onPress={() => onDayPress(date)}
                                scaleAmount="subtle"
                                style={[
                                    styles.dayCell,
                                    {
                                        width: itemWidth,
                                        marginRight: isLastInRow ? 0 : GAP,
                                        marginBottom: isLastRow ? 0 : GAP,
                                        borderColor: colors.border,
                                        backgroundColor: hasSpending && !isFuture
                                            ? isDark
                                                ? `${themeColor}20`
                                                : `${themeColor}15`
                                            : "transparent",
                                        opacity: isFuture ? 0.3 : 1,
                                    },
                                    hasSpending && !isFuture && {
                                        borderColor: themeColor,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.dayText,
                                        {
                                            color: hasSpending && !isFuture
                                                ? themeColor
                                                : colors.textPrimary,
                                            fontFamily: hasSpending && !isFuture
                                                ? FONT_FAMILIES.body.bold
                                                : FONT_FAMILIES.body.medium,
                                        },
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
                            </ScalePressable>
                        );
                    })}
                </View>
            </View>
        </ElevatedCard>
    );
};

const styles = StyleSheet.create({
    calendarCard: {
        marginBottom: 16,
    },
    calendarTitle: {
        marginBottom: 16,
    },
    calendarContent: {
        width: "100%",
    },
    calendarHeaderRow: {
        flexDirection: "row",
        marginBottom: 12,
    },
    dayHeaderCell: {
        alignItems: "center",
        justifyContent: "center",
        height: 28,
    },
    dayHeaderText: {
        fontWeight: "600",
    },
    calendarGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    dayCell: {
        aspectRatio: 1,
        borderRadius: RADIUS.lg,
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
