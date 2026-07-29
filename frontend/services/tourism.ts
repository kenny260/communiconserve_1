import { apiClient } from "@/lib/api-client";
import type { TourismDestinationListItem } from "@/types/models";

export async function getDestinations(params?: Record<string, string>) {
  const { data } = await apiClient.get<{ results: TourismDestinationListItem[] }>("/tourism/", { params });
  return data.results ?? data;
}
