"use client";

import { useQuery } from "@tanstack/react-query";

import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminApi } from "@/services/admin";
import { formatCurrency } from "@/lib/utils";

export default function AdminTourismPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["admin-tourism"], queryFn: () => adminApi.destinations() });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#14231A]">Tourism</h1>
      <p className="text-sm text-[#7C9284]">Destinations and their booking status.</p>
      <div className="mt-6">
        <DataTable
          rows={data}
          isLoading={isLoading}
          isError={isError}
          columns={[
            { header: "Destination", accessor: (d) => d.name },
            { header: "Community", accessor: (d) => d.community_name },
            { header: "Location", accessor: (d) => d.location },
            { header: "Price", accessor: (d) => formatCurrency(d.price_per_person) },
          ]}
        />
      </div>

      <h2 className="mt-10 text-lg font-semibold text-[#14231A]">Bookings</h2>
      <AdminBookingsTable />
    </div>
  );
}

function AdminBookingsTable() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["admin-bookings"], queryFn: () => adminApi.bookings() });
  return (
    <div className="mt-4">
      <DataTable
        rows={data}
        isLoading={isLoading}
        isError={isError}
        columns={[
          { header: "Reference", accessor: (b) => b.reference },
          { header: "Destination", accessor: (b) => b.destination_name },
          { header: "Visit Date", accessor: (b) => b.visit_date },
          { header: "Guests", accessor: (b) => `${b.adults} adults, ${b.children} children` },
          { header: "Total", accessor: (b) => formatCurrency(b.total_price) },
          { header: "Status", accessor: (b) => <StatusBadge status={b.status} /> },
        ]}
      />
    </div>
  );
}
