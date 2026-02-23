import { useState, useEffect, useMemo } from "react";
import { useBudget } from "../context/BudgetContext";
import { useCategories } from "../context/CategoriesContext";
import { apiListTransactions } from "../api/transactionsApi";
import { Transaction } from "../types/models";
import { CATEGORY_REPO } from "../data/categoryRepo";

export interface MonthlyData {
  month: string; // "Jan", "Feb", etc.
  income: number;
  expenses: number;
  date: string; // YYYY-MM for sorting
}

export interface TopCategory {
  categoryId: string;
  categoryLabel: string;
  groupColor: string;
  icon: string;
  amount: number;
  percentage: number; // of total expenses
}

export interface BudgetInsightsResult {
  // Trend data (6 months)
  monthlyTrend: MonthlyData[];

  // Top categories (current cycle)
  topCategories: TopCategory[];

  // Summary stats
  savingsRate: number; // (income - expenses) / income * 100
  averageDailySpend: number;
  currentMonthTotal: number;
  previousMonthTotal: number;
  monthOverMonthChange: number; // percentage change

  // Current cycle totals
  cycleIncome: number;
  cycleExpenses: number;

  loading: boolean;
  error: string | null;
}

/**
 * Get the start of a month 6 months ago
 */
function getSixMonthsAgoStart(): string {
  const date = new Date();
  date.setMonth(date.getMonth() - 5); // Go back 5 months (current + 5 = 6 months)
  date.setDate(1); // First day of that month
  return formatDate(date);
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Get month abbreviation from YYYY-MM-DD
 */
function getMonthAbbr(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short" });
}

/**
 * Get YYYY-MM from YYYY-MM-DD
 */
function getYearMonth(dateStr: string): string {
  return dateStr.substring(0, 7);
}

/**
 * Hook to calculate budget insights - trends, top categories, stats.
 * Used by the Budget Insights tab.
 */
export function useBudgetInsights(): BudgetInsightsResult {
  const { cycleStartDate, cycleEndExclusive } = useBudget();
  const { categories: userCategories } = useCategories();

  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [cycleTransactions, setCycleTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch 6 months of historical transactions
  useEffect(() => {
    let mounted = true;
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        const sixMonthsAgo = getSixMonthsAgoStart();
        const today = formatDate(new Date());

        const allTxs: Transaction[] = [];
        let nextToken: string | null = null;

        do {
          const res = await apiListTransactions({
            fromDate: sixMonthsAgo,
            toDate: today,
            nextToken,
            limit: 100,
          });
          allTxs.push(...res.items);
          nextToken = res.nextToken || null;
        } while (nextToken);

        if (mounted) {
          setAllTransactions(allTxs);

          // Filter for current cycle
          if (cycleStartDate && cycleEndExclusive) {
            const cycleTxs = allTxs.filter((tx) => {
              return tx.date >= cycleStartDate && tx.date < cycleEndExclusive;
            });
            setCycleTransactions(cycleTxs);
          }
        }
      } catch (e: any) {
        console.error("Failed to load transactions for insights", e);
        if (mounted) {
          setError(e?.message ?? "Failed to load transactions");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchTransactions();
    return () => {
      mounted = false;
    };
  }, [cycleStartDate, cycleEndExclusive]);

  // Calculate monthly trend (6 months)
  const monthlyTrend = useMemo(() => {
    const monthMap = new Map<string, { income: number; expenses: number }>();

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const yearMonth = `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}`;
      monthMap.set(yearMonth, { income: 0, expenses: 0 });
    }

    // Aggregate transactions by month
    for (const tx of allTransactions) {
      if (!tx.includeInStats) continue;

      const yearMonth = getYearMonth(tx.date);
      const existing = monthMap.get(yearMonth);
      if (!existing) continue;

      if (tx.type === "income") {
        existing.income += tx.amount;
      } else if (tx.type === "expense") {
        existing.expenses += tx.amount;
      }
    }

    // Convert to array sorted by date
    const result: MonthlyData[] = [];
    const sortedMonths = Array.from(monthMap.keys()).sort();

    for (const yearMonth of sortedMonths) {
      const data = monthMap.get(yearMonth)!;
      // Get month abbreviation from yearMonth (YYYY-MM)
      const date = new Date(`${yearMonth}-01`);
      const monthAbbr = date.toLocaleDateString("en-US", { month: "short" });

      result.push({
        month: monthAbbr,
        income: data.income,
        expenses: data.expenses,
        date: yearMonth,
      });
    }

    return result;
  }, [allTransactions]);

  // Build category lookup from user categories
  const categoryMap = useMemo(() => {
    const map = new Map<
      string,
      { name: string; color: string; icon: string }
    >();
    for (const cat of userCategories) {
      // Find matching repo item for color and icon
      let color = cat.color || "#999";
      let icon = "help-circle-outline";

      for (const group of CATEGORY_REPO) {
        const item = group.items.find((i) => i.label === cat.name);
        if (item) {
          color = group.color;
          icon = item.icon;
          break;
        }
      }

      map.set(cat.id, { name: cat.name, color, icon });
    }
    return map;
  }, [userCategories]);

  // Calculate top spending categories (current cycle)
  const topCategories = useMemo(() => {
    const categoryTotals = new Map<string, number>();
    let totalExpenses = 0;

    for (const tx of cycleTransactions) {
      if (!tx.includeInStats) continue;
      if (tx.type !== "expense") continue;

      const current = categoryTotals.get(tx.categoryId) ?? 0;
      categoryTotals.set(tx.categoryId, current + tx.amount);
      totalExpenses += tx.amount;
    }

    // Convert to array and sort by amount
    const sorted = Array.from(categoryTotals.entries())
      .map(([categoryId, amount]) => {
        const catInfo = categoryMap.get(categoryId) ?? {
          name: "Unknown",
          color: "#999",
          icon: "help-circle-outline",
        };
        return {
          categoryId,
          categoryLabel: catInfo.name,
          groupColor: catInfo.color,
          icon: catInfo.icon,
          amount,
          percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
        };
      })
      .sort((a, b) => b.amount - a.amount);

    // Return top 5
    return sorted.slice(0, 5);
  }, [cycleTransactions, categoryMap]);

  // Calculate summary stats
  const stats = useMemo(() => {
    // Current cycle totals
    let cycleIncome = 0;
    let cycleExpenses = 0;

    for (const tx of cycleTransactions) {
      if (!tx.includeInStats) continue;
      if (tx.type === "income") {
        cycleIncome += tx.amount;
      } else if (tx.type === "expense") {
        cycleExpenses += tx.amount;
      }
    }

    // Savings rate
    const savingsRate =
      cycleIncome > 0 ? ((cycleIncome - cycleExpenses) / cycleIncome) * 100 : 0;

    // Average daily spend (current cycle)
    let daysInCycle = 1;
    if (cycleStartDate && cycleEndExclusive) {
      const start = new Date(cycleStartDate);
      const end = new Date(cycleEndExclusive);
      daysInCycle = Math.max(
        1,
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      );
    }

    // Calculate elapsed days for average
    const today = new Date();
    const cycleStart = cycleStartDate ? new Date(cycleStartDate) : today;
    const elapsedDays = Math.max(
      1,
      Math.ceil((today.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24))
    );

    const averageDailySpend = cycleExpenses / elapsedDays;

    // Month over month change
    const currentMonthData = monthlyTrend[monthlyTrend.length - 1];
    const previousMonthData = monthlyTrend[monthlyTrend.length - 2];

    const currentMonthTotal = currentMonthData?.expenses ?? 0;
    const previousMonthTotal = previousMonthData?.expenses ?? 0;

    const monthOverMonthChange =
      previousMonthTotal > 0
        ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100
        : 0;

    return {
      savingsRate,
      averageDailySpend,
      currentMonthTotal,
      previousMonthTotal,
      monthOverMonthChange,
      cycleIncome,
      cycleExpenses,
    };
  }, [cycleTransactions, cycleStartDate, cycleEndExclusive, monthlyTrend]);

  return {
    monthlyTrend,
    topCategories,
    ...stats,
    loading,
    error,
  };
}
