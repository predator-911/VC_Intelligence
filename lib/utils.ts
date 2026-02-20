import { Company, Sector, Stage } from "@/types";

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function filterCompanies(
  companies: Company[],
  query: string,
  sector?: Sector,
  stage?: Stage
): Company[] {
  return companies.filter((company) => {
    const matchesQuery =
      !query ||
      company.name.toLowerCase().includes(query.toLowerCase()) ||
      company.description.toLowerCase().includes(query.toLowerCase()) ||
      company.website.toLowerCase().includes(query.toLowerCase());

    const matchesSector = !sector || company.sector === sector;
    const matchesStage = !stage || company.stage === stage;

    return matchesQuery && matchesSector && matchesStage;
  });
}

export function sortCompanies(
  companies: Company[],
  sortBy: string,
  sortOrder: "asc" | "desc"
): Company[] {
  const sorted = [...companies];

  sorted.sort((a, b) => {
    let aValue: string | number = "";
    let bValue: string | number = "";

    switch (sortBy) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "sector":
        aValue = a.sector;
        bValue = b.sector;
        break;
      case "stage":
        aValue = a.stage;
        bValue = b.stage;
        break;
      case "founded":
        aValue = a.founded || 0;
        bValue = b.founded || 0;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return sorted;
}

export function exportToCSV(companies: Company[]): void {
  const headers = ["Name", "Website", "Sector", "Stage", "Description", "Founded", "Employees", "Location"];
  const rows = companies.map((company) => [
    company.name,
    company.website,
    company.sector,
    company.stage,
    company.description,
    company.founded?.toString() || "",
    company.employees || "",
    company.location || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `companies-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

