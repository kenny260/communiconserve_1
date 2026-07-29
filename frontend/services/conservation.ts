import { apiClient } from "@/lib/api-client";
import type { ConservationProjectListItem } from "@/types/models";

export async function getConservationProjects(params?: Record<string, string>) {
  const { data } = await apiClient.get<{ results: ConservationProjectListItem[] }>("/conservation/", { params });
  return data.results ?? data;
}
