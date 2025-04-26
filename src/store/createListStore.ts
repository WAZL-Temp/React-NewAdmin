import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BaseModel } from "../sharedBase/modelInterface";
import { useBaseService } from "../sharedBase/baseService";

export interface UseListQueryResult<T> {
  data: T[] | undefined;
  isLoading: boolean;
  error: Error | null;
  search: any;
  tableSearch: any;
  condition: any;
  roleCondition: any;
  deleteItem: (id: number) => void;
  load: () => void;
  setSearch: (search: any) => void;
  setTableSearch: (tableSearch: any) => void;
  clearSearch: (type: "search" | "table" | "both") => void;
  setCondition: (condition: any) => void;
  setRoleCondition: (roleCondition: any) => void;
  fetchRoleData: () => Promise<T[] | undefined>;
  fetchGridData: (pageNo: number, pageSize: number, orderBy: string, table: string) => Promise<any>;
}

export const useListQuery = <T extends BaseModel>(
  baseService: ReturnType<typeof useBaseService>
): UseListQueryResult<T> => {
  const queryClient = useQueryClient();
  const service = baseService;

  const cachedState = queryClient.getQueryData<{
    search: any;
    tableSearch: any;
    condition: any;
    roleCondition: any;
  }>([`list-${service.type}-state`]);


  const [search, setSearchState] = useState<any>(cachedState?.search || {});
  const [tableSearch, setTableSearchState] = useState<any>(
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
  const [condition, setConditionState] = useState<any>(cachedState?.condition || {});
  const [roleCondition, setRoleConditionState] = useState<any>(cachedState?.roleCondition || {});
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

  const setSearch = (newSearch: any) => {
    setSearchState((prev: any) => {
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

  const setTableSearch = (newTableSearch: any) => {
    setTableSearchState((prev: any) => {
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
    if (type === "table") setTableSearchState({});
    if (type === "both") {
      setSearchState({});
      setTableSearchState({});
    }
    // saveStateToCache();
  };

  const setCondition = (newCondition: any) => {
    setConditionState(newCondition);
    saveStateToCache();
  };

  const setRoleCondition = (newRoleCondition: any) => {
    setRoleConditionState((prev: any) => {
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
      setIsFetching(false);
      return fetchedData;
    } catch (err: unknown) {
      setIsFetching(false);
      console.error("Error fetching role data:", err);
    }
  };

  const fetchGridData = async (
    pageNo: number,
    pageSize: number,
    orderBy: string,
    table: string
  ): Promise<any> => {
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
