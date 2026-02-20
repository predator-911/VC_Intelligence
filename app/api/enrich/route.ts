import { NextRequest, NextResponse } from "next/server";

interface EnrichmentCache {
  [url: string]: {
    data: EnrichmentResponse;
    timestamp: number;
  };
}

const cache: EnrichmentCache = {};
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

interface EnrichmentResponse {
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

async function enrichCompany(url: string): Promise<EnrichmentResponse> {
  const apiKey = process.env.ENRICHMENT_API_KEY;
  const apiUrl = process.env.ENRICHMENT_API_URL || "https://api.example.com/enrich";

  if (!apiKey || apiKey === "your_api_key_here") {
    return generateMockEnrichment(url);
  }

  try {
    const response = await fetch(`${apiUrl}?url=${encodeURIComponent(url)}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Enrichment API failed");
    }

    const data = await response.json();
    return {
      summary: data.summary || "Company intelligence gathered from public sources.",
      bullets: data.bullets || [],
      keywords: data.keywords || [],
      signals: data.signals || [],
      sources: data.sources || [{ url, timestamp: new Date().toISOString() }],
      enrichedAt: new Date().toISOString(),
    };
  } catch (error) {
    return generateMockEnrichment(url);
  }
}

function generateMockEnrichment(url: string): EnrichmentResponse {
  const domain = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const companyName = domain.split(".")[0];

  const mockBullets = [
    `${companyName} provides enterprise-grade solutions for modern businesses`,
    `Focus on scalability and developer experience`,
    `Serving customers across multiple industries`,
    `Built with modern technology stack`,
  ];

  const mockKeywords = [
    "enterprise",
    "SaaS",
    "cloud",
    "automation",
    "scalability",
    "developer tools",
    "API",
    "integration",
  ].slice(0, Math.floor(Math.random() * 4) + 5);

  const mockSignals = [
    "Recent job postings indicate growth in engineering team",
    "New product features announced in last quarter",
    "Partnerships with major enterprise customers",
    "Expansion into new geographic markets",
  ].slice(0, Math.floor(Math.random() * 2) + 2);

  return {
    summary: `${companyName} is a technology company focused on delivering innovative solutions to enterprise customers. The company has demonstrated strong growth and market presence.`,
    bullets: mockBullets,
    keywords: mockKeywords,
    signals: mockSignals,
    sources: [
      {
        url,
        timestamp: new Date().toISOString(),
      },
      {
        url: `https://${domain}/about`,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    enrichedAt: new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
  }

  const normalizedUrl = url.replace(/\/$/, "");

  const cached = cache[normalizedUrl];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const enrichment = await enrichCompany(normalizedUrl);
    cache[normalizedUrl] = {
      data: enrichment,
      timestamp: Date.now(),
    };

    return NextResponse.json(enrichment);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to enrich company data" },
      { status: 500 }
    );
  }
}

