import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  ElevatedCard,
  H3,
  BodySmall,
  ButtonText,
  ScalePressable,
} from "../../ui";
import { useTheme } from "../../../hooks/useTheme";
import { useDashboardData } from "../../../hooks/useDashboardData";
import { SpendingChart } from "./widgets/SpendingChart";
import { SpendingCalendar } from "./widgets/SpendingCalendar";
import { RADIUS } from "../../../config/visuals";

interface DashboardViewProps {
  onDayPress: (date: string) => void;
  themeColor: string;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  onDayPress,
  themeColor,
}) => {
  const { colors } = useTheme();

  // Custom data hook handles all logic
  const {
    error,
    refreshTransactions,
    totals,
    budgetTotal,
    billingCycle,
    chartData,
    currentIndex,
    allDates,
    dailySpendingMap,
    formatAmount,
  } = useDashboardData({ themeColor });

  // Error state
  if (error) {
    return (
      <ElevatedCard padding={24} style={styles.errorCard}>
        <H3 color={colors.textPrimary} style={styles.errorTitle}>
          Failed to load data
        </H3>
        <BodySmall color={colors.textSecondary} style={styles.errorSubtext}>
          {error}
        </BodySmall>
        <ScalePressable onPress={() => refreshTransactions()}>
          <View style={[styles.retryButton, { backgroundColor: themeColor }]}>
            <ButtonText color="#FFFFFF">Retry</ButtonText>
          </View>
        </ScalePressable>
      </ElevatedCard>
    );
  }


  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <SpendingChart
        chartData={chartData}
        totals={totals}
        budgetTotal={budgetTotal}
        billingCycleLabel={billingCycle.label}
        themeColor={themeColor}
        currentIndex={currentIndex}
        formatAmount={formatAmount}
      />

      <SpendingCalendar
        allDates={allDates}
        dailySpendingMap={dailySpendingMap}
        onDayPress={onDayPress}
        themeColor={themeColor}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
  },
  errorCard: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  errorTitle: {
    marginBottom: 8,
  },
  errorSubtext: {
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
  },
});

export default DashboardView;
