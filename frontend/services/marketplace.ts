import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type { Category, ProductListItem } from "@/types/models";

export async function getProducts(params?: Record<string, string>) {
  const { data } = await apiClient.get<ApiResponse<{ results: ProductListItem[] }> | { results: ProductListItem[] }>(
    "/marketplace/products/",
    { params }
  );
  // Falls back gracefully whether or not StandardResponseRenderer envelope is active.
  return "data" in data ? data.data.results : (data as { results: ProductListItem[] }).results;
}

export async function getCategories() {
  const { data } = await apiClient.get<{ results: Category[] } | Category[]>("/marketplace/categories/");
  return Array.isArray(data) ? data : data.results;
}
