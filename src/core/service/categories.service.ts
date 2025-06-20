import { Category } from "../model/category";
import { useBaseService } from "../../sharedBase/baseService";

export const CategoriesService = () => {
	return useBaseService<Category>("Category");
};
