import { BaseService } from "../sharedBase/baseService";
import { BaseModel } from "../sharedBase/modelInterface";
import { AppUser } from "../core/model/appuser";
import { create, devtools } from "../sharedBase/globalImports";

export type ItemStore<T> = {
  data: T | null;
  id: number | undefined;
  slug: string;
  dataStatus: string;
  loading: boolean;
  status: string;
  error: object | undefined;
  condition: any | undefined;
  getItem: (id: number) => Promise<AppUser>;
  clearItem: () => void;
  addItem: (item: T) => void;
  updateItem: (item: T) => void;
  deleteItem: (id: number) => void;
  resetStatus: () => void;
};

export const createItemStore = <T extends BaseModel>(service: BaseService<T>, type: string) =>
  create<ItemStore<T>>()(
    devtools(
      (set, get) => ({
        data: null,
        id: undefined,
        slug: '',
        dataStatus: '',
        loading: false,
        status: "",
        error: undefined,
        condition: undefined,

        getItem: async (id: number) => {
          if (get().loading) {
            return;
          }

          if (get().id === id && get().dataStatus === "Loaded") {
            return get().data;
          }

          try {
            set({ id, loading: true, dataStatus: "Loading", error: undefined });
            const item = await service.get(id);
            set({ data: item, slug: item?.slug || "", loading: false, dataStatus: "Loaded", error: undefined });
            return item;
          } catch (error: any) {
            set({ error, loading: false, dataStatus: "error" });
            throw error;
          }
        },

        addItem: async (item: T) => {
          set({ loading: true });
          try {
            const addedItem = await service.add(item);
            set({
              data: addedItem,
              loading: false,
              dataStatus: 'loaded',
              error: undefined,
            });
          } catch (error: any) {
            set({ error, loading: false });
            throw error;
          }
        },

        updateItem: async (item: T) => {
          set({ loading: true });
          try {
            const updatedItem = await service.update(item);
            set({
              data: updatedItem,
              loading: false,
              dataStatus: 'loaded',
            });
          } catch (error: any) {
            set({ error, loading: false });
            throw error;
          }
        },

        deleteItem: (id: number) => {
          if (get().id === id) {
            set({ data: null, id: undefined });
          }
        },

        clearItem: () => {
          set({
            data: null,
            id: undefined,
            slug: "",
            dataStatus: "",
            loading: false,
            error: undefined,
            condition: undefined,
          });
        },
        resetStatus: () => {
          set({ status: "" });
        },
      }),
      {
        name: `View - ${type}`
      }
    )
  );
