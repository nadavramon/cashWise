import { useCallback, useEffect, useState, useRef } from "react";
import {
  apiListTransactions,
  Transaction,
  ListTransactionsInputApi,
  TransactionApi,
} from "../api/transactionsApi";

interface UsePaginatedTransactionsParams {
  fromDate: string; // 'YYYY-MM-DD'
  toDate: string; // 'YYYY-MM-DD'
  pageSize?: number;
}

export function usePaginatedTransactions({
  fromDate,
  toDate,
  pageSize = 50,
}: UsePaginatedTransactionsParams) {
  const [items, setItems] = useState<Transaction[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // We use a ref to track if we are currently mounted to avoid state updates on unmount
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Internal load function that accepts token as argument
  const loadPageInternal = useCallback(
    async (token: string | null, isReset: boolean) => {
      if (isReset) {
        setNextToken(null);
      }

      const isFirstPage = isReset;

      if (isFirstPage) {
        setLoadingInitial(true);
      } else {
        setLoadingMore(true);
      }

      setError(null);

      try {
        const input: ListTransactionsInputApi = {
          fromDate,
          toDate,
          limit: pageSize,
          nextToken: token,
        };

        const { items: pageItems, nextToken: newToken } =
          await apiListTransactions(input);

        if (mountedRef.current) {
          setItems((prev) =>
            isFirstPage
              ? pageItems
              : [
                  ...prev,
                  // safety: avoid dup ids if backend ever overlaps pages
                  ...pageItems.filter(
                    (p) => !prev.some((existing) => existing.id === p.id),
                  ),
                ],
          );

          setNextToken(newToken ?? null);
        }
      } catch (e: any) {
        console.error("Failed to load transactions", e);
        if (mountedRef.current) {
          setError(e?.message ?? "Unknown error");
        }
      } finally {
        if (mountedRef.current) {
          setLoadingInitial(false);
          setLoadingMore(false);
        }
      }
    },
    [fromDate, toDate, pageSize],
  );

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // For refresh, force reset with null token
      await loadPageInternal(null, true);
    } finally {
      if (mountedRef.current) {
        setRefreshing(false);
      }
    }
  }, [loadPageInternal]);

  // Initial load + when date range changes
  useEffect(() => {
    loadPageInternal(null, true);
    // We only trigger when date range changes.
    // loadPageInternal depends on fromDate/toDate/pageSize so it's stable enough.
  }, [loadPageInternal]);

  const loadMore = useCallback(() => {
    if (!nextToken || loadingMore) return;
    // Load next page using current token
    void loadPageInternal(nextToken, false);
  }, [nextToken, loadingMore, loadPageInternal]);

  return {
    items,
    hasNextPage: !!nextToken,
    loadingInitial,
    loadingMore,
    refreshing,
    error,
    refresh,
    loadMore,
  };
}
