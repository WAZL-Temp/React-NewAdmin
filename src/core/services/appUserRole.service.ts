import { AppUser } from "../model/appuser";
import { useBaseService } from "../../sharedBase/baseService";

export const useAppuserRoleService = () => {
	return useBaseService<AppUser>("AppUser");
};