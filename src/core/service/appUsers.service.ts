import { useBaseService } from "../../sharedBase/baseService";
import { AppUser } from "../model/appUser";


export const AppUserService = () => {
	return useBaseService<AppUser>("AppUser");
};
