import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Category, CategoryType } from "../types/models";
import {
  apiCreateCategory,
  apiDeleteCategory,
  apiListCategories,
  apiUpdateCategory,
  CategoryApi,
  CreateCategoryInputApi,
  UpdateCategoryInputApi,
} from "../api/categoriesApi";
import { useAuth } from "./AuthContext";
import { CATEGORY_REPO, RepoCategoryItem } from "../data/categoryRepo";

interface AddCategoryInput {
  name: string;
  type: CategoryType;
  color?: string;
}

interface CategoriesContextValue {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refreshCategories: () => Promise<void>;
  addCategory: (input: AddCategoryInput) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateCategory: (
    id: string,
    input: { name?: string; type?: "income" | "expense"; color?: string },
  ) => Promise<void>;
  addCategoryFromRepo: (
    groupId: string,
    item: RepoCategoryItem,
  ) => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextValue | undefined>(
  undefined,
);

export const useCategories = (): CategoriesContextValue => {
  const ctx = useContext(CategoriesContext);
  if (!ctx) {
    throw new Error("useCategories must be used within CategoriesProvider");
  }
  return ctx;
};

function mapApiToUi(cat: CategoryApi): Category {
  return {
    id: cat.id,
    userId: cat.userId,
    name: cat.name,
    type: cat.type, // Already App type
    color: cat.color ?? undefined,
    createdAt: cat.createdAt,
  };
}

export const CategoriesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { userId } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCategories = async () => {
    if (!userId) {
      setCategories([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const apiCats = await apiListCategories();
      setCategories(apiCats.map(mapApiToUi));
    } catch (e: any) {
      console.error("Failed to load categories", e);
      setError(e?.message ?? "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const addCategory = async (input: AddCategoryInput) => {
    if (!userId) throw new Error("Not signed in");

    const apiInput: CreateCategoryInputApi = {
      name: input.name,
      type: input.type,
      color: input.color,
    };

    try {
      setError(null);
      const created = await apiCreateCategory(apiInput);
      const uiCat = mapApiToUi(created);
      setCategories((prev) => [...prev, uiCat]);
    } catch (e: any) {
      console.error("Failed to create category", e);
      setError(e?.message ?? "Failed to create category");
      throw e;
    }
  };

  const deleteCategory = async (id: string) => {
    if (!userId) throw new Error("Not signed in");

    try {
      setError(null);
      const ok = await apiDeleteCategory(id);
      if (ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (e: any) {
      console.error("Failed to delete category", e);
      setError(e?.message ?? "Failed to delete category");
      throw e;
    }
  };

  const updateCategory = async (
    id: string,
    input: { name?: string; type?: CategoryType; color?: string },
  ) => {
    if (!userId) throw new Error("Not signed in");

    const apiInput: UpdateCategoryInputApi = {
      id,
      name: input.name,
      type: input.type,
      color: input.color,
    };

    try {
      setError(null);
      const ok = await apiUpdateCategory(apiInput);
      if (ok) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === id
              ? {
                  ...cat,
                  name: input.name ?? cat.name,
                  type: input.type ?? cat.type,
                  color: input.color ?? cat.color,
                }
              : cat,
          ),
        );
      }
    } catch (e: any) {
      console.error("Failed to update category", e);
      setError(e?.message ?? "Failed to update category");
      throw e;
    }
  };

  const addCategoryFromRepo = async (
    groupId: string,
    item: RepoCategoryItem,
  ) => {
    const group = CATEGORY_REPO.find((g) => g.id === groupId);
    await addCategory({
      name: item.label,
      type: item.type,
      color: group?.color,
    });
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        loading,
        error,
        addCategory,
        deleteCategory,
        refreshCategories,
        updateCategory,
        addCategoryFromRepo,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};
