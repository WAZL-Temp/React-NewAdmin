import { create } from "zustand";

interface AppUserTabStore {
  tab: "active" | "inactive" | "isDelete";
  setTab: (tab: "active" | "inactive" | "isDelete") => void;
}

export const useAppUserTabStore = create<AppUserTabStore>((set) => ({
  tab: "active",
   setTab: (tab) => {
    set({ tab });
  },
}));
