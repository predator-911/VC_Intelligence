"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { mockCompanies } from "@/lib/data";
import { storage } from "@/lib/storage";
import { EnrichmentData, CompanyNote } from "@/types";
import { Card } from "@/components/Card";
import { Tag } from "@/components/Tag";
import { ExternalLink, Save, Sparkles, ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function CompanyProfilePage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;
  const company = mockCompanies.find((c) => c.id === companyId);

  const [enrichment, setEnrichment] = useState<EnrichmentData | null>(null);
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentError, setEnrichmentError] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  useEffect(() => {
    if (!company) return;

    const savedNote = storage.notes.getByCompanyId(companyId);
    if (savedNote) {
      setNote(savedNote.content);
    }
  }, [companyId]);

  if (!company) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">Company not found</h2>
          <button
            onClick={() => router.push("/companies")}
            className="mt-4 text-sm text-neutral-400 hover:text-neutral-300"
          >
            Back to companies
          </button>
        </div>
      </div>
    );
  }

  const handleEnrich = async () => {
    setIsEnriching(true);
    setEnrichmentError(null);

    try {
      const response = await fetch(`/api/enrich?url=${encodeURIComponent(company.website)}`);
      if (!response.ok) {
        throw new Error("Enrichment failed");
      }
      const data = await response.json();
      setEnrichment(data);
    } catch (error) {
      setEnrichmentError("Failed to enrich company data. Please try again.");
    } finally {
      setIsEnriching(false);
    }
  };

  const handleSaveNote = () => {
    setIsSavingNote(true);
    const noteData: CompanyNote = {
      companyId,
      content: note,
      updatedAt: new Date().toISOString(),
    };
    storage.notes.saveNote(noteData);
    setTimeout(() => setIsSavingNote(false), 300);
  };

  return (
    <div className="p-8">
      <button
        onClick={() => router.push("/companies")}
        className="mb-6 flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-neutral-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to companies
      </button>

      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">{company.name}</h1>
            <div className="mt-2 flex items-center gap-3">
              <Tag variant="sector">{company.sector}</Tag>
              <Tag variant="stage">{company.stage}</Tag>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-neutral-400 transition-colors hover:text-neutral-300"
              >
                <ExternalLink className="h-3 w-3" />
                {company.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleEnrich}
              disabled={isEnriching}
              className="flex items-center gap-2 rounded border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-200 transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles className={`h-4 w-4 ${isEnriching ? "animate-spin" : ""}`} />
              {isEnriching ? "Enriching..." : "Enrich"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Overview">
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-400">
                  Description
                </h4>
                <p className="text-sm text-neutral-300">{company.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {company.founded && (
                  <div>
                    <h4 className="mb-1 text-xs font-medium uppercase tracking-wider text-neutral-400">
                      Founded
                    </h4>
                    <p className="text-sm text-neutral-300">{company.founded}</p>
                  </div>
                )}
                {company.employees && (
                  <div>
                    <h4 className="mb-1 text-xs font-medium uppercase tracking-wider text-neutral-400">
                      Employees
                    </h4>
                    <p className="text-sm text-neutral-300">{company.employees}</p>
                  </div>
                )}
                {company.location && (
                  <div>
                    <h4 className="mb-1 text-xs font-medium uppercase tracking-wider text-neutral-400">
                      Location
                    </h4>
                    <p className="text-sm text-neutral-300">{company.location}</p>
                  </div>
                )}
                {company.lastFundingAmount && (
                  <div>
                    <h4 className="mb-1 text-xs font-medium uppercase tracking-wider text-neutral-400">
                      Last Funding
                    </h4>
                    <p className="text-sm text-neutral-300">
                      {company.lastFundingAmount} {company.lastFunding && `(${company.lastFunding})`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {enrichment && (
            <Card title="Signals Timeline">
              <div className="space-y-3">
                {enrichment.signals.map((signal, idx) => (
                  <div key={idx} className="flex items-start gap-3 border-l-2 border-neutral-800 pl-4">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-neutral-600" />
                    <div className="flex-1">
                      <p className="text-sm text-neutral-300">{signal}</p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {formatDate(enrichment.enrichedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card title="Notes">
            <div className="space-y-3">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onBlur={handleSaveNote}
                placeholder="Add notes about this company..."
                rows={6}
                className="w-full rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 focus:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-700"
              />
              {isSavingNote && (
                <p className="text-xs text-neutral-500">Saving...</p>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {enrichmentError && (
            <Card>
              <div className="text-sm text-red-400">{enrichmentError}</div>
            </Card>
          )}

          {isEnriching && (
            <Card title="Enriching">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 animate-spin text-neutral-400" />
                <span className="text-sm text-neutral-400">Gathering intelligence...</span>
              </div>
            </Card>
          )}

          {enrichment && (
            <Card title="Enrichment">
              <div className="space-y-6">
                <div>
                  <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-400">
                    Summary
                  </h4>
                  <p className="text-sm text-neutral-300">{enrichment.summary}</p>
                </div>

                <div>
                  <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-400">
                    What They Do
                  </h4>
                  <ul className="space-y-1.5">
                    {enrichment.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-neutral-300">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-neutral-500" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-400">
                    Keywords
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {enrichment.keywords.map((keyword, idx) => (
                      <Tag key={idx} className="text-xs">
                        {keyword}
                      </Tag>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-400">
                    Derived Signals
                  </h4>
                  <div className="space-y-2">
                    {enrichment.signals.map((signal, idx) => (
                      <div key={idx} className="flex items-start gap-2 rounded bg-neutral-950 p-2">
                        <CheckCircle2 className="mt-0.5 h-3 w-3 flex-shrink-0 text-neutral-500" />
                        <span className="text-xs text-neutral-300">{signal}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-400">
                    Sources
                  </h4>
                  <div className="space-y-2">
                    {enrichment.sources.map((source, idx) => (
                      <div key={idx} className="text-xs">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-400 hover:text-neutral-300"
                        >
                          {source.url}
                        </a>
                        <div className="mt-0.5 text-neutral-500">
                          {formatDate(source.timestamp)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-neutral-800 pt-4">
                  <div className="text-xs text-neutral-500">
                    Enriched {formatDate(enrichment.enrichedAt)}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {!enrichment && !isEnriching && (
            <Card>
              <div className="text-center">
                <Sparkles className="mx-auto h-8 w-8 text-neutral-600" />
                <p className="mt-3 text-sm text-neutral-400">
                  Click "Enrich" to gather intelligence about this company
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

