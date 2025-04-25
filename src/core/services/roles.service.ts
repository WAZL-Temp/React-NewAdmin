import { useBaseService } from "../../sharedBase/baseService";
import { getToken } from "../../sharedBase/baseServiceVar";
import { Role } from "../model/role";
import { RoleData } from "../model/roledata";

export const createRoleService = (Role: typeof useBaseService) => {

    const apiBaseUrl = import.meta.env.VITE_API_URL || "";
    if (!apiBaseUrl) {
        throw new Error('VITE_API_URL is not defined');
    }
    const apiUrl = `${apiBaseUrl}/${Role}`;

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

    const addData = async (item: Role, roleData: RoleData[]): Promise<string> => {
        const form = { form: item, roleData: roleData };

        try {
            const response = await fetch(`${apiUrl}/roleDataAdd`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                throw new Error("Failed to add role data");
            }

            return await response.text();
        } catch (error) {
            console.error("Error adding role data:", error);
            throw error;
        }
    }

    return{
        addData
    }
}

export const roleService = createRoleService(useBaseService);
