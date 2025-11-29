export type BudgetMode = 'PLAN' | 'REMAINING' | 'INSIGHTS';

export interface PlannedBudgetItem {
    id: string;
    groupId: string;
    subCategoryCode: string;
    subCategoryLabel: string;
    amount: number;
}
