import { create } from "zustand";

export type TabCondition = Record<string, any>;

export interface ModelTabState {
  activeTabs: Record<
    string,
    {
      tabName: string | null;
      tabList: { name: string; condition: TabCondition; count?: number }[];
    }
  >;
  setTabLists: (model: string, list: { name: string; condition: TabCondition; count?: number }[]) => void;
  setActiveTab: (model: string, tabName: string) => void;
  getCondition: (model: string) => TabCondition | null;
  getTabName: (model: string) => string | null;
}

export const useModelTabStore = create<ModelTabState>((set, get) => ({
  activeTabs: {},

  setTabLists: (model, list) => {
    const key = model.toLowerCase();
    set((state) => {
      const existing = state.activeTabs[key];
      return {
        activeTabs: {
          ...state.activeTabs,
          [key]: {
            tabList: list,
            tabName: existing?.tabName ?? list[0]?.name ?? null,
          },
        },
      };
    });
  },

  setActiveTab: (model, tabName) => {
    const key = model.toLowerCase();
    set((state) => ({
      activeTabs: {
        ...state.activeTabs,
        [key]: {
          ...(state.activeTabs[key] ?? { tabList: [] }),
          tabName,
        },
      },
    }));
  },

  getCondition: (model) => {
    const key = model.toLowerCase();
    const modelState = get().activeTabs[key];
    if (!modelState || !modelState.tabName) return null;
    const tab = modelState.tabList.find(
      (t) => t.name.toLowerCase() === modelState.tabName?.toLowerCase()
    );
    return tab?.condition ?? null;
  },

  getTabName: (model) => {
    const key = model.toLowerCase();
    return get().activeTabs[key]?.tabName ?? null;
  },
}));
