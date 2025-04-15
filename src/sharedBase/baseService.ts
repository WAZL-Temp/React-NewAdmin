import { BaseModel } from "./modelInterface";

export class BaseService<T extends BaseModel> {
    protected apiUrl: string = "";
    protected apiBaseUrl: string = import.meta.env.VITE_API_URL || "";
    protected stateName: string | undefined;
    private static helperServiceObj: any;
    private static token: string = "";
    private static userInfo: any = {};

    constructor(type: string) {
        const baseUrl = import.meta.env.VITE_API_URL;
        if (!baseUrl) {
            throw new Error('VITE_API_URL is not defined');
        }
        this.apiUrl = `${baseUrl}/${type}`;
    }

    public static setToken(token: string) {
        BaseService.token = token;
    }

    public static setUserInfo(userInfo: any) {
        BaseService.userInfo = userInfo;
    }

    public static setHelperService(helperSvc: any) {
        BaseService.helperServiceObj = helperSvc;
    }

    public static get helperService() {
        return BaseService.helperServiceObj;
    }

    // private getHeaders(): HeadersInit {
    //     const headers: HeadersInit = {
    //         "Content-Type": "application/json"
    //     };

    //     if (BaseService.token) {
    //         headers["Authorization"] = `Bearer ${BaseService.token}`;
    //     }
    //     return headers;
    // }

