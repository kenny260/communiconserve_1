"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search } from "lucide-react";

import { ProductCard } from "@/components/marketplace/product-card";
import { getCategories, getProducts } from "@/services/marketplace";

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");

  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ["products", search, category],
    queryFn: () => getProducts({ search, category }),
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#14231A]">Marketplace</h1>
      <p className="mt-1 text-sm text-[#7C9284]">
        Browse products from verified local producers across the Lubombo Corridor.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7C9284]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border border-black/10 py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-primary focus:outline-none"
        >
          <option value="">All categories</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="mt-8">
        {isLoading && <p className="text-sm text-[#7C9284]">Loading products…</p>}
        {isError && (
          <p className="text-sm text-red-600">
            Could not load products. Make sure the Django API is running at NEXT_PUBLIC_API_URL.
          </p>
        )}
        {!isLoading && !isError && products?.length === 0 && (
          <p className="text-sm text-[#7C9284]">No products match your search.</p>
        )}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
