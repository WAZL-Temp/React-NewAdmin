import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useBaseService } from "../sharedBase/baseService";
import { BaseModel } from "../sharedBase/modelInterface";
import { HomeCommonData, ListHtmlData } from "../types/homepage";

interface UseHomeQueryResult  {
  homeCommonData: HomeCommonData | null;
  homeUserData: HomeCommonData | null;
  homeHtmlData: ListHtmlData | null;
  search: Record<string, unknown>;
  setSearch: (search: Record<string, unknown>) => void;
  isLoading: boolean;
  error: Error | null;
  deleteItem: (id: number) => void;
  load: () => void;
}

export const useHomeQuery = <T extends BaseModel>(
  service : ReturnType<typeof useBaseService>
): UseHomeQueryResult => {
  const queryClient = useQueryClient();

  const [homeCommonData, setHomeCommonData] = useState<HomeCommonData | null>(null);
  const [homeUserData, setHomeUserData] = useState<HomeCommonData | null>(null);
  const [homeHtmlData, setHomeHtmlData] = useState<ListHtmlData | null>(null);
  const [search, setSearch] = useState<Record<string, unknown>>({});

  const { isLoading, error } = useQuery({
    queryKey: [`home-${service.type}`],
    queryFn: async () => {
      const { homeCommon, homeUser, htmlData } = await service.getHomeCommonData("default", "admin", null);
      setHomeCommonData(homeCommon);
      setHomeUserData(homeUser);
      setHomeHtmlData(htmlData);
      return { homeCommon, homeUser, htmlData };
    },
    staleTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      await service.handleDelete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`home-${service.type}`] });
    },
  });

  const load = () => {
    queryClient.invalidateQueries({ queryKey: [`home-${service.type}`] });
  };

  return {
    homeCommonData,
    homeUserData,
    homeHtmlData,
    search,
    setSearch,
    isLoading,
    error: error ?? null,
    deleteItem: deleteMutation.mutate,
    load,
  };
};
