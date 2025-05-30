import { useBaseService } from "../../sharedBase/baseService";
import { EnumDetail } from "../model/enumdetail";


export const EnumDetailsService = () => {
	return useBaseService<EnumDetail>("EnumDetail");
};
