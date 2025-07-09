import { AppUserTest } from "../model/appUserTests";
import { useBaseService } from "../../sharedBase/baseService";

export const AppUserTestsService = () => {
	return useBaseService<AppUserTest>("AppUserTest");
};
