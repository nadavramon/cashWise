// src/context/BudgetContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiGetBudget, apiUpsertBudget, Budget } from "../api/budgetApi";
import { useTransactions } from "./TransactionsContext";

type BudgetDraft = {
  totalBudget: number;
  categoryBudgets: Record<string, number>;
};

type BudgetContextValue = {
  budget: Budget | null;
  draft: BudgetDraft;
  loading: boolean;
  error: string | null;

  cycleStartDate: string; // YYYY-MM-DD
  cycleEndExclusive: string; // YYYY-MM-DD

  setTotalBudget: (value: number) => void;
  setCategoryBudget: (categoryId: string, value: number) => void;
  clearCategoryBudget: (categoryId: string) => void;

  refresh: () => Promise<void>;
  save: () => Promise<void>;
};

const BudgetContext = createContext<BudgetContextValue | undefined>(undefined);

export const useBudget = (): BudgetContextValue => {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error("useBudget must be used within BudgetProvider");
  return ctx;
};

const safeNum = (n: any, fallback: number) =>
  typeof n === "number" && !Number.isNaN(n) ? n : fallback;

const addDays = (yyyyMmDd: string, days: number): string => {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${dt.getFullYear()}-${mm}-${dd}`;
};

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { dateRange } = useTransactions();
  // We don't need profile anymore for cycle calculation since we trust TransactionsContext
  // const { profile } = useProfile();

  const cycleStartDate = dateRange.fromDate;
  // TransactionsContext uses inclusive toDate. Budget uses exclusive end date.
  const cycleEndExclusive = useMemo(() => {
    if (!dateRange.toDate) return "";
    return addDays(dateRange.toDate, 1);
  }, [dateRange.toDate]);

  const [budget, setBudget] = useState<Budget | null>(null);
  const [draft, setDraft] = useState<BudgetDraft>({
    totalBudget: 0,
    categoryBudgets: {},
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!cycleStartDate) return;
    try {
      setLoading(true);
      setError(null);

      const b = await apiGetBudget(cycleStartDate);
      setBudget(b);

      // Initialize draft from server budget (or empty defaults)
      const total = safeNum(b?.totalBudget, 0);
      const cats = (b?.categoryBudgets ?? {}) as Record<string, number>;

      setDraft({
        totalBudget: total,
        categoryBudgets: { ...cats },
      });
    } catch (e: any) {
      console.error("Failed to load budget", e);
      setError(e?.message ?? "Failed to load budget");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycleStartDate]);

  const setTotalBudget = (value: number) => {
    setDraft((prev) => ({ ...prev, totalBudget: value }));
  };

  const setCategoryBudget = (categoryId: string, value: number) => {
    setDraft((prev) => ({
      ...prev,
      categoryBudgets: { ...prev.categoryBudgets, [categoryId]: value },
    }));
  };

  const clearCategoryBudget = (categoryId: string) => {
    setDraft((prev) => {
      const next = { ...prev.categoryBudgets };
      delete next[categoryId];
      return { ...prev, categoryBudgets: next };
    });
  };

  const save = async () => {
    if (!cycleStartDate || !cycleEndExclusive) return;
    try {
      setLoading(true); // optimistically show loading
      setError(null);

      const saved = await apiUpsertBudget({
        cycleStartDate,
        cycleEndExclusive,
        totalBudget: draft.totalBudget,
        categoryBudgets: draft.categoryBudgets,
      });

      setBudget(saved);
      // Update draft to match saved exactly (sanitization)
      setDraft({
        totalBudget: saved.totalBudget,
        categoryBudgets: (saved.categoryBudgets ?? {}) as Record<
          string,
          number
        >,
      });
    } catch (e: any) {
      console.error("Failed to save budget", e);
      setError(e?.message ?? "Failed to save budget");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const value: BudgetContextValue = {
    budget,
    draft,
    loading,
    error,
    cycleStartDate,
    cycleEndExclusive,
    setTotalBudget,
    setCategoryBudget,
    clearCategoryBudget,
    refresh: load,
    save,
  };

  return (
    <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
  );
};
