"use client";

export interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
}

export function DataTable<T extends { id: string }>({
  columns, rows, isLoading, isError, emptyLabel = "No records found.",
}: {
  columns: Column<T>[];
  rows: T[] | undefined;
  isLoading: boolean;
  isError: boolean;
  emptyLabel?: string;
}) {
  if (isLoading) return <p className="text-sm text-[#7C9284]">Loading…</p>;
  if (isError) return <p className="text-sm text-red-600">Could not load data. Confirm you are logged in as an administrator and the API is running.</p>;
  if (!rows || rows.length === 0) return <p className="text-sm text-[#7C9284]">{emptyLabel}</p>;

  return (
    <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#F4F7F4] text-xs uppercase tracking-wide text-[#7C9284]">
          <tr>
            {columns.map((col) => (
              <th key={col.header} className="px-4 py-3 font-medium">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-[#F9FBF9]">
              {columns.map((col) => (
                <td key={col.header} className="px-4 py-3">{col.accessor(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
