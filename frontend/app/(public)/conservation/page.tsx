"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

import { getConservationProjects } from "@/services/conservation";

const categoryLabels: Record<string, string> = {
  restoration: "Restoration Activity",
  campaign: "Environmental Campaign",
  community: "Community Success Story",
};

export default function ConservationPage() {
  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ["conservation-projects"],
    queryFn: () => getConservationProjects(),
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#14231A]">Conservation</h1>
      <p className="mt-1 text-sm text-[#7C9284]">
        Projects, campaigns, and restoration efforts led by communities across the Lubombo Corridor.
      </p>

      {isLoading && <p className="mt-8 text-sm text-[#7C9284]">Loading projects…</p>}
      {isError && <p className="mt-8 text-sm text-red-600">Couldn't load conservation projects.</p>}

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects?.map((p) => (
          <Link
            key={p.id}
            href={`/conservation/${p.slug}`}
            className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="relative aspect-video w-full bg-[#EFF5EF]">
              {p.cover_image ? (
                <Image src={p.cover_image} alt={p.title} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-[#7C9284]">No image</div>
              )}
            </div>
            <div className="space-y-1 p-4">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {categoryLabels[p.category]}
              </span>
              <p className="pt-1 font-semibold text-[#14231A]">{p.title}</p>
              <p className="text-xs text-[#7C9284]">{p.community_name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
