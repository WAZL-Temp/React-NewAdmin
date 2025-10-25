import { create } from "zustand";

export type TabCondition = Record<string, any>;

export interface ModelTabState {
  activeTabs: Record<
    string, // model key (e.g., "appuser", "category")
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
    set((state) => {
      const existing = state.activeTabs[model];
      return {
        activeTabs: {
          ...state.activeTabs,
          [model]: {
            tabList: list,
            tabName: existing?.tabName ?? list[0]?.name ?? null,
          },
        },
      };
    });
  },

  setActiveTab: (model, tabName) => {
    set((state) => ({
      activeTabs: {
        ...state.activeTabs,
        [model]: {
          ...(state.activeTabs[model] ?? { tabList: [] }),
          tabName,
        },
      },
    }));
  },

  getCondition: (model) => {
    const modelState = get().activeTabs[model];
    if (!modelState || !modelState.tabName) return null;
    const tab = modelState.tabList.find(
      (t) => t.name.toLowerCase() === modelState.tabName?.toLowerCase()
    );
    return tab?.condition ?? null;
  },

  getTabName: (model) => get().activeTabs[model]?.tabName ?? null,
}));
