// src/utils/billingCycle.ts
import { DateRangePresetApi } from "../api/profileApi";

export type DateRangePreset = DateRangePresetApi | "THIS_WEEK" | "CUSTOM";

export interface DateRange {
  preset: DateRangePreset;
  fromDate: string; // 'YYYY-MM-DD'
  toDate: string; // 'YYYY-MM-DD' - typically inclusive in UI usage
}

export interface BillingCycleConfig {
  startDay: number; // 1–28
  timezone?: string;
}

export function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // 1–12
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const getNowInTimezone = (timeZone: string): Date => {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());

    const y = Number(parts.find((p) => p.type === "year")?.value);
    const m = Number(parts.find((p) => p.type === "month")?.value);
    const d = Number(parts.find((p) => p.type === "day")?.value);

    return new Date(y, m - 1, d);
  } catch {
    // Fallback to local time if timezone is invalid
    return new Date();
  }
};

/**
 * Main utility to resolve any preset (UI or API) into a concrete date range.
 */
export const getPresetRange = (
  preset: DateRangePreset,
  startDay: number = 1,
  timezone: string = "Asia/Jerusalem", // Default fallback
): DateRange => {
  const now = getNowInTimezone(timezone);

  // 1. Handle CUSTOM logic - usually handled by caller, but safe default
  if (preset === "CUSTOM") {
    return {
      preset: "CUSTOM",
      fromDate: formatDate(now),
      toDate: formatDate(now),
    };
  }

  // 2. Handle THIS_WEEK (UI Only)
  if (preset === "THIS_WEEK") {
    const day = now.getDay();
    // Monday as start of week? (0=Sun, 1=Mon)
    // Adjust logic to match user expectation: "Monday" based
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

  // 3. Handle specific presets via shared logic
  const { start, endExclusive } = getCycleRangeForDate(
    now,
    { startDay },
    preset as DateRangePresetApi,
  );

  // Convert endExclusive (start of next period) to inclusive end date
  const endDate = new Date(endExclusive);
  endDate.setDate(endDate.getDate() - 1);

  return {
    preset,
    fromDate: start,
    toDate: formatDate(endDate),
  };
};

/**
 * Returns [start, endExclusive] in YYYY-MM-DD based on the preset and offset.
 * Used internally and by other contexts.
 */
export function getCycleRangeForDate(
  today: Date,
  config: BillingCycleConfig,
  preset: DateRangePresetApi,
  offset: number = 0,
): { start: string; endExclusive: string } {
  // 0. Fallback for CUSTOM
  if (preset === "CUSTOM") {
    return {
      start: formatDate(today),
      endExclusive: formatDate(new Date(today.getTime() + 86400000)), // tomorrow
    };
  }

  // 1. Handle Calendar Month Logic
  if (preset === "THIS_MONTH" || preset === "LAST_MONTH") {
    const baseDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const effectiveOffset = offset + (preset === "LAST_MONTH" ? 1 : 0);
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
    // End is "now" + 1 day (exclusive)
    const end = new Date(today);
    end.setDate(end.getDate() + 1);

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
  const startDay = config.startDay;
  const year = today.getFullYear();
  const month = today.getMonth(); // 0–11

  const candidateStart = new Date(year, month, startDay);
  let currentStart: Date;

  if (today >= candidateStart) {
    currentStart = candidateStart;
  } else {
    currentStart = new Date(year, month - 1, startDay);
  }

  const effectiveOffset = offset + (preset === "LAST_CYCLE" ? 1 : 0);

  const start = addMonths(currentStart, -effectiveOffset);
  const end = addMonths(start, 1);

  return {
    start: formatDate(start),
    endExclusive: formatDate(end),
  };
}

function addMonths(date: Date, deltaMonths: number): Date {
  const d = new Date(date.getTime());
  const targetMonth = d.getMonth() + deltaMonths;
  d.setMonth(targetMonth);
  return d;
}

/**
 * Adds N days to a YYYY-MM-DD string and returns YYYY-MM-DD.
 */
export const addDays = (yyyyMmDd: string, days: number): string => {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return formatDate(dt);
};

/**
 * Converts an inclusive end date (YYYY-MM-DD) to an exclusive end date (next day).
 * Useful for Budget contexts that require cycleEndExclusive.
 */
export const getExclusiveEndDate = (inclusiveToDate: string): string => {
  if (!inclusiveToDate) return "";
  return addDays(inclusiveToDate, 1);
};
