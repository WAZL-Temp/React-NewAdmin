import { useBaseService } from "../../sharedBase/baseService";
import { RoleData } from "../model/roledata";

export const RoleDataService = () => {
	return useBaseService<RoleData>("RoleData");
};