    protected getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            "Content-Type": "application/json"
        };
    
        if (BaseService.token) {
            headers["Authorization"] = `Bearer ${BaseService.token}`;
        }
        return headers;
    }    

    protected handleError(error: any): never {
        if (error.response && error.response.status === 401) {
            const helperSvc = BaseService.helperService;
            helperSvc?.setNavigationUrl(window.location.pathname);
            throw error.response.status;
        }

        throw error.response?.data?.message || "Server error";
    }

    async importExcel(needSampleData: any): Promise<Blob> {
        const response = await fetch(`${this.apiUrl}/DownloadImportExcelFile`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(needSampleData),
        });

        if (!response.ok) {
            throw new Error("Failed to import Excel file");
        }

        const res = response.blob();
        return await res;
    }

    async checkImportData(): Promise<T[]> {
        const response = await fetch(`${this.apiUrl}/ImportCheck`, {
            method: 'POST',
            headers: this.getHeaders(),
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
    }


    async getImportData(file: any): Promise<T[]> {
        const response = await fetch(`${this.apiUrl}/ImportData`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(file),
        });

        if (!response.ok) throw new Error("Failed to get import data");
        return await response.json();
    }

    async syncImportData(file: any): Promise<T[]> {
        const response = await fetch(`${this.apiUrl}/ImportDataSync`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(file),
        });

        if (!response.ok) throw new Error("Failed to sync import data");
        return await response.json();
    }

    async clearData(): Promise<void> {
        console.log("Clear all state functionality to be implemented.");
    }

    async getHomeCommon(type: string, pageType: string, condition: any): Promise<any[]> {
        const payload = {
            "type": type,
            "pageType": pageType,
            "condition": condition
        }

        const response = await fetch(`${this.apiUrl}/GetHomeCommonData`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to fetch home common data");
        return await response.json();
    }

    async getHomeUser(type: string, pageType: string, condition: any): Promise<any[]> {
        const response = await fetch(`${this.apiUrl}/GetHomeUserData`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ type, pageType, condition }),
        });

        if (!response.ok) throw new Error("Failed to fetch home user data");
        return await response.json();
    }

    async getHtmlData(type: string, pageType: string, language: string, condition: any): Promise<any[]> {
        const response = await fetch(`${this.apiUrl}/GetHtmlData`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ type, pageType, language, condition }),
        });

        if (!response.ok) throw new Error("Failed to fetch HTML data");
        return await response.json();
    }

    async getHomeCommonData(type: string, pageType: string, condition: any): Promise<any> {
        // const reload = true;
        try {
            const [homeCommon, homeUser, htmlData] = await Promise.all([
                this.getHomeCommon(type, pageType, condition),
                this.getHomeUser(type, pageType, condition),
                this.getHtmlData(type, pageType, "en", condition),
            ]);

            return { homeCommon, homeUser, htmlData };
        } catch (err) {
            console.error("Failed to fetch one or more data sets:", err);
            throw new Error("Failed to fetch complete data");
        }
    }


    async searchData(search: any, order: string[], condition: any): Promise<T[]> {
        let searchCondition = condition;
        const response = await fetch(`${this.apiUrl}/Search`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ form: search, condition: searchCondition, orderColumns: order }),
        });

        if (!response.ok) throw new Error("Failed to search data");
        return await response.json();
    }

    async exportExcel(search: any, order: string[]): Promise<Blob> {
        try {
            const response = await fetch(`${this.apiUrl}/DownloadExcelFile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getHeaders(),
                },
                body: JSON.stringify({ form: search, order }),
            });

            if (!response.ok) {
                throw new Error("Failed to export Excel file");
            }

            return await response.blob();
        } catch (error) {
            this.handleError(error);
        }
    }

    async downloadPdf(fileInfo: any): Promise<Blob> {
        try {
            const response = await fetch(`${this.apiUrl}/Download"`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(fileInfo),
            });

            if (!response.ok) {
                throw new Error("Failed to download PDF");
            }

            return await response.blob();
        } catch (error) {
            return this.handleError(error);
        }
    }

    async getAll(condition:any): Promise<T[]> {
        const response = await fetch(`${this.apiUrl}/Get`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ condition: condition }),
        });

        if (!response.ok) throw new Error("Failed to fetch data");
        return await response.json();
    }

    async get(id: number): Promise<T> {
        try {
            const response = await fetch(`${this.apiUrl}/GetById`, {
                method: 'POST',
                headers: this.getHeaders(),
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

    async add(item: T): Promise<T> {
        const response = await fetch(`${this.apiUrl}/Add`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(item),
        });

        if (!response.ok) throw new Error("Failed to add item");
        return await response.json();
    }

    async draft(item: T): Promise<T> {
        const response = await fetch(`${this.apiUrl}/Draft`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(item),
        });

        if (!response.ok) throw new Error("Failed to save draft");
        return await response.json();
    }

    async update(item: T): Promise<T> {
        const response = await fetch(`${this.apiUrl}/Update`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(item),
        });

        if (!response.ok) throw new Error("Failed to update item");
        return await response.json();
    }

    async delete(id: number): Promise<void> {
        const response = await fetch(`${this.apiUrl}/Delete`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ Id: id }),
        });

        if (!response.ok) throw new Error("Failed to delete item");
        return;
    }

    async fileUpload(file: File): Promise<any> {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${this.apiUrl}/FileUpload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${BaseService.token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to upload file");
        }
        return await response.json();
    }

    async fileDownload(fileInfo: any): Promise<Blob> {
        const response = await fetch(`${this.apiUrl}/Download`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(fileInfo),
        });

        if (!response.ok) throw new Error("Failed to download file");
        return await response.blob();
    }

    async unique(name: string, item: T, condition: any): Promise<boolean> {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const response = await fetch(`${this.apiUrl}/CheckUnique`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ columnName: name, form: item, condition }),
        });

        if (!response.ok) throw new Error("Failed to check uniqueness");
        return await response.json();
    }

    async getRoleData(): Promise<any> {
        try {
            if (BaseService.userInfo) {
                const cleanJson = BaseService.userInfo?.trim();
                const baseUserInfo = cleanJson ? JSON.parse(cleanJson) : null;
                const form = { role: baseUserInfo?.role, id: 0 }

                const response = await fetch(`${this.apiUrl}/GetRoleData`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...this.getHeaders(),
                    },
                    body: JSON.stringify(form),
                });

                if (!response.ok) {
                    throw new Error("Failed to export Excel file");
                }

                return await response.json();
            }
        } catch (error) {
            this.handleError(error);
        }
    }

    async getGridData(pageNo: number,pageSize: number,orderBy: string,table: string): Promise<any> {
        const form = {pageNo:pageNo,pageSize:pageSize,orderBy:orderBy,table:table};
        const response = await fetch(`${this.apiUrl}/GetGridData`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(form),
        });

        if (!response.ok) throw new Error("Failed to fetch grid Data");
        return await response.json();
    }
}

