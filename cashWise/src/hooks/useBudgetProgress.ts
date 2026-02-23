import { useState, useEffect, useMemo } from "react";
import { useBudget } from "../context/BudgetContext";
import { useCategories } from "../context/CategoriesContext";
import { apiListTransactions } from "../api/transactionsApi";
import { Transaction } from "../types/models";
import { CATEGORY_REPO, RepoCategoryItem } from "../data/categoryRepo";

export interface CategoryProgress {
  categoryCode: string;
  categoryLabel: string;
  groupId: string;
  groupColor: string;
  icon: string;
  budgeted: number;
  spent: number;
  remaining: number;
  percentage: number; // 0-100+, can exceed 100 if over budget
  isOverBudget: boolean;
}

export interface BudgetProgressResult {
  categories: CategoryProgress[];
  totalBudgeted: number;
  totalSpent: number;
  totalRemaining: number;
  overallPercentage: number;
  loading: boolean;
  error: string | null;
}

/**
 * Helper to find a category item in CATEGORY_REPO by its code.
 * Returns the item and its parent group.
 */
function findRepoItemByCode(
  code: string
): { item: RepoCategoryItem; groupId: string; groupColor: string } | null {
  for (const group of CATEGORY_REPO) {
    const item = group.items.find((i) => i.code === code);
    if (item) {
      return { item, groupId: group.id, groupColor: group.color };
    }
  }
  return null;
}

/**
 * Hook to calculate budget progress - spent vs budgeted per category.
 * Used by the Budget Remaining tab.
 */
export function useBudgetProgress(): BudgetProgressResult {
  const { draft, cycleStartDate, cycleEndExclusive } = useBudget();
  const { categories: userCategories } = useCategories();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch transactions for the current billing cycle
  useEffect(() => {
    if (!cycleStartDate || !cycleEndExclusive) return;

    let mounted = true;
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        const allTxs: Transaction[] = [];
        let nextToken: string | null = null;

        do {
          const res = await apiListTransactions({
            fromDate: cycleStartDate,
            toDate: cycleEndExclusive,
            nextToken,
            limit: 100,
          });
          allTxs.push(...res.items);
          nextToken = res.nextToken || null;
        } while (nextToken);

        if (mounted) {
          setTransactions(allTxs);
        }
      } catch (e: any) {
        console.error("Failed to load transactions for budget progress", e);
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

  // Build a map from category label to user category IDs
  // A user can have multiple categories with the same name, so we collect all IDs
  const labelToCategoryIds = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const cat of userCategories) {
      const existing = map.get(cat.name) ?? [];
      existing.push(cat.id);
      map.set(cat.name, existing);
    }
    return map;
  }, [userCategories]);

  // Aggregate spending by category ID
  const spendingByCategoryId = useMemo(() => {
    const map = new Map<string, number>();
    for (const tx of transactions) {
      if (!tx.includeInStats) continue;
      if (tx.type !== "expense") continue;

      const current = map.get(tx.categoryId) ?? 0;
      map.set(tx.categoryId, current + tx.amount);
    }
    return map;
  }, [transactions]);

  // Calculate progress for each budgeted category
  const categoryProgress = useMemo(() => {
    const result: CategoryProgress[] = [];

    for (const [categoryCode, budgetedAmount] of Object.entries(
      draft.categoryBudgets
    )) {
      // Find the repo item to get label, icon, group info
      const repoInfo = findRepoItemByCode(categoryCode);
      if (!repoInfo) continue;

      const { item, groupId, groupColor } = repoInfo;

      // Find user category IDs that match this label
      const categoryIds = labelToCategoryIds.get(item.label) ?? [];

      // Sum spending across all matching category IDs
      let spent = 0;
      for (const catId of categoryIds) {
        spent += spendingByCategoryId.get(catId) ?? 0;
      }

      const remaining = budgetedAmount - spent;
      const percentage =
        budgetedAmount > 0 ? (spent / budgetedAmount) * 100 : 0;
      const isOverBudget = spent > budgetedAmount;

      result.push({
        categoryCode,
        categoryLabel: item.label,
        groupId,
        groupColor,
        icon: item.icon,
        budgeted: budgetedAmount,
        spent,
        remaining,
        percentage,
        isOverBudget,
      });
    }

    // Sort by percentage descending (highest usage first)
    result.sort((a, b) => b.percentage - a.percentage);

    return result;
  }, [draft.categoryBudgets, labelToCategoryIds, spendingByCategoryId]);

  // Calculate totals
  const totals = useMemo(() => {
    let totalBudgeted = 0;
    let totalSpent = 0;

    for (const cat of categoryProgress) {
      totalBudgeted += cat.budgeted;
      totalSpent += cat.spent;
    }

    const totalRemaining = totalBudgeted - totalSpent;
    const overallPercentage =
      totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

    return {
      totalBudgeted,
      totalSpent,
      totalRemaining,
      overallPercentage,
    };
  }, [categoryProgress]);

  return {
    categories: categoryProgress,
    ...totals,
    loading,
    error,
  };
}
