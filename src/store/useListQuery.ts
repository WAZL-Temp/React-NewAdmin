import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BaseModel } from "../sharedBase/modelInterface";
import { useBaseService } from "../sharedBase/baseService";
import { CachedState, ConditionParams, RoleConditionParams, SearchParams, TableSearchParams } from "../types/listpage";

export interface UseListQueryResult<T> {
  data: T[] | undefined;
  isLoading: boolean;
  error: Error | null;
  search: SearchParams;
  tableSearch: TableSearchParams;
  condition: ConditionParams;
  roleCondition: RoleConditionParams;
  deleteItem: (id: number) => void;
  load: () => void;
  setSearch: (search: SearchParams) => void;
  setTableSearch: (tableSearch: TableSearchParams) => void;
  clearSearch: (type: "search" | "table" | "both") => void;
  setCondition: (condition: ConditionParams) => void;
  setRoleCondition: (roleCondition: RoleConditionParams) => void;
  fetchRoleData: () => Promise<T[] | undefined>;
  fetchGridData: (pageNo: number, pageSize: number, orderBy: string, table: string) => Promise<{ data: T[]; total: number } | undefined>;
}

export const useListQuery = <T extends BaseModel>(
  baseService: ReturnType<typeof useBaseService>
): UseListQueryResult<T> => {
  const queryClient = useQueryClient();
  const service = baseService;

  const cachedState = queryClient.getQueryData<CachedState>([`list-${service.type}-state`]);

  const [search, setSearchState] = useState<SearchParams>(cachedState?.search || {});
  const [tableSearch, setTableSearchState] = useState<TableSearchParams>(
    cachedState?.tableSearch || {
      sortField: "",
      sortOrder: "",
      first: 0,
      rows: 10,
      filter: "",
      top: "",
      left: "",
      searchRowFilter: {},
    }
  );
  const [condition, setConditionState] = useState<ConditionParams>(cachedState?.condition || {});
  const [roleCondition, setRoleConditionState] = useState<RoleConditionParams>(cachedState?.roleCondition || {});
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const payload = { ...condition, ...search, ...roleCondition };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [`list-${service.type}`],
    queryFn: () => service.getAll(payload),
    staleTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => service.handleDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`list-${service.type}`] });
    },
  });

  const saveStateToCache = () => {
    queryClient.setQueryData([`list-${service.type}-state`], {
      search,
      tableSearch,
      condition,
      roleCondition,
    });
  };

  const setSearch = (newSearch: SearchParams) => {
    setSearchState((prev:SearchParams) => {
      const updated = { ...prev, ...newSearch };
      queryClient.setQueryData([`list-${service.type}-state`], {
        search: updated,
        tableSearch,
        condition,
        roleCondition,
      });
      return updated;
    });
  };

  const setTableSearch = (newTableSearch: Partial<TableSearchParams>) => {
    setTableSearchState((prev) => {
      const updated = { ...prev, ...newTableSearch };
      queryClient.setQueryData([`list-${service.type}-state`], {
        search,
        tableSearch: updated,
        condition,
        roleCondition,
      });
      return updated;
    });
  };

  const clearSearch = (type: "search" | "table" | "both") => {
    
    if (type === "search") setSearchState({});
    if (type === "table") setTableSearchState({
      sortField: "",
      sortOrder: "",
      first: 0,
      rows: 10,
      filter: "",
      top: "",
      left: "",
      searchRowFilter: {},
    });
    if (type === "both") {
      setSearchState({});
      setTableSearchState({
      sortField: "",
      sortOrder: "",
      first: 0,
      rows: 10,
      filter: "",
      top: "",
      left: "",
      searchRowFilter: {},
    });
    }
    saveStateToCache();
  };

  const setCondition = (newCondition: ConditionParams) => {
    setConditionState(newCondition);
    saveStateToCache();
  };

  const setRoleCondition = (newRoleCondition: RoleConditionParams) => {
    setRoleConditionState((prev:RoleConditionParams) => {
      const updated = { ...prev, ...newRoleCondition };
      queryClient.setQueryData([`list-${service.type}-state`], {
        search,
        tableSearch,
        condition,
        roleCondition: updated,
      });
      return updated;
    });
  };

  const load = () => {
    refetch();
  };

  const fetchRoleData = async (): Promise<T[] | undefined> => {
    if (isFetching) return;
    setIsFetching(true);

    try {
      const fetchedData = await service.getRoleData();
      // console.log("Fetched role data:", fetchedData);
      
      if (!fetchedData) {
        console.error("No data returned from the service.");
        return [];
      }
      return fetchedData;
    } catch  {
      // (err: unknown)
      setIsFetching(false);
      // console.error("Error fetching role data:", err);
      return [];
    }
  };

  const fetchGridData = async (
    pageNo: number,
    pageSize: number,
    orderBy: string,
    table: string
  ): Promise<{ data: T[]; total: number } | undefined> => {
    try {
      const fetchedGridData = await service.getGridData(pageNo, pageSize, orderBy, table);
      return fetchedGridData;
    } catch (err: unknown) {
      console.error("Error fetching grid data:", err);
    }
  };

  return {
    data: data as T[] | undefined,
    isLoading,
    error: error as Error | null,
    search,
    tableSearch,
    condition,
    roleCondition,
    deleteItem: deleteMutation.mutate,
    load,
    setSearch,
    setTableSearch,
    clearSearch,
    setCondition,
    setRoleCondition,
    fetchRoleData,
    fetchGridData
  };
};
