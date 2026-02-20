"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import { mockCompanies } from "@/lib/data";
import { List } from "@/types";
import { Card } from "@/components/Card";
import { Table } from "@/components/Table";
import { Tag } from "@/components/Tag";
import { Plus, Trash2, Download, X } from "lucide-react";
import { exportToCSV } from "@/lib/utils";

export default function ListsPage() {
  const router = useRouter();
  const [lists, setLists] = useState<List[]>([]);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [newListName, setNewListName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    setLists(storage.lists.getAll());
  }, []);

  const handleCreateList = () => {
    if (!newListName.trim()) return;

    const newList: List = {
      id: Date.now().toString(),
      name: newListName.trim(),
      companyIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storage.lists.add(newList);
    setLists(storage.lists.getAll());
    setNewListName("");
    setShowCreateModal(false);
    setSelectedList(newList);
  };

  const handleDeleteList = (id: string) => {
    if (confirm("Are you sure you want to delete this list?")) {
      storage.lists.delete(id);
      setLists(storage.lists.getAll());
      if (selectedList?.id === id) {
        setSelectedList(null);
      }
    }
  };

  const handleAddCompany = (companyId: string) => {
    if (!selectedList) return;
    if (selectedList.companyIds.includes(companyId)) return;

    const updated = {
      ...selectedList,
      companyIds: [...selectedList.companyIds, companyId],
    };
    storage.lists.update(selectedList.id, updated);
    setLists(storage.lists.getAll());
    setSelectedList(updated);
  };

  const handleRemoveCompany = (companyId: string) => {
    if (!selectedList) return;

    const updated = {
      ...selectedList,
      companyIds: selectedList.companyIds.filter((id) => id !== companyId),
    };
    storage.lists.update(selectedList.id, updated);
    setLists(storage.lists.getAll());
    setSelectedList(updated);
  };

  const handleExport = () => {
    if (!selectedList) return;
    const companies = mockCompanies.filter((c) => selectedList.companyIds.includes(c.id));
    exportToCSV(companies);
  };

  const listCompanies = selectedList
    ? mockCompanies.filter((c) => selectedList.companyIds.includes(c.id))
    : [];

  const availableCompanies = mockCompanies.filter(
    (c) => !selectedList?.companyIds.includes(c.id)
  );

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Lists</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Organize companies into custom lists
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-200 transition-smooth hover:bg-neutral-800"
        >
          <Plus className="h-4 w-4" />
          New List
        </button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Create New List</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewListName("");
                }}
                className="text-neutral-400 hover:text-neutral-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateList();
                }}
                placeholder="List name..."
                className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 transition-smooth focus:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-700"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewListName("");
                  }}
                  className="rounded-md border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm text-neutral-300 transition-smooth hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateList}
                  disabled={!newListName.trim()}
                  className="rounded-md border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-smooth hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Card title="Your Lists">
            {lists.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm font-medium text-neutral-400">No lists yet</p>
                <p className="mt-2 text-xs text-neutral-500">
                  Create a list to organize companies
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {lists.map((list) => (
                  <button
                    key={list.id}
                    onClick={() => setSelectedList(list)}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm transition-smooth ${
                      selectedList?.id === list.id
                        ? "bg-neutral-800 text-white"
                        : "text-neutral-400 transition-smooth hover:bg-neutral-800/50 hover:text-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{list.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-500">
                          {list.companyIds.length}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteList(list.id);
                          }}
                          className="text-neutral-500 hover:text-red-400"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {selectedList ? (
            <>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">{selectedList.name}</h2>
                    <p className="mt-1 text-sm text-neutral-400">
                      {listCompanies.length} {listCompanies.length === 1 ? "company" : "companies"}
                    </p>
                  </div>
                  {listCompanies.length > 0 && (
                    <button
                      onClick={handleExport}
                      className="flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-200 transition-smooth hover:bg-neutral-800"
                    >
                      <Download className="h-4 w-4" />
                      Export CSV
                    </button>
                  )}
                </div>
              </Card>

              {listCompanies.length > 0 ? (
                <Card>
                  <Table
                    columns={[
                      {
                        key: "name",
                        label: "Company",
                        render: (company) => (
                          <div>
                            <div className="font-medium text-white">{company.name}</div>
                            <div className="text-xs text-neutral-500">{company.website}</div>
                          </div>
                        ),
                      },
                      {
                        key: "sector",
                        label: "Sector",
                        render: (company) => <Tag variant="sector">{company.sector}</Tag>,
                      },
                      {
                        key: "stage",
                        label: "Stage",
                        render: (company) => <Tag variant="stage">{company.stage}</Tag>,
                      },
                      {
                        key: "actions",
                        label: "",
                        render: (company) => (
                          <button
                            onClick={() => handleRemoveCompany(company.id)}
                            className="text-neutral-500 hover:text-red-400"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        ),
                        className: "w-12",
                      },
                    ]}
                    data={listCompanies}
                    onRowClick={(company) => router.push(`/companies/${company.id}`)}
                  />
                </Card>
              ) : (
                <Card>
                  <div className="py-12 text-center">
                    <p className="text-sm font-medium text-neutral-400">No companies in this list</p>
                    <p className="mt-2 text-xs text-neutral-500">
                      Add companies from the list below
                    </p>
                  </div>
                </Card>
              )}

              {availableCompanies.length > 0 && (
                <Card title="Add Companies">
                  <div className="space-y-2">
                    {availableCompanies.slice(0, 10).map((company) => (
                      <div
                        key={company.id}
                        className="flex items-center justify-between rounded border border-neutral-800 bg-neutral-950 px-3 py-2"
                      >
                        <div>
                          <div className="text-sm font-medium text-white">{company.name}</div>
                          <div className="text-xs text-neutral-500">{company.sector}</div>
                        </div>
                        <button
                          onClick={() => handleAddCompany(company.id)}
                          className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-smooth hover:bg-neutral-800"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                    {availableCompanies.length > 10 && (
                      <p className="pt-2 text-xs text-neutral-500">
                        {availableCompanies.length - 10} more companies available
                      </p>
                    )}
                  </div>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <div className="py-12 text-center">
                <p className="text-sm text-neutral-500">Select a list to view companies</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

