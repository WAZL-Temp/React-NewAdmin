import { enumDetailStore } from "../store/enumDetailsStore";
import { appUserRoleDetailStore } from "../pages/admin/appuser/appuserRoleDetailStore";

export class LookupServiceBase {
    async fetchDataEnum(type: string): Promise<any[]> {
        const data = enumDetailStore.getState().data;
        if (data != null) {
            return data.filter((item: any) => item.section === type);
        } else {
            return [];
        }
    }

    async getLabelEnum(type: string, value: string): Promise<any> {
        const data = enumDetailStore.getState().data;
        if (data.length) {
            const filteredData = data.filter((item: any) => item.section === type && item.value === value);
            return filteredData.length ? filteredData[0] : {};
        } else {
            return {};
        }
    }

    async fetchRoleDetailsData(): Promise<any[]> {
        const store = appUserRoleDetailStore.getState();
    
        if (store?.data?.length) {
            return store.data;
        }
    
        try {
            if (!store.isFetching) {
                store.fetchRoleData();
            }
    
            return new Promise((resolve) => {
                const checkStore = () => {
                    const updatedStore = appUserRoleDetailStore.getState();
                    if (updatedStore?.data?.length) {
                        resolve(updatedStore.data);
                    } else {
                        setTimeout(checkStore, 100);
                    }
                };
                checkStore();
            });
        } catch (error) {
            console.error("Error fetching role data:", error);
            return [];
        }
    }

    //TODO - Sandeep: Pending for Unique Search
    //TODO - Sandeep: Pending for Get Lookup Data

    // async searchData(type: string, search: any): Promise<any[]> {
    //     const url = `${this.baseUrl}/${type}/search`;
    //     try {
    //         const response = await fetch(url, {
    //             method: 'POST',
    //             headers: this.getHeaders(),
    //             body: JSON.stringify(search),
    //         });
    //         return await response.json();
    //     } catch (error) {
    //         console.error('Error searching data:', error);
    //         return [];
    //     }
    // }

    // uniqueNameValidator(type: string, column: string, id: any) {
    //     return async (value: string): Promise<{ uniqueNameExists: boolean } | null> => {
    //         if (!value) return null;

    //         const columnName = column.charAt(0).toUpperCase() + column.slice(1);
    //         const condition = { Id: id, [columnName]: value };

    //         const url = `${this.baseUrl}/${type}/unique`;
    //         try {
    //             const response = await fetch(url, {
    //                 method: 'POST',
    //                 headers: this.getHeaders(),
    //                 body: JSON.stringify(condition),
    //             });
    //             const isUnique = await response.json();
    //             return isUnique ? { uniqueNameExists: true } : null;
    //         } catch (error) {
    //             console.error('Error checking uniqueness:', error);
    //             return null;
    //         }
    //     };
    // }
}
