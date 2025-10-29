import { useBaseService } from "../../sharedBase/baseService";
import { AppUserTest } from "../model/appUserTest";


export const AppUserTestService = () => {
	return useBaseService<AppUserTest>("AppUserTest");
};
