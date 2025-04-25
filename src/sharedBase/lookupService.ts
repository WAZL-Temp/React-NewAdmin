import { useState, useEffect } from "react";
import { useAppUserService } from "../core/services/appUsers.service";
import { useListQuery } from "../store/createListStore";
import { AppUser } from "../core/model/appuser";
import { EnumDetail } from "../core/model/enumdetail";
import { useEnumDetailsService } from "../core/services/enumDetails.service";

export const useFetchDataEnum = (type: string) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const enumDetailService = useEnumDetailsService();
  const query = useListQuery<EnumDetail>(enumDetailService);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const enumDetaildata = query?.data;
        if (enumDetaildata != null) {
          const enumData = enumDetaildata.filter((item) => item.section === type);
          setData(enumData);
          return;
        } else {
          return [];
        }
        // setData(data.filter((item: any) => item.section === type));
      } catch (err: any) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export const useGetLabelEnum = (type: string, value: string) => {
  const [label, setLabel] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const enumDetailService = useEnumDetailsService();
  const query = useListQuery<EnumDetail>(enumDetailService);

  useEffect(() => {
    const fetchLabel = async () => {
      setLoading(true);
      try {
        const data = query?.data;
        const filteredData = data?.filter(
          (item: any) => item.section === type && item.value === value
        );
        setLabel(filteredData && filteredData.length ? filteredData[0] : {});
      } catch (err: any) {
        setError(err.message || "Failed to fetch label");
      } finally {
        setLoading(false);
      }
    };

    fetchLabel();
  }, []);

  return { label, loading, error };
};

export const useFetchRoleDetailsData = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userService = useAppUserService();
  const query = useListQuery<AppUser>(userService);

  useEffect(() => {
    const fetchRoleDetails = async () => {
      setLoading(true);
      try {
        const response = await query.fetchRoleData();
        
        setData(response || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch role details");
      } finally {
        setLoading(false);
      }
    };

    fetchRoleDetails();
  }, []);

  return { data, loading, error };
};
