"use client";

import { useQuery } from "@tanstack/react-query";

import { DataTable } from "@/components/admin/data-table";
import { adminApi } from "@/services/admin";

export default function AdminCommunitiesPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["admin-communities"], queryFn: () => adminApi.communities() });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#14231A]">Communities</h1>
      <p className="text-sm text-[#7C9284]">Community profiles across the Lubombo Corridor.</p>
      <div className="mt-6">
        <DataTable
          rows={data}
          isLoading={isLoading}
          isError={isError}
          columns={[
            { header: "Name", accessor: (c) => c.name },
            { header: "District", accessor: (c) => c.district },
            { header: "Products", accessor: (c) => c.product_count ?? "—" },
            { header: "Published", accessor: (c) => (c.is_published ? "Yes" : "No") },
          ]}
        />
      </div>
    </div>
  );
}
