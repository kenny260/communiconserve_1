"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

import { getCommunities } from "@/services/communities";

export default function CommunitiesPage() {
  const { data: communities, isLoading, isError } = useQuery({ queryKey: ["communities"], queryFn: getCommunities });

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#14231A]">Communities</h1>
      <p className="mt-1 text-sm text-[#7C9284]">
        Meet the communities of the Lubombo Corridor driving conservation, commerce, and tourism.
      </p>

      {isLoading && <p className="mt-8 text-sm text-[#7C9284]">Loading communities…</p>}
      {isError && <p className="mt-8 text-sm text-red-600">Couldn't load communities.</p>}

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {communities?.map((c) => (
          <Link
            key={c.id}
            href={`/communities/${c.slug}`}
            className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="relative aspect-video w-full bg-[#EFF5EF]">
              {c.cover_image ? (
                <Image src={c.cover_image} alt={c.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-[#7C9284]">No image</div>
              )}
            </div>
            <div className="p-4">
              <p className="font-semibold text-[#14231A]">{c.name}</p>
              <p className="text-xs text-[#7C9284]">{c.district} District</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
