// src/utils/overview.ts
import type { Transaction } from "../types/models";

/**
 * Compute total income, expenses and net for a list of transactions.
 * Only includes transactions where includeInStats === true.
 */
export function computePeriodTotals(transactions: Transaction[]) {
  let income = 0;
  let expenses = 0;

  for (const t of transactions) {
    if (!t.includeInStats) continue;

    if (t.type === "income") {
      income += t.amount;
    } else if (t.type === "expense") {
      expenses += t.amount;
    }
  }

  return {
    income,
    expenses,
    net: income - expenses,
  };
}

/**
 * Group expenses by date and return a map:
 * { 'YYYY-MM-DD': totalExpenseAmount }
 */
export function groupDailySpending(transactions: Transaction[]) {
  const map: Record<string, number> = {};

  for (const t of transactions) {
    if (!t.includeInStats) continue;
    if (t.type !== "expense") continue;

    const key = t.date; // already 'YYYY-MM-DD' in your model
    map[key] = (map[key] ?? 0) + t.amount;
  }

  return map;
}

/**
 * Build an array of date strings from fromDate to toDate (inclusive),
 * assuming both are 'YYYY-MM-DD'.
 */
export function buildDateRangeArray(
  fromDate: string,
  toDate: string,
): string[] {
  const dates: string[] = [];

  const [fromY, fromM, fromD] = fromDate.split("-").map(Number);
  const [toY, toM, toD] = toDate.split("-").map(Number);

  const start = new Date(fromY, fromM - 1, fromD);
  const end = new Date(toY, toM - 1, toD);

  let current = start;
  while (current <= end) {
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, "0");
    const d = String(current.getDate()).padStart(2, "0");
    dates.push(`${y}-${m}-${d}`);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}
