import type {
  TransactionType as GqlTxType,
  CategoryType as GqlCatType,
} from "./graphqlTypes";
import type {
  TransactionType as AppTxType,
  CategoryType as AppCatType,
} from "../types/models";

// ---------- TransactionType ----------
export function toGqlTxType(t: AppTxType): GqlTxType {
  return t === "income" ? "INCOME" : "EXPENSE";
}

export function fromGqlTxType(t: GqlTxType): AppTxType {
  return t === "INCOME" ? "income" : "expense";
}

// ---------- CategoryType ----------
export function toGqlCatType(t: AppCatType): GqlCatType {
  if (t === "both") return "BOTH";
  return t === "income" ? "INCOME" : "EXPENSE";
}

export function fromGqlCatType(t: GqlCatType): AppCatType {
  if (t === "BOTH") return "both";
  return t === "INCOME" ? "income" : "expense";
}
