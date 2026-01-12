// src/utils/errorHandler.ts

interface GraphQLError {
    message: string;
    errorType?: string;
    path?: (string | number)[];
    locations?: { line: number; column: number }[];
}

interface AppSyncResult {
    errors?: GraphQLError[];
    data?: any;
}

/**
 * Parses diverse error shapes (GraphQL, Network, Standard Error) into a user-friendly message.
 * 
 * @param error - The raw error object caught in catch block or returned in result.errors
 * @returns A localized or user-friendly string
 */
export function getErrorMessage(error: any): string {
    if (!error) return "An unknown error occurred.";

    // 1. Handle Array of GraphQL Errors
    if (Array.isArray(error)) {
        // If it's an array, it might be result.errors from AppSync
        const firstMsg = error[0]?.message;
        return mapBackendMessage(firstMsg);
    }

    // 2. Handle Object with 'errors' property (AppSync response style)
    if (error.errors && Array.isArray(error.errors)) {
        return mapBackendMessage(error.errors[0]?.message);
    }

    // 3. Handle Standard Error Object
    if (error instanceof Error) {
        return mapBackendMessage(error.message);
    }

    // 4. Handle String
    if (typeof error === "string") {
        return mapBackendMessage(error);
    }

    return "An unexpected error occurred.";
}

/**
 * Maps raw backend/network messages to friendly UI strings.
 * Can be expanded with i18n keys later.
 */
function mapBackendMessage(rawMsg: string | undefined): string {
    if (!rawMsg) return "An unknown error occurred.";

    const lower = rawMsg.toLowerCase();

    if (lower.includes("network request failed") || lower.includes("network error")) {
        return "Network error. Please check your internet connection.";
    }

    if (lower.includes("unauthorized") || lower.includes("not authorized")) {
        return "You are not authorized to perform this action.";
    }

    if (lower.includes("validation error")) {
        return "Please check your input data.";
    }

    // Fallback: return the raw message if it looks clean, or a generic one?
    // Ideally, we shouldn't show raw stack traces or internal IDs.
    // For now, clean it up slightly.
    return rawMsg;
}
