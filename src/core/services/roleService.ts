import { BaseService } from "../../sharedBase/baseService";
import { Role } from "../model/role";
import { RoleData } from "../model/roledata";

export class RoleService extends BaseService<Role> {
    protected apiUrl: string;
    protected apiBaseUrl: string = import.meta.env.VITE_API_URL || "";

    constructor() {
        super("Role");
        if (!this.apiBaseUrl) {
            throw new Error('VITE_API_URL is not defined');
        }
        this.apiUrl = `${this.apiBaseUrl}/Role`;
    }

    async addData(item: Role, roleData: RoleData[]): Promise<string> {
        const form = { form: item, roleData: roleData };
        
        try {
            const response = await fetch(`${this.apiUrl}/roleDataAdd`, {
                method: 'POST',
                headers: this.getHeaders(),
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
}

export const roleService = new RoleService();
