import { AppUser } from "../model/appuser";
import { BaseService } from "../../sharedBase/baseService";

export const appUserTestService = new BaseService<AppUser>("AppUserTest");