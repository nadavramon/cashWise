// src/api/transactionsApi.ts
import { graphqlClient } from "./graphqlClient";
import {
  CREATE_TRANSACTION,
  LIST_TRANSACTIONS,
  UPDATE_TRANSACTION,
  DELETE_TRANSACTION,
} from "./operations";

import type { TransactionType as AppTxType } from "../types/models";
import { fromGqlTxType, toGqlTxType } from "./mappers";
import type { TransactionType as GqlTxType } from "./graphqlTypes";

export type { AppTxType as TransactionType };

export interface CreateTransactionInput {
  type: AppTxType;
  amount: number;
  categoryId: string;
  date: string; // 'YYYY-MM-DD'
  note?: string | null;
  includeInStats?: boolean;
}

export interface UpdateTransactionInputApi {
  id: string;
  date: string; // 'YYYY-MM-DD' original date
  type?: AppTxType;
  amount?: number;
  categoryId?: string;
  note?: string | null;
  includeInStats?: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  type: AppTxType;
  amount: number;
  categoryId: string;
  date: string;
  note?: string | null;
  includeInStats: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export async function apiUpdateTransaction(
  input: UpdateTransactionInputApi,
): Promise<boolean> {
  const result = await graphqlClient.graphql({
    query: UPDATE_TRANSACTION,
    variables: {
      input: {
        ...input,
        type: input.type ? toGqlTxType(input.type) : undefined,
      },
    },
  });

  if (
    !("data" in result) ||
    typeof result.data?.updateTransaction !== "boolean"
  ) {
    throw new Error("updateTransaction returned no data");
  }

  return result.data.updateTransaction;
}

export async function apiDeleteTransaction(
  id: string,
  date: string,
): Promise<boolean> {
  const result = await graphqlClient.graphql({
    query: DELETE_TRANSACTION,
    variables: { id, date },
  });

  if (
    !("data" in result) ||
    typeof result.data?.deleteTransaction !== "boolean"
  ) {
    throw new Error("deleteTransaction returned no data");
  }

  return result.data.deleteTransaction;
}

export async function apiCreateTransaction(
  input: CreateTransactionInput,
): Promise<Transaction> {
  const result = await graphqlClient.graphql({
    query: CREATE_TRANSACTION,
    variables: {
      input: {
        ...input,
        type: toGqlTxType(input.type),
      },
    },
    authMode: "userPool",
  });

  if ("data" in result && result.data?.createTransaction) {
    const raw = result.data.createTransaction;
    return {
      ...raw,
      type: fromGqlTxType(raw.type as GqlTxType),
    } as Transaction;
  }

  throw new Error("CreateTransaction returned no data");
}

export interface TransactionApi {
  id: string;
  userId: string;
  type: GqlTxType;
  amount: number;
  categoryId: string;
  date: string; // AWSDate: 'YYYY-MM-DD'
  note?: string | null;
  includeInStats: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface ListTransactionsInputApi {
  fromDate: string; // 'YYYY-MM-DD'
  toDate: string; // 'YYYY-MM-DD'
  limit?: number;
  nextToken?: string | null;
}

export interface TransactionConnectionApi {
  items: Transaction[];
  nextToken?: string | null;
}

interface ListTransactionsResponse {
  listTransactions: {
    items: TransactionApi[];
    nextToken?: string | null;
  };
}

export async function apiListTransactions(
  input: ListTransactionsInputApi,
): Promise<TransactionConnectionApi> {
  // Changed return type to Connection
  const result = (await graphqlClient.graphql({
    query: LIST_TRANSACTIONS,
    variables: { input },
    authMode: "userPool",
  })) as { data: ListTransactionsResponse };

  const data = result.data?.listTransactions ?? { items: [], nextToken: null };
  return {
    items: data.items.map((item) => ({
      ...item,
      type: fromGqlTxType(item.type),
    })),
    nextToken: data.nextToken,
  };
}
