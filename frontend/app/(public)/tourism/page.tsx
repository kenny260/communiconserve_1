"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import { getDestinations } from "@/services/tourism";

export default function TourismPage() {
  const { data: destinations, isLoading, isError } = useQuery({
    queryKey: ["destinations"],
    queryFn: () => getDestinations(),
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#14231A]">Tourism</h1>
      <p className="mt-1 text-sm text-[#7C9284]">
        Explore eco-tourism destinations across the Lubombo Corridor and book your next experience.
      </p>

      {isLoading && <p className="mt-8 text-sm text-[#7C9284]">Loading destinations…</p>}
      {isError && (
        <p className="mt-8 text-sm text-red-600">
          Couldn't load destinations. Make sure the Django API is running.
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {destinations?.map((d) => (
          <Link
            key={d.id}
            href={`/tourism/${d.slug}`}
            className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="relative aspect-video w-full bg-[#EFF5EF]">
              {d.cover_image ? (
                <Image src={d.cover_image} alt={d.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-[#7C9284]">No image</div>
              )}
            </div>
            <div className="space-y-1 p-4">
              <p className="font-semibold text-[#14231A]">{d.name}</p>
              <p className="flex items-center gap-1 text-xs text-[#7C9284]">
                <MapPin className="h-3.5 w-3.5" /> {d.location} · {d.community_name}
              </p>
              <p className="pt-1 font-semibold text-primary">{formatCurrency(d.price_per_person)} / person</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
