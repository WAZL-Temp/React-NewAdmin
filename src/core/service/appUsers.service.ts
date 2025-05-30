import { AppUser } from "../model/appuser";
import { useBaseService } from "../../sharedBase/baseService";

export const AppUserService = () => {
	return useBaseService<AppUser>("AppUser");
};
