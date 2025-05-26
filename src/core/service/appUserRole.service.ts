import { AppUser } from "../model/appuser";
import { useQuery } from "@tanstack/react-query";
import { useBaseService } from "../../sharedBase/baseService";

export const useAppuserRoleService = () => {
  const baseService = useBaseService<AppUser>("AppUser");

  const fetchRoleDataFn = async (): Promise<AppUser[]> => {
    const data = await baseService.getRoleData();
    if (!data) {
      console.error("No data returned from getRoleData.");
      return [];
    }
    return data;
  };

  const {
    data: roleData,
    isLoading: roleLoading,
    error: roleError,
  } = useQuery<AppUser[], Error>({
    queryKey: ["roleData"],
    queryFn: fetchRoleDataFn,
    staleTime: 5 * 60 * 1000,
  });

  return {
    baseService,
    roleData,
    roleLoading,
    roleError,
    fetchRoleData: async (): Promise<AppUser[] | undefined> => roleData,
  };
};
