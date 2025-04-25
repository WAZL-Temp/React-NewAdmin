import { AppUser } from "../model/appuser";
import { useBaseService } from "../../sharedBase/baseService";


export const useAppUserTestService = () => {
    return useBaseService<AppUser>("AppUserTest");
};
