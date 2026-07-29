"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Image from "next/image";

import { apiClient } from "@/lib/api-client";

async function getProject(slug: string) {
  const { data } = await apiClient.get(`/conservation/${slug}/`);
  return data;
}

export default function ConservationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, isError } = useQuery({
    queryKey: ["conservation-project", slug],
    queryFn: () => getProject(slug),
  });

  if (isLoading) return <div className="container mx-auto px-4 py-16 text-sm text-[#7C9284]">Loading…</div>;
  if (isError || !project) return <div className="container mx-auto px-4 py-16 text-sm text-red-600">Project not found.</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="relative aspect-[3/1] w-full overflow-hidden rounded-2xl bg-[#EFF5EF]">
        {project.cover_image ? (
          <Image src={project.cover_image} alt={project.title} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#7C9284]">No image</div>
        )}
      </div>

      <h1 className="mt-6 text-3xl font-bold text-[#14231A]">{project.title}</h1>
      <p className="text-sm text-[#7C9284]">{project.community?.name ?? ""} &middot; {project.status.replace("_", " ")}</p>

      <p className="mt-4 max-w-2xl text-sm text-[#4C5F52]">{project.description}</p>
      {project.impact_summary && (
        <p className="mt-2 text-sm font-medium text-primary">{project.impact_summary}</p>
      )}

      {project.updates?.length > 0 && (
        <div className="mt-8">
          <h2 className="font-semibold text-[#14231A]">Progress Updates</h2>
          <div className="mt-3 space-y-4">
            {project.updates.map((u: any) => (
              <div key={u.id} className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-[#14231A]">{u.title}</p>
                <p className="mt-1 text-sm text-[#4C5F52]">{u.content}</p>
                <p className="mt-2 text-xs text-[#7C9284]">{new Date(u.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.gallery?.length > 0 && (
        <div className="mt-8">
          <h2 className="font-semibold text-[#14231A]">Gallery</h2>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {project.gallery.map((g: any) => (
              <div key={g.id} className="relative aspect-square overflow-hidden rounded-lg bg-[#EFF5EF]">
                <Image src={g.image} alt={g.caption} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
