import { apiClient } from "@/lib/api-client";
import type { User } from "@/types/api";

export async function login(username: string, password: string) {
  const { data } = await apiClient.post("/auth/login/", { username, password });
  return data;
}

export async function getMe() {
  const { data } = await apiClient.get<User>("/auth/me/");
  return data;
}
