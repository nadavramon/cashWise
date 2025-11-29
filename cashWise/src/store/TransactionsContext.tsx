import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Transaction as UiTransaction } from '../types/models';
import { useAuth } from './AuthContext';
import { useProfile } from './ProfileContext';
import {
  apiCreateTransaction,
  apiListTransactions,
  apiUpdateTransaction,
  apiDeleteTransaction,
  CreateTransactionInput as ApiCreateInput,
  Transaction as ApiTransaction,
  UpdateTransactionInputApi,
} from '../api/transactionsApi';

type DateRangePreset = 'THIS_MONTH' | 'LAST_MONTH' | 'THIS_WEEK' | 'CUSTOM';

interface DateRange {
  preset: DateRangePreset;
  fromDate: string; // 'YYYY-MM-DD'
  toDate: string; // 'YYYY-MM-DD'
}

const formatDate = (d: Date): string => {
  const yyyy = d.getFullYear();
  const mm = `${d.getMonth() + 1}`.padStart(2, '0');
  const dd = `${d.getDate()}`.padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const getPresetRange = (preset: DateRangePreset): DateRange => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  if (preset === 'THIS_MONTH') {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    return {
      preset,
      fromDate: formatDate(first),
      toDate: formatDate(last),
    };
  }

  if (preset === 'LAST_MONTH') {
    const lastMonth = month - 1;
    const first = new Date(year, lastMonth, 1);
    const last = new Date(year, lastMonth + 1, 0);
    return {
      preset,
      fromDate: formatDate(first),
      toDate: formatDate(last),
    };
  }

  if (preset === 'THIS_WEEK') {
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

  return {
    preset: 'CUSTOM',
    fromDate: formatDate(now),
    toDate: formatDate(now),
  };
};

interface AddTransactionInput {
  type: 'income' | 'expense';
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
  setPresetRange: (preset: DateRangePreset) => void;
  setCustomRange: (fromDate: string, toDate: string) => void;
  refreshCurrentRange: () => Promise<void>;
  addTransaction: (input: AddTransactionInput) => Promise<void>;
  updateTransaction: (
    id: string,
    originalDate: string,
    patch: {
      type?: 'income' | 'expense';
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
    throw new Error('useTransactions must be used within TransactionsProvider');
  }
  return ctx;
};

function mapApiToUi(tx: ApiTransaction): UiTransaction {
  return {
    id: tx.id,
    userId: tx.userId,
    type: tx.type === 'INCOME' ? 'income' : 'expense',
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
  const [dateRange, setDateRangeState] = useState<DateRange>(() =>
    getPresetRange('THIS_MONTH'),
  );

  const fetchTransactionsForRange = async (range: DateRange) => {
    if (!userId) {
      setTransactions([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const apiTxs = await apiListTransactions(range.fromDate, range.toDate);
      const mapped = apiTxs.map(mapApiToUi);

      setTransactions(mapped);
    } catch (e: any) {
      console.error('Failed to load transactions', e);
      setError(e?.message ?? 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!profile?.defaultDateRangePreset) return;

    // Only accept known presets
    const preset = profile.defaultDateRangePreset as DateRangePreset;
    if (!['THIS_MONTH', 'LAST_MONTH', 'THIS_WEEK'].includes(preset)) {
      return;
    }

    // Only override if the user hasn't manually changed the preset away
    // from the initial THIS_MONTH (simple rule: only if current is THIS_MONTH).
    setDateRangeState((prev) => {
      if (prev.preset !== 'THIS_MONTH') {
        return prev;
      }
      return getPresetRange(preset);
    });
  }, [profile?.defaultDateRangePreset]);

  useEffect(() => {
    fetchTransactionsForRange(dateRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, dateRange.fromDate, dateRange.toDate]);

  const addTransaction = async (input: AddTransactionInput) => {
    if (!userId) {
      throw new Error('Not signed in');
    }

    const apiInput: ApiCreateInput = {
      type: input.type === 'income' ? 'INCOME' : 'EXPENSE',
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
    } catch (e: any) {
      console.error('Failed to create transaction', e);
      setError(e?.message ?? 'Failed to create transaction');
      throw e;
    }
  };

  const refreshCurrentRange = async () => {
    await fetchTransactionsForRange(dateRange);
  };

  const setPresetRange = (preset: DateRangePreset) => {
    const range = getPresetRange(preset);
    setDateRangeState(range);
  };

  const setCustomRange = (fromDate: string, toDate: string) => {
    setDateRangeState({
      preset: 'CUSTOM',
      fromDate,
      toDate,
    });
  };

  const updateTransaction = async (
    id: string,
    originalDate: string,
    patch: {
      type?: 'income' | 'expense';
      amount?: number;
      categoryId?: string;
      note?: string;
      includeInStats?: boolean;
    },
  ) => {
    if (!userId) throw new Error('Not signed in');

    const apiInput: UpdateTransactionInputApi = {
      id,
      date: originalDate,
    };

    if (patch.type) {
      apiInput.type = patch.type === 'income' ? 'INCOME' : 'EXPENSE';
    }
    if (typeof patch.amount === 'number') {
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
      if (!ok) throw new Error('Update failed');

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
    } catch (e: any) {
      console.error('Failed to update transaction', e);
      setError(e?.message ?? 'Failed to update transaction');
      throw e;
    }
  };

  const deleteTransaction = async (id: string, date: string) => {
    if (!userId) throw new Error('Not signed in');

    try {
      setError(null);
      const ok = await apiDeleteTransaction(id, date);
      if (!ok) throw new Error('Delete failed');

      setTransactions((prev) =>
        prev.filter((tx) => !(tx.id === id && tx.date === date)),
      );
    } catch (e: any) {
      console.error('Failed to delete transaction', e);
      setError(e?.message ?? 'Failed to delete transaction');
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
