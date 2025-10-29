import { create } from "zustand";

interface AppUserTestTabStore {
  tab: "active" | "inactive" | "isDelete";
  setTab: (tab: "active" | "inactive" | "isDelete") => void;
}

export const AppUserTestsTabStore = create<AppUserTestTabStore>((set) => ({
  tab: "active",
   setTab: (tab) => {
    set({ tab });
  },
}));
