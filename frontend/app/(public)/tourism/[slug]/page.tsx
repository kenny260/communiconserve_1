"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

import { apiClient } from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";

async function getDestination(slug: string) {
  const { data } = await apiClient.get(`/tourism/${slug}/`);
  return data;
}

export default function DestinationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [visitDate, setVisitDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const { data: destination, isLoading, isError } = useQuery({
    queryKey: ["destination", slug],
    queryFn: () => getDestination(slug),
  });

  const handleBook = async () => {
    try {
      await apiClient.post("/bookings/", {
        destination: destination.id, visit_date: visitDate, adults, children,
      });
      setStatus("success");
    } catch (e: any) {
      if (e?.response?.status === 401) {
        router.push("/auth/login");
        return;
      }
      setStatus("error");
    }
  };

  if (isLoading) return <div className="container mx-auto px-4 py-16 text-sm text-[#7C9284]">Loading…</div>;
  if (isError || !destination) return <div className="container mx-auto px-4 py-16 text-sm text-red-600">Destination not found.</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="relative aspect-[3/1] w-full overflow-hidden rounded-2xl bg-[#EFF5EF]">
        {destination.cover_image ? (
          <Image src={destination.cover_image} alt={destination.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#7C9284]">No image</div>
        )}
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold text-[#14231A]">{destination.name}</h1>
          <p className="text-sm text-[#7C9284]">{destination.location}</p>
          <p className="mt-4 text-sm text-[#4C5F52]">{destination.description}</p>
          <p className="mt-4 text-sm"><span className="text-[#7C9284]">Facilities:</span> {destination.facilities}</p>
          <p className="mt-1 text-sm"><span className="text-[#7C9284]">Opening hours:</span> {destination.opening_hours}</p>
          <p className="mt-1 text-sm"><span className="text-[#7C9284]">Contact:</span> {destination.contact_info}</p>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <p className="text-lg font-bold text-primary">{formatCurrency(destination.price_per_person)} / person</p>

          {status === "success" ? (
            <p className="mt-4 text-sm text-primary">Booking submitted! Check My Bookings for confirmation.</p>
          ) : (
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-[#7C9284]">Visit date</label>
                <input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} className="input mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#7C9284]">Adults</label>
                  <input type="number" min={1} value={adults} onChange={(e) => setAdults(Number(e.target.value))} className="input mt-1" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#7C9284]">Children</label>
                  <input type="number" min={0} value={children} onChange={(e) => setChildren(Number(e.target.value))} className="input mt-1" />
                </div>
              </div>
              {status === "error" && <p className="text-xs text-red-600">Could not create the booking. Please try again.</p>}
              <button
                onClick={handleBook}
                disabled={!visitDate}
                className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#26662A] disabled:opacity-60"
              >
                Book Experience
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
