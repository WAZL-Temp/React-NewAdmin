import { AppUserTest } from "../model/appUserTest";
import { useBaseService } from "../../sharedBase/baseService";

export const AppUserTestsService = () => {
	return useBaseService<AppUserTest>("AppUserTest");
};
