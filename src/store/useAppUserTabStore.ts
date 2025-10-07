import { create } from "zustand";

interface AppUserTabStore {
  tab: "active" | "inactive";
  setTab: (tab: "active" | "inactive") => void;
}

export const useAppUserTabStore = create<AppUserTabStore>((set) => ({
  tab: "active",
   setTab: (tab) => {
    set({ tab });
  },
}));
