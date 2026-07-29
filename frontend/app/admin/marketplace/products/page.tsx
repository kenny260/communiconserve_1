"use client";

import { useQuery } from "@tanstack/react-query";

import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminApi } from "@/services/admin";
import { formatCurrency } from "@/lib/utils";

export default function AdminProductsPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["admin-products"], queryFn: () => adminApi.products() });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#14231A]">Products</h1>
      <p className="text-sm text-[#7C9284]">All marketplace listings across every verified seller.</p>
      <div className="mt-6">
        <DataTable
          rows={data}
          isLoading={isLoading}
          isError={isError}
          columns={[
            { header: "Product", accessor: (p) => p.name },
            { header: "Category", accessor: (p) => p.category_name },
            { header: "Seller", accessor: (p) => p.seller_name },
            { header: "Price", accessor: (p) => formatCurrency(p.price) },
            { header: "Rating", accessor: (p) => `${p.average_rating} (${p.ratings_count})` },
          ]}
        />
      </div>
    </div>
  );
}
