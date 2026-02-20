import { List, SavedSearch, CompanyNote } from "@/types";

const STORAGE_KEYS = {
  LISTS: "vc_intelligence_lists",
  SAVED_SEARCHES: "vc_intelligence_saved_searches",
  NOTES: "vc_intelligence_notes",
} as const;

export const storage = {
  lists: {
    getAll: (): List[] => {
      if (typeof window === "undefined") return [];
      const data = localStorage.getItem(STORAGE_KEYS.LISTS);
      return data ? JSON.parse(data) : [];
    },
    save: (lists: List[]): void => {
      if (typeof window === "undefined") return;
      localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(lists));
    },
    add: (list: List): void => {
      const lists = storage.lists.getAll();
      storage.lists.save([...lists, list]);
    },
    update: (id: string, updates: Partial<List>): void => {
      const lists = storage.lists.getAll();
      const updated = lists.map((list) =>
        list.id === id ? { ...list, ...updates, updatedAt: new Date().toISOString() } : list
      );
      storage.lists.save(updated);
    },
    delete: (id: string): void => {
      const lists = storage.lists.getAll();
      storage.lists.save(lists.filter((list) => list.id !== id));
    },
  },
  savedSearches: {
    getAll: (): SavedSearch[] => {
      if (typeof window === "undefined") return [];
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_SEARCHES);
      return data ? JSON.parse(data) : [];
    },
    save: (searches: SavedSearch[]): void => {
      if (typeof window === "undefined") return;
      localStorage.setItem(STORAGE_KEYS.SAVED_SEARCHES, JSON.stringify(searches));
    },
    add: (search: SavedSearch): void => {
      const searches = storage.savedSearches.getAll();
      storage.savedSearches.save([...searches, search]);
    },
    delete: (id: string): void => {
      const searches = storage.savedSearches.getAll();
      storage.savedSearches.save(searches.filter((search) => search.id !== id));
    },
  },
  notes: {
    getAll: (): CompanyNote[] => {
      if (typeof window === "undefined") return [];
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      return data ? JSON.parse(data) : [];
    },
    save: (notes: CompanyNote[]): void => {
      if (typeof window === "undefined") return;
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    },
    getByCompanyId: (companyId: string): CompanyNote | null => {
      const notes = storage.notes.getAll();
      return notes.find((note) => note.companyId === companyId) || null;
    },
    saveNote: (note: CompanyNote): void => {
      const notes = storage.notes.getAll();
      const existing = notes.findIndex((n) => n.companyId === note.companyId);
      if (existing >= 0) {
        notes[existing] = note;
      } else {
        notes.push(note);
      }
      storage.notes.save(notes);
    },
  },
};

