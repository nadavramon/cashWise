// src/api/transactionsApi.ts
import { graphqlClient } from './graphqlClient';
import {
  CREATE_TRANSACTION,
  LIST_TRANSACTIONS,
  UPDATE_TRANSACTION,
  DELETE_TRANSACTION,
} from './operations';

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface CreateTransactionInput {
  type: TransactionType;
  amount: number;
  categoryId: string;
  date: string;           // 'YYYY-MM-DD'
  note?: string | null;
  includeInStats?: boolean;
}

export interface UpdateTransactionInputApi {
  id: string;
  date: string; // 'YYYY-MM-DD' original date
  type?: TransactionType;
  amount?: number;
  categoryId?: string;
  note?: string | null;
  includeInStats?: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
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
    variables: { input },
  });

  if (!('data' in result) || typeof result.data?.updateTransaction !== 'boolean') {
    throw new Error('updateTransaction returned no data');
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

  if (!('data' in result) || typeof result.data?.deleteTransaction !== 'boolean') {
    throw new Error('deleteTransaction returned no data');
  }

  return result.data.deleteTransaction;
}

export async function apiCreateTransaction(
  input: CreateTransactionInput
): Promise<Transaction> {
  const result = await graphqlClient.graphql({
    query: CREATE_TRANSACTION,
    variables: { input },
    authMode: 'userPool',
  });

  if ('data' in result && result.data?.createTransaction) {
    return result.data.createTransaction as Transaction;
  }

  throw new Error('CreateTransaction returned no data');
}

export interface TransactionApi {
  id: string;
  userId: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  categoryId: string;
  date: string; // AWSDate: 'YYYY-MM-DD'
  note?: string | null;
  includeInStats: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface ListTransactionsInputApi {
  fromDate: string;      // 'YYYY-MM-DD'
  toDate: string;        // 'YYYY-MM-DD'
  limit?: number;
  nextToken?: string | null;
}

export interface TransactionConnectionApi {
  items: TransactionApi[];
  nextToken?: string | null;
}

interface ListTransactionsResponse {
  listTransactions: TransactionConnectionApi;
}

export async function apiListTransactions(
  input: ListTransactionsInputApi,
): Promise<TransactionConnectionApi> { // Changed return type to Connection
  const result = (await graphqlClient.graphql({
    query: LIST_TRANSACTIONS,
    variables: { input },
    authMode: 'userPool',
  })) as { data: ListTransactionsResponse };

  return result.data?.listTransactions ?? { items: [], nextToken: null };
}
