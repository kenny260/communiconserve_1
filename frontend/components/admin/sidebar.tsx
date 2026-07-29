"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, ClipboardCheck, ShoppingBag, Tag, MapPin,
  UsersRound, Leaf, Bell, FileBarChart, BarChart3, ShieldCheck, Settings,
} from "lucide-react";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/seller-applications", label: "Seller Applications", icon: ClipboardCheck },
  { href: "/admin/verified-sellers", label: "Verified Sellers", icon: ShoppingBag },
  { href: "/admin/marketplace/products", label: "Products", icon: ShoppingBag },
  { href: "/admin/marketplace/categories", label: "Categories", icon: Tag },
  { href: "/admin/tourism", label: "Tourism", icon: MapPin },
  { href: "/admin/communities", label: "Communities", icon: UsersRound },
  { href: "/admin/conservation", label: "Conservation", icon: Leaf },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/reports", label: "Reports", icon: FileBarChart },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: ShieldCheck },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 bg-[#0F1F14] text-[#D8E4DC] md:block">
      <div className="px-5 py-6">
        <p className="text-lg font-semibold text-white">CommuniConserve</p>
        <p className="text-xs text-secondary">Conserve. Connect. Prosper.</p>
      </div>
      <nav className="space-y-1 px-3 pb-6">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                active ? "bg-primary text-white" : "hover:bg-white/5"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
