import { BaseService } from "../sharedBase/baseService";
import { create, devtools } from "../sharedBase/globalImports";
import { BaseModel } from "../sharedBase/modelInterface";

export interface ListStore<T> {
  set(arg0: { status: string; }): unknown;
  data: T[];
  loading: boolean;
  status: string;
  error: string | null;
  search: any;
  tableSearch: any;
  isFetching: boolean;
  condition: any;
  roleCondition: any;
  loadList: () => Promise<T>;
  reloadList: () => Promise<T>;
  addItem: (item: T) => void;
  updateItem: (item: T) => void;
  setSearch: (search: any) => void;
  setTableSearch: (tableSearch: any) => void;
  setCondition: (condition: any) => void;
  setRoleCondition: (roleCondition: any) => void;
  clearSearch: (type: 'search' | 'table' | 'both') => void;
  deleteItem: (id: number) => void;
  resetStatus: () => void;
  fetchRoleData: () => T[];
  fetchGridData : (pageNo: number,pageSize: number,orderBy: string,table: string) => Promise<any>;
}

export const createListStore = <T extends BaseModel>(service: BaseService<T>, type: string) =>
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
          sortField: '',
          sortOrder: '',
          first: 0,
          rows: 10,
          filter: '',
          top: '',
          left: '',
          searchRowFilter: {},
        },
        loadList: async () => {
          if (get().status === "") {
            set({ loading: true, error: null, status: "Loading" });
            try {
              const { condition, search, roleCondition } = get();
              const payload = { ...condition, ...search, ...roleCondition };
              const fetchedData = await service.getAll(payload);
              set({ data: fetchedData, loading: false, status: "Loaded" });
            } catch (err: any) {
              set({ error: err.message, loading: false, status: "" });
            }
          }
        },
        reloadList: async () => {
          set({ loading: true, error: null, status: "Loading" });

          try {
            const { condition, search, roleCondition } = get();
            const payload = { ...condition, ...search, ...roleCondition };
            const fetchedData = await service.getAll(payload);                        
            set({ data: fetchedData, loading: false, status: "Loaded" });
          } catch (err: any) {
            set({ error: err.message, loading: false, status: "" });
          }
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
            }
          }));
        },        
        clearSearch: (type: 'search' | 'table' | 'both') => {
          if (type === 'search') {
            set({ search: {} });
          }
          if (type === 'table') {
            set({ tableSearch: {} });
          }
          if (type === 'both') {
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
        fetchRoleData: async () => {
          const { isFetching } = get();
          if (isFetching) return;
          set({ isFetching: true });

          try {
            const fetchedData = await service.getRoleData();
            set({ data: fetchedData, loading: false, isFetching: false });
            return fetchedData;
          } catch (err: any) {
            set({ error: err.message, loading: false, isFetching: false });
          }
        },
        fetchGridData: async (pageNo: number,pageSize: number,orderBy: string,table: string) => {

          try {
            const fetchedGridData = await service.getGridData(pageNo,pageSize,orderBy,table);
            set({ data: fetchedGridData });
            return fetchedGridData;
          } catch (err: any) {
            set({ error: err.message});
          }
        },
      }),
      {
        name: `List-${type}`,
      }
    ),
  );
