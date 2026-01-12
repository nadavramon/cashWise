import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { Transaction as UiTransaction } from "../types/models";
import { useAuth } from "./AuthContext";
import { useProfile } from "./ProfileContext";
import {
  apiCreateTransaction,
  apiListTransactions,
  apiUpdateTransaction,
  apiDeleteTransaction,
  CreateTransactionInput as ApiCreateInput,
  UpdateTransactionInputApi,
} from "../api/transactionsApi";
import {
  DateRange,
  DateRangePreset,
  getPresetRange,
  formatDate,
} from "../utils/billingCycle";
import { getErrorMessage } from "../utils/errorHandler";

export type { DateRange, DateRangePreset };

interface AddTransactionInput {
  type: "income" | "expense";
  amount: number;
  categoryId: string;
  date: string; // 'YYYY-MM-DD'
  note?: string;
}

interface TransactionsContextValue {
  transactions: UiTransaction[];
  loading: boolean;
  error: string | null;
  dateRange: DateRange;
  lastUpdated?: number;
  setPresetRange: (preset: DateRangePreset) => void;
  setCustomRange: (fromDate: string, toDate: string) => void;
  refreshCurrentRange: () => Promise<void>;
  addTransaction: (input: AddTransactionInput) => Promise<void>;
  updateTransaction: (
    id: string,
    originalDate: string,
    patch: {
      type?: "income" | "expense";
      amount?: number;
      categoryId?: string;
      note?: string;
      includeInStats?: boolean;
    },
  ) => Promise<void>;
  deleteTransaction: (id: string, date: string) => Promise<void>;
  // Pagination
  loadMore: () => Promise<void>;
  hasNextPage: boolean;
  loadingMore: boolean;
}

const TransactionsContext = createContext<TransactionsContextValue | undefined>(
  undefined,
);

export const useTransactions = (): TransactionsContextValue => {
  const ctx = useContext(TransactionsContext);
  if (!ctx) {
    throw new Error("useTransactions must be used within TransactionsProvider");
  }
  return ctx;
};

