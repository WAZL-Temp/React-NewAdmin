import { AppUser } from "../model/appuser";
import { useBaseService } from "../../sharedBase/baseService";

export const useAppUserService = () => {
	return useBaseService<AppUser>("AppUser");
};
