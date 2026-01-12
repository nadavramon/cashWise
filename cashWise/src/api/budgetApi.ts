// src/api/budgetApi.ts
import { graphqlClient } from "./graphqlClient";
import { GET_BUDGET, UPSERT_BUDGET } from "./operations";

export type Budget = {
    cycleStartDate: string;
    cycleEndExclusive: string;
    totalBudget: number;
    categoryBudgets: Record<string, number> | null;
    createdAt: string;
    updatedAt: string;
};

export type UpsertBudgetInputApi = {
    cycleStartDate: string;
    cycleEndExclusive: string;
    totalBudget: number;
    categoryBudgets?: Record<string, number> | null; // app-friendly
};

const parseAwsJson = (value: any): Record<string, number> | null => {
    if (value == null) return null;
    if (typeof value === "string") {
        try {
            return JSON.parse(value);
        } catch {
            return null;
        }
    }
    if (typeof value === "object") return value as Record<string, number>;
    return null;
};

interface GetBudgetResponse {
    getBudget: {
        cycleStartDate: string;
        cycleEndExclusive: string;
        totalBudget: number;
        categoryBudgets: string | null; // AWSJSON comes as string often, or object if client parses it
        createdAt: string;
        updatedAt: string;
    } | null;
}

interface UpsertBudgetResponse {
    upsertBudget: {
        cycleStartDate: string;
        cycleEndExclusive: string;
        totalBudget: number;
        categoryBudgets: string | null;
        createdAt: string;
        updatedAt: string;
    };
}

export async function apiGetBudget(
    cycleStartDate: string,
): Promise<Budget | null> {
    const res = await graphqlClient.graphql<GetBudgetResponse>({
        query: GET_BUDGET,
        variables: { cycleStartDate },
    });

    if (!("data" in res)) {
        // If errors or failing
        return null;
    }

    const b = res.data?.getBudget;
    if (!b) return null;

    return {
        cycleStartDate: b.cycleStartDate,
        cycleEndExclusive: b.cycleEndExclusive,
        totalBudget: Number(b.totalBudget),
        categoryBudgets: parseAwsJson(b.categoryBudgets),
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
    };
}

export async function apiUpsertBudget(
    input: UpsertBudgetInputApi,
): Promise<Budget> {
    const gqlInput: any = {
        cycleStartDate: input.cycleStartDate,
        cycleEndExclusive: input.cycleEndExclusive,
        totalBudget: input.totalBudget,
    };

    // AWSJSON expects a JSON string (works reliably in AppSync)
    if (input.categoryBudgets != null) {
        gqlInput.categoryBudgets = JSON.stringify(input.categoryBudgets);
    }

    const res = await graphqlClient.graphql<UpsertBudgetResponse>({
        query: UPSERT_BUDGET,
        variables: { input: gqlInput },
    });

    if (!("data" in res) || !res.data?.upsertBudget) {
        throw new Error("upsertBudget returned null");
    }

    const b = res.data.upsertBudget;

    return {
        cycleStartDate: b.cycleStartDate,
        cycleEndExclusive: b.cycleEndExclusive,
        totalBudget: Number(b.totalBudget),
        categoryBudgets: parseAwsJson(b.categoryBudgets),
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
    };
}
