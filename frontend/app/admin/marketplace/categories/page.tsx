"use client";

import { useQuery } from "@tanstack/react-query";

import { DataTable } from "@/components/admin/data-table";
import { adminApi } from "@/services/admin";

export default function AdminCategoriesPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["admin-categories"], queryFn: () => adminApi.categories() });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#14231A]">Categories</h1>
      <p className="text-sm text-[#7C9284]">Marketplace product categories.</p>
      <div className="mt-6">
        <DataTable
          rows={data}
          isLoading={isLoading}
          isError={isError}
          columns={[
            { header: "Name", accessor: (c) => c.name },
            { header: "Slug", accessor: (c) => c.slug },
            { header: "Description", accessor: (c) => c.description || "—" },
          ]}
        />
      </div>
    </div>
  );
}
