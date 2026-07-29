import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F4F7F4]">
      <AdminSidebar />
      <div className="flex-1">
        <header className="sticky top-0 z-10 border-b border-black/5 bg-white px-6 py-4">
          <p className="text-xs text-[#7C9284]">Admin</p>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
