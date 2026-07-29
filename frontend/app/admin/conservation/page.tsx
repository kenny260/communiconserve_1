"use client";

import { useQuery } from "@tanstack/react-query";

import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminApi } from "@/services/admin";

export default function AdminConservationPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["admin-conservation"], queryFn: () => adminApi.conservationProjects() });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#14231A]">Conservation</h1>
      <p className="text-sm text-[#7C9284]">Conservation projects, campaigns, and community success stories.</p>
      <div className="mt-6">
        <DataTable
          rows={data}
          isLoading={isLoading}
          isError={isError}
          columns={[
            { header: "Title", accessor: (p) => p.title },
            { header: "Community", accessor: (p) => p.community_name },
            { header: "Category", accessor: (p) => p.category.replace("_", " ") },
            { header: "Status", accessor: (p) => <StatusBadge status={p.status} /> },
          ]}
        />
      </div>
    </div>
  );
}