export const TransactionsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { userId } = useAuth();
  const { profile } = useProfile();

  const [transactions, setTransactions] = useState<UiTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [nextToken, setNextTokenState] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // Signal updates to consumers
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  // Default to CURRENT_CYCLE
  const [dateRange, setDateRangeState] = useState<DateRange>(() => {
    return {
      preset: "CURRENT_CYCLE",
      fromDate: formatDate(new Date()),
      toDate: formatDate(new Date()),
    };
  });

  // Race condition handling
  const lastRequestId = useRef<number>(0);

  const fetchTransactionsForRange = async (range: DateRange) => {
    if (!userId) {
      setTransactions([]);
      return;
    }

    const requestId = Date.now();
    lastRequestId.current = requestId;

    try {
      setLoading(true);
      setError(null);

      const response = await apiListTransactions({
        fromDate: range.fromDate,
        toDate: range.toDate,
        nextToken: null, // Initial load always starts from null
        limit: 20,
      });

      // Check if this request is still the latest one
      if (requestId !== lastRequestId.current) {
        return; // Abort: a newer request has started
      }

      setTransactions(response.items);
      setNextTokenState(response.nextToken || null);
    } catch (e: any) {
      // Only set error if we are still the latest request
      if (requestId === lastRequestId.current) {
        const msg = getErrorMessage(e);
        console.error("Failed to load transactions", e);
        setError(msg);
      }
    } finally {
      // Only unset loading if we are still the latest request
      if (requestId === lastRequestId.current) {
        setLoading(false);
      }
    }
  };

  // Sync with profile default
  useEffect(() => {
    if (!profile) return;

    const targetPreset =
      (profile.overviewDateRangePreset as DateRangePreset) || "CURRENT_CYCLE";
    const startDay = profile.billingCycleStartDay || 1;
    const timezone = profile.billingCycleTimezone || "Asia/Jerusalem";

    setDateRangeState((current) => {
      // Re-calculate based on profile settings
      return getPresetRange(targetPreset, startDay, timezone);
    });
  }, [profile]);

  // Fetch when range or user changes
  useEffect(() => {
    fetchTransactionsForRange(dateRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, dateRange.fromDate, dateRange.toDate]);

  const addTransaction = async (input: AddTransactionInput) => {
    if (!userId) throw new Error("Not signed in");

    const apiInput: ApiCreateInput = {
      type: input.type,
      amount: input.amount,
      categoryId: input.categoryId,
      date: input.date,
      note: input.note ?? null,
      includeInStats: true,
    };

    try {
      setError(null);
      const created = await apiCreateTransaction(apiInput);
      setTransactions((prev) => [created, ...prev]);
      setLastUpdated(Date.now());
    } catch (e: any) {
      const msg = getErrorMessage(e);
      console.error("Failed to create transaction", e);
      setError(msg);
      throw new Error(msg);
    }
  };

  const refreshCurrentRange = async () => {
    await fetchTransactionsForRange(dateRange);
  };

  const setPresetRange = (preset: DateRangePreset) => {
    const startDay = profile?.billingCycleStartDay || 1;
    const timezone = profile?.billingCycleTimezone || "Asia/Jerusalem";
    const range = getPresetRange(preset, startDay, timezone);
    setDateRangeState(range);
  };

  const setCustomRange = (fromDate: string, toDate: string) => {
    setDateRangeState({
      preset: "CUSTOM",
      fromDate,
      toDate,
    });
  };

  const updateTransaction = async (
    id: string,
    originalDate: string,
    patch: {
      type?: "income" | "expense";
      amount?: number;
      categoryId?: string;
      note?: string;
      includeInStats?: boolean;
    },
  ) => {
    if (!userId) throw new Error("Not signed in");

    const apiInput: UpdateTransactionInputApi = {
      id,
      date: originalDate,
    };

    if (patch.type) apiInput.type = patch.type;
    if (typeof patch.amount === "number") apiInput.amount = patch.amount;
    if (patch.categoryId) apiInput.categoryId = patch.categoryId;
    if (patch.note !== undefined) apiInput.note = patch.note;
    if (patch.includeInStats !== undefined)
      apiInput.includeInStats = patch.includeInStats;

    try {
      setError(null);
      const ok = await apiUpdateTransaction(apiInput);
      if (!ok) throw new Error("Update failed");

      setTransactions((prev) =>
        prev.map((tx) => {
          if (tx.id !== id || tx.date !== originalDate) return tx;
          return {
            ...tx,
            ...(patch.type ? { type: patch.type } : {}),
            ...(patch.amount !== undefined ? { amount: patch.amount } : {}),
            ...(patch.categoryId ? { categoryId: patch.categoryId } : {}),
            ...(patch.note !== undefined ? { note: patch.note } : {}),
            ...(patch.includeInStats !== undefined
              ? { includeInStats: patch.includeInStats }
              : {}),
          };
        }),
      );
      setLastUpdated(Date.now());
    } catch (e: any) {
      const msg = getErrorMessage(e);
      console.error("Failed to update transaction", e);
      setError(msg);
      throw new Error(msg);
    }
  };

  const deleteTransaction = async (id: string, date: string) => {
    if (!userId) throw new Error("Not signed in");

    try {
      setError(null);
      const ok = await apiDeleteTransaction(id, date);
      if (!ok) throw new Error("Delete failed");

      setTransactions((prev) =>
        prev.filter((tx) => !(tx.id === id && tx.date === date)),
      );
      setLastUpdated(Date.now());
    } catch (e: any) {
      const msg = getErrorMessage(e);
      console.error("Failed to delete transaction", e);
      setError(msg);
      throw new Error(msg);
    }
  };

  const loadMore = async () => {
    if (!nextToken || loadingMore || !userId) return;

    try {
      setLoadingMore(true);
      const response = await apiListTransactions({
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        nextToken,
        limit: 20,
      });

      setTransactions((prev) => [...prev, ...response.items]);
      setNextTokenState(response.nextToken || null);
    } catch (e: any) {
      console.error("Failed to load more transactions", e);
      // We generally don't set the global error for pagination failures to avoid blocking the UI,
      // but you could add a toast or separate error state if desired.
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        loading,
        error,
        dateRange,
        lastUpdated,
        setPresetRange,
        setCustomRange,
        refreshCurrentRange,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        loadMore,
        hasNextPage: !!nextToken,
        loadingMore,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};
