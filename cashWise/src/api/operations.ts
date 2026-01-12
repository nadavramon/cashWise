// src/api/operations.ts

export const CREATE_TRANSACTION = /* GraphQL */ `
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      userId
      type
      amount
      categoryId
      date
      note
      includeInStats
      createdAt
      updatedAt
    }
  }
`;

export const LIST_TRANSACTIONS = /* GraphQL */ `
  query ListTransactions($input: ListTransactionsInput!) {
    listTransactions(input: $input) {
      items {
        id
        userId
        type
        amount
        categoryId
        date
        note
        includeInStats
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const CREATE_CATEGORY = /* GraphQL */ `
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      userId
      name
      type
      color
      createdAt
    }
  }
`;

export const LIST_CATEGORIES = /* GraphQL */ `
  query ListCategories {
    listCategories {
      id
      userId
      name
      type
      color
      createdAt
    }
  }
`;

export const DELETE_CATEGORY = /* GraphQL */ `
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;

export const UPDATE_CATEGORY = /* GraphQL */ `
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(input: $input)
  }
`;

export const UPDATE_TRANSACTION = /* GraphQL */ `
  mutation UpdateTransaction($input: UpdateTransactionInput!) {
    updateTransaction(input: $input)
  }
`;

export const DELETE_TRANSACTION = /* GraphQL */ `
  mutation DeleteTransaction($id: ID!, $date: AWSDate!) {
    deleteTransaction(id: $id, date: $date)
  }
`;

export const GET_USER_PROFILE = /* GraphQL */ `
  query GetUserProfile {
    getUserProfile {
      userId
      email
      firstName
      lastName
      language
      currency
      billingCycleStartDay
      billingCycleTimezone
      overviewDateRangePreset
      budgetDateRangePreset
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_USER_PROFILE = /* GraphQL */ `
  mutation UpdateUserProfile($input: UpdateUserProfileInput!) {
    updateUserProfile(input: $input) {
      userId
      email
      firstName
      lastName
      language
      currency
      billingCycleStartDay
      billingCycleTimezone
      overviewDateRangePreset
      budgetDateRangePreset
      createdAt
      updatedAt
    }
  }
`;

export const EXPORT_TRANSACTIONS = /* GraphQL */ `
  mutation ExportTransactions($fromDate: AWSDate!, $toDate: AWSDate!) {
    exportTransactions(fromDate: $fromDate, toDate: $toDate) {
      ok
      message
      url
    }
  }
`;

export const GET_BUDGET = /* GraphQL */ `
  query GetBudget($cycleStartDate: AWSDate!) {
    getBudget(cycleStartDate: $cycleStartDate) {
      cycleStartDate
      cycleEndExclusive
      totalBudget
      categoryBudgets
      createdAt
      updatedAt
    }
  }
`;

export const UPSERT_BUDGET = /* GraphQL */ `
  mutation UpsertBudget($input: UpsertBudgetInput!) {
    upsertBudget(input: $input) {
      cycleStartDate
      cycleEndExclusive
      totalBudget
      categoryBudgets
      createdAt
      updatedAt
    }
  }
`;
