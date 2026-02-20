"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mockCompanies, sectors, stages } from "@/lib/data";
import { filterCompanies, sortCompanies, formatRelativeTime } from "@/lib/utils";
import { Company, Sector, Stage } from "@/types";
import { Table } from "@/components/Table";
import { Tag } from "@/components/Tag";
import { SignalIndicator } from "@/components/SignalIndicator";
import { Filter } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function CompaniesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedSector, setSelectedSector] = useState<Sector | undefined>(
    (searchParams.get("sector") as Sector) || undefined
  );
  const [selectedStage, setSelectedStage] = useState<Stage | undefined>(
    (searchParams.get("stage") as Stage) || undefined
  );
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let result = filterCompanies(mockCompanies, query, selectedSector, selectedStage);
    result = sortCompanies(result, sortBy, sortOrder);
    return result;
  }, [query, selectedSector, selectedStage, sortBy, sortOrder]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const columns = [
    {
      key: "name",
      label: "Company",
      sortable: true,
      className: "min-w-[200px]",
      render: (company: Company) => (
        <div>
          <div className="font-medium text-white text-xs">{company.name}</div>
          <div className="text-xs text-neutral-600 mt-0.5">{company.website.replace(/^https?:\/\//, "")}</div>
        </div>
      ),
    },
    {
      key: "sector",
      label: "Sector",
      sortable: true,
      className: "w-[140px]",
      render: (company: Company) => <Tag variant="sector">{company.sector}</Tag>,
    },
    {
      key: "stage",
      label: "Stage",
      sortable: true,
      className: "w-[100px]",
      render: (company: Company) => <Tag variant="stage">{company.stage}</Tag>,
    },
    {
      key: "signals",
      label: "Signals",
      className: "w-[120px]",
      render: (company: Company) => (
        <SignalIndicator status={company.signals || "none"} />
      ),
    },
    {
      key: "description",
      label: "Description",
      className: "min-w-[300px]",
      render: (company: Company) => (
        <div className="max-w-md truncate text-neutral-500 text-xs">{company.description}</div>
      ),
    },
    {
      key: "lastActivity",
      label: "Last Activity",
      sortable: true,
      className: "w-[100px]",
      render: (company: Company) => (
        <span className="text-neutral-500 text-xs">
          {company.lastActivity ? formatRelativeTime(company.lastActivity) : "—"}
        </span>
      ),
    },
    {
      key: "lastFunding",
      label: "Funding",
      className: "w-[120px] text-right",
      render: (company: Company) => (
        <div className="text-right">
          {company.lastFundingAmount ? (
            <div className="tabular-nums text-white text-xs font-medium">{company.lastFundingAmount}</div>
          ) : (
            <span className="text-neutral-600 text-xs">—</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Companies</h1>
          <p className="mt-1 text-sm text-neutral-400">
            {filtered.length} {filtered.length === 1 ? "company" : "companies"}
          </p>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search companies..."
            className="flex-1 rounded-md border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 transition-smooth focus:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-700"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-neutral-500" />
            <span className="text-sm text-neutral-400">Filters:</span>
          </div>
          <select
            value={selectedSector || ""}
            onChange={(e) => {
              setSelectedSector((e.target.value as Sector) || undefined);
              setCurrentPage(1);
            }}
            className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 transition-smooth focus:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-700"
          >
            <option value="">All Sectors</option>
            {sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
          <select
            value={selectedStage || ""}
            onChange={(e) => {
              setSelectedStage((e.target.value as Stage) || undefined);
              setCurrentPage(1);
            }}
            className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 transition-smooth focus:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-700"
          >
            <option value="">All Stages</option>
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-lg border border-neutral-800 bg-neutral-900 shadow-sm">
        <Table
          columns={columns}
          data={paginated}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onRowClick={(company) => router.push(`/companies/${company.id}`)}
        />
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-neutral-400">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-300 transition-smooth hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-neutral-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-300 transition-smooth hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

