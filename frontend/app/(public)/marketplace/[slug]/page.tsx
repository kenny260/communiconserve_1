"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";

import { apiClient } from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";

async function getProduct(slug: string) {
  const { data } = await apiClient.get(`/marketplace/products/${slug}/`);
  return data;
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProduct(slug),
  });

  if (isLoading) return <div className="container mx-auto px-4 py-16 text-sm text-[#7C9284]">Loading…</div>;
  if (isError || !product) return <div className="container mx-auto px-4 py-16 text-sm text-red-600">Product not found.</div>;

  const primaryImage = product.images?.find((i: any) => i.is_primary) ?? product.images?.[0];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#EFF5EF]">
          {primaryImage ? (
            <Image src={primaryImage.image} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[#7C9284]">No image</div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-[#14231A]">{product.name}</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-[#7C9284]">
            <Star className="h-4 w-4 fill-accent text-accent" />
            {product.average_rating} ({product.ratings_count} reviews)
          </p>
          <p className="mt-4 text-2xl font-bold text-primary">{formatCurrency(product.price)}</p>
          <p className="mt-4 text-sm text-[#4C5F52]">{product.description}</p>

          <div className="mt-6 rounded-xl border border-black/5 bg-white p-4 text-sm shadow-sm">
            <p><span className="text-[#7C9284]">Category:</span> {product.category_detail?.name}</p>
            <p className="mt-1"><span className="text-[#7C9284]">In stock:</span> {product.stock_quantity}</p>
          </div>

          <button className="mt-6 w-full rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-[#26662A] sm:w-auto">
            Contact Seller
          </button>
        </div>
      </div>

      {product.reviews?.length > 0 && (
        <div className="mt-12">
          <h2 className="font-semibold text-[#14231A]">Reviews</h2>
          <div className="mt-3 space-y-3">
            {product.reviews.map((r: any) => (
              <div key={r.id} className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
                <p className="flex items-center gap-1 text-sm font-medium text-[#14231A]">
                  {r.reviewer_name}
                  <span className="ml-2 flex items-center gap-1 text-xs text-[#7C9284]">
                    <Star className="h-3 w-3 fill-accent text-accent" /> {r.rating}
                  </span>
                </p>
                {r.comment && <p className="mt-1 text-sm text-[#4C5F52]">{r.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
