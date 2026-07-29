import { apiClient } from "@/lib/api-client";

export interface SellerApplicationPayload {
  full_name: string;
  organization_name?: string;
  community: string;
  district: string;
  phone_number: string;
  email: string;
  business_type: string;
  products_to_sell: string;
  business_description: string;
}

export async function submitSellerApplication(payload: SellerApplicationPayload) {
  const { data } = await apiClient.post("/seller-applications/", payload);
  return data;
}
