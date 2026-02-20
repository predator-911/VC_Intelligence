"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mockCompanies, sectors, stages } from "@/lib/data";
import { filterCompanies, sortCompanies } from "@/lib/utils";
import { Company, Sector, Stage } from "@/types";
import { Table } from "@/components/Table";
import { Tag } from "@/components/Tag";

const ITEMS_PER_PAGE = 10;

export default function CompaniesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<Sector | undefined>();
  const [selectedStage, setSelectedStage] = useState<Stage | undefined>();
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const q = searchParams.get("q");
    const sector = searchParams.get("sector");
    const stage = searchParams.get("stage");

    if (q) setQuery(q);
    if (sector) setSelectedSector(sector as Sector);
    if (stage) setSelectedStage(stage as Stage);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = filterCompanies(mockCompanies, query, selectedSector, selectedStage);
    result = sortCompanies(result, sortBy, sortOrder);
    return result;
  }, [query, selectedSector, selectedStage, sortBy, sortOrder]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const columns = [
    {
      key: "name",
      label: "Company",
      sortable: true,
      render: (company: Company) => (
        <div>
          <div className="font-medium text-white">{company.name}</div>
          <div className="text-xs text-neutral-500">{company.website}</div>
        </div>
      ),
    },
    {
      key: "sector",
      label: "Sector",
      sortable: true,
      render: (company: Company) => <Tag variant="sector">{company.sector}</Tag>,
    },
    {
      key: "stage",
      label: "Stage",
      sortable: true,
      render: (company: Company) => <Tag variant="stage">{company.stage}</Tag>,
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-6">
        {filtered.length} Companies
      </h1>

      <Table
        columns={columns}
        data={paginated}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={(key) => {
          if (sortBy === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
          } else {
            setSortBy(key);
            setSortOrder("asc");
          }
        }}
        onRowClick={(company) => router.push(`/companies/${company.id}`)}
      />
    </div>
  );
}
