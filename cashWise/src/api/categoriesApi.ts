// src/api/categoriesApi.ts
import { graphqlClient } from "./graphqlClient";
import {
  CREATE_CATEGORY,
  LIST_CATEGORIES,
  DELETE_CATEGORY,
  UPDATE_CATEGORY,
} from "./operations";

import type { CategoryType as AppCatType } from "../types/models";
import { fromGqlCatType, toGqlCatType } from "./mappers";
import type { CategoryType as GqlCatType } from "./graphqlTypes";

export type { AppCatType as CategoryTypeApi };

export interface CategoryApi {
  id: string;
  userId: string;
  name: string;
  type: AppCatType;
  color?: string | null;
  createdAt: string;
}

export interface CreateCategoryInputApi {
  name: string;
  type: AppCatType;
  color?: string | null;
}

export interface UpdateCategoryInputApi {
  id: string;
  name?: string;
  type?: AppCatType;
  color?: string | null;
}
interface CreateCategoryResponse {
  createCategory: {
    id: string;
    userId: string;
    name: string;
    type: GqlCatType;
    color?: string | null;
    createdAt: string;
  };
}

interface ListCategoriesResponse {
  listCategories: {
    id: string;
    userId: string;
    name: string;
    type: GqlCatType;
    color?: string | null;
    createdAt: string;
  }[];
}

interface DeleteCategoryResponse {
  deleteCategory: boolean;
}

interface UpdateCategoryResponse {
  updateCategory: boolean;
}

export async function apiCreateCategory(
  input: CreateCategoryInputApi,
): Promise<CategoryApi> {
  const result = await graphqlClient.graphql<CreateCategoryResponse>({
    query: CREATE_CATEGORY,
    variables: {
      input: {
        ...input,
        type: toGqlCatType(input.type),
      },
    },
  });

  if (!("data" in result) || !result.data?.createCategory) {
    throw new Error("createCategory returned no data");
  }

  const raw = result.data.createCategory;
  return {
    ...raw,
    type: fromGqlCatType(raw.type),
  };
}

export async function apiListCategories(): Promise<CategoryApi[]> {
  const result = await graphqlClient.graphql<ListCategoriesResponse>({
    query: LIST_CATEGORIES,
  });

  if (!("data" in result) || !result.data?.listCategories) {
    throw new Error("listCategories returned no data");
  }

  return result.data.listCategories.map((cat: any) => ({
    ...cat,
    type: fromGqlCatType(cat.type),
  }));
}

export async function apiDeleteCategory(id: string): Promise<boolean> {
  const result = await graphqlClient.graphql<DeleteCategoryResponse>({
    query: DELETE_CATEGORY,
    variables: { id },
  });

  if (!("data" in result) || typeof result.data?.deleteCategory !== "boolean") {
    throw new Error("deleteCategory returned no data");
  }

  return result.data.deleteCategory;
}

export async function apiUpdateCategory(
  input: UpdateCategoryInputApi,
): Promise<boolean> {
  const result = await graphqlClient.graphql<UpdateCategoryResponse>({
    query: UPDATE_CATEGORY,
    variables: {
      input: {
        ...input,
        type: input.type ? toGqlCatType(input.type) : undefined,
      },
    },
  });

  if (!("data" in result) || typeof result.data?.updateCategory !== "boolean") {
    throw new Error("updateCategory returned no data");
  }

  return result.data.updateCategory;
}
