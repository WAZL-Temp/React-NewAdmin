import { useState, useEffect } from "react";
import { useListQuery } from "../store/useListQuery";
import { EnumDetail } from "../core/model/enumdetail";
import { EnumDetailsService } from "../core/service/enumDetails.service";
import { AppuserRoleService } from "../core/service/appUserRole.service";
import { RoleDetail } from "../core/model/roledetail";
import {  DashboardInfoResponse, DashboardInfoService } from "../core/service/dashboardInfo.service";

export const useFetchDataEnum = (type: string) => {
  const [data, setData] = useState<EnumDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const enumDetailService = EnumDetailsService();
  const query = useListQuery<EnumDetail>(enumDetailService);

  useEffect(() => {
    query.setRoleCondition({});
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const enumDetaildata = query?.data;

        if (enumDetaildata) {
          const enumData = enumDetaildata.filter((item) => item.section === type);
          setData(enumData);
          return;
        } else {
          return [];
        }
      } catch {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query?.data, type]);

  return { data, loading, error };
};

export const useGetLabelEnum = (type: string, value: string) => {
  const [label, setLabel] = useState<EnumDetail>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const enumDetailService = EnumDetailsService();
  const query = useListQuery<EnumDetail>(enumDetailService);

  useEffect(() => {
    const fetchLabel = async () => {
      setLoading(true);
      try {
        const data = query?.data;
        const filteredData = data?.filter(
          (item: EnumDetail) => item.section === type && item.value === value
        );
        setLabel(filteredData && filteredData.length ? filteredData[0] : {});
      } catch {
        setError("Failed to fetch label");
      } finally {
        setLoading(false);
      }
    };

    fetchLabel();
  }, [query?.data, type, value]);

  return { label, loading, error };
};

export const useFetchRoleDetailsData = () => {
  const [data, setData] = useState<RoleDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ use hook properly
  const { fetchRoleData, roleData } = AppuserRoleService();

  useEffect(() => {
    const fetchRoleDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchRoleData();

        if (response && response.length > 0) {
          setData(response);
        } else {
          setError("No role data found.");
        }
      } catch {
        setError("Failed to fetch role details");
      } finally {
        setLoading(false);
      }
    };

    fetchRoleDetails();
  }, [roleData]);

  return { data, loading, error };
};


export const useFetchDashboardInfoData = () => {
  const [data, setData] = useState<DashboardInfoResponse>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchDashboardInfoData, dashboardInfoData } = DashboardInfoService();

  useEffect(() => {
    const fetchRoleDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchDashboardInfoData();

        if (response && Object.keys(response).length > 0) {
          setData(response);
        } else {
          setError("No role data found.");
        }
      } catch {
        setError("Failed to fetch role details");
      } finally {
        setLoading(false);
      }
    };

    fetchRoleDetails();
  }, [dashboardInfoData]);

  return { data, loading, error };
};



interface Service {
  // getAll: (condition: any) => Promise<any[]>;
  getLookup: () => Promise<any[]>;
}

export function getService(): Service | null {
  // type: string
  const service: Service | null = null;
  return service;
}

export async function getData(service: Service | null): Promise<any[]> {
  // userFilter: boolean = false
  if (service != null) {
    // const condition = {};
    const data = await service.getLookup();
    return data;
  } else {
    return [];
  }
}