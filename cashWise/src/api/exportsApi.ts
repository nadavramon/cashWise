import { graphqlClient } from './graphqlClient';
import { EXPORT_TRANSACTIONS } from './operations';

interface ExportResult {
    ok: boolean;
    message?: string | null;
    url?: string | null;
}

interface ExportTransactionsResponse {
    exportTransactions: ExportResult;
}

export async function apiExportTransactions(
    fromDate: string,
    toDate: string
): Promise<string> {
    const result = await graphqlClient.graphql<ExportTransactionsResponse>({
        query: EXPORT_TRANSACTIONS,
        variables: { fromDate, toDate },
        authMode: 'userPool',
    });

    if ('data' in result && result.data?.exportTransactions) {
        const { ok, message, url } = result.data.exportTransactions;
        if (ok && url) {
            return url;
        }
        throw new Error(message || 'Export failed (no URL returned)');
    }

    throw new Error('ExportTransactions returned no data');
}
