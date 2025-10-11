import { useQuery } from "@tanstack/react-query";
import { useBaseService } from "../../sharedBase/baseService";

export interface DashboardCounts {
    inactiveCount: number;
    activeCount: number;
    deletedCount: number;
}

export interface DashboardInfoResponse {
    [key: string]: DashboardCounts[] | undefined;
}

export const DashboardInfoService = () => {
    const baseService = useBaseService("Home");

    const fetchDashboardInfoDataFn = async (): Promise<DashboardInfoResponse> => {
        const data = await baseService.getDashboardInfo();

        if (!data || Array.isArray(data)) {
            console.error("Unexpected or empty response from Dashboard Info.");
            return {};
        }

        return data;
    };

    const {
        data: dashboardInfoData,
        isLoading: roleLoading,
        error: roleError,
    } = useQuery<DashboardInfoResponse, Error>({
        queryKey: ["dashboardInfoData"],
        queryFn: fetchDashboardInfoDataFn,
        staleTime: 5 * 60 * 1000,
    });

    return {
        baseService,
        dashboardInfoData,
        roleLoading,
        roleError,
        fetchDashboardInfoData: async (): Promise<DashboardInfoResponse | undefined> =>
            dashboardInfoData,
    };
};
