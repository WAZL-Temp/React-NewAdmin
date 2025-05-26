import { useBaseService } from "../../sharedBase/baseService";
import { AppUserTest } from "../model/appusertest";


export const useAppUserTestService = () => {
    return useBaseService<AppUserTest>("AppUserTest");
};
