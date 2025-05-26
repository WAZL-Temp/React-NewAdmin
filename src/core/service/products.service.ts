import { Product } from "../model/product";
import { useBaseService } from "../../sharedBase/baseService";

export const useProductService = () => {
	return useBaseService<Product>("ProductLive");
};
