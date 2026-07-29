import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import type { ProductListItem } from "@/types/models";

export function ProductCard({ product }: { product: ProductListItem }) {
  return (
    <Link
      href={`/marketplace/${product.slug}`}
      className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[#EFF5EF]">
        {product.primary_image ? (
          <Image
            src={product.primary_image}
            alt={product.name}
            fill
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#7C9284]">No image</div>
        )}
      </div>
      <div className="space-y-1 p-4">
        <p className="text-sm font-medium text-[#14231A]">{product.name}</p>
        <p className="text-xs text-[#7C9284]">{product.seller_name}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="font-semibold text-primary">{formatCurrency(product.price)}</span>
          <span className="flex items-center gap-1 text-xs text-[#7C9284]">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            {product.average_rating} ({product.ratings_count})
          </span>
        </div>
      </div>
    </Link>
  );
}
