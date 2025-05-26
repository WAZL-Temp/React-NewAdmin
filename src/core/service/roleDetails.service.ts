import { useBaseService } from "../../sharedBase/baseService";
import { RoleDetail } from "../model/roledetail";

export const useRoleDataService = () => {
    return useBaseService<RoleDetail>("RoleDetail");
};