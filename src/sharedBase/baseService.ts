import { useState } from "react";
import { BaseModel } from "./modelInterface";
import { getToken, getUserInfo, setToken, setUserInfo } from "./baseServiceVar";
import { CustomFile } from "../core/model/customfile";
import { FileInfo } from "../types/listpage";

export const useBaseService = <T extends BaseModel>(type: string) => {
    const apiBaseUrl = import.meta.env.VITE_API_URL || "";
    if (!apiBaseUrl) {
        throw new Error('VITE_API_URL is not defined');
    }
    const apiUrl = `${apiBaseUrl}/${type}`;
    const [helperServiceObj, setHelperServiceObj] = useState<any>(null);

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

    const handleError = (error: any): never => {
        if (error.response && error.response.status === 401) {
            helperServiceObj?.setNavigationUrl(window.location.pathname);
            throw error.response.status;
        }

        throw error.response?.data?.message || "Server error";
    };

    const importExcel = async (needSampleData: any): Promise<Blob> => {
        const response = await fetch(`${apiUrl}/DownloadImportExcelFile`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(needSampleData),
        });

        if (!response.ok) {
            throw new Error("Failed to import Excel file");
        }

        return await response.blob();
    };

    const checkImportData = async (): Promise<T[]> => {
        const response = await fetch(`${apiUrl}/ImportCheck`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({}),
        });

        if (!response.ok) {
            throw new Error("Failed to check import data");
        }

        const responseText = await response.text();

        if (!responseText) {
            return [];
        }

        try {
            return JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse JSON response:', e);
            throw new Error("Invalid JSON response");
        }
    };

    const getImportData = async (file: any): Promise<T[]> => {
        const response = await fetch(`${apiUrl}/ImportData`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(file),
        });

        if (!response.ok) throw new Error("Failed to get import data");
        return await response.json();
    };

    const syncImportData = async (file: any): Promise<T[]> => {
        const response = await fetch(`${apiUrl}/ImportDataSync`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(file),
        });

        if (!response.ok) throw new Error("Failed to sync import data");
        return await response.json();
    };

    const clearData = async (): Promise<void> => {
        console.log("Clear all state functionality to be implemented.");
    };

    const getHomeCommon = async (type: string, pageType: string, condition: any): Promise<any[]> => {
        const payload = {
            "type": type,
            "pageType": pageType,
            "condition": condition
        };

        const response = await fetch(`${apiUrl}/GetHomeCommonData`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to fetch home common data");
        return await response.json();
    };

    const getHomeUser = async (type: string, pageType: string, condition: any): Promise<any[]> => {
        const response = await fetch(`${apiUrl}/GetHomeUserData`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ type, pageType, condition }),
        });

        if (!response.ok) throw new Error("Failed to fetch home user data");
        return await response.json();
    }

    const getHtmlData = async (type: string, pageType: string, language: string, condition: any): Promise<any[]> => {
        const response = await fetch(`${apiUrl}/GetHtmlData`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ type, pageType, language, condition }),
        });

        if (!response.ok) throw new Error("Failed to fetch HTML data");
        return await response.json();
    }

    const getHomeCommonData = async (type: string, pageType: string, condition: any): Promise<any> => {
        // const reload = true;
        try {
            const [homeCommon, homeUser, htmlData] = await Promise.all([
                getHomeCommon(type, pageType, condition),
                getHomeUser(type, pageType, condition),
                getHtmlData(type, pageType, "en", condition),
            ]);

            return { homeCommon, homeUser, htmlData };
        } catch (err) {
            console.error("Failed to fetch one or more data sets:", err);
            throw new Error("Failed to fetch complete data");
        }
    }

    const searchData = async (search: any, order: string[], condition: any): Promise<T[]> => {
        const searchCondition = condition;
        const response = await fetch(`${apiUrl}/Search`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ form: search, condition: searchCondition, orderColumns: order }),
        });

        if (!response.ok) throw new Error("Failed to search data");
        return await response.json();
    }

    const exportExcel = async (search: any, order: string[]): Promise<Blob | undefined> => {
        try {
            const response = await fetch(`${apiUrl}/DownloadExcelFile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getHeaders(),
                },
                body: JSON.stringify({ form: search, order }),
            });

            if (!response.ok) {
                throw new Error("Failed to export Excel file");
            }

            return await response.blob();
        } catch (error) {
            handleError(error);
            return undefined;
        }
    }

    const downloadPdf = async (fileInfo: any): Promise<Blob> => {
        try {
            const response = await fetch(`${apiUrl}/Download"`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(fileInfo),
            });

            if (!response.ok) {
                throw new Error("Failed to download PDF");
            }

            return await response.blob();
        } catch (error) {
            return handleError(error);
        }
    }

    const getAll = async (condition: any): Promise<T[]> => {
        const response = await fetch(`${apiUrl}/Get`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ condition: condition }),
        });

        if (!response.ok) throw new Error("Failed to fetch data");
        return await response.json();
    }

    const get = async (id: number): Promise<T> => {
        try {
            const response = await fetch(`${apiUrl}/GetById`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                console.error("Failed response details:", errorDetails);
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error during fetch:", error);
            throw error;
        }
    }

    const add = async (item: T): Promise<T> => {
        const response = await fetch(`${apiUrl}/Add`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(item),
        });

        if (!response.ok) throw new Error("Failed to add item");
        return await response.json();
    }

    const draft = async (item: T): Promise<T> => {
        const response = await fetch(`${apiUrl}/Draft`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(item),
        });

        if (!response.ok) throw new Error("Failed to save draft");
        return await response.json();
    }

    const update = async (item: T): Promise<T> => {
        const response = await fetch(`${apiUrl}/Update`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(item),
        });

        if (!response.ok) throw new Error("Failed to update item");
        return await response.json();
    }

    const handleDelete = async (id: number): Promise<void> => {
        const response = await fetch(`${apiUrl}/Delete`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ Id: id }),
        });

        if (!response.ok) throw new Error("Failed to delete item");
        return;
    }

    const fileUpload = async (file: File): Promise<CustomFile> => {
        const formData = new FormData();
        formData.append("file", file);
        const token = getToken();

        const response = await fetch(`${apiUrl}/FileUpload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to upload file");
        }
        return await response.json();
    }

    const fileDownload = async (fileInfo: FileInfo): Promise<Blob> => {
        const response = await fetch(`${apiUrl}/Download`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(fileInfo),
        });

        if (!response.ok) throw new Error("Failed to download file");
        return await response.blob();
    }

    const unique = async (name: string, item: T, condition: any): Promise<boolean> => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const response = await fetch(`${apiUrl}/CheckUnique`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ columnName: name, form: item, condition }),
        });

        if (!response.ok) throw new Error("Failed to check uniqueness");
        return await response.json();
    }

    const getRoleData = async (): Promise<any> => {
        try {
            const userInfo = getUserInfo();
            
            if (userInfo) {
                const form = { role: userInfo?.role, id: 0 }
                
                const response = await fetch(`${apiUrl}/GetRoleData`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...getHeaders(),
                    },
                    body: JSON.stringify(form),
                });

                if (!response.ok) {
                    throw new Error("Failed to export Excel file");
                }

                return await response.json();
            }
        } catch (error) {
            handleError(error);
        }
    }

    const getGridData = async (pageNo: number, pageSize: number, orderBy: string, table: string): Promise<any> => {
        const form = { pageNo: pageNo, pageSize: pageSize, orderBy: orderBy, table: table };
        const response = await fetch(`${apiUrl}/GetGridData`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(form),
        });

        if (!response.ok) throw new Error("Failed to fetch grid Data");
        return await response.json();
    }

    return {
        setToken,
        setUserInfo,
        setHelperServiceObj,
        importExcel,
        checkImportData,
        getImportData,
        syncImportData,
        clearData,
        getHomeCommon,
        getHomeCommonData,
        searchData, exportExcel, downloadPdf, getAll, get, add, draft, update,
        handleDelete, fileUpload, fileDownload, unique, getRoleData,
        getGridData,
        type
    };
};