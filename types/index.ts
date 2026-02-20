export type Sector =
  | "Enterprise Software"
  | "Consumer"
  | "Fintech"
  | "Healthcare"
  | "AI/ML"
  | "DevTools"
  | "E-commerce"
  | "SaaS"
  | "Other";

export type Stage =
  | "Pre-Seed"
  | "Seed"
  | "Series A"
  | "Series B"
  | "Series C"
  | "Series D+"
  | "Growth";

export interface Company {
  id: string;
  name: string;
  website: string;
  sector: Sector;
  stage: Stage;
  description: string;
  founded?: number;
  employees?: string;
  location?: string;
  lastFunding?: string;
  lastFundingAmount?: string;
}

export interface EnrichmentData {
  summary: string;
  bullets: string[];
  keywords: string[];
  signals: string[];
  sources: Array<{
    url: string;
    timestamp: string;
  }>;
  enrichedAt: string;
}

export interface List {
  id: string;
  name: string;
  companyIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  sector?: Sector;
  stage?: Stage;
  createdAt: string;
}

export interface CompanyNote {
  companyId: string;
  content: string;
  updatedAt: string;
}

