"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import { SavedSearch } from "@/types";
import { Card } from "@/components/Card";
import { Tag } from "@/components/Tag";
import { Plus, Trash2, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { sectors, stages } from "@/lib/data";

export default function SavedSearchesPage() {
  const router = useRouter();
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSearchName, setNewSearchName] = useState("");
  const [newSearchQuery, setNewSearchQuery] = useState("");
  const [newSearchSector, setNewSearchSector] = useState<string>("");
  const [newSearchStage, setNewSearchStage] = useState<string>("");

  useEffect(() => {
    setSavedSearches(storage.savedSearches.getAll());
  }, []);

  const handleCreateSearch = () => {
    if (!newSearchName.trim()) return;

    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: newSearchName.trim(),
      query: newSearchQuery.trim(),
      sector: newSearchSector || undefined,
      stage: newSearchStage || undefined,
      createdAt: new Date().toISOString(),
    };

    storage.savedSearches.add(newSearch);
    setSavedSearches(storage.savedSearches.getAll());
    setNewSearchName("");
    setNewSearchQuery("");
    setNewSearchSector("");
    setNewSearchStage("");
    setShowCreateModal(false);
  };

  const handleDeleteSearch = (id: string) => {
    if (confirm("Are you sure you want to delete this saved search?")) {
      storage.savedSearches.delete(id);
      setSavedSearches(storage.savedSearches.getAll());
    }
  };

  const handleRunSearch = (search: SavedSearch) => {
    const params = new URLSearchParams();
    if (search.query) params.set("q", search.query);
    if (search.sector) params.set("sector", search.sector);
    if (search.stage) params.set("stage", search.stage);
    router.push(`/companies?${params.toString()}`);
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Saved Searches</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Save and re-run your search queries
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-200 transition-colors hover:bg-neutral-800"
        >
          <Plus className="h-4 w-4" />
          New Search
        </button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-lg">
            <h2 className="mb-4 text-lg font-semibold text-white">Save Search</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-400">
                  Search Name
                </label>
                <input
                  type="text"
                  value={newSearchName}
                  onChange={(e) => setNewSearchName(e.target.value)}
                  placeholder="e.g., Series A SaaS companies"
                  className="w-full rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 focus:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-700"
                  autoFocus
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-400">
                  Query
                </label>
                <input
                  type="text"
                  value={newSearchQuery}
                  onChange={(e) => setNewSearchQuery(e.target.value)}
                  placeholder="Search term..."
                  className="w-full rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 focus:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-400">
                    Sector
                  </label>
                  <select
                    value={newSearchSector}
                    onChange={(e) => setNewSearchSector(e.target.value)}
                    className="w-full rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-200 focus:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-700"
                  >
                    <option value="">All Sectors</option>
                    {sectors.map((sector) => (
                      <option key={sector} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-400">
                    Stage
                  </label>
                  <select
                    value={newSearchStage}
                    onChange={(e) => setNewSearchStage(e.target.value)}
                    className="w-full rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-200 focus:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-700"
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
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewSearchName("");
                    setNewSearchQuery("");
                    setNewSearchSector("");
                    setNewSearchStage("");
                  }}
                  className="rounded border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm text-neutral-300 transition-colors hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSearch}
                  disabled={!newSearchName.trim()}
                  className="rounded border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {savedSearches.length === 0 ? (
        <Card>
          <div className="py-12 text-center">
            <Search className="mx-auto h-12 w-12 text-neutral-600" />
            <p className="mt-4 text-sm text-neutral-500">No saved searches yet</p>
            <p className="mt-2 text-xs text-neutral-600">
              Save your search queries to quickly re-run them later
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {savedSearches.map((search) => (
            <Card key={search.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white">{search.name}</h3>
                  <div className="mt-2 space-y-1.5">
                    {search.query && (
                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <Search className="h-3 w-3" />
                        {search.query}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      {search.sector && <Tag variant="sector">{search.sector}</Tag>}
                      {search.stage && <Tag variant="stage">{search.stage}</Tag>}
                    </div>
                    <div className="text-xs text-neutral-500">
                      Saved {formatDate(search.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleRunSearch(search)}
                    className="rounded p-1.5 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-300"
                    title="Run search"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSearch(search.id)}
                    className="rounded p-1.5 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

