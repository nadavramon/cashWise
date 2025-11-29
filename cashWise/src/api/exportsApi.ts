import { graphqlClient } from './graphqlClient';
import { EXPORT_TRANSACTIONS } from './operations';

export async function apiExportTransactions(
    fromDate: string,
    toDate: string
): Promise<string> {
    const result = await graphqlClient.graphql({
        query: EXPORT_TRANSACTIONS,
        variables: { fromDate, toDate },
        authMode: 'userPool',
    });

    if ('data' in result && result.data?.exportTransactions) {
        return result.data.exportTransactions as string;
    }

    throw new Error('ExportTransactions returned no data');
}
