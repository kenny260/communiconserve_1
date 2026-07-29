import { apiClient } from "@/lib/api-client";
import type { Community } from "@/types/models";

export async function getCommunities() {
  const { data } = await apiClient.get<{ results: Community[] }>("/communities/");
  return data.results ?? data;
}
