import { getToken } from "./baseServiceVar";

export const apiBaseUrl = import.meta.env.VITE_API_URL || "";
if (!apiBaseUrl) {
    throw new Error("VITE_API_URL is not defined");
}

export const getApiUrl = (resourceName: string): string => {
    return `${apiBaseUrl}/${resourceName}`;
};

export const getHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };
    const token = getToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
};
