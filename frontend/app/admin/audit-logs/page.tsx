"use client";

import { useQuery } from "@tanstack/react-query";

import { DataTable } from "@/components/admin/data-table";
import { adminApi } from "@/services/admin";

export default function AdminAuditLogsPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["admin-audit-logs"], queryFn: () => adminApi.auditLogs() });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#14231A]">Audit Logs</h1>
      <p className="text-sm text-[#7C9284]">A record of every administrative action taken on the platform.</p>
      <div className="mt-6">
        <DataTable
          rows={data}
          isLoading={isLoading}
          isError={isError}
          columns={[
            { header: "Actor", accessor: (l) => l.actor_name ?? "system" },
            { header: "Action", accessor: (l) => l.action.replace(/_/g, " ") },
            { header: "Target", accessor: (l) => (l.target_type ? `${l.target_type} #${l.target_id}` : "—") },
            { header: "Date", accessor: (l) => new Date(l.created_at).toLocaleString() },
          ]}
        />
      </div>
    </div>
  );
}
