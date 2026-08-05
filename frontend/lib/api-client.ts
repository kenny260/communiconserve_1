import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
    : "http://localhost:8000/api/v1",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (token) {
    config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
  }
  return config;
});

// If the API ever rejects our token (expired, invalid, or signed with an old
// SECRET_KEY), clear it immediately and retry the request once without auth,
// instead of silently resending the same bad token on every future request.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retried && typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      original._retried = true;
      delete original.headers.Authorization;
      return apiClient(original);
    }
    return Promise.reject(error);
  }
);
