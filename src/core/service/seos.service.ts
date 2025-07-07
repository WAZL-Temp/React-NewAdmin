import { Seo } from "../model/seo";
import { useBaseService } from "../../sharedBase/baseService";

export const SeosService = () => {
	return useBaseService<Seo>("Seo");
};
