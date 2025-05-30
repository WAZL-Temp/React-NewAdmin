import { useBaseService } from "../../sharedBase/baseService";
import { RoleDetail } from "../model/roledetail";

export const RoleDataService = () => {
    return useBaseService<RoleDetail>("RoleDetail");
};