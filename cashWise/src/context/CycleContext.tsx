import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useProfile } from "./ProfileContext";
import {
  apiListTransactions,
  Transaction as ApiTransaction,
} from "../api/transactionsApi";
import { Transaction } from "../types/models";
import { DateRangePresetApi } from "../api/profileApi";
import { useTransactions } from "./TransactionsContext";

import { getCycleRangeForDate } from "../utils/billingCycle";
import { getErrorMessage } from "../utils/errorHandler";

/*
  Cycle Calculation Logic:
  If startDay = 10:
  Offset 0 (Current):
    If today >= 10th: Start = 10th of this month. End = 10th of next month.
    If today < 10th: Start = 10th of last month. End = 10th of this month.
*/

interface OverviewCycleContextValue {
  offset: number;
  setOffset: (next: number) => void;
  start: string;
  endExclusive: string;
  loading: boolean;
  transactions: Transaction[];
  error: string | null;
  refreshTransactions: () => Promise<void>;
}

const OverviewCycleContext = createContext<
  OverviewCycleContextValue | undefined
>(undefined);

export const useOverviewCycle = () => {
  const context = useContext(OverviewCycleContext);
  if (!context) {
    throw new Error(
      "useOverviewCycle must be used within OverviewCycleProvider",
    );
  }
  return context;
};

const mapApiToModel = (apiTx: ApiTransaction): Transaction => ({
  id: apiTx.id,
  userId: apiTx.userId,
  type: apiTx.type, // Already mapped
  amount: apiTx.amount,
  categoryId: apiTx.categoryId,
  date: apiTx.date,
  note: apiTx.note ?? undefined,
  includeInStats: apiTx.includeInStats,
  createdAt: apiTx.createdAt,
  updatedAt: apiTx.updatedAt ?? undefined,
});

export const OverviewCycleProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { profile } = useProfile();
  useTransactions();

  const [offset, setOffset] = useState(0);
  const [start, setStart] = useState<string>("");
  const [endExclusive, setEndExclusive] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!profile) return;

    // @ts-ignore
    const { billingCycleStartDay, overviewDateRangePreset } = profile;
    // Default to CURRENT_CYCLE if missing (type cast/checking handled in getCycleRange)
    const preset =
      (overviewDateRangePreset as DateRangePresetApi) || "CURRENT_CYCLE";

    const { start: s, endExclusive: e } = getCycleRangeForDate(
      new Date(),
      { startDay: billingCycleStartDay ?? 1 },
      preset,
      offset,
    );

    setStart(s);
    setEndExclusive(e);
    setLoading(true);
    setError(null);

    try {
      console.log(
        `Fetching transactions from ${s} to ${e} (Preset: ${preset}, Offset: ${offset})`,
      );

      const allTxs: Transaction[] = []; // Model Transaction
      let nextToken: string | null = null;

      do {
        const response = await apiListTransactions({
          fromDate: s,
          toDate: e,
          nextToken,
        });

        const mapped = response.items.map(mapApiToModel);
        allTxs.push(...mapped);
        nextToken = response.nextToken || null;
      } while (nextToken);

      setTransactions(allTxs);
    } catch (err: any) {
      console.error("Error fetching transactions:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [profile, offset]);

  // Reset offset when specific profile fields change
  useEffect(() => {
    if (profile?.overviewDateRangePreset) {
      setOffset(0);
    }
  }, [profile?.overviewDateRangePreset]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const value: OverviewCycleContextValue = {
    offset,
    setOffset,
    start,
    endExclusive,
    loading,
    transactions,
    error,
    refreshTransactions: fetchTransactions,
  };

  return (
    <OverviewCycleContext.Provider value={value}>
      {children}
    </OverviewCycleContext.Provider>
  );
};
