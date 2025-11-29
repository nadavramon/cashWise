// src/screens/OverviewScreen.tsx
import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  useWindowDimensions,
  useColorScheme,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTransactions } from '../store/TransactionsContext';
import { useProfile } from '../store/ProfileContext';
import { useCategories } from '../store/CategoriesContext';
import TransactionForm from '../components/TransactionForm';
import type { OverviewStackParamList } from '../navigation/OverviewStack';
import {
  computePeriodTotals,
  groupDailySpending,
  buildDateRangeArray,
} from '../utils/overview';
import { getCurrencySymbol } from '../utils/currency';
import { t, isRTL } from '../utils/i18n';
import { CATEGORY_REPO } from '../data/categoryRepo';

// Feature Components
import OverviewHeader from '../components/features/overview/OverviewHeader';
import OverviewModeSwitcher, { OverviewMode } from '../components/features/overview/OverviewModeSwitcher';
import DashboardView from '../components/features/overview/DashboardView';
import SpendingView from '../components/features/overview/SpendingView';
import TransactionList from '../components/features/overview/TransactionList';

type Nav = NativeStackNavigationProp<OverviewStackParamList, 'OverviewMain'>;

const OverviewScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { width } = useWindowDimensions();
  const { transactions, dateRange } = useTransactions();
  const { profile } = useProfile();
  const { categories } = useCategories();
  const currencySymbol = getCurrencySymbol(profile?.currency);
  const language = profile?.language || 'en';

  // --- THEME & COLORS SETUP ---
  const isDarkMode = useColorScheme() === 'dark';
  const themeColor = isDarkMode ? '#02C3BD' : '#007CBE';
  const textColor = isDarkMode ? '#FFFFFF' : '#333333';

  const [mode, setMode] = useState<OverviewMode>('DASHBOARD');
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'EXPENSES' | 'INCOME' | 'SAVINGS'>('EXPENSES');

  const translateX = useRef(new Animated.Value(0)).current;
  const modeOrder: Record<OverviewMode, number> = {
    DASHBOARD: 0,
    SPENDING: 1,
    LIST: 2,
  };

  const totals = useMemo(
    () => computePeriodTotals(transactions),
    [transactions],
  );

  const dailySpendingMap = useMemo(
    () => groupDailySpending(transactions),
    [transactions],
  );

  const allDates = useMemo(
    () => buildDateRangeArray(dateRange.fromDate, dateRange.toDate),
    [dateRange.fromDate, dateRange.toDate],
  );

  const isoString = (dateObj: Date) => {
    const year = dateObj.getFullYear();
    const month = `${dateObj.getMonth() + 1}`.padStart(2, '0');
    const day = `${dateObj.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const billingCycle = useMemo(() => {
    const toDate = new Date(dateRange.toDate);
    const start = new Date(toDate);
    if (toDate.getDate() >= 10) {
      start.setDate(10);
    } else {
      start.setMonth(toDate.getMonth() - 1);
      start.setDate(10);
    }
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    end.setDate(9);

    const label = `10/${`${start.getMonth() + 1}`.padStart(
      2,
      '0',
    )} - 09/${`${end.getMonth() + 1}`.padStart(2, '0')}`;

    return {
      start: isoString(start),
      end: isoString(end),
      label,
    };
  }, [dateRange.toDate]);

  const billingCycleDates = useMemo(
    () => buildDateRangeArray(billingCycle.start, billingCycle.end),
    [billingCycle.start, billingCycle.end],
  );

  const visibleCycleDates = useMemo(() => {
    const todayIso = isoString(new Date());
    const maxDate = todayIso < billingCycle.end ? todayIso : billingCycle.end;
    const filtered = billingCycleDates.filter((date) => date <= maxDate);
    return filtered.length > 0 ? filtered : billingCycleDates.slice(0, 1);
  }, [billingCycle.end, billingCycleDates]);

  // --- CHART CONFIGURATION ---
  const chartData = useMemo(() => {
    return {
      labels: visibleCycleDates.map((date) => {
        const day = date.slice(8, 10);
        const label = ['10', '15', '20', '25', '30', '05'].includes(day) ? day : '';
        return label;
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

  const chartConfig = useMemo(
    () => ({
      // Transparent Background
      backgroundColor: 'transparent',
      backgroundGradientFrom: 'transparent',
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: 'transparent',
      backgroundGradientToOpacity: 0,
      decimalPlaces: 0,
      color: (opacity = 1) => {
        return isDarkMode
          ? `rgba(2, 195, 189, ${opacity})`
          : `rgba(0, 124, 190, ${opacity})`;
      },
      labelColor: (opacity = 1) => isDarkMode
        ? `rgba(255, 255, 255, 1)`
        : `rgba(51, 51, 51, 1)`,
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
  const maxChartValue =
    datasetValues.length > 0 ? Math.max(...datasetValues, 0) : 0;
  const safeMaxChartValue = maxChartValue > 0 ? maxChartValue : 1;
  const chartWidthPx = Math.max(width - 64, 280);
  const chartHeightPx = 250;
  const chartPaddingHorizontal = 16;
  const chartPaddingVertical = 36;
  const effectiveWidth = Math.max(
    chartWidthPx - chartPaddingHorizontal * 2,
    1,
  );
  const effectiveHeight = Math.max(
    chartHeightPx - chartPaddingVertical - 12,
    1,
  );
  const pointSpacing =
    datasetValues.length > 1
      ? effectiveWidth / (datasetValues.length - 1)
      : 0;

  const getPointPosition = (index: number) => {
    const value = datasetValues[index] ?? 0;
    const ratio = safeMaxChartValue === 0 ? 0 : value / safeMaxChartValue;
    const x = chartPaddingHorizontal + pointSpacing * index;
    const y = chartHeightPx - chartPaddingVertical - ratio * effectiveHeight;
    return { x, y };
  };

  const cumulativeSpending = useMemo(() => {
    let running = 0;
    return visibleCycleDates.map((date) => {
      running += dailySpendingMap[date] ?? 0;
      return running;
    });
  }, [visibleCycleDates, dailySpendingMap]);

  const hideZeroPoints = useMemo(() => {
    return chartData.datasets[0].data.reduce<number[]>((acc, value, index) => {
      if (value === 0) acc.push(index);
      return acc;
    }, []);
  }, [chartData]);

  const cycleBudget = 0;

  const formatAmount = (amount: number) => {
    return `${currencySymbol}${amount.toFixed(2)}`;
  };

  const handleDayPress = (date: string) => {
    navigation.navigate('DailyTransactions', { date });
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (!t.includeInStats) return false;
      if (filter === 'EXPENSES') return t.type === 'expense';
      if (filter === 'INCOME') return t.type === 'income';
      if (filter === 'SAVINGS') {
        const cat = categories.find(c => c.id === t.categoryId);
        return cat?.name?.toLowerCase() === 'savings';
      }
      return false;
    });
  }, [transactions, filter, categories]);

  // Group by category with color logic
  const spendingChartData = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();

    for (const t of filteredTransactions) {
      const key = t.categoryId;
      const prev = map.get(key) ?? { total: 0, count: 0 };
      prev.total += t.amount;
      prev.count += 1;
      map.set(key, prev);
    }

    const result: {
      categoryId: string;
      total: number;
      count: number;
      name: string;
      color: string;
      legendFontColor: string;
      legendFontSize: number;
    }[] = [];

    const palette = [
      '#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#1dd1a1',
    ];
    let pIndex = 0;

    const findRepoColor = (categoryName: string) => {
      const lowerName = categoryName.toLowerCase();
      for (const group of CATEGORY_REPO) {
        if (group.items.some(item => item.label.toLowerCase() === lowerName)) {
          return group.color;
        }
      }
      return null;
    };

    for (const [categoryId, agg] of map.entries()) {
      const cat = categories.find((c) => c.id === categoryId);
      const categoryName = cat?.name ?? 'Uncategorized';

      let color = cat?.color ?? findRepoColor(categoryName);
      if (!color) {
        color = palette[pIndex % palette.length];
        pIndex++;
      }

      result.push({
        categoryId,
        total: agg.total,
        count: agg.count,
        name: categoryName,
        color,
        legendFontColor: isDarkMode ? '#CCC' : '#7F7F7F',
        legendFontSize: 12,
      });
    }

    return result.sort((a, b) => b.total - a.total);
  }, [filteredTransactions, categories, isDarkMode]);

  const pieData = spendingChartData.map((item) => ({
    name: item.name,
    population: item.total,
    color: item.color,
    legendFontColor: item.legendFontColor,
    legendFontSize: item.legendFontSize,
  }));

  const totalAmount = spendingChartData.reduce((acc, curr) => acc + curr.total, 0);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [transactions]);

  const handleModeChange = (nextMode: OverviewMode) => {
    if (nextMode === mode) return;
    const direction = modeOrder[nextMode] > modeOrder[mode] ? 1 : -1;
    translateX.setValue(direction * width);
    setMode(nextMode);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const renderModeContent = () => {
    if (mode === 'DASHBOARD') {
      return (
        <DashboardView
          totals={totals}
          billingCycle={billingCycle}
          chartData={chartData}
          chartConfig={chartConfig}
          dailySpendingMap={dailySpendingMap}
          allDates={allDates}
          onDayPress={handleDayPress}
          themeColor={themeColor}
          formatAmount={formatAmount}
          hideZeroPoints={hideZeroPoints}
          chartWidthPx={chartWidthPx}
          chartHeightPx={chartHeightPx}
          cumulativeSpending={cumulativeSpending}
          visibleCycleDates={visibleCycleDates}
          getPointPosition={getPointPosition}
          datasetValues={datasetValues}
        />
      );
    }

    if (mode === 'SPENDING') {
      return (
        <SpendingView
          totals={totals}
          cycleBudget={cycleBudget}
          filter={filter}
          setFilter={setFilter}
          spendingChartData={spendingChartData}
          pieData={pieData}
          totalAmount={totalAmount}
          chartConfig={chartConfig}
          formatAmount={formatAmount}
          themeColor={themeColor}
        />
      );
    }

    return (
      <TransactionList transactions={sortedTransactions} />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: textColor }]}>{t('overviewTitle', language)}</Text>
        <OverviewHeader
          dateRange={dateRange}
          themeColor={themeColor}
          title={undefined} // Header title handled by screen title above
        />

        <OverviewModeSwitcher
          currentMode={mode}
          onModeChange={handleModeChange}
          themeColor={themeColor}
          language={language}
        />

        <View style={styles.modeContentWrapper}>
          <Animated.View
            style={[
              styles.modeContentInner,
              { transform: [{ translateX }] },
            ]}
          >
            {renderModeContent()}
          </Animated.View>
        </View>

        {/* Conditional Add Button */}
        {(mode === 'SPENDING' || mode === 'LIST') && (
          transactions.length === 0 ? (
            <View style={styles.emptyStateContainer} pointerEvents="box-none">
              <TouchableOpacity
                style={styles.bigAddButton}
                onPress={() => setShowAddModal(true)}
              >
                <Text style={styles.bigAddButtonText}>+ {t('addTransaction', language)}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.fab, { backgroundColor: themeColor }]}
              onPress={() => setShowAddModal(true)}
            >
              <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
          )
        )}

        <Modal
          visible={showAddModal}
          animationType="slide"
          onRequestClose={() => setShowAddModal(false)}
          presentationStyle="pageSheet"
        >
          <View style={{ flex: 1, backgroundColor: isDarkMode ? '#1a1a1a' : '#f2f2f7' }}>
            <TransactionForm
              onSuccess={() => setShowAddModal(false)}
              onCancel={() => setShowAddModal(false)}
            />
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default OverviewScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  modeContentWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  modeContentInner: {
    flex: 1,
    width: '100%',
  },
  emptyStateContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  bigAddButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 8,
  },
  bigAddButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 20,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    marginTop: -4,
  },
});