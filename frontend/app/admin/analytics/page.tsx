"use client";

import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { getDashboardAnalytics } from "@/services/analytics";
import { formatCurrency } from "@/lib/utils";

export default function AdminAnalyticsPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["dashboard-analytics"], queryFn: getDashboardAnalytics });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#14231A]">Analytics</h1>
      <p className="text-sm text-[#7C9284]">Platform-wide totals and recent activity.</p>

      {isLoading && <p className="mt-6 text-sm text-[#7C9284]">Loading…</p>}
      {isError && <p className="mt-6 text-sm text-red-600">Couldn't load analytics.</p>}

      {data && (
        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#14231A]">Platform totals</p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              {Object.entries(data.totals).map(([key, value]) => (
                <div key={key}>
                  <p className="text-[#7C9284] capitalize">{key.replace(/_/g, " ")}</p>
                  <p className="text-lg font-semibold text-[#14231A]">
                    {key === "revenue" ? formatCurrency(value as string) : value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#14231A]">Top communities by product listings</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.top_communities.map((c) => ({ name: c.name, value: 1 }))}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#66BB6A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
