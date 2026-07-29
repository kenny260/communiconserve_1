// Mirrors the standard API envelope from spec section 16.
export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

export type UserRole = "visitor" | "ngo_coordinator" | "conservation_officer";

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}
