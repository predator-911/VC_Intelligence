"use client";

import { ReactNode } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (key: string) => void;
  onRowClick?: (row: T) => void;
}

export function Table<T extends { id: string }>({
  columns,
  data,
  sortBy,
  sortOrder,
  onSort,
  onRowClick,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-800">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400",
                  column.className
                )}
              >
                {column.sortable ? (
                  <button
                    onClick={() => onSort?.(String(column.key))}
                    className="flex items-center gap-1 hover:text-neutral-300"
                  >
                    {column.label}
                    {sortBy === column.key && (
                      <span className="text-neutral-500">
                        {sortOrder === "asc" ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </span>
                    )}
                  </button>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-neutral-500">
                No companies found
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className="cursor-pointer transition-colors hover:bg-neutral-800/30"
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={cn("px-4 py-3 text-sm text-neutral-300", column.className)}
                  >
                    {column.render
                      ? column.render(row)
                      : String(row[column.key as keyof T] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

