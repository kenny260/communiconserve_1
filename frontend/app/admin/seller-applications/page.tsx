"use client";

import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";

import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminApi } from "@/services/admin";

export default function AdminSellerApplicationsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-seller-applications"],
    queryFn: () => adminApi.sellerApplications(),
  });

  const review = useMutation({
    mutationFn: ({ id, action }: { id: string; action: "approve" | "reject" }) =>
      adminApi.reviewApplication(id, action),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-seller-applications"] }),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#14231A]">Seller Applications</h1>
      <p className="text-sm text-[#7C9284]">Review and approve or reject applications to become a verified seller.</p>
      <div className="mt-6">
        <DataTable
          rows={data}
          isLoading={isLoading}
          isError={isError}
          columns={[
            { header: "Applicant", accessor: (a) => a.full_name },
            { header: "Business", accessor: (a) => a.organization_name || "—" },
            { header: "District", accessor: (a) => a.district },
            { header: "Submitted", accessor: (a) => new Date(a.created_at).toLocaleDateString() },
            { header: "Status", accessor: (a) => <StatusBadge status={a.status} /> },
            {
              header: "Action",
              accessor: (a) =>
                a.status === "pending" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => review.mutate({ id: a.id, action: "approve" })}
                      className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => review.mutate({ id: a.id, action: "reject" })}
                      className="rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-[#7C9284]">Reviewed</span>
                ),
            },
          ]}
        />
      </div>
    </div>
  );
}
