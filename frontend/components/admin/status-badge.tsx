const styles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  confirmed: "bg-green-100 text-green-700",
  published: "bg-green-100 text-green-700",
  completed: "bg-green-100 text-green-700",
  delivered: "bg-green-100 text-green-700",
  in_progress: "bg-blue-100 text-blue-700",
  processing: "bg-blue-100 text-blue-700",
  planned: "bg-slate-100 text-slate-700",
  draft: "bg-slate-100 text-slate-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${styles[status] ?? "bg-slate-100 text-slate-700"}`}>
      {status.replace("_", " ")}
    </span>
  );
}
