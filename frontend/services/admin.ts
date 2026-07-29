import { apiClient } from "@/lib/api-client";

// Generic list fetcher for admin table pages — every endpoint returns
// DRF's paginated {results: [...]} shape (or a plain array if pagination
// is disabled for that viewset).
async function list<T>(url: string, params?: Record<string, string>): Promise<T[]> {
  const { data } = await apiClient.get(url, { params });
  return Array.isArray(data) ? data : data.results ?? [];
}

export const adminApi = {
  users: (params?: Record<string, string>) => list<any>("/auth/users/", params),
  sellerApplications: (params?: Record<string, string>) => list<any>("/seller-applications/", params),
  reviewApplication: (id: string, action: "approve" | "reject", rejection_reason?: string) =>
    apiClient.post(`/seller-applications/${id}/review/`, { action, rejection_reason }),
  verifiedSellers: (params?: Record<string, string>) => list<any>("/sellers/", params),
  products: (params?: Record<string, string>) => list<any>("/marketplace/products/", params),
  categories: (params?: Record<string, string>) => list<any>("/marketplace/categories/", params),
  destinations: (params?: Record<string, string>) => list<any>("/tourism/", params),
  bookings: (params?: Record<string, string>) => list<any>("/bookings/", params),
  communities: (params?: Record<string, string>) => list<any>("/communities/", params),
  conservationProjects: (params?: Record<string, string>) => list<any>("/conservation/", params),
  notifications: (params?: Record<string, string>) => list<any>("/notifications/", params),
  reports: (params?: Record<string, string>) => list<any>("/reports/", params),
  auditLogs: (params?: Record<string, string>) => list<any>("/audit-logs/", params),
  generateReport: (payload: { report_type: string; period_start: string; period_end: string }) =>
    apiClient.post("/reports/generate/", payload),
};
