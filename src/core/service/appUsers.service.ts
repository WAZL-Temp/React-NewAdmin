import { AppUser } from "../model/appUser";
import { useBaseService } from "../../sharedBase/baseService";

export const AppUserService = () => {
	return useBaseService<AppUser>("AppUser");
};
