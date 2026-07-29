"use client";

import { useQuery } from "@tanstack/react-query";

import { DataTable } from "@/components/admin/data-table";
import { adminApi } from "@/services/admin";

export default function AdminUsersPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["admin-users"], queryFn: () => adminApi.users() });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#14231A]">Users</h1>
      <p className="text-sm text-[#7C9284]">Administrator and customer accounts.</p>
      <div className="mt-6">
        <DataTable
          rows={data}
          isLoading={isLoading}
          isError={isError}
          columns={[
            { header: "Name", accessor: (u) => `${u.first_name} ${u.last_name}` || u.username },
            { header: "Username", accessor: (u) => u.username },
            { header: "Email", accessor: (u) => u.email },
            { header: "Role", accessor: (u) => u.role.replace("_", " ") },
            { header: "Joined", accessor: (u) => new Date(u.created_at).toLocaleDateString() },
          ]}
        />
      </div>
    </div>
  );
}
