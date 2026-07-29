"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, ShoppingBag, Package, CalendarCheck, ShoppingCart, Leaf } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { StatCard } from "@/components/admin/stat-card";
import { formatCurrency } from "@/lib/utils";
import { getDashboardAnalytics } from "@/services/analytics";

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-analytics"],
    queryFn: getDashboardAnalytics,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#14231A]">Dashboard</h1>
      <p className="text-sm text-[#7C9284]">Welcome back! Here's what's happening on CommuniConserve.</p>

      {isLoading && <p className="mt-6 text-sm text-[#7C9284]">Loading analytics…</p>}
      {isError && (
        <p className="mt-6 text-sm text-red-600">
          Couldn't load analytics. Log in as an administrator and confirm the API is running.
        </p>
      )}

      {data && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            <StatCard icon={Users} label="Total Users" value={data.totals.users} />
            <StatCard icon={ShoppingBag} label="Verified Sellers" value={data.totals.verified_sellers} accent="secondary" />
            <StatCard icon={Package} label="Products" value={data.totals.products} accent="accent" />
            <StatCard icon={CalendarCheck} label="Bookings" value={data.totals.bookings} />
            <StatCard icon={ShoppingCart} label="Orders" value={data.totals.orders} accent="secondary" />
            <StatCard icon={Leaf} label="Conservation Projects" value={data.totals.conservation_projects} accent="accent" />
          </div>

          <div className="mt-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#14231A]">Last 30 days</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "New Users", value: data.recent_30_days.new_users },
                    { name: "New Orders", value: data.recent_30_days.new_orders },
                    { name: "New Bookings", value: data.recent_30_days.new_bookings },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2E7D32" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p className="mt-4 text-sm text-[#7C9284]">
            Total revenue to date: <span className="font-semibold text-primary">{formatCurrency(data.totals.revenue)}</span>
          </p>
        </>
      )}
    </div>
  );
}
