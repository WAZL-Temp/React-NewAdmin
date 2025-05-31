import { Product } from "../model/product";
import { useBaseService } from "../../sharedBase/baseService";

export const ProductService = () => {
	return useBaseService<Product>("ProductLive");
};
