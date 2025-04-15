import { createListStore } from "../../../store/createListStore";
import { appUserService } from "../../../core/services/appUserService";
import { AppUser } from "../../../core/model/appuser";
import { createItemStore } from "../../../store/createItemStore";
import { createHomeStore } from "../../../store/createHomeStore";

export const appUserListStore = createListStore<AppUser>(appUserService, "AppUser");

export const appUserItemStore = createItemStore<AppUser>(appUserService,"AppUser");

export const appUserHomeStore = createHomeStore<any>(appUserService,"AppUser");

