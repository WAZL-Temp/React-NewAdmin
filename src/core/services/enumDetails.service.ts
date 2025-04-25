import { useBaseService } from "../../sharedBase/baseService";
import { EnumDetail } from "../model/enumdetail";


export const useEnumDetailsService = () => {
	return useBaseService<EnumDetail>("EnumDetail");
};
