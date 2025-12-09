// src/utils/billingCycle.ts

export interface BillingCycleConfig {
    startDay: number; // 1–28
    timezone?: string; // we’ll ignore for now; can integrate luxon later
}

/**
 * Returns [start, endExclusive] in YYYY-MM-DD, where:
 * - start = first day of cycle
 * - endExclusive = first day of the NEXT cycle
 *
 * offset = 0 => current cycle
 * offset = 1 => previous cycle
 * offset = -1 => next cycle (if you ever want it)
 */
export function getCycleRangeForDate(
    today: Date,
    config: BillingCycleConfig,
    offset: number = 0,
): { start: string; endExclusive: string } {
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

    // Apply offset (in months)
    const start = addMonths(currentStart, -offset);
    const end = addMonths(start, 1); // next cycle start

    return {
        start: formatDate(start),          // inclusive
        endExclusive: formatDate(end),     // exclusive
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
    const month = String(d.getMonth() + 1).padStart(2, '0'); // 1–12
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
