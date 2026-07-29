"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Image from "next/image";

import { apiClient } from "@/lib/api-client";

async function getCommunity(slug: string) {
  const { data } = await apiClient.get(`/communities/${slug}/`);
  return data;
}

export default function CommunityDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: community, isLoading, isError } = useQuery({
    queryKey: ["community", slug],
    queryFn: () => getCommunity(slug),
  });

  if (isLoading) return <div className="container mx-auto px-4 py-16 text-sm text-[#7C9284]">Loading…</div>;
  if (isError || !community) return <div className="container mx-auto px-4 py-16 text-sm text-red-600">Community not found.</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="relative aspect-[3/1] w-full overflow-hidden rounded-2xl bg-[#EFF5EF]">
        {community.cover_image ? (
          <Image src={community.cover_image} alt={community.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#7C9284]">No image</div>
        )}
      </div>

      <h1 className="mt-6 text-3xl font-bold text-[#14231A]">{community.name}</h1>
      <p className="text-sm text-[#7C9284]">{community.district} District</p>

      <div className="mt-6 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="font-semibold text-[#14231A]">Overview</h2>
          <p className="mt-2 text-sm text-[#4C5F52]">{community.overview}</p>

          <h2 className="mt-6 font-semibold text-[#14231A]">Conservation Initiatives</h2>
          <p className="mt-2 text-sm text-[#4C5F52]">{community.conservation_initiatives}</p>

          {community.gallery?.length > 0 && (
            <>
              <h2 className="mt-6 font-semibold text-[#14231A]">Gallery</h2>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {community.gallery.map((g: any) => (
                  <div key={g.id} className="relative aspect-square overflow-hidden rounded-lg bg-[#EFF5EF]">
                    <Image src={g.image} alt={g.caption} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-[#14231A]">Contact</h2>
          <p className="mt-2 text-sm text-[#4C5F52]">{community.contact_email}</p>
          <p className="text-sm text-[#4C5F52]">{community.contact_phone}</p>
        </div>
      </div>
    </div>
  );
}
