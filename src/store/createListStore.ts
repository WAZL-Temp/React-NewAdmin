import { BaseService } from "../sharedBase/baseService";
import { create, devtools } from "../sharedBase/globalImports";
import { BaseModel } from "../sharedBase/modelInterface";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface ListStore<T> {
  data: T[];
  loading: boolean;
  status: string;
  error: string | null;
  search: any;
  tableSearch: any;
  isFetching: boolean;
  condition: any;
  roleCondition: any;
  setSearch: (search: any) => void;
  setTableSearch: (tableSearch: any) => void;
  setCondition: (condition: any) => void;
  setRoleCondition: (roleCondition: any) => void;
  clearSearch: (type: "search" | "table" | "both") => void;
  deleteItem: (id: number) => void;
  resetStatus: () => void;
}

export const createListStore = <T extends BaseModel>(
  type: string
) =>
  create<ListStore<T>>()(
    devtools(
      (set, get) => ({
        data: [],
        loading: false,
        status: "",
        error: null,
        search: {},
        isFetching: false,
        tableSearch: {
          sortField: "",
          sortOrder: "",
          first: 0,
          rows: 10,
          filter: "",
          top: "",
          left: "",
          searchRowFilter: {},
        },
        setSearch: (newSearch: any) => {
          set((state) => ({
            search: {
              ...state.search,
              ...newSearch,
            },
            status: "",
          }));
        },
        setTableSearch: (tableSearch: any) => {
          set({ tableSearch });
        },
        setCondition: (condition: any) => {
          set({ condition });
        },
        setRoleCondition: (newRoleCondition: any) => {
          set((state) => ({
            roleCondition: {
              ...state.roleCondition,
              ...newRoleCondition,
            },
          }));
        },
        clearSearch: (type: "search" | "table" | "both") => {
          if (type === "search") {
            set({ search: {} });
          }
          if (type === "table") {
            set({ tableSearch: {} });
          }
          if (type === "both") {
            set({ search: {}, tableSearch: {} });
          }
        },
        deleteItem: (id: number) => {
          set((state) => ({
            data: state.data.filter((item: any) => item.id !== id),
          }));
        },
        resetStatus: () => {
          set({ status: "" });
        },
      }),
      {
        name: `List-${type}`,
      }
    )
  );

  export interface QueryStore<T>{
    data: T[] | undefined;
    isLoading: boolean;
    error: Error | null;
    deleteItem: (id: number) => void;
    load: () => void;
  }

// Hook to use TanStack Query with Zustand
export const useListQuery = <T extends BaseModel>(
  store: ListStore<T>,
  service: BaseService<T>
) => {
  const queryClient = useQueryClient();

  // Fetch data using TanStack Query
  const { data, isLoading, error } = useQuery({
    queryKey: [`list-${service.constructor.name}`],
    queryFn: async () => {
      const { condition, search, roleCondition } = store;
      const payload = { ...condition, ...search, ...roleCondition };
      return await service.getAll(payload);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mutation for deleting an item
  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      await service.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`list-${service.constructor.name}`] });
    },
  } //    
   
  );

  const load = async () => {
    // console.log("load function called");
    //   const { condition, search, roleCondition } = store;
    //   const payload = { ...condition, ...search, ...roleCondition };
    //   await queryClient.fetchQuery({
    //     queryKey: [`list-${service.constructor.name}`],
    //     queryFn: async () => await service.getAll(payload),
    //   });
    queryClient.invalidateQueries({ queryKey: [`list-${service.constructor.name}`] });
    
  };

  return {
    data,
    isLoading,
    error,
    deleteItem: deleteMutation.mutate,
    load, 
  };
};