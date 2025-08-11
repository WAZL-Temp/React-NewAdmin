import { AppUser } from "../model/appUser";
import { useBaseService } from "../../sharedBase/baseService";
import { getApiUrl, getHeaders } from "../../sharedBase/apiService";

const apiUrl = getApiUrl("AppUser");

export const getGridData = (resourceName: string) => {
	const apiUrl = getApiUrl(resourceName);

	const getPageData = async (payload: any): Promise<any> => {
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

export const convertLang = async (): Promise<any> => {
	try {
		const response = await fetch(`${apiUrl}/SyncLangAll`, {
			method: "POST",
			headers: getHeaders(),
			body: JSON.stringify({}),
		});

		if (!response.ok) {
			throw new Error("Failed to convert language for all");
		}

		return await response.json();
	} catch (error) {
		console.error("Error in convertLang:", error);
		throw error;
	}
};

export const convertLangItem = async (id: any, lang: any): Promise<any> => {
	try {
		const form = { id: id, Lang: lang };

		const response = await fetch(`${apiUrl}/SyncLangItem`, {
			method: "POST",
			headers: getHeaders(),
			body: JSON.stringify(form),
		});

		if (!response.ok) {
			throw new Error("Failed to convert language for item");
		}

		return await response.json();
	} catch (error) {
		console.error("Error in convertLangItem:", error);
		throw error;
	}
};

export const appUserPageDataService = getGridData("AppUser");

export const AppUserService = () => {
	return useBaseService<AppUser>("AppUser");
};
