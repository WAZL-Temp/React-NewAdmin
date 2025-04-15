import { appuserRoleService } from "../../../core/services/appuserRoleService";
import { createListStore } from "../../../store/createListStore";


export const appUserRoleDetailStore = createListStore<any>(appuserRoleService, "AppUser");
