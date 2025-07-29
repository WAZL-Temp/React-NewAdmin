import { Category } from "../model/category";
import { useBaseService } from "../../sharedBase/baseService";
import { getToken } from "../../sharedBase/baseServiceVar";

export const getGridData = (resourceName: string) => {

	const apiBaseUrl = import.meta.env.VITE_API_URL || "";
	if (!apiBaseUrl) {
		throw new Error('VITE_API_URL is not defined');
	}
	const apiUrl = `${apiBaseUrl}/${resourceName}`;

	const getHeaders = (): HeadersInit => {
		const headers: HeadersInit = {
			"Content-Type": "application/json",
		};
		const token = getToken();
		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		}
		return headers;
	};

	const getPageData = async (payload:any): Promise<any> => {
		// const form = {
        //     condition: condition,
        //     orderColumns: [orderBy],
        //     pageNo: pageNo,
        //     pageSize: pageSize,
        //     totalCount: totalCount
        // };

		try {
			const response = await fetch(`${apiUrl}/GetPageData`, {
				method: 'POST',
				headers: getHeaders(),
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				throw new Error("Failed to get page grid data");
			}

			return await response.json();
		} catch (error) {
			console.error("Error get page grid data:", error);
			throw error;
		}
	}

	return {
		getPageData
	}
}

export const categoryPageDataService = getGridData("Category");
export const CategoriesService = () => {
	return useBaseService<Category>("Category");
};
