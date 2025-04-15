import { BaseService } from "../sharedBase/baseService";
import { create, devtools } from "../sharedBase/globalImports";
import { BaseModel } from "../sharedBase/modelInterface";
import { HomeCommonData, ListHtmlData } from "../types/homepage";

export interface HomeStore {
  homeCommonData: HomeCommonData | null;
  homeUserData: HomeCommonData | null;
  homeHtmlData: ListHtmlData| null;
  loading: boolean;
  status: string;
  error: string | null;
  search: Record<string, unknown>;
  setSearch: (search: Record<string, unknown>) => void;
  loadHome: () => Promise<void>;
}

export const createHomeStore = <T extends BaseModel>(service: BaseService<T>, type: string) =>
  create<HomeStore>()(
    devtools(
      (set, get) => ({
        homeCommonData: [],
        homeUserData: [],
        homeHtmlData: [],
        loading: false,
        status: "",
        error: null,
        search: {},

        setSearch: (search: Record<string, unknown>) => {
          set({ search, status: "" });
        },

        loadHome: async () => {
          if (get().status === "") {
            set({ loading: true, status: "loading", error: null });
            try {
              const { homeCommon, homeUser, htmlData } = await service.getHomeCommonData("default", "admin", null);
              set({
                homeCommonData: homeCommon, homeUserData: homeUser, homeHtmlData: htmlData,
                loading: false, status: "loaded"
              });
            } catch (err: any) {
              set({ error: err.message || "Failed to fetch Home Data", loading: false, status: "error" });
            }
          }
        },
      }),
      {
        name: `Home - ${type}`,
      }
    )
  );




