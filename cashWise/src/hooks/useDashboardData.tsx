import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { useOverviewCycle } from "../context/CycleContext";
import { useProfile } from "../context/ProfileContext";
import { useBudget } from "../context/BudgetContext";
import { useTheme } from "./useTheme";
import {
    groupDailySpending,
    computePeriodTotals,
    buildDateRangeArray,
} from "../utils/overview";
import { getCurrencySymbol } from "../utils/currency";
import { FONT_FAMILIES } from "../config/typography";

interface UseDashboardDataProps {
    themeColor: string;
}

export const useDashboardData = ({ themeColor }: UseDashboardDataProps) => {
    const { isDark, colors } = useTheme();

    // Context Data
    const { transactions, start, endExclusive, error, refreshTransactions } =
        useOverviewCycle();
    const { profile } = useProfile();
    const { budget, draft } = useBudget();

    const currencySymbol = getCurrencySymbol(profile?.currency);
    const budgetTotal = budget?.totalBudget ?? draft.totalBudget ?? 0;

    // Helpers
    const formatAmount = (amount: number) =>
        `${currencySymbol}${amount.toFixed(2)}`;

    const isoString = (dateObj: Date) => {
        const year = dateObj.getFullYear();
        const month = `${dateObj.getMonth() + 1}`.padStart(2, "0");
        const day = `${dateObj.getDate()}`.padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // 1. Totals
    const totals = useMemo(
        () => computePeriodTotals(transactions),
        [transactions]
    );

    // 2. Billing Cycle Label
    const billingCycle = useMemo(() => {
        if (!start || !endExclusive) return { label: "", start: "", end: "" };
        const startDate = new Date(start);
        const endDate = new Date(endExclusive);
        endDate.setDate(endDate.getDate() - 1);
        const format = (d: Date) =>
            `${d.getDate()} ${d.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}`;
        const label = `${format(startDate)} - ${format(endDate)}`;
        return { start, end: endExclusive, label };
    }, [start, endExclusive]);

    // 3. All Dates
    const allDates = useMemo(() => {
        if (!billingCycle.start || !billingCycle.end) return [];
        const endD = new Date(billingCycle.end);
        endD.setDate(endD.getDate() - 1);
        return buildDateRangeArray(billingCycle.start, isoString(endD));
    }, [billingCycle]);

    // 4. Daily Spending
    const dailySpendingMap = useMemo(
        () => groupDailySpending(transactions),
        [transactions]
    );

    // 5. Current Index (Today)
    const todayIso = isoString(new Date());
    const currentIndex = useMemo(() => {
        let index = -1;
        allDates.forEach((date, i) => {
            if (date <= todayIso) {
                index = i;
            }
        });
        return index;
    }, [allDates, todayIso]);

    // 6. Chart Data Generation
    const chartData = useMemo(() => {
        if (!billingCycle.start) return [];

        // Styles for data point
        const currentDotWrapperStyle = {
            width: 18,
            height: 18,
            alignItems: "center" as const,
            justifyContent: "center" as const,
        };

        const currentDotGlowStyle = {
            position: "absolute" as const,
            width: 18,
            height: 18,
            borderRadius: 9,
            opacity: 0.25,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 8,
            elevation: 4,
        };

        const currentDotCoreStyle = {
            width: 8,
            height: 8,
            borderRadius: 4,
            borderWidth: 2,
        };

        const lastIndex = allDates.length - 1;

        return allDates.map((date, index) => {
            const dayStr = date.slice(8, 10);
            const isFuture = currentIndex === -1 || index > currentIndex;
            const isCurrent = index === currentIndex;
            const value = isFuture ? undefined : (dailySpendingMap[date] ?? 0);
            const showLabel = index % 5 === 0 || index === lastIndex;

            return {
                value,
                label: showLabel ? `${parseInt(dayStr, 10)}` : "",
                date,
                hideDataPoint: !isCurrent,
                customDataPoint: isCurrent
                    ? () => (
                        <View style={currentDotWrapperStyle}>
                            <View
                                style={[
                                    currentDotGlowStyle,
                                    { backgroundColor: themeColor, shadowColor: themeColor },
                                ]}
                            />
                            <View
                                style={[
                                    currentDotCoreStyle,
                                    {
                                        backgroundColor: themeColor,
                                        borderColor: isDark ? colors.surface : "#FFFFFF",
                                    },
                                ]}
                            />
                        </View>
                    )
                    : undefined,
                labelTextStyle: {
                    color: colors.textSecondary,
                    fontSize: 10,
                    fontFamily: FONT_FAMILIES.body.medium,
                },
            };
        });
    }, [
        allDates,
        billingCycle.start,
        currentIndex,
        dailySpendingMap,
        isDark,
        colors,
        themeColor,
    ]);

    return {
        // Data
        transactions,
        totals,
        start,
        endExclusive,
        error,
        refreshTransactions,
        budgetTotal,

        // Calculated
        billingCycle,
        allDates,
        dailySpendingMap,
        currentIndex,
        chartData,

        // Helpers
        formatAmount,
        currencySymbol,
    };
};
