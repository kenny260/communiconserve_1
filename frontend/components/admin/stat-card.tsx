import type { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon, label, value, accent = "primary",
}: { icon: LucideIcon; label: string; value: string | number; accent?: "primary" | "secondary" | "accent" }) {
  const bg = { primary: "bg-primary/10 text-primary", secondary: "bg-secondary/10 text-[#2F6B34]", accent: "bg-accent/10 text-[#8A6512]" }[accent];

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-2xl font-bold text-[#14231A]">{value}</p>
      <p className="text-sm text-[#7C9284]">{label}</p>
    </div>
  );
}
