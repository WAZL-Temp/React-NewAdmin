import { AppUser } from "../model/appuser";
import { BaseService } from "../../sharedBase/baseService";

export const appUserService = new BaseService<AppUser>("AppUser");