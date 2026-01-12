import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
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
  TransactionApi as ApiTransaction,
  UpdateTransactionInputApi,
} from "../api/transactionsApi";
import { getCycleRangeForDate } from "../utils/billingCycle";
import { DateRangePresetApi } from "../api/profileApi";

type DateRangePreset = DateRangePresetApi | "THIS_WEEK";

interface DateRange {
  preset: DateRangePreset;
  fromDate: string; // 'YYYY-MM-DD'
  toDate: string; // 'YYYY-MM-DD'
}

const formatDate = (d: Date): string => {
  const yyyy = d.getFullYear();
  const mm = `${d.getMonth() + 1}`.padStart(2, "0");
  const dd = `${d.getDate()}`.padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const getNowInTimezone = (timeZone: string): Date => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const y = Number(parts.find((p) => p.type === "year")?.value);
  const m = Number(parts.find((p) => p.type === "month")?.value);
  const d = Number(parts.find((p) => p.type === "day")?.value);

  // local Date representing that calendar day
  return new Date(y, m - 1, d);
};

// Helper to bridge the gap between `DateRangePreset` (UI) and billing logic
const getPresetRange = (
  preset: DateRangePreset,
  startDay: number = 1,
  timezone: string = "Asia/Jerusalem",
): DateRange => {
  const now = getNowInTimezone(timezone);

  // Handle specific UI-only presets like THIS_WEEK if not covered by utility
  if (preset === "THIS_WEEK") {
    const day = now.getDay();
    const diffToMonday = (day + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return {
      preset,
      fromDate: formatDate(monday),
      toDate: formatDate(sunday),
    };
  }

  if (preset === "CUSTOM") {
    return {
      preset: "CUSTOM",
      fromDate: formatDate(now),
      toDate: formatDate(now),
    };
  }

  // Use the shared utility for everything else (CURRENT_CYCLE, LAST_CYCLE, THIS_MONTH, LAST_MONTH, YEAR_TO_DATE)
  const { start, endExclusive } = getCycleRangeForDate(
    now,
    { startDay },
    preset as DateRangePresetApi,
  );

  // Note: TransactionsContext uses inclusive ranges (user expects 'toDate' to be included potentially?)
  // Actually, apiListTransactions takes from/to.
  // The utility returns endExclusive (start of next period).
  // We subtract 1 day from endExclusive to get the inclusive end date.
  const endDate = new Date(endExclusive);
  endDate.setDate(endDate.getDate() - 1);

  return {
    preset,
    fromDate: start,
    toDate: formatDate(endDate),
  };
};

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
  lastUpdated?: number; // Add this
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

function mapApiToUi(tx: ApiTransaction | any): UiTransaction {
  // tx is now the Refactored Transaction interface from API which uses App types
  // But we might need to handle null vs undefined for strictness
  return {
    id: tx.id,
    userId: tx.userId,
    type: tx.type, // Already 'income' | 'expense'
    amount: tx.amount,
    categoryId: tx.categoryId,
    date: tx.date,
    note: tx.note ?? undefined,
    includeInStats: tx.includeInStats ?? true,
    createdAt: tx.createdAt,
    updatedAt: tx.updatedAt ?? undefined,
  };
}

export const TransactionsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { userId } = useAuth();
  const { profile } = useProfile();

  const [transactions, setTransactions] = useState<UiTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add lastUpdated state to signal changes to consumers (Chart, CycleContext)
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  // Default to CURRENT_CYCLE
  const [dateRange, setDateRangeState] = useState<DateRange>(() => {
    return {
      preset: "CURRENT_CYCLE",
      fromDate: formatDate(new Date()),
      toDate: formatDate(new Date()),
    };
  });

  const fetchTransactionsForRange = async (range: DateRange) => {
    if (!userId) {
      setTransactions([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const allTxs: UiTransaction[] = [];
      let nextToken: string | null = null;

      do {
        // Call the thin API wrapper
        const response = await apiListTransactions({
          fromDate: range.fromDate,
          toDate: range.toDate,
          nextToken,
        });

        const mapped = response.items.map(mapApiToUi);
        allTxs.push(...mapped);
        nextToken = response.nextToken || null;
      } while (nextToken);

      setTransactions(allTxs);
    } catch (e: any) {
      console.error("Failed to load transactions", e);
      setError(e?.message ?? "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  // Sync with profile default
  useEffect(() => {
    if (!profile) return;

    const targetPreset =
      (profile.overviewDateRangePreset as DateRangePreset) || "CURRENT_CYCLE";

    const startDay = profile.billingCycleStartDay || 1;

    setDateRangeState((current) => {
      // If the current preset is different from the target AND it's not custom/interactive, maybe update?
      // For now, we force update only if we are still on the initial/default logic or if simple switching is desired.
      // Let's just update based on the profile's preferred preset + startDay logic.
      const timezone = profile.billingCycleTimezone || "Asia/Jerusalem";
      return getPresetRange(targetPreset, startDay, timezone);
    });
  }, [profile]);

  useEffect(() => {
    fetchTransactionsForRange(dateRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, dateRange.fromDate, dateRange.toDate]);

  const addTransaction = async (input: AddTransactionInput) => {
    if (!userId) {
      throw new Error("Not signed in");
    }

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
      const uiTx = mapApiToUi(created);
      setTransactions((prev) => [uiTx, ...prev]);
      setLastUpdated(Date.now()); // Signal update
    } catch (e: any) {
      console.error("Failed to create transaction", e);
      setError(e?.message ?? "Failed to create transaction");
      throw e;
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

    if (patch.type) {
      apiInput.type = patch.type;
    }
    if (typeof patch.amount === "number") {
      apiInput.amount = patch.amount;
    }
    if (patch.categoryId) {
      apiInput.categoryId = patch.categoryId;
    }
    if (patch.note !== undefined) {
      apiInput.note = patch.note;
    }
    if (patch.includeInStats !== undefined) {
      apiInput.includeInStats = patch.includeInStats;
    }

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
      setLastUpdated(Date.now()); // Signal update
    } catch (e: any) {
      console.error("Failed to update transaction", e);
      setError(e?.message ?? "Failed to update transaction");
      throw e;
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
      setLastUpdated(Date.now()); // Signal update
    } catch (e: any) {
      console.error("Failed to delete transaction", e);
      setError(e?.message ?? "Failed to delete transaction");
      throw e;
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
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};
