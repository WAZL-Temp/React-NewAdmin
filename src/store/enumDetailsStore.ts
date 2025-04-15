import { EnumDetail } from "../core/model/enumdetail";
import { enumDetailsService } from "../core/services/enumDetailsService";
import { createListStore } from "./createListStore";

export const enumDetailStore = createListStore<EnumDetail>(enumDetailsService,"Enum Detail");