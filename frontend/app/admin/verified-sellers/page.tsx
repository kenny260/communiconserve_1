"use client";

import { useQuery } from "@tanstack/react-query";

import { DataTable } from "@/components/admin/data-table";
import { adminApi } from "@/services/admin";

export default function AdminVerifiedSellersPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["admin-sellers"], queryFn: () => adminApi.verifiedSellers() });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#14231A]">Verified Sellers</h1>
      <p className="text-sm text-[#7C9284]">Sellers approved to publish products on the marketplace.</p>
      <div className="mt-6">
        <DataTable
          rows={data}
          isLoading={isLoading}
          isError={isError}
          columns={[
            { header: "Business", accessor: (s) => s.business_name },
            { header: "Community", accessor: (s) => s.community_name },
            { header: "Type", accessor: (s) => s.business_type },
            { header: "Products", accessor: (s) => s.product_count },
            { header: "Active", accessor: (s) => (s.is_active ? "Yes" : "No") },
          ]}
        />
      </div>
    </div>
  );
}
