import { createListStore } from "../../../store/createListStore";
import { AppUser } from "../../../core/model/appuser";


export const appUserListStore = createListStore<AppUser>("AppUser");


