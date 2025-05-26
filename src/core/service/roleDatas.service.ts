import { useBaseService } from "../../sharedBase/baseService";
import { RoleData } from "../model/roledata";

export const useRoleDataService = () => {
	return useBaseService<RoleData>("RoleData");
};
