export type TransactionType = 'expense' | 'income';

export type CategoryType = TransactionType | 'both';

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: CategoryType;  
  color?: string;
  createdAt: string; // ISO
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  date: string;       // 'YYYY-MM-DD' for v1
  note?: string;
  accountId?: string;
  includeInStats: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;         // Cognito sub later
  email: string;
  createdAt: string;
}