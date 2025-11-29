import { Category, Transaction } from '../types/models';

export interface SummaryResult {
  totalIncome: number;
  totalExpense: number;
  net: number;
  byCategory: {
    categoryId: string;
    categoryName: string;
    type: 'income' | 'expense' | 'both';
    totalAmount: number;
  }[];
}

// For v1 we can ignore date range and summarize all transactions we have.
// Later we’ll add fromDate/toDate.
export function calculateSummary(
  transactions: Transaction[],
  categories: Category[],
): SummaryResult {
  let totalIncome = 0;
  let totalExpense = 0;

  const categoryMap = new Map<string, Category>();
  categories.forEach((c) => categoryMap.set(c.id, c));

  const categoryTotals = new Map<string, number>();

  for (const tx of transactions) {
    if (!tx.includeInStats) continue;

    if (tx.type === 'income') {
      totalIncome += tx.amount;
    } else if (tx.type === 'expense') {
      totalExpense += tx.amount;
    }

    const current = categoryTotals.get(tx.categoryId) ?? 0;
    categoryTotals.set(tx.categoryId, current + tx.amount);
  }

  const byCategory: SummaryResult['byCategory'] = [];
  categoryTotals.forEach((amount, categoryId) => {
    const category = categoryMap.get(categoryId);
    if (!category) return;
    byCategory.push({
      categoryId,
      categoryName: category.name,
      type: category.type,
      totalAmount: amount,
    });
  });

  const net = totalIncome - totalExpense;

  return {
    totalIncome,
    totalExpense,
    net,
    byCategory,
  };
}