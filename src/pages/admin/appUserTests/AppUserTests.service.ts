import { AppUserTestService } from "../../../core/service/appUserTests.service";
import { getApiUrl, getHeaders } from "../../../sharedBase/apiService";

export const CustomAppUserTestService = () => {
  const base = AppUserTestService();
  const apiUrl = getApiUrl("AppUserTest");

  const getPageData = async (payload: any): Promise<any> => {
    try {
      const response = await fetch(`${apiUrl}/GetPageData`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to get page grid data");
      return await response.json();
    } catch (error) {
      console.error("Error get page grid data:", error);
      throw error;
    }
  };

  const convertLang = async (): Promise<any> => {
    try {
      const response = await fetch(`${apiUrl}/SyncLangAll`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({}),
      });
      if (!response.ok) throw new Error("Failed to convert language for all");
      return await response.json();
    } catch (error) {
      console.error("Error in convertLang:", error);
      throw error;
    }
  };

  const convertLangItem = async (id: any, lang: any): Promise<any> => {
    try {
      const form = { id, Lang: lang };
      const response = await fetch(`${apiUrl}/SyncLangItem`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Failed to convert language for item");
      return await response.json();
    } catch (error) {
      console.error("Error in convertLangItem:", error);
      throw error;
    }
  };

  return {
    ...base,
    getPageData,
    convertLang,
    convertLangItem,
  };
};
