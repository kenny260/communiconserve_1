"use client";

import { useQuery } from "@tanstack/react-query";

import { DataTable } from "@/components/admin/data-table";
import { adminApi } from "@/services/admin";

export default function AdminNotificationsPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["admin-notifications"], queryFn: () => adminApi.notifications() });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#14231A]">Notifications</h1>
      <p className="text-sm text-[#7C9284]">System and platform notifications.</p>
      <div className="mt-6">
        <DataTable
          rows={data}
          isLoading={isLoading}
          isError={isError}
          columns={[
            { header: "Title", accessor: (n) => n.title },
            { header: "Type", accessor: (n) => n.type.replace("_", " ") },
            { header: "Message", accessor: (n) => <span className="line-clamp-1 text-[#4C5F52]">{n.message}</span> },
            { header: "Read", accessor: (n) => (n.is_read ? "Yes" : "No") },
            { header: "Date", accessor: (n) => new Date(n.created_at).toLocaleDateString() },
          ]}
        />
      </div>
    </div>
  );
}
