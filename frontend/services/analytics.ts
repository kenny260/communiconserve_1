import { apiClient } from "@/lib/api-client";
import type { DashboardAnalytics } from "@/types/models";

export async function getDashboardAnalytics() {
  const { data } = await apiClient.get<DashboardAnalytics>("/analytics/dashboard/");
  return data;
}
