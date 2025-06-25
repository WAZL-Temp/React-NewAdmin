import { useBaseService } from "../../sharedBase/baseService";
import { RoleDetail } from "../model/roledetail";

export const RoleDetailService = () => {
    return useBaseService<RoleDetail>("RoleDetail");
};