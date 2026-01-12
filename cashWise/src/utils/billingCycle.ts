// src/utils/billingCycle.ts
import { DateRangePresetApi } from "../api/profileApi";

export interface BillingCycleConfig {
  startDay: number; // 1–28
  timezone?: string; // we’ll ignore for now; can integrate luxon later
}

/**
 * Returns [start, endExclusive] in YYYY-MM-DD based on the preset and offset.
 *
 * @param today - The reference "today" (usually new Date())
 * @param config - Cycle configuration (start day)
 * @param preset - The selected date range strategy
 * @param offset - Shift the range back/forward.
 *                 For CYCLE/MONTH presets: 1 unit = 1 cycle/month.
 *                 For YEAR_TO_DATE: 1 unit = 1 year.
 */
export function getCycleRangeForDate(
  today: Date,
  config: BillingCycleConfig,
  preset: DateRangePresetApi,
  offset: number = 0,
): { start: string; endExclusive: string } {
  // 0. Handle CUSTOM (Should be handled by caller with specific dates, but prevent fallthrough)
  if (preset === "CUSTOM") {
    return {
      start: formatDate(today),
      endExclusive: formatDate(new Date(today.getTime() + 86400000)), // tomorrow
    };
  }

  // 1. Handle Calendar Month Logic
  if (preset === "THIS_MONTH" || preset === "LAST_MONTH") {
    // Base: Start of current month
    let baseDate = new Date(today.getFullYear(), today.getMonth(), 1);

    // If "LAST_MONTH" is selected, it's effectively "THIS_MONTH" with offset +1 (or start -1 month)
    // Let's standardise: default offset=0 means "This Month".
    // If preset is LAST_MONTH, we add 1 to the 'logical' offset (backwards).
    const effectiveOffset = offset + (preset === "LAST_MONTH" ? 1 : 0);

    // Go back 'effectiveOffset' months
    const start = addMonths(baseDate, -effectiveOffset);
    const end = addMonths(start, 1);

    return {
      start: formatDate(start),
      endExclusive: formatDate(end),
    };
  }

  // 2. Handle Year To Date
  if (preset === "YEAR_TO_DATE") {
    const year = today.getFullYear() - offset;
    const start = new Date(year, 0, 1); // Jan 1st
    // End is "now" (exclusive would be tomorrow?)
    // or typically YTD means up to *now*.
    // For range queries "toDate" is usually exclusive.
    // Let's set end to tomorrow to include today's transactions.
    const end = new Date(today);
    end.setDate(end.getDate() + 1);

    // Note: YTD usually implies dynamic end date.
    // Use fixed end of year? No, YTD is "so far".
    // But if I go back 1 year (offset=1), it should probably be the FULL previous year?
    if (offset > 0) {
      // Full previous year
      return {
        start: formatDate(start),
        endExclusive: formatDate(new Date(year + 1, 0, 1)),
      };
    }

    return {
      start: formatDate(start),
      endExclusive: formatDate(end),
    };
  }

  // 3. Handle Billing Cycle Logic (CURRENT_CYCLE, LAST_CYCLE)
  // Default to CURRENT_CYCLE if null/unknown

  const startDay = config.startDay;
  // Work in local time for now
  const year = today.getFullYear();
  const month = today.getMonth(); // 0–11

  // Candidate start in this month
  const candidateStart = new Date(year, month, startDay);
  let currentStart: Date;

  if (today >= candidateStart) {
    // Cycle started this month
    currentStart = candidateStart;
  } else {
    // Cycle started last month
    currentStart = new Date(year, month - 1, startDay);
  }

  const effectiveOffset = offset + (preset === "LAST_CYCLE" ? 1 : 0);

  // Apply offset (in months)
  const start = addMonths(currentStart, -effectiveOffset);
  const end = addMonths(start, 1); // next cycle start

  return {
    start: formatDate(start), // inclusive
    endExclusive: formatDate(end), // exclusive
  };
}

function addMonths(date: Date, deltaMonths: number): Date {
  const d = new Date(date.getTime());
  const targetMonth = d.getMonth() + deltaMonths;
  d.setMonth(targetMonth);
  return d;
}

function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // 1–12
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
