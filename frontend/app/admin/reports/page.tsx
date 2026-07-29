"use client";

import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { DataTable } from "@/components/admin/data-table";
import { adminApi } from "@/services/admin";

export default function AdminReportsPage() {
  const queryClient = useQueryClient();
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [reportType, setReportType] = useState("monthly");

  const { data, isLoading, isError } = useQuery({ queryKey: ["admin-reports"], queryFn: () => adminApi.reports() });

  const generate = useMutation({
    mutationFn: () => adminApi.generateReport({ report_type: reportType, period_start: periodStart, period_end: periodEnd }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-reports"] }),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#14231A]">Reports</h1>
      <p className="text-sm text-[#7C9284]">Generate monthly or annual reports from live order and booking data.</p>

      <div className="mt-4 flex flex-wrap items-end gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
        <div>
          <label className="text-xs font-medium text-[#7C9284]">Type</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="input mt-1">
            <option value="monthly">Monthly</option>
            <option value="annual">Annual</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-[#7C9284]">Period start</label>
          <input type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} className="input mt-1" />
        </div>
        <div>
          <label className="text-xs font-medium text-[#7C9284]">Period end</label>
          <input type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} className="input mt-1" />
        </div>
        <button
          onClick={() => generate.mutate()}
          disabled={!periodStart || !periodEnd || generate.isPending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#26662A] disabled:opacity-60"
        >
          {generate.isPending ? "Generating…" : "Generate Report"}
        </button>
      </div>

      <div className="mt-6">
        <DataTable
          rows={data}
          isLoading={isLoading}
          isError={isError}
          columns={[
            { header: "Title", accessor: (r) => r.title },
            { header: "Type", accessor: (r) => r.report_type },
            { header: "Period", accessor: (r) => `${r.period_start} → ${r.period_end}` },
            { header: "Orders", accessor: (r) => r.summary_data?.orders_count ?? "—" },
            { header: "Order Revenue", accessor: (r) => r.summary_data?.orders_revenue ?? "—" },
            { header: "Bookings", accessor: (r) => r.summary_data?.bookings_count ?? "—" },
          ]}
        />
      </div>
    </div>
  );
}
